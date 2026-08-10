"use client";

import { useState } from "react";
import { MapMarker, MarkerContent } from "@/components/ui/map";
import { MapPinIcon } from "lucide-react";
import { VenueInfo, type VenueEvent } from "@/components/map/VenueInfo";
import { cn } from "@/lib/utils";

const Z_INDEX: Record<"done" | "upcoming" | "live", number> = { done: 0, upcoming: 1, live: 2 };
const ALWAYS_OPEN_ZOOM = 13;

export type VenueMarkerProps = Readonly<{
  longitude: number;
  latitude: number;
  event?: VenueEvent;
  onClick?: (e: MouseEvent) => void;
  zoom?: number;
}>;

export function VenueMarker({ longitude, latitude, event, onClick, zoom = 0 }: VenueMarkerProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const status = event?.status;

  const handleClick = (e: MouseEvent) => {
    onClick?.(e);
    if (event) setSheetOpen(true);
  };

  const isForceOpen = zoom >= ALWAYS_OPEN_ZOOM;
  const showCard = event && (isForceOpen || isHovered);

  return (
    <>
      <MapMarker
        longitude={longitude}
        latitude={latitude}
        zIndex={status ? Z_INDEX[status] : 1}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MarkerContent>
          <div className="relative flex flex-col items-center">
            {/* Flyer card — rendered inside the marker so it moves with it */}
            {showCard && (
              <div
                className={cn(
                  "absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 overflow-hidden",
                  "rounded-lg border border-border bg-popover shadow-md ring-1 ring-foreground/10",
                  "animate-in fade-in-0 zoom-in-95 duration-100 font-sans"
                )}
              >
                {event.event_images?.[0]?.url ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.event_images[0].url}
                      alt={event.name}
                      className="w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-3 py-2.5">
                      <p className="text-sm font-semibold leading-tight text-white">{event.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-2">
                    <p className="truncate text-xs font-semibold text-popover-foreground">
                      {event.name}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pin */}
            <div className="relative">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full backdrop-blur-xs",
                  status === "done" ? "bg-muted-foreground/80 dark:bg-muted/80" : "bg-primary/90"
                )}
              >
                <MapPinIcon className="size-5 text-primary-foreground" />
              </div>
              {status === "live" && (
                <span className="absolute -right-0.5 -top-0.5 flex size-3.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50" />
                  <span className="relative inline-flex size-3.5 rounded-full border-2 border-white/90 bg-primary" />
                </span>
              )}
            </div>
          </div>
        </MarkerContent>
      </MapMarker>

      {event && <VenueInfo event={event} open={sheetOpen} onOpenChange={setSheetOpen} />}
    </>
  );
}
