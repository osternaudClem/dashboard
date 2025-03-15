import { NextRequest, NextResponse } from 'next/server';

import { format, subHours } from 'date-fns';

import { prisma } from '@/lib/prisma/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const appId = url.searchParams.get('appId');
    const startDate = url.searchParams.get('from');
    const endDate = url.searchParams.get('to');

    if (!appId) {
      return NextResponse.json({ error: 'Missing appId parameter' }, { status: 400 });
    }

    const logs = await getLogsGroupedByHour(appId, startDate, endDate);

    return NextResponse.json(logs);
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

const getLogsGroupedByHour = async (
  appId: string,
  startDate: string | null,
  endDate: string | null,
) => {
  const since = startDate ? new Date(startDate) : subHours(new Date(), 24);
  const until = endDate ? new Date(endDate) : new Date();

  const totalRequests = await prisma.httpLog.groupBy({
    by: ['timestamp'],
    _count: { _all: true },
    where: { appId, timestamp: { gte: since, lte: until } },
    orderBy: { timestamp: 'asc' },
  });

  const errorRequests = await prisma.httpLog.groupBy({
    by: ['timestamp'],
    _count: { _all: true },
    where: { appId, timestamp: { gte: since, lte: until }, statusCode: { gte: 400 } },
    orderBy: { timestamp: 'asc' },
  });

  return formatLogsForGraph(totalRequests, errorRequests);
};

const formatLogsForGraph = (
  totalLogs: { timestamp: Date; _count: { _all: number } }[],
  errorLogs: { timestamp: Date; _count: { _all: number } }[],
) => {
  const hoursMap = new Map<string, { total: number; errors: number }>();

  for (let i = 0; i < 24; i++) {
    const hour = format(subHours(new Date(), i), 'yyyy-MM-dd HH:00');
    hoursMap.set(hour, { total: 0, errors: 0 });
  }

  totalLogs.forEach(({ timestamp, _count }) => {
    const hourKey = format(new Date(timestamp), 'yyyy-MM-dd HH:00');
    if (hoursMap.has(hourKey)) {
      hoursMap.get(hourKey)!.total = _count._all;
    }
  });

  errorLogs.forEach(({ timestamp, _count }) => {
    const hourKey = format(new Date(timestamp), 'yyyy-MM-dd HH:00');
    if (hoursMap.has(hourKey)) {
      hoursMap.get(hourKey)!.errors = _count._all;
    }
  });

  return Array.from(hoursMap.entries())
    .map(([hour, values]) => ({ hour, ...values }))
    .reverse();
};
