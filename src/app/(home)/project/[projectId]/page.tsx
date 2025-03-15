import Link from 'next/link';

import { PlusIcon } from 'lucide-react';

import ListApps from '@/components/apps/ListApps';
import { Button } from '@/components/ui/button';

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

const ProjecPage = async ({ params }: Props) => {
  const { projectId } = await params;

  return (
    <div className="mb-4 flex-col">
      <header className="mb-4 flex items-center justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href={`/project/${projectId}/edit`}>Edit Project</Link>
        </Button>
        <Button variant="default" asChild>
          <Link href={`/project/${projectId}/app/create`}>
            <PlusIcon />
            New App
          </Link>
        </Button>
      </header>

      <ListApps projectId={projectId} />
    </div>
  );
};

export default ProjecPage;
