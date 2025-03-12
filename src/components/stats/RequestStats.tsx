'use client';

import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type RequestStatsProps = {
  timeframe: 'hour' | 'day' | 'month';
  appId: string;
};

async function fetchStats(appId: string) {
  const response = await fetch(`/api/http-logs/stats?appId=${appId}`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}

export function RequestStatsCard({ timeframe, appId }: RequestStatsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stats', appId],
    queryFn: () => fetchStats(appId),
  });

  if (isLoading)
    return <div className="bg-muted/50 flex aspect-video flex-col rounded-xl p-4">Loading...</div>;
  if (error)
    return (
      <div className="bg-muted/50 flex aspect-video flex-col rounded-xl p-4">
        Error loading stats
      </div>
    );

  const stats = data[timeframe];
  const chartData = [
    {
      name: 'Requests',
      success: stats.success,
      failed: stats.failed,
    },
  ];

  return (
    <div className="bg-muted/50 flex aspect-video flex-col rounded-xl p-4">
      <h3 className="mb-2 text-lg font-semibold">Last {timeframe}</h3>
      <div className="flex flex-col gap-2">
        <p>Total requests: {stats.total}</p>
        <p className="text-green-600">Successful: {stats.success}</p>
        <p className="text-red-600">Failed: {stats.failed}</p>
      </div>
      <div className="mt-auto h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="success" fill="#22c55e" stackId="stack" />
            <Bar dataKey="failed" fill="#ef4444" stackId="stack" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
