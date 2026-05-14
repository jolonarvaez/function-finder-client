"use client";

import * as React from "react";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { SlidersHorizontalIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GenreSelector } from "@/components/GenreSelector";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import { EVENT_STATUSES, EVENT_STATUS_LABELS, type EventStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────

export type MapFiltersProps = Readonly<{
  defaultOpen?: boolean;
  defaultDate?: Date;
  className?: string;
}>;

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

// ── Component ─────────────────────────────────────────────────

export function MapFilters({ defaultOpen = false, defaultDate, className }: MapFiltersProps) {
  const [open, setOpen] = React.useState(defaultOpen);
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

  const activeCount = selectedGenres.length + (startDate ? 1 : 0) + (eventStatus !== "all" ? 1 : 0);

  function handleDateOption(option: DateOption) {
    setDateOption(option);
    if (option === "today") {
      setDateRange("day", new Date());
    } else if (option === "week") {
      setDateRange("week", new Date());
    } else if (option === "pick-week" && referenceDate) {
      setDateRange("week", referenceDate);
    }
  }

  function handlePickedWeek(d: Date | undefined) {
    if (!d) return;
    setDateRange("week", d);
  }

  function handlePickedDate(d: Date | undefined) {
    if (!d) return;
    setDateRange("day", d);
  }

  function handleDateClear() {
    setDateOption(null);
    setDateRange("day", undefined);
  }

  const thisWeekLabel = currentWeekLabel();
  const currentTodayLabel = todayLabel();

  const cardClass = cn(
    "flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
    "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10",
    "hover:bg-muted"
  );

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={cn("w-80", className)}>
      {/* Trigger pill */}
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium shadow-md transition-colors",
            "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          )}
        >
          <SlidersHorizontalIcon className="size-4 shrink-0" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {activeCount}
            </span>
          )}
          <ChevronDownIcon
            className={cn(
              "ml-auto size-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>

      {/* Panel */}
      <CollapsibleContent className="data-[state=closed]:overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
        <div className="mt-1 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          <div className="space-y-3 p-3">
            {/* Status */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </p>
              <div className="flex flex-wrap gap-1.5">
                {EVENT_STATUSES.map((status) => {
                  const isSelected = status === eventStatus;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setEventStatus(status as EventStatus)}
                      className="shrink-0 rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                    >
                      <Badge
                        variant={isSelected ? "default" : "secondary"}
                        className={cn(
                          "h-auto cursor-pointer px-3 py-0.5 text-xs transition-colors",
                          isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        )}
                      >
                        {EVENT_STATUS_LABELS[status]}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Genre */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Genre
              </p>
              <GenreSelector
                selected={selectedGenres}
                onChange={setSelectedGenres}
                size="small"
                variant="wrap"
              />
            </div>

            <Separator />

            {/* Date */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Date
              </p>

              <RadioGroup
                value={dateOption ?? ""}
                onValueChange={(v) => handleDateOption(v as DateOption)}
                className="gap-1"
              >
                {/* Today */}
                <Label htmlFor="df-today" className={cardClass}>
                  <span className="flex flex-col gap-0.5">
                    <span>Today</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {currentTodayLabel}
                    </span>
                  </span>
                  <RadioGroupItem id="df-today" value="today" />
                </Label>

                {/* This Week */}
                <Label htmlFor="df-week" className={cardClass}>
                  <span className="flex flex-col gap-0.5">
                    <span>This Week</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {thisWeekLabel}
                    </span>
                  </span>
                  <RadioGroupItem id="df-week" value="week" />
                </Label>

                {/* Pick a Week */}
                <Label htmlFor="df-pick-week" className={cardClass}>
                  Pick a Week
                  <RadioGroupItem id="df-pick-week" value="pick-week" />
                </Label>

                {/* Pick a Date */}
                <Label htmlFor="df-pick-date" className={cardClass}>
                  Pick a Date
                  <RadioGroupItem id="df-pick-date" value="pick-date" />
                </Label>
              </RadioGroup>

              {/* Week range calendar */}
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
                  className="w-full rounded-xl border"
                />
              )}

              {/* Single date calendar */}
              {dateOption === "pick-date" && (
                <Calendar
                  mode="single"
                  selected={referenceDate}
                  onSelect={handlePickedDate}
                  className="w-full rounded-xl border"
                />
              )}

              {dateOption && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-1.5 text-muted-foreground"
                  onClick={handleDateClear}
                >
                  <XIcon className="size-3" />
                  Clear date
                </Button>
              )}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
