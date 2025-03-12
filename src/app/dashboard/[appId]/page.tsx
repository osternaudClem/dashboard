import Link from 'next/link';

import { RequestStatsCard } from '@/components/stats/RequestStats';
import HttpLogsTable from '@/components/table/HttpLogsTable';
import { Button } from '@/components/ui/button';

type Props = {
  params: Promise<{ appId: string }>;
};

export default async function Page({ params }: Props) {
  const { appId } = await params;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1>{appId}</h1>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/${appId}/edit`}>Edit App</Link>
        </Button>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <RequestStatsCard timeframe="hour" appId={appId} />
        <RequestStatsCard timeframe="day" appId={appId} />
        <RequestStatsCard timeframe="month" appId={appId} />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <HttpLogsTable />
      </div>
    </>
  );
}
