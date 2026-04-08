"use client";

import * as React from "react";
import { format } from "date-fns";
import { SlidersHorizontalIcon, CalendarIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { GenreSelector } from "@/components/GenreSelector";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import { cn } from "@/lib/utils";

export type MapFiltersProps = Readonly<{
  defaultOpen?: boolean;
  defaultDate?: Date;
  className?: string;
}>;

export function MapFilters({ defaultOpen = false, defaultDate, className }: MapFiltersProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const { selectedGenres, selectedDate, setSelectedGenres, setSelectedDate } = useMapFilterStore();

  const activeCount = selectedGenres.length + (selectedDate ? 1 : 0);

  React.useEffect(() => {
    setSelectedDate(defaultDate ?? new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

          {/* Date */}
          <div className="space-y-1.5">
            <p className="text-md font-medium text-foreground">Date</p>
            <div className="flex items-center gap-2">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 flex-1 justify-start gap-2 rounded-lg text-sm font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="size-3.5 shrink-0" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => {
                      setSelectedDate(d);
                      setCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>

              {selectedDate && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Clear date"
                  onClick={() => setSelectedDate(undefined)}
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
