'use client';

import { useEffect, useState } from 'react';

import { HttpLog } from '@prisma/client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { LogDetailsSheet } from './LogDetailsSheet';
import TableFilters from './TableFilters';
import { columns } from './columns';

const fetchHttpLogs = async ({
  page,
  limit,
  source,
  method,
  status,
  startDate,
  endDate,
}: {
  page: number;
  limit: number;
  source: string;
  method: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (source) params.append('source', source);
  if (method) params.append('method', method);
  if (status) params.append('status', status);
  if (startDate) params.append('startDate', startDate.toISOString());
  if (endDate) params.append('endDate', endDate.toISOString());

  const res = await fetch(`/api/http-logs?${params}`);
  return res.json();
};

const HttpLogsTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [source, setSource] = useState('');
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedLog, setSelectedLog] = useState<HttpLog | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  const resetFilters = () => {
    setPage(1);
    setLimit(10);
    setSource('');
    setMethod('');
    setStatus('');
    setStartDate(null);
    setEndDate(null);
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['httpLogs', { page, limit, source, method, status, startDate, endDate }],
    queryFn: () => fetchHttpLogs({ page, limit, source, method, status, startDate, endDate }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(() => {
        refetch();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refetch, refreshInterval]);

  const table = useReactTable({
    data: Array.isArray(data?.data) ? data.data : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">HTTP Logs</h1>

      <div className="flex items-center justify-between">
        <TableFilters
          source={source}
          setSource={setSource}
          limit={limit}
          setLimit={setLimit}
          method={method}
          setMethod={setMethod}
          status={status}
          setStatus={setStatus}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onApply={() => setPage(1)}
          onReset={resetFilters}
          refreshInterval={refreshInterval}
          setRefreshInterval={setRefreshInterval}
        />
      </div>

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

      {data?.pagination && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page === 1 ? (
                <PaginationLink isActive={false}>Previous</PaginationLink>
              ) : (
                <PaginationLink onClick={() => setPage(page - 1)}>Previous</PaginationLink>
              )}
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>{data.pagination.page}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                isActive={page < data.pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <LogDetailsSheet log={selectedLog} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
};

export default HttpLogsTable;
