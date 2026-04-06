"use client";

import { MapMarker, MarkerContent } from "@/components/ui/map";

type UserLocationMarkerProps = Readonly<{
  longitude: number;
  latitude: number;
}>;

export function UserLocationMarker({ longitude, latitude }: UserLocationMarkerProps) {
  return (
    <MapMarker longitude={longitude} latitude={latitude}>
      <MarkerContent className="pointer-events-none">
        <span className="flex size-4 items-center justify-center rounded-full border-2 border-white bg-primary shadow-md" />
      </MarkerContent>
    </MapMarker>
  );
}
