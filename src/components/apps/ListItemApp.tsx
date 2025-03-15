import Link from 'next/link';

import { App } from '@prisma/client';
import { PenSquareIcon, TrashIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import AppLogsChart from './AppLogsChart';

type Props = {
  className?: string;
  app: App;
};

const ListItemApp = ({ className = '', app }: Props) => {
  return (
    <div className={cn('border-input rounded-lg border p-4', className)}>
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

      <AppLogsChart appId={app.id} />
    </div>
  );
};

export default ListItemApp;
