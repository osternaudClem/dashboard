import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';

import { type ExtendedSession, authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma/prisma';

export async function GET() {
  try {
    const session: ExtendedSession | null = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user data', details: (error as Error).message },
      { status: 500 },
    );
  }
}
