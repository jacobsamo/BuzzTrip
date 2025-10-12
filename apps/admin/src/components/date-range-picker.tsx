"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@buzztrip/ui/components/button";
import { Calendar } from "@buzztrip/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@buzztrip/ui/components/popover";
import { cn } from "@buzztrip/ui/lib/utils";

type DateRangePreset = {
  label: string;
  value: string;
  getDates: () => DateRange;
};

const presets: DateRangePreset[] = [
  {
    label: "Last 7 days",
    value: "7d",
    getDates: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 7);
      return { from, to };
    },
  },
  {
    label: "Last 30 days",
    value: "30d",
    getDates: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 30);
      return { from, to };
    },
  },
  {
    label: "Last 3 months",
    value: "3m",
    getDates: () => {
      const to = new Date();
      const from = new Date();
      from.setMonth(from.getMonth() - 3);
      return { from, to };
    },
  },
  {
    label: "Last 6 months",
    value: "6m",
    getDates: () => {
      const to = new Date();
      const from = new Date();
      from.setMonth(from.getMonth() - 6);
      return { from, to };
    },
  },
  {
    label: "Last 12 months",
    value: "12m",
    getDates: () => {
      const to = new Date();
      const from = new Date();
      from.setMonth(from.getMonth() - 12);
      return { from, to };
    },
  },
];

interface DateRangePickerProps {
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  range,
  onRangeChange,
  className,
}: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(
    null
  );

  const handlePresetClick = (preset: DateRangePreset) => {
    const newRange = preset.getDates();
    onRangeChange(newRange);
    setSelectedPreset(preset.value);
  };

  const handleCalendarSelect = (newRange: DateRange | undefined) => {
    onRangeChange(newRange);
    setSelectedPreset(null); // Clear preset when manually selecting
  };

  const formatDateRange = () => {
    if (!range?.from) return "Pick a date range";
    if (!range.to) {
      return range.from.toLocaleDateString("en-AU", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return `${range.from.toLocaleDateString("en-AU", {
      month: "short",
      day: "numeric",
    })} - ${range.to.toLocaleDateString("en-AU", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !range && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex">
            {/* Preset buttons sidebar */}
            <div className="flex flex-col border-r border-border p-2 gap-1">
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={
                    selectedPreset === preset.value ? "default" : "ghost"
                  }
                  size="sm"
                  className="justify-start"
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            {/* Calendar */}
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={range?.from}
                selected={range}
                onSelect={handleCalendarSelect}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
