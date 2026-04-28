"use client";

import * as React from "react";
import { format } from "date-fns";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
type DateOption = "today" | "week" | "pick";

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

const DATE_OPTIONS: { label: string; value: DateOption }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "Pick a date", value: "pick" },
];

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
        : dateOption === "pick" && referenceDate
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
    // "pick" stays open for calendar interaction
  }

  function handlePickedDate(d: Date | undefined) {
    setDateRange("day", d);
    if (d) setActiveSheet(null);
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
        <FilterPill
          label={dateLabel}
          active={!!referenceDate}
          onClick={() => setActiveSheet("date")}
        />
      </div>

      {/* Status sheet */}
      <Sheet open={activeSheet === "status"} onOpenChange={(o) => !o && setActiveSheet(null)}>
        <SheetContent side="bottom" className="mx-auto max-w-xl rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Status</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-1 p-2">
            {EVENT_STATUSES.map((status) => {
              const selected = status === eventStatus;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusSelect(status as EventStatus)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    selected ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <span className="font-medium">{EVENT_STATUS_LABELS[status as EventStatus]}</span>
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border-2 transition-colors",
                      selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                    )}
                  >
                    {selected && <span className="size-2 rounded-full bg-primary-foreground" />}
                  </span>
                </button>
              );
            })}
          </div>
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
            {DATE_OPTIONS.map(({ label, value }) => {
              const selected = dateOption === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleDateOption(value)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    selected ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <span className="font-medium">{label}</span>
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border-2 transition-colors",
                      selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                    )}
                  >
                    {selected && <span className="size-2 rounded-full bg-primary-foreground" />}
                  </span>
                </button>
              );
            })}

            {/* Calendar revealed when "pick" is selected */}
            {dateOption === "pick" && (
              <div className="pt-2">
                <Calendar
                  mode="single"
                  selected={referenceDate}
                  onSelect={handlePickedDate}
                  className="mx-auto rounded-xl border"
                />
              </div>
            )}

            {/* Week range highlight */}
            {dateOption === "week" && startDate && endDate && (
              <div className="pt-2">
                <Calendar
                  mode="single"
                  selected={undefined}
                  onSelect={(d) => {
                    if (d) {
                      setDateRange("week", d);
                    }
                  }}
                  modifiers={{
                    range_start: [startDate],
                    range_end: [endDate],
                    range_middle: { after: startDate, before: endDate },
                  }}
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
