import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';

import { prisma } from '@/lib/prisma/prisma';

import { ExtendedSession, authOptions } from '../../auth/[...nextauth]/route';

type ParamsProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function GET(_req: Request, { params }: ParamsProps) {
  try {
    const { projectId } = await params;

    const session: ExtendedSession | null = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { apps: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch app' }, { status: 500 });
  }
}
