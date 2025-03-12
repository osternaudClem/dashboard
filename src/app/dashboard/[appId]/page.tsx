import { RequestStatsCard } from '@/components/stats/RequestStats';
import HttpLogsTable from '@/components/table/HttpLogsTable';

type Props = {
  params: Promise<{ appId: string }>;
};

export default async function Page({ params }: Props) {
  const { appId } = await params;

  return (
    <>
      <h1>{appId}</h1>
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
