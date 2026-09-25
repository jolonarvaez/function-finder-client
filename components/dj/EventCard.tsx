"use client";

import { format, parseISO } from "date-fns";
import { MapPinIcon, PencilIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTime, type DJEvent } from "./dj-event.types";
import { CopyLinkButton } from "@/components/reusables/CopyLinkButton";
import { StatusBadge } from "@/components/reusables/StatusBadge";
import { cn } from "@/lib/utils";

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
  onEdit?: () => void;
  onView?: () => void;
  className?: string;
};

export function EventCard({ event, onEdit, onView, className }: EventCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 space-y-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            {event.status === "live" || event.status === "upcoming" ? (
              <StatusBadge status={event.status} />
            ) : null}
            <p className="truncate text-lg font-semibold text-foreground">{event.name}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPinIcon className="size-3.5 shrink-0" />
            {event.address && (
              <p data-slot="event-address" className="text-sm text-foreground">
                {event.address}
              </p>
            )}
          </div>
        </div>

        {event.status === "upcoming" && onEdit && (
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
