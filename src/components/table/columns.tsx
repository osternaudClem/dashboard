import { HttpLog } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<HttpLog>[] = [
  {
    accessorKey: 'source',
    header: 'Source',
  },
  {
    accessorKey: 'method',
    header: 'Method',
  },
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    accessorKey: 'statusCode',
    header: 'Status',
    cell: ({ row }) => {
      const statusCode = row.getValue('statusCode') as number;

      const getBadgeVariant = (code: number) => {
        if (code >= 400) return 'error';
        if (code >= 300) return 'warning';
        return 'success';
      };

      return <Badge variant={getBadgeVariant(statusCode)}>{statusCode}</Badge>;
    },
  },
  {
    accessorKey: 'timestamp',
    header: 'Time',
    cell: ({ row }) => new Date(row.getValue('timestamp')).toLocaleString(),
  },
];
