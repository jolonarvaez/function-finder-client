"use client";

import * as React from "react";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import {
  GENRES,
  type Genre,
  EVENT_STATUSES,
  EVENT_STATUS_LABELS,
  type EventStatus,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type DateOption = "today" | "week" | "pick-week" | "pick-date";

function weekRangeLabel(date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  const s = format(start, "MMM d");
  const e = start.getMonth() === end.getMonth() ? format(end, "d") : format(end, "MMM d");
  return `${s} - ${e}`;
}

const DATE_OPTIONS: { value: DateOption; label: () => string }[] = [
  { value: "today", label: () => `Today · ${format(new Date(), "EEE, MMM d")}` },
  { value: "week", label: () => `This Week · ${weekRangeLabel()}` },
  { value: "pick-week", label: () => "Pick a Week" },
  { value: "pick-date", label: () => "Pick a Date" },
];

export type EventListFiltersProps = Readonly<{
  defaultDate?: Date;
  className?: string;
}>;

export function EventListFilters({ defaultDate, className }: EventListFiltersProps) {
  const [dateOption, setDateOption] = React.useState<DateOption | null>(null);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [genreOpen, setGenreOpen] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);

  const {
    selectedGenres,
    eventStatus,
    referenceDate,
    startDate,
    endDate,
    setSelectedGenres,
    setEventStatus,
    setDateRange,
  } = useMapFilterStore();

  React.useEffect(() => {
    setDateRange("week", defaultDate ?? new Date());
    setDateOption("week");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateLabel = (() => {
    if (dateOption === "today") return `Today · ${format(new Date(), "MMM d")}`;
    if (dateOption === "week") return `This Week · ${weekRangeLabel()}`;
    if (dateOption === "pick-week" && startDate && endDate)
      return `${format(startDate, "MMM d")}–${format(endDate, "MMM d")}`;
    if (dateOption === "pick-date" && referenceDate) return format(referenceDate, "MMM d, yyyy");
    return "Date";
  })();

  function handleDateOptionClick(opt: DateOption) {
    setDateOption(opt);
    if (opt === "today") {
      setDateRange("day", new Date());
      setDateOpen(false);
    } else if (opt === "week") {
      setDateRange("week", new Date());
      setDateOpen(false);
    }
  }

  function handlePickedWeek(d: Date | undefined) {
    if (!d) return;
    setDateRange("week", d);
    setDateOpen(false);
  }

  function handlePickedDate(d: Date | undefined) {
    if (!d) return;
    setDateRange("day", d);
    setDateOpen(false);
  }

  function handleDateClear() {
    setDateOption(null);
    setDateRange("day", undefined);
    setDateOpen(false);
  }

  function toggleGenre(genre: Genre) {
    setSelectedGenres(
      selectedGenres.includes(genre)
        ? selectedGenres.filter((g) => g !== genre)
        : [...selectedGenres, genre]
    );
  }

  const optionRowClass = (active: boolean) =>
    cn(
      "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted hover:text-foreground",
      active && "bg-primary/80 font-medium text-white"
    );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Status */}
      <Popover open={statusOpen} onOpenChange={setStatusOpen}>
        <PopoverTrigger asChild>
          <Button variant={eventStatus === "all" ? "outline" : "default"}>
            {EVENT_STATUS_LABELS[eventStatus]}
            <ChevronDownIcon className="size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-48">
          <div className="flex flex-col gap-0.5">
            {EVENT_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className={optionRowClass(eventStatus === s)}
                onClick={() => {
                  setEventStatus(s as EventStatus);
                  setStatusOpen(false);
                }}
              >
                {EVENT_STATUS_LABELS[s as EventStatus]}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Genre */}
      <Popover open={genreOpen} onOpenChange={setGenreOpen}>
        <PopoverTrigger asChild>
          <Button variant={selectedGenres.length > 0 ? "default" : "outline"}>
            {selectedGenres.length > 0 ? `Genre · ${selectedGenres.length}` : "Genre"}
            <ChevronDownIcon className="size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72">
          <div className="flex flex-wrap gap-1.5">
            {GENRES.map((genre: Genre) => {
              const active = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleGenre(genre)}
                  className="rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                >
                  <Badge
                    variant={active ? "default" : "secondary"}
                    className="h-auto cursor-pointer px-3 py-1 text-xs transition-colors"
                  >
                    {genre}
                  </Badge>
                </button>
              );
            })}
          </div>
          {selectedGenres.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full gap-1.5 text-muted-foreground"
              onClick={() => setSelectedGenres([])}
            >
              <XIcon className="size-3" />
              Clear
            </Button>
          )}
        </PopoverContent>
      </Popover>

      {/* Date */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <Button variant={startDate ? "default" : "outline"}>
            {dateLabel}
            <ChevronDownIcon className="size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto min-w-56">
          <div className="flex flex-col gap-0.5">
            {DATE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={optionRowClass(dateOption === value)}
                onClick={() => handleDateOptionClick(value)}
              >
                {label()}
              </button>
            ))}
          </div>

          {dateOption === "pick-week" && (
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={handlePickedWeek}
              modifiers={
                startDate && endDate
                  ? {
                      range_start: [startDate],
                      range_end: [endDate],
                      range_middle: { after: startDate, before: endDate },
                    }
                  : undefined
              }
              className="mt-2 rounded-xl border"
            />
          )}

          {dateOption === "pick-date" && (
            <Calendar
              mode="single"
              selected={referenceDate}
              onSelect={handlePickedDate}
              className="mt-2 rounded-xl border"
            />
          )}

          {dateOption && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full gap-1.5 text-muted-foreground"
              onClick={handleDateClear}
            >
              <XIcon className="size-3" />
              Clear date
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
