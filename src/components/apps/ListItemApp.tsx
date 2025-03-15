import Link from 'next/link';

import { App } from '@prisma/client';
import { PenSquareIcon, TrashIcon } from 'lucide-react';

import { useGetHttpLogsStats } from '@/lib/react-query/httpLogsQueries';
import { cn } from '@/lib/utils';

import { getDefaultToday } from '../SelectDate';
import { Button } from '../ui/button';
import AppLogsChart from './AppLogsChart';

type Props = {
  className?: string;
  app: App;
};

const ListItemApp = ({ className = '', app }: Props) => {
  const { data: chartData, isFetching } = useGetHttpLogsStats({
    appId: app.id,
    startDate: getDefaultToday().from,
    endDate: getDefaultToday().to,
  });

  return (
    <div className={cn('border-input rounded-md border p-4', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="">
          <Link href={`/project/${app.projectId}/app/${app.id}`}>{app.name}</Link>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <TrashIcon />
          </Button>

          <Button variant="outline" asChild>
            <Link href={`/project/${app.projectId}/app/${app.id}/edit`}>
              <PenSquareIcon />
            </Link>
          </Button>
        </div>
      </div>

      {!isFetching ? <AppLogsChart httpLogs={chartData?.data || []} hideHeader /> : null}
    </div>
  );
};

export default ListItemApp;
