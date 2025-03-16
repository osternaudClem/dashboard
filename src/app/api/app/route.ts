import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { z } from 'zod';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma/prisma';

const appSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  projectId: z.string().min(1, 'Project ID is required'),
});

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      include: { apps: true },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsedBody = appSchema.parse(body);

    const { projectId } = parsedBody;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const newProject = await prisma.app.create({
      data: {
        ...parsedBody,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Failed to create project', details: (error as Error).message },
      { status: 500 },
    );
  }
}
