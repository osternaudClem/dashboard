'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import AppLogsChart from '@/components/apps/AppLogsChart';
import HttpLogsTable from '@/components/table/HttpLogsTable';
import TableFilters from '@/components/table/TableFilters';
import { Button } from '@/components/ui/button';
import { useGetHttpLogsByAppId, useGetHttpLogsStats } from '@/lib/react-query/httpLogsQueries';

const AppPage = () => {
  const params = useParams();
  const appId = params.appId as string;
  const projectId = params.projectId as string;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [source, setSource] = useState('');
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  const {
    data: tableData,
    isLoading: isTableLoading,
    refetch: refetchTable,
  } = useGetHttpLogsByAppId({
    appId,
    page,
    limit,
    source,
    method,
    status,
    startDate,
    endDate,
  });

  const { data: chartData } = useGetHttpLogsStats({
    appId,
    source,
    method,
    status,
    startDate,
    endDate,
  });

  return (
    <div className="space-y-4">
      <div className="gao-4 mb-4 flex items-center justify-end">
        <Button variant="outline" asChild>
          <Link href={`/project/${projectId}/app/${appId}/edit`}>Edit App</Link>
        </Button>
      </div>

      <TableFilters
        source={source}
        setSource={setSource}
        limit={limit}
        setLimit={setLimit}
        method={method}
        setMethod={setMethod}
        status={status}
        setStatus={setStatus}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        refreshInterval={refreshInterval}
        setRefreshInterval={setRefreshInterval}
      />

      <AppLogsChart httpLogs={chartData?.data || []} />

      <HttpLogsTable
        isLoading={isTableLoading}
        httpLogs={tableData?.data || []}
        pagination={tableData?.pagination}
        page={page}
        setPage={setPage}
        onRefresh={refetchTable}
        refreshInterval={refreshInterval}
      />
    </div>
  );
};

export default AppPage;
