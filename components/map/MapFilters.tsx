"use client";

import * as React from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { SlidersHorizontalIcon, CalendarIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenreSelector } from "@/components/GenreSelector";
import { useMapFilterStore, type DateRangeType } from "@/components/map/use-map-filter-store";
import { cn } from "@/lib/utils";

export type MapFiltersProps = Readonly<{
  defaultOpen?: boolean;
  defaultDate?: Date;
  defaultDateRangeType?: DateRangeType;
  className?: string;
}>;

const DATE_RANGE_OPTIONS: { label: string; value: DateRangeType }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

function formatDateRangeLabel(type: DateRangeType, referenceDate: Date): string {
  if (type === "day") return format(referenceDate, "PPP");
  if (type === "week") {
    const sunday = startOfWeek(referenceDate, { weekStartsOn: 0 });
    const saturday = endOfWeek(referenceDate, { weekStartsOn: 0 });
    if (sunday.getMonth() === saturday.getMonth()) {
      return `${format(sunday, "MMM d")} – ${format(saturday, "d, yyyy")}`;
    }
    return `${format(sunday, "MMM d")} – ${format(saturday, "MMM d, yyyy")}`;
  }
  // month
  return format(referenceDate, "MMMM yyyy");
}

export function MapFilters({ defaultOpen = false, defaultDate, defaultDateRangeType = "week", className }: MapFiltersProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const {
    selectedGenres,
    dateRangeType,
    referenceDate,
    startDate,
    endDate,
    setSelectedGenres,
    setDateRange,
  } = useMapFilterStore();

  const activeCount = selectedGenres.length + (startDate ? 1 : 0);

  React.useEffect(() => {
    setDateRange(defaultDateRangeType, defaultDate ?? new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTypeChange(type: DateRangeType) {
    setDateRange(type, referenceDate ?? new Date());
  }

  function handleDateSelect(d: Date | undefined) {
    setDateRange(dateRangeType, d);
    if (d) setCalendarOpen(false);
  }

  function handleClear() {
    setDateRange(dateRangeType, undefined);
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={className}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            "bg-muted/40 hover:bg-muted/60 active:bg-muted/80",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          )}
        >
          <span className="flex items-center gap-2 text-foreground">
            <SlidersHorizontalIcon className="size-4" />
            Filters
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDownIcon
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
        <div className="space-y-3 pt-3">
          {/* Genre */}
          <GenreSelector selected={selectedGenres} onChange={setSelectedGenres} variant={"wrap"} />

          {/* Date range */}
          <div className="space-y-1.5">
            <p className="text-md font-medium text-foreground">Date</p>

            {/* Type toggle */}
            <Tabs value={dateRangeType} onValueChange={(v) => handleTypeChange(v as DateRangeType)}>
              <TabsList className="w-full">
                {DATE_RANGE_OPTIONS.map(({ label, value }) => (
                  <TabsTrigger key={value} value={value} className="flex-1 text-sm">
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Date picker */}
            <div className="flex items-center gap-1 mt-2">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 flex-1 justify-start gap-2 rounded-lg text-sm font-normal",
                      !referenceDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="size-3.5 shrink-0" />
                    {referenceDate
                      ? formatDateRangeLabel(dateRangeType, referenceDate)
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRangeType === "day" ? referenceDate : undefined}
                    onSelect={handleDateSelect}
                    modifiers={
                      dateRangeType !== "day" && startDate && endDate
                        ? {
                            range_start: [startDate],
                            range_end: [endDate],
                            range_middle: { after: startDate, before: endDate },
                          }
                        : {}
                    }
                  />
                </PopoverContent>
              </Popover>

              {referenceDate && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Clear date"
                  onClick={handleClear}
                  className="size-9 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
