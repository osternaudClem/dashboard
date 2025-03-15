import { HttpLog } from '@prisma/client';
import { keepPreviousData } from '@tanstack/react-query';

import { useGenericQuery } from '@/hooks/use-generic-query';

import { QUERY_KEYS } from './queryKeys';

type HttpLogsResponse = {
  data: HttpLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type FetchHttpLogsParams = {
  page?: number;
  limit?: number;
  source?: string;
  method?: string;
  status?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  appId?: string;
};

export const useGetHttpLogsByAppId = (params: FetchHttpLogsParams) =>
  useGenericQuery<HttpLogsResponse>(
    [QUERY_KEYS.HTTP_LOGS_BY_APP_ID, JSON.stringify(params)],
    async (): Promise<HttpLogsResponse> => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.source) queryParams.append('source', params.source);
      if (params.method) queryParams.append('method', params.method);
      if (params.status) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate.toISOString());
      if (params.endDate) queryParams.append('endDate', params.endDate.toISOString());
      if (params.appId) queryParams.append('appId', params.appId);

      const res = await fetch(`/api/http-logs?${queryParams}`);
      return res.json();
    },
    {
      placeholderData: keepPreviousData,
    },
  );

export const useGetHttpLogsStats = (params: Omit<FetchHttpLogsParams, 'page' | 'limit'>) =>
  useGenericQuery<{ data: HttpLog[] }>(
    [QUERY_KEYS.HTTP_LOGS_STATS_BY_APP_ID, JSON.stringify(params)],
    async () => {
      const queryParams = new URLSearchParams();

      if (params.source) queryParams.append('source', params.source);
      if (params.method) queryParams.append('method', params.method);
      if (params.status) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate.toISOString());
      if (params.endDate) queryParams.append('endDate', params.endDate.toISOString());
      if (params.appId) queryParams.append('appId', params.appId);
      queryParams.append('stats', 'true');

      const res = await fetch(`/api/http-logs?${queryParams}`);
      return res.json();
    },
  );
