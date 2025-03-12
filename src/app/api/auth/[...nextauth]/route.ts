import bcrypt from 'bcryptjs';
import NextAuth, { type NextAuthOptions, Session, SessionStrategy } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { prisma } from '@/lib/prisma/prisma';

type ExtendedJWT = JWT & {
  id: string;
  email: string;
  username: string;
};

export type ExtendedSession = Session & {
  user?: {
    id?: string;
    username?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' as SessionStrategy },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@email.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) throw new Error('No user found');

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error('Invalid password');

        return { id: user.id, email: user.email, username: user.username };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
        } as ExtendedJWT;
      }
      return token as ExtendedJWT;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: JWT; // Use generic JWT here, but assert to ExtendedJWT
    }) {
      const extendedToken = token as ExtendedJWT; // Type assertion

      if (!session.user) session.user = {};
      session.user.id = extendedToken.id;
      session.user.username = extendedToken.username;
      session.user.email = extendedToken.email;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
