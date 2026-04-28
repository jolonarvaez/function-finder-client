"use client";

import * as React from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenreSelector } from "@/components/GenreSelector";
import { useMapFilterStore, type DateRangeType } from "@/components/map/use-map-filter-store";
import { EVENT_STATUSES, EVENT_STATUS_LABELS, type EventStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────

export type MobileMapFiltersProps = Readonly<{
  defaultDate?: Date;
  defaultDateRangeType?: DateRangeType;
  className?: string;
}>;

type ActiveSheet = "status" | "genre" | "date" | null;

// ── Helpers ───────────────────────────────────────────────────

const DATE_RANGE_OPTIONS: { label: string; value: DateRangeType }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

function formatDatePillLabel(type: DateRangeType, referenceDate: Date): string {
  if (type === "day") return format(referenceDate, "MMM d");
  if (type === "week") {
    const sunday = startOfWeek(referenceDate, { weekStartsOn: 0 });
    const saturday = endOfWeek(referenceDate, { weekStartsOn: 0 });
    if (sunday.getMonth() === saturday.getMonth()) {
      return `${format(sunday, "MMM d")}–${format(saturday, "d")}`;
    }
    return `${format(sunday, "MMM d")}–${format(saturday, "MMM d")}`;
  }
  return format(referenceDate, "MMM yyyy");
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

export function MobileMapFilters({
  defaultDate,
  defaultDateRangeType = "week",
  className,
}: MobileMapFiltersProps) {
  const [activeSheet, setActiveSheet] = React.useState<ActiveSheet>(null);

  const {
    selectedGenres,
    eventStatus,
    dateRangeType,
    referenceDate,
    startDate,
    endDate,
    setSelectedGenres,
    setEventStatus,
    setDateRange,
  } = useMapFilterStore();

  React.useEffect(() => {
    setDateRange(defaultDateRangeType, defaultDate ?? new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Pill labels ──────────────────────────────────────────────

  const statusLabel = EVENT_STATUS_LABELS[eventStatus];
  const genreLabel =
    selectedGenres.length > 0 ? `Genre · ${selectedGenres.length}` : "Genre";
  const dateLabel = referenceDate
    ? formatDatePillLabel(dateRangeType, referenceDate)
    : "Date";

  // ── Date sheet handlers ──────────────────────────────────────

  function handleTypeChange(type: DateRangeType) {
    setDateRange(type, referenceDate ?? new Date());
  }

  function handleDateSelect(d: Date | undefined) {
    setDateRange(dateRangeType, d);
  }

  function handleDateClear() {
    setDateRange(dateRangeType, undefined);
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

          <div className="flex flex-col gap-1 py-2">
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
                      selected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40"
                    )}
                  >
                    {selected && (
                      <span className="size-2 rounded-full bg-primary-foreground" />
                    )}
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

          <div className="py-2">
            <GenreSelector
              variant="wrap"
              selected={selectedGenres}
              onChange={setSelectedGenres}
            />
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

          <div className="flex flex-col gap-4 py-2">
            <Tabs
              value={dateRangeType}
              onValueChange={(v) => handleTypeChange(v as DateRangeType)}
            >
              <TabsList className="w-full">
                {DATE_RANGE_OPTIONS.map(({ label, value }) => (
                  <TabsTrigger key={value} value={value} className="flex-1 text-sm">
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

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
              className="mx-auto"
            />
          </div>

          <SheetFooter className="flex-row gap-2 pt-2">
            {referenceDate && (
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
