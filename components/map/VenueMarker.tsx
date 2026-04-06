"use client";

import { useState } from "react";
import { MapMarker, MarkerContent } from "@/components/ui/map";
import { MapPinIcon } from "lucide-react";
import { VenueInfo, type VenueEvent } from "@/components/map/VenueInfo";

export type VenueMarkerProps = Readonly<{
  longitude: number;
  latitude: number;
  live?: boolean;
  event?: VenueEvent;
  onClick?: (e: MouseEvent) => void;
}>;

export function VenueMarker({
  longitude,
  latitude,
  live = false,
  event,
  onClick,
}: VenueMarkerProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleClick = (e: MouseEvent) => {
    onClick?.(e);
    if (event) setSheetOpen(true);
  };

  return (
    <>
      <MapMarker longitude={longitude} latitude={latitude} onClick={handleClick}>
        <MarkerContent>
          <div className="relative">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary">
              <MapPinIcon className="size-5 text-primary-foreground" />
            </div>
            {live && (
              <span className="absolute -top-0.5 -right-0.5 flex size-3.5">
                <span className="absolute inline-flex size-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-3.5 rounded-full border-2 border-card bg-primary" />
              </span>
            )}
          </div>
        </MarkerContent>
      </MapMarker>

      {event && <VenueInfo event={event} open={sheetOpen} onOpenChange={setSheetOpen} />}
    </>
  );
}
