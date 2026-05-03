"use client";

import * as React from "react";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import {
  GENRES,
  type Genre,
  EVENT_STATUSES,
  EVENT_STATUS_LABELS,
  type EventStatus,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────

export type MobileMapFiltersProps = Readonly<{
  defaultDate?: Date;
  className?: string;
}>;

type ActiveSheet = "status" | "genre" | "date" | null;
type DateOption = "today" | "week" | "pick-week" | "pick-date";

// ── Helpers ───────────────────────────────────────────────────

function currentWeekLabel() {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 0 });
  const end = endOfWeek(now, { weekStartsOn: 0 });
  const startStr = format(start, "MMM d");
  const endStr = start.getMonth() === end.getMonth() ? format(end, "d") : format(end, "MMM d");
  return `${startStr} – ${endStr}`;
}

function todayLabel() {
  return format(new Date(), "EEE, MMM d");
}

// ── Sub-components ────────────────────────────────────────────

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
    >
      <Badge
        variant={active ? "default" : "secondary"}
        className={cn(
          "h-auto cursor-pointer px-3 py-1 text-sm transition-colors",
          active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
      >
        {label}
      </Badge>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────

export function MobileMapFilters({ defaultDate, className }: MobileMapFiltersProps) {
  const [activeSheet, setActiveSheet] = React.useState<ActiveSheet>(null);
  const [dateOption, setDateOption] = React.useState<DateOption | null>(null);

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

  // ── Pill labels ──────────────────────────────────────────────

  const statusLabel = EVENT_STATUS_LABELS[eventStatus];
  const genreLabel = selectedGenres.length > 0 ? `Genre · ${selectedGenres.length}` : "Genre";
  const dateLabel =
    dateOption === "today"
      ? "Today"
      : dateOption === "week"
        ? "This Week"
        : dateOption === "pick-week" && startDate && endDate
          ? `${format(startDate, "MMM d")} – ${format(endDate, "d")}`
          : dateOption === "pick-date" && referenceDate
            ? format(referenceDate, "MMM d")
            : "Date";

  // ── Date option handler ──────────────────────────────────────

  function handleDateOption(option: DateOption) {
    setDateOption(option);
    if (option === "today") {
      setDateRange("day", new Date());
    } else if (option === "week") {
      setDateRange("week", new Date());
    }
    // "pick-week" and "pick-date" stay open for calendar interaction
  }

  function handlePickedWeek(d: Date | undefined) {
    if (!d) return;
    setDateRange("week", d);
    setActiveSheet(null);
  }

  function handlePickedDate(d: Date | undefined) {
    if (!d) return;
    setDateRange("day", d);
    setActiveSheet(null);
  }

  function handleDateClear() {
    setDateOption(null);
    setDateRange("day", undefined);
  }

  // ── Status sheet handler ─────────────────────────────────────

  function handleStatusSelect(status: EventStatus) {
    setEventStatus(status);
    setActiveSheet(null);
  }

  const thisWeekLabel = currentWeekLabel();
  const currentTodayLabel = todayLabel();

  return (
    <>
      {/* Pill row */}
      <div className={cn("flex gap-2 overflow-x-auto", className)}>
        <FilterPill
          label={statusLabel}
          active={eventStatus !== "all"}
          onClick={() => setActiveSheet("status")}
        />
        <FilterPill
          label={genreLabel}
          active={selectedGenres.length > 0}
          onClick={() => setActiveSheet("genre")}
        />
        <FilterPill label={dateLabel} active={!!startDate} onClick={() => setActiveSheet("date")} />
      </div>

      {/* Status sheet */}
      <Sheet open={activeSheet === "status"} onOpenChange={(o) => !o && setActiveSheet(null)}>
        <SheetContent side="bottom" className="mx-auto max-w-xl rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Status</SheetTitle>
          </SheetHeader>

          <RadioGroup
            value={eventStatus}
            onValueChange={(v) => handleStatusSelect(v as EventStatus)}
            className="gap-1 p-2"
          >
            {EVENT_STATUSES.map((status) => (
              <Label
                key={status}
                htmlFor={`status-${status}`}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                  "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10",
                  "hover:bg-muted"
                )}
              >
                {EVENT_STATUS_LABELS[status as EventStatus]}
                <RadioGroupItem id={`status-${status}`} value={status} />
              </Label>
            ))}
          </RadioGroup>
        </SheetContent>
      </Sheet>

      {/* Genre sheet */}
      <Sheet open={activeSheet === "genre"} onOpenChange={(o) => !o && setActiveSheet(null)}>
        <SheetContent side="bottom" className="mx-auto max-w-xl rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Genres</SheetTitle>
          </SheetHeader>

          <div className="flex flex-wrap gap-2 p-2">
            {GENRES.map((genre: Genre) => {
              const active = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setSelectedGenres(
                      active
                        ? selectedGenres.filter((g) => g !== genre)
                        : [...selectedGenres, genre]
                    )
                  }
                  className="shrink-0 rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                >
                  <Badge
                    variant={active ? "default" : "secondary"}
                    className={cn(
                      "h-auto cursor-pointer px-3 py-1 text-sm transition-colors",
                      active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                  >
                    {genre}
                  </Badge>
                </button>
              );
            })}
          </div>

          <SheetFooter className="pt-4">
            <Button className="w-full" onClick={() => setActiveSheet(null)}>
              Done
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Date sheet */}
      <Sheet open={activeSheet === "date"} onOpenChange={(o) => !o && setActiveSheet(null)}>
        <SheetContent side="bottom" className="mx-auto max-w-xl rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Date</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-1 p-2">
            <RadioGroup
              value={dateOption ?? ""}
              onValueChange={(v) => handleDateOption(v as DateOption)}
              className="gap-1"
            >
              {/* Today */}
              <Label
                htmlFor="date-today"
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                  "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10",
                  "hover:bg-muted"
                )}
              >
                <span className="flex flex-col gap-0.5">
                  <span>Today</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {currentTodayLabel}
                  </span>
                </span>
                <RadioGroupItem id="date-today" value="today" />
              </Label>

              {/* This Week — fixed to current week, shows date range sublabel */}
              <Label
                htmlFor="date-week"
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                  "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10",
                  "hover:bg-muted"
                )}
              >
                <span className="flex flex-col gap-0.5">
                  <span>This Week</span>
                  <span className="text-xs font-normal text-muted-foreground">{thisWeekLabel}</span>
                </span>
                <RadioGroupItem id="date-week" value="week" />
              </Label>

              {/* Pick a Week */}
              <Label
                htmlFor="date-pick-week"
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                  "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10",
                  "hover:bg-muted"
                )}
              >
                Pick a Week
                <RadioGroupItem id="date-pick-week" value="pick-week" />
              </Label>

              {/* Pick a Date */}
              <Label
                htmlFor="date-pick-date"
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                  "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10",
                  "hover:bg-muted"
                )}
              >
                Pick a Date
                <RadioGroupItem id="date-pick-date" value="pick-date" />
              </Label>
            </RadioGroup>

            {/* Week range calendar revealed when "pick-week" is selected */}
            {dateOption === "pick-week" && (
              <div className="pt-2">
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
                  className="mx-auto rounded-xl border"
                />
              </div>
            )}

            {/* Single date calendar revealed when "pick-date" is selected */}
            {dateOption === "pick-date" && (
              <div className="pt-2">
                <Calendar
                  mode="single"
                  selected={referenceDate}
                  onSelect={handlePickedDate}
                  className="mx-auto rounded-xl border"
                />
              </div>
            )}
          </div>

          <SheetFooter className="flex-row gap-2 pt-2">
            {dateOption && (
              <Button
                variant="ghost"
                className="gap-1.5 text-muted-foreground"
                onClick={handleDateClear}
              >
                <XIcon className="size-3.5" />
                Clear
              </Button>
            )}
            <Button className="flex-1" onClick={() => setActiveSheet(null)}>
              Done
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
