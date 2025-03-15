'use client';

import { useCallback, useMemo, useState } from 'react';

import { HttpLog } from '@prisma/client';
import { Collapsible } from '@radix-ui/react-collapsible';
import { ChevronRightIcon } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

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

type AppLogsChartProps = {
  httpLogs: HttpLog[];
  hideHeader?: boolean;
};

const AppLogsChart = ({ httpLogs, hideHeader = false }: AppLogsChartProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const data = useMemo(() => {
    const hourlyStats = httpLogs.reduce(
      (acc, log) => {
        const hour = new Date(log.timestamp).toISOString().slice(11, 13) + ':00';

        if (!acc[hour]) {
          acc[hour] = { hour, total: 0, errors: 0 };
        }

        acc[hour].total++;
        if (log.statusCode >= 400) {
          acc[hour].errors++;
        }

        return acc;
      },
      {} as Record<string, { hour: string; total: number; errors: number }>,
    );

    return Object.values(hourlyStats).sort((a, b) => a.hour.localeCompare(b.hour));
  }, [httpLogs]);

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
    <Collapsible open={isExpanded} onOpenChange={handleToggleExpand}>
      <Card className="bg-muted/50 space-y-4">
        {!hideHeader ? (
          <CardHeader className="mb-0">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Application Logs Overview</h2>
                <ChevronRightIcon
                  className={cn('transition-transform', isExpanded ? 'rotate-90' : '')}
                />
              </div>
            </CollapsibleTrigger>
          </CardHeader>
        ) : null}
        <CollapsibleContent>
          <CardContent className="px-0">
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
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                />
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
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default AppLogsChart;
