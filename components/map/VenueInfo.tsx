"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Persona } from "@/components/shared/Persona";
import { EventImageGallery } from "@/components/event/EventImageGallery";
import { XIcon, MapPinIcon, Turntable, ClockIcon, CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { EventImage } from "@/components/dj/dj-event.types";

// ── Types ────────────────────────────────────────────────────

export type VenuePerformer = Readonly<{
  name: string;
  avatar?: string;
  genre: string[];
  userId?: string;
  setTime?: string;
}>;

export type VenueEvent = Readonly<{
  id: string;
  name: string;
  event_images?: EventImage[];
  address: string;
  category: string;
  /** ISO date string e.g. "2026-04-02" */
  date?: string;
  startTime: string;
  endTime: string;
  entryPrice?: number;
  featured: boolean;
  attending: number;
  status: "live" | "upcoming" | "done";
  performers: VenuePerformer[];
  created_by: string;
}>;

export type VenueInfoProps = Readonly<{
  event: VenueEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

// ── Component ────────────────────────────────────────────────

export function VenueInfo({ event, open, onOpenChange }: VenueInfoProps) {
  const live = event.status === "live";
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="mx-auto flex max-h-[85vh] max-w-xl flex-col gap-0 rounded-t-2xl p-0"
      >
        {/* Floating close button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/80"
        >
          <XIcon className="size-4" />
        </button>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Venue info */}
          <SheetHeader className="px-5 pt-5 pb-0">
            {live && (
              <Badge className="w-fit bg-primary text-white">
                <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-white" />{" "}
                Live Now
              </Badge>
            )}
            <SheetTitle className="text-xl font-bold">{event.name}</SheetTitle>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="size-3.5 shrink-0" />
              {event.address}
            </p>
          </SheetHeader>

          {/* Performers */}
          {event.performers.length > 0 && (
            <div className="mx-5 my-4 flex flex-col gap-3 border-t border-border py-4">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Turntable className="size-3.5 shrink-0" />
                {live ? "Now Playing" : "Lineup"}
              </p>
              {event.performers.map((performer) => (
                <Persona
                  key={`${performer.userId ?? performer.name}`}
                  userId={performer.userId}
                  name={performer.name}
                  genre={performer.genre}
                  avatarSrc={performer.avatar}
                  setTime={performer.setTime}
                  isActive={live}
                  variant="min"
                />
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mx-5 mt-4 grid grid-cols-2 gap-3">
            {event.date && (
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarIcon className="size-3.5" />
                  Date
                </p>
                <p className="mt-1 text-base font-bold text-foreground">
                  {format(parseISO(event.date), "MMM d, yyyy")}
                </p>
              </div>
            )}
            <div
              className={
                event.date
                  ? "rounded-xl border border-border bg-card p-3"
                  : "col-span-2 rounded-xl border border-border bg-card p-3"
              }
            >
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ClockIcon className="size-3.5" />
                Hours
              </p>
              <p className="mt-1 text-base font-bold text-foreground">
                {event.startTime} – {event.endTime}
              </p>
            </div>
          </div>

          {/* Image gallery */}
          {(event.event_images?.length ?? 0) > 0 ? (
            <div className="mt-4 px-5 pb-4">
              <EventImageGallery event={event} alt={`${event.name} flyer`} />
            </div>
          ) : (
            <div className="h-4" />
          )}
        </div>

        {/* Sticky CTA */}
        <div className="shrink-0 border-t border-border px-5 py-3">
          <Button asChild className="h-10 w-full rounded-lg text-xs font-semibold">
            <Link href={`/events/${event.id}`}>View Event Details</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
