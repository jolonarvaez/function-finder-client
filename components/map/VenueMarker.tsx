"use client";

import { useState } from "react";
import { MapMarker, MarkerContent } from "@/components/ui/map";
import { MapPinIcon } from "lucide-react";
import { VenueInfo, type VenueEvent } from "@/components/map/VenueInfo";
import { getStatus, type EventStatus } from "@/components/dj/dj-event.types";

const Z_INDEX: Record<EventStatus, number> = { past: 0, upcoming: 1, live: 2 };

export type VenueMarkerProps = Readonly<{
  longitude: number;
  latitude: number;
  event?: VenueEvent;
  onClick?: (e: MouseEvent) => void;
}>;

export function VenueMarker({ longitude, latitude, event, onClick }: VenueMarkerProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const status = event?.date ? getStatus({ ...event, date: event.date }) : undefined;

  const handleClick = (e: MouseEvent) => {
    onClick?.(e);
    if (event) setSheetOpen(true);
  };

  return (
    <>
      <MapMarker
        longitude={longitude}
        latitude={latitude}
        zIndex={status ? Z_INDEX[status] : 1}
        onClick={handleClick}
      >
        <MarkerContent>
          <div className="relative">
            <div
              className={`flex size-10 items-center justify-center rounded-full backdrop-blur-xs 
                ${status === "past" ? "bg-muted-foreground/80 dark:bg-muted/80" : "bg-primary/90 -z-40"}`}
            >
              <MapPinIcon className="size-5 text-primary-foreground" />
            </div>
            {status === "live" && (
              <span className="absolute -top-0.5 -right-0.5 flex size-3.5">
                <span className="absolute inline-flex size-full rounded-full bg-primary opacity-50 animate-ping" />
                <span className="relative inline-flex size-3.5 rounded-full border-2 border-white/90 bg-primary" />
              </span>
            )}
          </div>
        </MarkerContent>
      </MapMarker>

      {event && <VenueInfo event={event} open={sheetOpen} onOpenChange={setSheetOpen} />}
    </>
  );
}
