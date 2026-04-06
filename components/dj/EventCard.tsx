"use client";

import { format, parseISO } from "date-fns";
import { MapPinIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatTime, type DJEvent, type EventStatus } from "./dj-event.types";

function GenreChips({ genres }: { genres: DJEvent["genres"] }) {
  return (
    <div className="flex flex-wrap gap-1">
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
};

export function EventCard({ event, status, onEdit }: EventCardProps) {
  const isPast = status === "past";
  const isLive = status === "live";

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 space-y-2",
        isPast && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-0.5 text-sm font-semibold uppercase tracking-wide text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                Live
              </span>
            )}
            <p className="truncate text-lg font-semibold text-foreground">{event.name}</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground">
            <MapPinIcon className="size-3.5 shrink-0" />
            <span className="truncate">
              {event.venue} · {event.category}
            </span>
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
          {formatTime(event.startTime)} – {formatTime(event.endTime)}
        </span>
        {event.entryPrice != null ? <span>₱{event.entryPrice}</span> : <span>Free</span>}
      </div>

      <GenreChips genres={event.genres} />

      {event.address && <p className="text-sm text-foreground">{event.address}</p>}
    </div>
  );
}
