import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';

import { type ExtendedSession, authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma/prisma';

export async function GET(_req: Request, { params }: { params: { appId: string } }) {
  try {
    const session: ExtendedSession | null = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const app = await prisma.app.findUnique({
      where: { id: params.appId },
      include: { project: true },
    });

    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    if (app.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(app);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch app' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { appId: string } }) {
  try {
    const session: ExtendedSession | null = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const app = await prisma.app.update({
      where: { id: params.appId },
      data: { name: data.name },
    });

    return NextResponse.json(app);
  } catch {
    return NextResponse.json({ error: 'Failed to update app' }, { status: 500 });
  }
}
