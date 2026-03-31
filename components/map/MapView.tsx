"use client";

import { Map, MapControls } from "@/components/ui/map";
import { SearchBar } from "@/components/SearchBar";

// Makati, Philippines
const MAKATI_CENTER: [number, number] = [121.0244, 14.5547];
const DEFAULT_ZOOM = 14;

export function MapView() {
  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* Search bar panel */}
      <div className="absolute inset-x-0 top-0 z-10 bg-card px-4 pb-4 pt-14">
        <SearchBar showFilter />
      </div>

      {/* Full-screen map */}
      <Map
        className="h-full w-full"
        center={MAKATI_CENTER}
        zoom={DEFAULT_ZOOM}
      >
        <MapControls position="bottom-right" showZoom showCompass />
      </Map>
    </div>
  );
}
