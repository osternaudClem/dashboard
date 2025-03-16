import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma/prisma';

type ParamsProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function GET(_req: Request, { params }: ParamsProps) {
  try {
    const { projectId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

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
