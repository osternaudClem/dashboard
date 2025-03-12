"use client";
import { useState } from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { HttpLog } from "@prisma/client";

const fetchHttpLogs = async ({
  page,
  limit,
  source,
}: {
  page: number;
  limit: number;
  source?: string;
}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (source) params.append("source", source);

  const res = await fetch(`/api/http-logs?${params}`);
  return res.json();
};

const HttpLogsTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [source, setSource] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["httpLogs", { page, limit, source }],
    queryFn: () => fetchHttpLogs({ page, limit, source }),
    placeholderData: keepPreviousData,
  });

  console.log(">>> ℹ️ HttpLogsTable - 60", { source });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">HTTP Logs</h1>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Filter by source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <Select
          value={limit.toString()}
          onValueChange={(value) => setLimit(Number(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Limit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setPage(1)}>Apply</Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Source</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            data?.data.map((log: HttpLog) => (
              <TableRow key={log.id}>
                <TableCell>{log.source}</TableCell>
                <TableCell>{log.method}</TableCell>
                <TableCell>{log.url}</TableCell>
                <TableCell>{log.statusCode}</TableCell>
                <TableCell>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {data?.pagination && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page === 1 ? (
                <PaginationLink isActive={false}>Previous</PaginationLink>
              ) : (
                <PaginationLink onClick={() => setPage(page - 1)}>
                  Previous
                </PaginationLink>
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
    </div>
  );
};

export default HttpLogsTable;
