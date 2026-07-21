"use client";

import { format, parseISO } from "date-fns";
import { MapPinIcon, PencilIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTime, type DJEvent, type EventStatus } from "./dj-event.types";
import { CopyLinkButton } from "@/components/reusables/CopyLinkButton";

function GenreChips({ genres }: { genres: DJEvent["genres"] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((g) => (
        <Badge key={g} variant="default">
          {g}
        </Badge>
      ))}
    </div>
  );
}

export type EventCardProps = {
  event: DJEvent;
  status: EventStatus;
  onEdit?: () => void;
  onView?: () => void;
};

export function EventCard({ event, status, onEdit, onView }: EventCardProps) {
  const isPast = status === "past";
  const isLive = status === "live";

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary-foreground opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-primary-foreground" />
                </span>
                Live
              </span>
            )}
            <p className="truncate text-lg font-semibold text-foreground">{event.name}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPinIcon className="size-3.5 shrink-0" />
            {event.address && <p className="text-sm text-foreground">{event.address}</p>}
          </div>
        </div>

        {!isPast && !isLive && onEdit && (
          <Button
            size="icon"
            variant="ghost"
            className="size-8 shrink-0 rounded-lg"
            aria-label="Edit event"
            onClick={onEdit}
          >
            <PencilIcon className="size-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span>{format(parseISO(event.date), "EEE, MMM d, yyyy")}</span>
        <span>
          {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </span>
        {event.entryPrice ? <span>₱{event.entryPrice}</span> : <span>Free</span>}
      </div>

      <GenreChips genres={event.genres} />

      <div className="flex items-center gap-2">
        <CopyLinkButton
          url={`${typeof window !== "undefined" ? window.location.origin : ""}/events/${event.id}`}
        />
        {onView && (
          <Button variant="outline" size="sm" className="h-7 gap-1 px-2" onClick={onView}>
            <ExternalLinkIcon className="size-3.5" />
            View Event
          </Button>
        )}
      </div>
    </div>
  );
}
