"use client";

import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Persona } from "@/components/Persona";
import { HeartIcon, XIcon, MapPinIcon, MusicIcon, ClockIcon, CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { Genre } from "@/lib/constants";

// ── Types ────────────────────────────────────────────────────

export type VenueDJ = Readonly<{
  name: string;
  avatar?: string;
  genre: Genre | Genre[];
}>;

export type VenueEvent = Readonly<{
  name: string;
  image?: string;
  address: string;
  category: string;
  /** ISO date string e.g. "2026-04-02" */
  date?: string;
  startTime: string;
  endTime: string;
  entryPrice?: number;
  featured: boolean;
  attending: number;
  dj: VenueDJ;
  created_by: string;
}>;

export type VenueInfoProps = Readonly<{
  event: VenueEvent;
  live?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

// ── Component ────────────────────────────────────────────────

export function VenueInfo({ event, live = false, open, onOpenChange }: VenueInfoProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="mx-auto max-w-xl gap-0 rounded-t-2xl p-0"
      >
        {/* Hero */}
        {event.image ? (
          <div className="relative">
            <Image
              src={event.image}
              alt={event.name}
              width={600}
              height={192}
              className="h-48 w-full rounded-t-2xl object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

            {/* Overlaid controls */}
            <div className="absolute top-3 left-3">
              {live && (
                <Badge className="bg-primary text-white">
                  <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-white" />{" "}
                  Live Now
                </Badge>
              )}
            </div>
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full bg-card/60 text-foreground backdrop-blur-sm transition-colors hover:bg-card/80"
              >
                <HeartIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex size-8 items-center justify-center rounded-full bg-card/60 text-foreground backdrop-blur-sm transition-colors hover:bg-card/80"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-5 pt-5">
            <div className="flex items-center gap-2">
              {live && (
                <Badge className="bg-primary text-white">
                  <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-white" />{" "}
                  Live Now
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/80"
              >
                <HeartIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex size-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/80"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* Venue info */}
        <SheetHeader className="px-5 pt-5 pb-0">
          <SheetTitle className="text-xl font-bold">{event.name}</SheetTitle>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPinIcon className="size-3.5" />
            {event.address}
          </p>
        </SheetHeader>

        {/* DJ */}
        <div className="border-t border-border mx-5 mt-4 pt-4">
          {live && (
            <p className="mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <MusicIcon className="size-3.5" />
              Now Playing
            </p>
          )}
          <Persona
            userId={event.created_by}
            name={event.dj.name}
            genre={event.dj.genre}
            avatarSrc={event.dj.avatar}
            isActive={live}
            variant="min"
          />
        </div>

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

        {/* CTA */}
        <SheetFooter className="px-5 pt-4 pb-6">
          {/* <Button className="h-12 w-full rounded-xl text-sm font-semibold">
            Go Now
          </Button> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
