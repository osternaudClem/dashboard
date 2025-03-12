import { HttpLog } from '@prisma/client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type LogDetailsSheetProps = {
  log: HttpLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const parsedResponse = (str: unknown): unknown => {
  try {
    if (typeof str === 'string') {
      const parsed = JSON.parse(str);
      return typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2);
    }
  } catch {
    return str;
  }
};

export function LogDetailsSheet({ log, open, onOpenChange }: LogDetailsSheetProps) {
  if (!log) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full max-w-[600px] flex-col gap-0 p-0 sm:w-[550px] sm:max-w-full xl:w-[700px]"
      >
        <div className="border-b p-2">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">Log Details</SheetTitle>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="mb-3 text-lg font-semibold">Basic Info</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-muted-foreground font-medium">Method</div>
                <div className="font-mono">{log.method}</div>
                <div className="text-muted-foreground font-medium">Status</div>
                <div
                  className={`font-mono ${log.statusCode >= 400 ? 'text-red-500' : 'text-green-500'}`}
                >
                  {log.statusCode}
                </div>
                <div className="text-muted-foreground font-medium">Source</div>
                <div className="font-mono">{log.source}</div>
                <div className="text-muted-foreground font-medium">Timestamp</div>
                <div className="font-mono">{new Date(log.timestamp).toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="mb-3 text-lg font-semibold">URL</h3>
              <p className="font-mono text-sm break-all">{log.url}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="mb-3 text-lg font-semibold">Headers</h3>
              <pre className="bg-background max-h-[200px] overflow-auto rounded-md p-4 font-mono text-sm">
                {JSON.stringify(log.headers, null, 2)}
              </pre>
            </div>

            {log.body && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="mb-3 text-lg font-semibold">Body</h3>
                <pre className="bg-background max-h-[200px] overflow-auto rounded-md p-4 font-mono text-sm">
                  {JSON.stringify(log.body, null, 2)}
                </pre>
              </div>
            )}

            {log.response && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="mb-3 text-lg font-semibold">Response</h3>
                <pre className="bg-background max-h-[200px] overflow-auto rounded-md p-4 font-mono text-sm">
                  {JSON.stringify(parsedResponse(log.response), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
