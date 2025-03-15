import { useCallback, useEffect, useState } from 'react';

import { PlusIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { HTTP_METHODS, STATUS_CODES } from '@/constants/filters';
import { cn } from '@/lib/utils';

import SelectDate from '../SelectDate';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type FilterKey = 'method' | 'statusCode' | 'timeRange';

const AVAILABLE_FILTERS: {
  key: FilterKey;
  label: string;
  options: string[];
}[] = [
  {
    key: 'method',
    label: 'Method',
    options: HTTP_METHODS,
  },
  {
    key: 'statusCode',
    label: 'Status',
    options: STATUS_CODES.map((s) => s.label),
  },
  {
    key: 'timeRange',
    label: 'Time range',
    options: [],
  },
];

type TableFiltersProps = {
  source: string;
  setSource: (value: string) => void;
  limit: number;
  setLimit: (value: number) => void;
  method: string;
  setMethod: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  refreshInterval: number | null;
  setRefreshInterval: (value: number | null) => void;
};

const TableFilters = ({
  method,
  setMethod,
  status,
  setStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: TableFiltersProps) => {
  const [filters, setFilters] = useState<FilterKey[]>([]);

  useEffect(() => {
    if (!!method && !filters.includes('method')) {
      setFilters((prevFilters) => [...prevFilters, 'method']);
    }
  }, [filters, method]);

  const handleAddFilter = useCallback((filter: FilterKey) => {
    setFilters((prevFilters) => [...prevFilters, filter]);
  }, []);

  const handleRemoveFilter = useCallback(
    (filter: FilterKey) => {
      let setter;
      if (filter === 'method') {
        setter = setMethod;
      } else if (filter === 'statusCode') {
        setter = setStatus;
      } else if (filter === 'timeRange') {
        setter = () => {
          setStartDate(undefined);
          setEndDate(undefined);
        };
      } else {
        setter = () => {};
      }

      setter('');

      setFilters((prevFilters) => prevFilters.filter((f) => f !== filter));
    },
    [setEndDate, setMethod, setStartDate, setStatus],
  );

  return (
    <div className="flex flex-wrap gap-4">
      {filters.includes('method') ? (
        <div
          className={cn(
            'hover:bg-accent/70 flex items-center rounded-md border',
            !!method ? 'bg-accent' : 'border-accent border-dashed',
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="hover:bg-transparent">
                {method || 'Method'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {HTTP_METHODS.map((m) => (
                <DropdownMenuCheckboxItem
                  key={m}
                  checked={method === m}
                  onClick={() => setMethod(m)}
                >
                  {m}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full p-0 hover:bg-transparent hover:text-neutral-700 dark:hover:text-neutral-300"
            onClick={() => handleRemoveFilter('method')}
          >
            <XIcon className="size-3.5" />
          </Button>
        </div>
      ) : null}

      {filters.includes('statusCode') ? (
        <div
          className={cn(
            'hover:bg-accent/70 flex items-center rounded-md border',
            !!status ? 'bg-accent' : 'border-accent border-dashed',
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="hover:bg-transparent">
                {status || 'Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {STATUS_CODES.map((m) => (
                <DropdownMenuCheckboxItem
                  key={m.value}
                  checked={status === m.value}
                  onClick={() => setStatus(m.value)}
                >
                  {m.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full p-0 hover:bg-transparent hover:text-neutral-700 dark:hover:text-neutral-300"
            onClick={() => handleRemoveFilter('statusCode')}
          >
            <XIcon className="size-3.5" />
          </Button>
        </div>
      ) : null}

      {filters.includes('timeRange') ? (
        <div
          className={cn(
            'hover:bg-accent/70 flex items-center rounded-md border',
            !!startDate || !!endDate ? 'bg-accent' : 'border-accent border-dashed',
          )}
        >
          <SelectDate
            dateRange={{ from: startDate, to: endDate }}
            onChange={({ from, to }) => {
              setStartDate(from);
              setEndDate(to);
            }}
          />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full p-0 hover:bg-transparent hover:text-neutral-700 dark:hover:text-neutral-300"
            onClick={() => handleRemoveFilter('timeRange')}
          >
            <XIcon className="size-3.5" />
          </Button>
        </div>
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-[38px]">
            <PlusIcon /> filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {AVAILABLE_FILTERS.map((filter) => (
            <DropdownMenuItem key={filter.key} onClick={() => handleAddFilter(filter.key)}>
              {filter.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TableFilters;
