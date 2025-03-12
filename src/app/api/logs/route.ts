import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const log = await prisma.log.create({ data: body });
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to log data', details: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const source = url.searchParams.get('source') || undefined;
    const level = url.searchParams.get('level') || undefined;
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const logs = await prisma.log.findMany({
      where: {
        source,
        level,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        timestamp: 'desc',
      },
    });

    const totalLogs = await prisma.log.count({
      where: { source, level },
    });

    return NextResponse.json({
      data: logs,
      pagination: {
        page,
        limit,
        total: totalLogs,
        totalPages: Math.ceil(totalLogs / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch logs data', details: (error as Error).message },
      { status: 500 },
    );
  }
}
