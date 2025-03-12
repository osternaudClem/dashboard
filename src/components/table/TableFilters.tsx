import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const STATUS_CODES = [
  { value: '200', label: '200 OK' },
  { value: '201', label: '201 Created' },
  { value: '400', label: '400 Bad Request' },
  { value: '401', label: '401 Unauthorized' },
  { value: '403', label: '403 Forbidden' },
  { value: '404', label: '404 Not Found' },
  { value: '500', label: '500 Internal Server Error' },
];

const DEFAULT_VALUES = {
  source: '',
  method: '',
  status: '',
  limit: 10,
  startDate: null,
  endDate: null,
} as const;

interface TableFiltersProps {
  source: string;
  setSource: (value: string) => void;
  limit: number;
  setLimit: (value: number) => void;
  method: string;
  setMethod: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  onApply: () => void;
  onReset: () => void;
}

const TableFilters = ({
  source,
  setSource,
  limit,
  setLimit,
  method,
  setMethod,
  status,
  setStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onApply,
  onReset,
}: TableFiltersProps) => {
  const isDefault = {
    source: source === DEFAULT_VALUES.source,
    method: method === DEFAULT_VALUES.method,
    status: status === DEFAULT_VALUES.status,
    limit: limit === DEFAULT_VALUES.limit,
    dates: startDate === DEFAULT_VALUES.startDate && endDate === DEFAULT_VALUES.endDate,
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative">
        <Input
          placeholder="Filter by source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className={isDefault.source ? 'border-dashed' : ''}
        />
        {!isDefault.source && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 rounded-full p-0"
            onClick={() => setSource(DEFAULT_VALUES.source)}
          >
            ×
          </Button>
        )}
      </div>

      <div className="relative">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className={`w-[120px] ${isDefault.method ? 'border-dashed' : ''}`}>
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {HTTP_METHODS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!isDefault.method && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1/2 right-8 h-6 w-6 -translate-y-1/2 rounded-full p-0"
            onClick={() => setMethod(DEFAULT_VALUES.method)}
          >
            ×
          </Button>
        )}
      </div>

      <div className="relative">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className={`w-[200px] ${isDefault.status ? 'border-dashed' : ''}`}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_CODES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!isDefault.status && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1/2 right-8 h-6 w-6 -translate-y-1/2 rounded-full p-0"
            onClick={() => setStatus(DEFAULT_VALUES.status)}
          >
            ×
          </Button>
        )}
      </div>

      <div className="relative flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-[150px] justify-start text-left font-normal ${isDefault.dates ? 'border-dashed' : ''}`}
            >
              {startDate ? format(startDate, 'PP') : <span>Start date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: startDate || undefined, to: endDate || undefined }}
              onSelect={(range) => {
                if (range) {
                  const { from, to } = range;
                  setStartDate(from ? new Date(from.setHours(0, 0, 0, 0)) : null);
                  setEndDate(to ? new Date(to.setHours(23, 59, 59, 999)) : null);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {!isDefault.dates && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 rounded-full p-0"
            onClick={() => {
              setStartDate(DEFAULT_VALUES.startDate);
              setEndDate(DEFAULT_VALUES.endDate);
            }}
          >
            ×
          </Button>
        )}
      </div>

      <div className="relative">
        <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
          <SelectTrigger className={`w-[100px] ${isDefault.limit ? 'border-dashed' : ''}`}>
            <SelectValue placeholder="Limit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        {!isDefault.limit && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1/2 right-8 h-6 w-6 -translate-y-1/2 rounded-full p-0"
            onClick={() => setLimit(DEFAULT_VALUES.limit)}
          >
            ×
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            onReset();
            onApply();
          }}
        >
          Reset All
        </Button>
      </div>
    </div>
  );
};

export default TableFilters;
