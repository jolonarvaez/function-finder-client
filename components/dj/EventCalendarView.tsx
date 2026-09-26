"use client";

import { createContext, useContext, useMemo, useRef, useState } from "react";
import type { DayButton } from "react-day-picker";
import { format, parseISO, startOfMonth } from "date-fns";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { STATUS_LABELS } from "@/components/reusables/StatusBadge";
import { cn } from "@/lib/utils";
import { EventCard } from "./EventCard";
import { toISODate, type DJEvent } from "./dj-event.types";

/** Event names shown inside a day cell before collapsing into "+N more". */
const MAX_VISIBLE_EVENTS = 2;

/** Filled primary for events still ahead (live/upcoming), outline for done. */
const CHIP_CLASSES: Record<DJEvent["status"], string> = {
  live: "bg-primary text-primary-foreground",
  upcoming: "bg-primary text-primary-foreground",
  done: "border border-border text-muted-foreground",
};

type CalendarContextValue = Readonly<{
  eventsByDate: Map<string, DJEvent[]>;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}>;

// DayPicker only hands a DayButton its `day`, so events and actions arrive through context.
const CalendarContext = createContext<CalendarContextValue | null>(null);

function useCalendarContext() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("EventDayButton must be rendered inside EventCalendarView");
  return ctx;
}

/** Opens on the nearest live/upcoming event so the DJ lands on what matters next. */
function initialMonth(events: DJEvent[]) {
  const next = events
    .filter((e) => e.status === "live" || e.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  return startOfMonth(next ? parseISO(next.date) : new Date());
}

function EventDayButton({ day, children, ...props }: React.ComponentProps<typeof DayButton>) {
  const { eventsByDate, onView, onEdit } = useCalendarContext();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const events = eventsByDate.get(toISODate(day.date));

  if (!events) {
    return (
      <CalendarDayButton day={day} {...props}>
        {children}
      </CalendarDayButton>
    );
  }

  const overflow = events.length - MAX_VISIBLE_EVENTS;
  const label = `${format(day.date, "MMMM d")}: ${events
    .map((e) => `${e.name} (${STATUS_LABELS[e.status]})`)
    .join(", ")}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* An anchor rather than PopoverTrigger, which would replace the day button's focus ref. */}
      <PopoverAnchor asChild>
        <div ref={anchorRef} className="w-full">
          <CalendarDayButton
            day={day}
            {...props}
            aria-label={label}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={cn("font-semibold", props.className)}
            onClick={(e) => {
              props.onClick?.(e);
              setOpen((o) => !o);
            }}
          >
            {children}
            <div aria-hidden lang="en" className="flex w-full min-w-0 flex-col gap-1 mt-1 text-xs">
              {events.slice(0, MAX_VISIBLE_EVENTS).map((e) => (
                <span
                  key={e.id}
                  className={cn(
                    "line-clamp-2 rounded-md py-1 font-medium whitespace-normal wrap-break-word hyphens-auto",
                    CHIP_CLASSES[e.status]
                  )}
                >
                  {e.name}
                </span>
              ))}
              {overflow > 0 && (
                <span className="font-normal text-muted-foreground">+{overflow} more</span>
              )}
            </div>
          </CalendarDayButton>
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="max-h-[70vh] w-80 gap-0 divide-y divide-border overflow-y-auto p-0"
        // Clicks on the day itself toggle via onClick; don't let them count as "outside".
        onInteractOutside={(e) => {
          if (anchorRef.current?.contains(e.target as Node)) e.preventDefault();
        }}
      >
        {events.map((e) => (
          <EventCard
            key={e.id}
            event={e}
            className="rounded-none border-0 bg-transparent **:data-[slot=event-address]:truncate"
            onView={() => onView(e.id)}
            onEdit={() => onEdit(e.id)}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}

export type EventCalendarViewProps = Readonly<{
  events: DJEvent[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}>;

export function EventCalendarView({ events, onView, onEdit }: EventCalendarViewProps) {
  const [month, setMonth] = useState(() => initialMonth(events));

  const ctx = useMemo(() => {
    const eventsByDate = new Map<string, DJEvent[]>();
    for (const e of events) {
      const day = eventsByDate.get(e.date);
      if (day) day.push(e);
      else eventsByDate.set(e.date, [e]);
    }
    for (const day of eventsByDate.values()) {
      day.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return { eventsByDate, onView, onEdit };
  }, [events, onView, onEdit]);

  const monthPrefix = format(month, "yyyy-MM");
  const hasEventsThisMonth = events.some((e) => e.date.startsWith(monthPrefix));

  return (
    <CalendarContext.Provider value={ctx}>
      <div className="space-y-3">
        <Calendar
          month={month}
          onMonthChange={setMonth}
          // DayPicker only renders DayButtons for interactive calendars.
          onDayClick={() => {}}
          showOutsideDays={false}
          className="w-full rounded-lg border border-border bg-card p-2 [--cell-size:--spacing(11)]"
          classNames={{
            root: "w-full",
            // Taller, equal-width cells so event names fit under the day number.
            day: "aspect-auto min-w-0 flex-1 basis-0",
            day_button: "aspect-auto h-auto min-h-18 min-w-0 justify-start gap-1 px-0.5 py-1.5",
          }}
          components={{ DayButton: EventDayButton }}
        />
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {!hasEventsThisMonth && `No events in ${format(month, "MMMM")}.`}
        </p>
      </div>
    </CalendarContext.Provider>
  );
}
