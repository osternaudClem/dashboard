import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma/prisma';

const MAX_RESPONSE_LENGTH = 1000;
const MAX_STRING_LENGTH = 500;

const truncateResponse = (response: string) => {
  if (!response) {
    return response;
  }

  if (typeof response === 'string') {
    return response.length > MAX_RESPONSE_LENGTH
      ? response.slice(0, MAX_STRING_LENGTH) + '...'
      : response;
  }

  if (typeof response === 'object') {
    return JSON.stringify(response).length > MAX_RESPONSE_LENGTH
      ? JSON.stringify(response).slice(0, MAX_STRING_LENGTH) + '...'
      : JSON.stringify(response);
  }

  return response;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // get header authorization Bearer key
    const authorization = req.headers.get('authorization');

    if (!authorization) {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Authorization header is missing' },
        { status: 401 },
      );
    }

    const bearerToken = authorization.split('Bearer ')[1];

    // check if the authorization key is valid
    const isExist = await prisma.app.findFirst({
      where: { apiKey: bearerToken },
    });

    if (!isExist) {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Invalid Authorization key' },
        { status: 401 },
      );
    }

    body.response = truncateResponse(body.response);

    body.appId = isExist.id;
    const log = await prisma.httpLog.create({ data: body });
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to add httpLog data',
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const deleteLogs = url.searchParams.get('delete') || undefined;

    if (deleteLogs) {
      await prisma.httpLog.deleteMany({});
      return NextResponse.json({ message: 'All http logs deleted' });
    }

    const source = url.searchParams.get('source') || undefined;
    const method = url.searchParams.get('method') || undefined;
    const logUrl = url.searchParams.get('url') || undefined;
    const statusCode = url.searchParams.get('status') || undefined;
    const startDate = url.searchParams.get('startDate') || undefined;
    const endDate = url.searchParams.get('endDate') || undefined;
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const status = statusCode ? parseInt(statusCode, 10) : undefined;

    const httpLogs = await prisma.httpLog.findMany({
      where: {
        method,
        url: logUrl,
        statusCode: status,
        source,
        timestamp: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        timestamp: 'desc',
      },
    });

    const totalHttpLogs = await prisma.httpLog.count({
      where: {
        method,
        url: logUrl,
        statusCode: status,
        source,
        timestamp: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      },
    });

    return NextResponse.json({
      data: httpLogs,
      pagination: {
        page,
        limit,
        total: totalHttpLogs,
        totalPages: Math.ceil(totalHttpLogs / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch httpLog data',
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
