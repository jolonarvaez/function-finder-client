"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Persona } from "@/components/Persona";
import { cn } from "@/lib/utils";
import { formatTime } from "@/components/dj/dj-event.types";
import type { ApiEvent } from "@/lib/services/events";

type Props = Readonly<{ event: ApiEvent }>;

export function EventItem({ event }: Props) {
  const address = event.custom_location?.address ?? event.location ?? "Location TBA";
  const startTime = formatTime(event.start_time.slice(0, 5));
  const endTime = formatTime(event.end_time.slice(0, 5));
  const isLive = event.status === "live";
  const isDone = event.status === "done";
  const isUpcoming = event.status === "upcoming";

  return (
    <div className={cn("relative overflow-hidden rounded-lg border border-border bg-card")}>
      {/* Stretched card link — sits beneath all interactive children */}
      <Link
        href={`/events/${event.id}`}
        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={event.name}
      />

      {/* Top row: details + flyer */}
      <div className="relative flex">
        <div className="min-w-0 flex-1 space-y-3 p-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="truncate font-semibold text-foreground">{event.name}</p>
              {isLive && <Badge variant="default">Live</Badge>}
              {isUpcoming && <Badge variant="secondary">Upcoming</Badge>}
              {isDone && <Badge variant="outline">Done</Badge>}
            </div>
            <p className="mt-0.5 text-sm capitalize text-foreground">{event.category}</p>
            {event.description && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{event.description}</p>
            )}
          </div>

          <div className="space-y-1.5 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-3.5 shrink-0" />
              <span>{format(parseISO(event.date), "EEE, MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="size-3.5 shrink-0" />
              <span>
                {startTime} - {endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-3.5 shrink-0" />
              <span className="truncate">{address}</span>
            </div>
          </div>

          {event.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.genres.map((g) => (
                <Badge key={g} variant="outline" className="text-xs">
                  {g}
                </Badge>
              ))}
            </div>
          )}

          {event.entry_price ? (
            <span className="text-sm font-medium text-foreground">
              ₱{event.entry_price.toLocaleString()}
            </span>
          ) : (
            <span className="text-sm text-foreground">Free</span>
          )}
        </div>

        {event.flyer_url && (
          <div className="w-1/2 shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.flyer_url}
              alt={`${event.name} flyer`}
              className="size-full object-cover"
            />
          </div>
        )}
      </div>

      {/* DJ row — full width below the flyer */}
      <div className="relative z-10 border-t border-border px-4 pb-4 pt-3">
        <Persona
          variant="min"
          name={event.users.display_name}
          avatarSrc={event.users.avatar_url ?? undefined}
          avatarFallback={event.users.display_name[0]}
          userId={event.created_by}
        />
        <Button asChild className="mt-3 w-full">
          <Link href={`/events/${event.id}`}>View details</Link>
        </Button>
      </div>
    </div>
  );
}
