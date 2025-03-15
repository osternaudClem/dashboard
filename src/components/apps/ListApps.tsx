'use client';

import { useGetProjectById } from '@/lib/react-query/projectQueries';
import { cn } from '@/lib/utils';

import { Skeleton } from '../ui/skeleton';
import ListItemApp from './ListItemApp';

const ListAppsSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="border-input flex h-16 items-center justify-between rounded-lg border p-4" />
      <Skeleton className="border-input flex h-16 items-center justify-between rounded-lg border p-4" />
      <Skeleton className="border-input flex h-16 items-center justify-between rounded-lg border p-4" />
    </div>
  );
};

type Props = {
  className?: string;
  projectId?: string;
};

const ListApps = ({ className = '', projectId }: Props) => {
  const { data: apps, isFetching } = useGetProjectById(projectId || '');

  return (
    <div className={cn(className)}>
      {isFetching ? (
        <ListAppsSkeleton />
      ) : (
        <div className="flex flex-col gap-4">
          {apps?.apps.map((app) => <ListItemApp key={app.id} app={app} />)}
        </div>
      )}
    </div>
  );
};

export default ListApps;
