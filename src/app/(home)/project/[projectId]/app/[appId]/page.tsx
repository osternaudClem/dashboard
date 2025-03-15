import Link from 'next/link';

import AppLogsChart from '@/components/apps/AppLogsChart';
import HttpLogsTable from '@/components/table/HttpLogsTable';
import { Button } from '@/components/ui/button';

type Props = {
  params: Promise<{ appId: string }>;
};

const AppPage = async ({ params }: Props) => {
  const { appId } = await params;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1>{appId}</h1>
        <Button variant="outline" asChild>
          <Link href={`/app/${appId}/edit`}>Edit App</Link>
        </Button>
      </div>
      <div className="">
        <AppLogsChart appId={appId} />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-lg md:min-h-min">
        <HttpLogsTable />
      </div>
    </>
  );
};

export default AppPage;
