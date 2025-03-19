import { createAuthClient } from 'better-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const { signIn, signUp, useSession, signOut, forgetPassword, resetPassword } =
  createAuthClient({
    baseURL: BASE_URL,
  });
