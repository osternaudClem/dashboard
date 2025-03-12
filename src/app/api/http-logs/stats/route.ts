import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const appId = url.searchParams.get('appId');

    if (!appId) {
      return NextResponse.json({ error: 'Missing appId parameter' }, { status: 400 });
    }

    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [hourStats, dayStats, monthStats] = await Promise.all([
      getTimeframeStats(appId, hourAgo),
      getTimeframeStats(appId, dayAgo),
      getTimeframeStats(appId, monthAgo),
    ]);

    return NextResponse.json({
      hour: hourStats,
      day: dayStats,
      month: monthStats,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch statistics',
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

async function getTimeframeStats(appId: string, fromDate: Date) {
  const logs = await prisma.httpLog.groupBy({
    by: ['statusCode'],
    where: {
      appId,
      timestamp: {
        gte: fromDate,
      },
    },
    _count: true,
  });

  const total = logs.reduce((acc, curr) => acc + curr._count, 0);
  const success = logs
    .filter((log) => log.statusCode >= 200 && log.statusCode < 400)
    .reduce((acc, curr) => acc + curr._count, 0);
  const failed = total - success;

  return { total, success, failed };
}
