'use client';

import { useCallback, useEffect, useState } from 'react';

import { HttpLog } from '@prisma/client';
import { Collapsible, CollapsibleContent } from '@radix-ui/react-collapsible';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronRightIcon } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import LogDetailsSheet from './LogDetailsSheet';
import TablePagination from './TablePagination';
import { columns } from './columns';

type HttpLogsTableProps = {
  httpLogs: HttpLog[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  onRefresh: () => void;
  refreshInterval: number | null;
};

const HttpLogsTable = ({
  httpLogs,
  pagination,
  isLoading,
  page,
  setPage,
  onRefresh,
  refreshInterval,
}: HttpLogsTableProps) => {
  const [selectedLog, setSelectedLog] = useState<HttpLog | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(() => {
        onRefresh();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [onRefresh, refreshInterval]);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const table = useReactTable({
    data: httpLogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Collapsible open={isExpanded} onOpenChange={handleToggleExpand}>
      <Card className="bg-muted/50 space-y-4">
        <CardHeader className="mb-0">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">HTTP Logs</h2>
              <ChevronRightIcon
                className={cn('transition-transform', isExpanded ? 'rotate-90' : '')}
              />
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedLog(row.original);
                        setSheetOpen(true);
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {pagination && (
              <TablePagination
                pagination={pagination}
                currentPage={page}
                updatePage={setPage}
                className="mt-4"
              />
            )}

            <LogDetailsSheet log={selectedLog} open={sheetOpen} onOpenChange={setSheetOpen} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default HttpLogsTable;
