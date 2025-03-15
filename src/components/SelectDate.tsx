import { useCallback, useEffect, useState } from 'react';

import {
  endOfDay,
  endOfMonth,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subHours,
} from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const PRESET_RANGES = [
  { label: 'Last Hour', range: { from: subHours(new Date(), 1), to: new Date() } },
  {
    label: 'Today',
    range: {
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    },
  },
  {
    label: 'Last 7 Days',
    range: {
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    },
  },
  {
    label: 'Last 30 Days',
    range: {
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    },
  },
  {
    label: 'This Month',
    range: {
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    },
  },
  {
    label: 'This Year',
    range: {
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    },
  },
];

type DateRange = { from: Date | undefined; to: Date | undefined };

type Props = {
  className?: string;
  dateRange?: DateRange;
  onChange: (range: DateRange) => void;
};

export const getDefaultToday = () => {
  const today = new Date();
  return {
    from: startOfDay(today),
    to: endOfDay(today),
  };
};

const SelectDate = ({
  className = '',
  dateRange = {
    from: undefined,
    to: undefined,
  },
  onChange,
}: Props) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleRangeChange = useCallback(
    (range: DateRange, presetLabel?: string) => {
      onChange(range);
      setSelectedPreset(presetLabel || null);

      if (presetLabel) {
        setOpen(false);
      }
    },
    [onChange],
  );

  useEffect(() => {
    const preset = PRESET_RANGES.find(
      (preset) =>
        preset.range.from.getTime() === dateRange.from?.getTime() &&
        preset.range.to.getTime() === dateRange.to?.getTime(),
    );

    if (preset) {
      setSelectedPreset(preset.label);
    }
  }, [dateRange]);

  return (
    <div className={cn(className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-transparent">
            <CalendarIcon className="h-4 w-4" />
            {selectedPreset
              ? selectedPreset
              : dateRange.from && dateRange.to
                ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
                : 'Select Date Range'}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[650px] min-w-[320px] overflow-auto p-4">
          <div className="flex gap-4">
            <div className="w-1/3 border-r pr-4">
              <h4 className="mb-2 text-sm font-semibold">Presets</h4>
              <ul className="space-y-2">
                {PRESET_RANGES.map((preset) => (
                  <li key={preset.label}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full px-2 py-1 text-left text-sm',
                        selectedPreset === preset.label && 'bg-gray-200',
                      )}
                      onClick={() => handleRangeChange(preset.range, preset.label)}
                    >
                      {preset.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1">
              <h4 className="mb-2 text-sm font-semibold">Select Range</h4>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => handleRangeChange(range as DateRange)}
                numberOfMonths={2}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                handleRangeChange({ from: undefined, to: undefined });
                setSelectedPreset(null);
              }}
            >
              Clear
            </Button>
            <Button onClick={() => setOpen(false)}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectDate;
