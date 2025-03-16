'use client';

import Link from 'next/link';

import { AppWindowMacIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProjectById } from '@/lib/react-query/projectQueries';
import { cn } from '@/lib/utils';

// Import icon for empty state

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

const EmptyState = ({ projectId }: { projectId?: string }) => {
  return (
    <div
      className="border-input my-8 flex flex-col items-center justify-center space-y-4 rounded-lg border
        border-dashed p-8 text-center"
    >
      <AppWindowMacIcon className="text-muted-foreground h-10 w-10" />
      <p className="text-muted-foreground text-sm">No apps have been created yet.</p>
      <Button variant="default" asChild>
        <Link href={`/project/${projectId}/app/create`}>Create New App</Link>
      </Button>
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
      ) : apps?.apps.length ? (
        <div className="flex flex-col gap-4">
          {apps.apps.map((app) => (
            <ListItemApp key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <EmptyState projectId={projectId} />
      )}
    </div>
  );
};

export default ListApps;
