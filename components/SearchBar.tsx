"use client";

import * as React from "react";
import { format } from "date-fns";
import { SearchIcon, SlidersHorizontalIcon, CalendarIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { GenreSelector } from "@/components/GenreSelector";
import { VenueFilterSelector } from "@/components/VenueFilterSelector";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import { cn } from "@/lib/utils";

export type SearchBarProps = Readonly<{
  showFilter?: boolean;
  showStatus?: boolean;
  defaultDate?: Date;
  className?: string;
}>;

export function SearchBar({
  showFilter = false,
  showStatus = false,
  defaultDate,
  className,
}: SearchBarProps) {
  const [filterOpen, setFilterOpen] = React.useState(showFilter);
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const {
    selectedGenres,
    query,
    activeFilter,
    dateRangeType,
    referenceDate: selectedDate,
    setSelectedGenres,
    setQuery,
    setActiveFilter,
    setDateRange,
  } = useMapFilterStore();

  const setSelectedDate = (date: Date | undefined) => setDateRange(dateRangeType, date);

  // Seed the store with defaultDate (or today) on first mount
  React.useEffect(() => {
    setDateRange(dateRangeType, defaultDate ?? new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search input */}
      <div className="relative flex items-center">
        <SearchIcon
          size={15}
          className="pointer-events-none absolute left-3 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search venues, genres, and DJs..."
          className="h-10 bg-muted/40 pl-9 pr-10 text-sm"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setFilterOpen((prev: boolean) => !prev)}
          aria-label="Toggle filters"
          className={cn("absolute right-1 size-8", filterOpen && "text-primary")}
        >
          <SlidersHorizontalIcon size={15} />
        </Button>
      </div>

      {filterOpen && (
        <div className="space-y-3 pb-3">
          {showStatus && <VenueFilterSelector selected={activeFilter} onChange={setActiveFilter} />}

          {/* Genre */}
          <GenreSelector selected={selectedGenres} onChange={setSelectedGenres} />

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
      )}
    </div>
  );
}
