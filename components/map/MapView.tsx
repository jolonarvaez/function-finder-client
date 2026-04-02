"use client";

import { useDeferredValue, useMemo } from "react";
import { Map, MapControls } from "@/components/ui/map";
import { SearchBar } from "@/components/SearchBar";
import { VenueMarker } from "@/components/map/VenueMarker";
import { ConnectedTopNav } from "@/components/map/ConnectedTopNav";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import type { VenueEvent } from "@/components/map/VenueInfo";

// Makati, Philippines
const MAKATI_CENTER: [number, number] = [121.0244, 14.5547];
const DEFAULT_ZOOM = 14;

export type MapVenue = Readonly<{
  lng: number;
  lat: number;
  live?: boolean;
  distance?: string;
  event: VenueEvent;
}>;

export type MapViewProps = Readonly<{
  venues?: MapVenue[];
  defaultDate?: Date;
}>;

function venueMatchesGenres(venue: MapVenue, genres: string[]): boolean {
  const djGenres = Array.isArray(venue.event.dj.genre)
    ? venue.event.dj.genre
    : [venue.event.dj.genre];
  return djGenres.some((g) => genres.includes(g));
}

function venueMatchesDate(venue: MapVenue, date: Date): boolean {
  if (!venue.event.date) return true; // no date on event — always show
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return venue.event.date === iso;
}

export function MapView({ venues = [], defaultDate }: MapViewProps) {
  const selectedGenres = useMapFilterStore((s) => s.selectedGenres);
  const selectedDate = useMapFilterStore((s) => s.selectedDate);
  const deferredGenres = useDeferredValue(selectedGenres);
  const deferredDate = useDeferredValue(selectedDate);

  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      if (deferredGenres.length > 0 && !venueMatchesGenres(v, deferredGenres)) return false;
      if (deferredDate && !venueMatchesDate(v, deferredDate)) return false;
      return true;
    });
  }, [venues, deferredGenres, deferredDate]);

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* Top nav + search panel */}
      <div className="absolute inset-x-0 top-0 z-10 bg-card px-4 py-4 space-y-3 border-b border-border">
        <ConnectedTopNav />
        <SearchBar showFilter defaultDate={defaultDate} />
      </div>

      {/* Full-screen map */}
      <Map
        className="h-full w-full"
        center={MAKATI_CENTER}
        zoom={DEFAULT_ZOOM}

      >
        <MapControls position="bottom-right" showZoom showCompass />
        {filteredVenues.map((venue) => (
          <VenueMarker
            key={venue.event.name}
            longitude={venue.lng}
            latitude={venue.lat}
            live={venue.live}
            event={venue.event}
          />
        ))}
      </Map>
    </div>
  );
}
