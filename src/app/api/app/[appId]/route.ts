import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma/prisma';

type ParamsProps = {
  params: Promise<{
    appId: string;
  }>;
};

export async function GET(_req: Request, { params }: ParamsProps) {
  try {
    const { appId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const app = await prisma.app.findUnique({
      where: { id: appId },
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

export async function PUT(req: Request, { params }: ParamsProps) {
  try {
    const { appId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const app = await prisma.app.update({
      where: { id: appId },
      data: { name: data.name },
    });

    return NextResponse.json(app);
  } catch {
    return NextResponse.json({ error: 'Failed to update app' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: ParamsProps) {
  try {
    const { appId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.app.delete({ where: { id: appId } });

    return NextResponse.json({ success: true, id: appId });
  } catch {
    return NextResponse.json({ error: 'Failed to delete app' }, { status: 500 });
  }
}
