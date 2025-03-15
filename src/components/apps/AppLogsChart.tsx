'use client';

import { useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import SelectDate, { getDefaultToday } from '../SelectDate';

const chartConfig = {
  total: {
    label: 'Total',
    color: 'hsl(var(--chart-1))',
  },
  errors: {
    label: 'Errors',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

async function fetchStats(
  appId: string,
  dateRange: { from: Date | undefined; to: Date | undefined },
): Promise<{ hour: string; total: number; errors: number }[]> {
  const response = await fetch(
    `/api/http-logs/stats?appId=${appId}&from=${dateRange.from?.toISOString()}&to=${dateRange.to?.toISOString()}`,
  );
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}

type AppLogsChartProps = {
  appId: string;
};

const AppLogsChart = ({ appId }: AppLogsChartProps) => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>(getDefaultToday());

  const { data } = useQuery({
    queryKey: ['stats', appId, dateRange],
    queryFn: () => fetchStats(appId, dateRange),
  });

  const maxTotal = useMemo(() => {
    if (!data) return 0;
    return Math.max(...data.map((d) => d.total));
  }, [data]);

  const maxErrors = useMemo(() => {
    if (!data) return 0;
    return Math.max(...data.map((d) => d.errors));
  }, [data]);

  const maxY = useMemo(() => {
    const rawMax = Math.max(maxTotal, maxErrors) * 1.1; // Add 10% buffer
    let factor = 1;

    if (rawMax < 10) {
      factor = 1;
    } else if (rawMax < 100) {
      factor = 10;
    } else if (rawMax < 1000) {
      factor = 50;
    } else if (rawMax < 10000) {
      factor = 100;
    }

    const roundedMax = Math.ceil(rawMax / factor) * factor;

    return roundedMax;
  }, [maxTotal, maxErrors]);

  return (
    <div className="bg-muted/50 rounded-lg pt-4">
      <SelectDate dateRange={dateRange} onChange={setDateRange} />

      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillErrors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-errors)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-errors)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickCount={3}
            domain={[0, maxY]}
          />
          <YAxis
            yAxisId="right"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickCount={3}
            orientation="right"
            domain={[0, maxY]}
            className="hidden"
          />

          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Area
            dataKey="total"
            type="natural"
            fill="url(#fillTotal)"
            stroke="var(--color-total)"
            stackId="a"
            yAxisId="left"
            className="pb-10"
          />
          <Area
            dataKey="errors"
            type="natural"
            fill="url(#fillErrors)"
            stroke="var(--color-errors)"
            stackId="a"
            yAxisId="right"
            className="pb-10"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default AppLogsChart;
