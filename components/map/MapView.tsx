"use client";

import { useDeferredValue, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";
import { Map, MapControls } from "@/components/ui/map";
import { SearchBar } from "@/components/SearchBar";
import { VenueMarker } from "@/components/map/VenueMarker";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
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
}>;

function venueMatchesGenres(venue: MapVenue, genres: string[]): boolean {
  const djGenres = Array.isArray(venue.event.dj.genre)
    ? venue.event.dj.genre
    : [venue.event.dj.genre];
  return djGenres.some((g) => genres.includes(g));
}

export function MapView({ venues = [] }: MapViewProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const selectedGenres = useMapFilterStore((s) => s.selectedGenres);
  const deferredGenres = useDeferredValue(selectedGenres);

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  const filteredVenues = useMemo(() => {
    if (deferredGenres.length === 0) return venues;
    return venues.filter((v) => venueMatchesGenres(v, deferredGenres));
  }, [venues, deferredGenres]);

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* Search bar panel */}
      <div className="absolute inset-x-0 top-0 z-10 bg-card px-4 pb-4 pt-14">
        <SearchBar showFilter />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="mt-2 gap-1.5"
        >
          <LogOutIcon className="size-3.5" />
          Sign Out
        </Button>
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
