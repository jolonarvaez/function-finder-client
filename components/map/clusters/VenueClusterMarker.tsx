"use client";

import { MapMarker, MarkerContent } from "@/components/ui/map";
import { cn } from "@/lib/utils";

export type VenueClusterMarkerProps = Readonly<{
  longitude: number;
  latitude: number;
  /** How many events this bubble stands for. */
  count: number;
  onClick?: () => void;
}>;

/** Bubbles grow with the number of events they hold, so density reads at a glance. */
function sizeFor(count: number): string {
  if (count < 10) return "size-10 text-sm";
  if (count < 25) return "size-12 text-base";
  return "size-14 text-lg";
}

export function VenueClusterMarker({
  longitude,
  latitude,
  count,
  onClick,
}: VenueClusterMarkerProps) {
  return (
    // Sits above individual pins so a bubble is never hidden behind one.
    <MapMarker longitude={longitude} latitude={latitude} zIndex={3} onClick={() => onClick?.()}>
      <MarkerContent>
        <button
          type="button"
          aria-label={`${count} events grouped here. Activate to expand.`}
          className={cn(
            "flex items-center justify-center rounded-full bg-primary/90 font-semibold text-primary-foreground backdrop-blur-xs",
            "ring-4 ring-primary/25 transition-transform duration-150 ease-out",
            "hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring active:scale-95",
            "motion-reduce:transition-none motion-reduce:hover:scale-100",
            sizeFor(count)
          )}
        >
          {count}
        </button>
      </MarkerContent>
    </MapMarker>
  );
}
