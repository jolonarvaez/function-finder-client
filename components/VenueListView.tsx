"use client";

import { useDeferredValue, useMemo } from "react";
import { LocationItem } from "@/components/LocationItem";
import { SearchBar } from "@/components/SearchBar";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MapVenue } from "@/components/map/MapView";

export type VenueListViewProps = Readonly<{
  venues?: MapVenue[];
}>;

function venueMatchesGenres(venue: MapVenue, genres: string[]): boolean {
  const djGenres = Array.isArray(venue.event.dj.genre)
    ? venue.event.dj.genre
    : [venue.event.dj.genre];
  return djGenres.some((g) => genres.includes(g));
}

function venueMatchesQuery(venue: MapVenue, query: string): boolean {
  const q = query.toLowerCase();
  return (
    venue.event.name.toLowerCase().includes(q) ||
    venue.event.address.toLowerCase().includes(q) ||
    venue.event.dj.name.toLowerCase().includes(q)
  );
}

export function VenueListView({ venues = [] }: VenueListViewProps) {
  const selectedGenres = useMapFilterStore((s) => s.selectedGenres);
  const query = useMapFilterStore((s) => s.query);
  const activeFilter = useMapFilterStore((s) => s.activeFilter);

  const deferredGenres = useDeferredValue(selectedGenres);
  const deferredQuery = useDeferredValue(query);

  const filteredVenues = useMemo(() => {
    let result = venues;

    if (deferredQuery) {
      result = result.filter((v) => venueMatchesQuery(v, deferredQuery));
    }

    if (deferredGenres.length > 0) {
      result = result.filter((v) => venueMatchesGenres(v, deferredGenres));
    }

    switch (activeFilter) {
      case "live-now":
        result = result.filter((v) => v.live);
        break;
      case "nearest":
        break;
      case "best-match":
        break;
    }

    return result;
  }, [venues, deferredQuery, deferredGenres, activeFilter]);

  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="px-4 pt-14">
        <h2 className="mb-3 text-lg font-semibold">Venues</h2>
        <SearchBar showStatus />
      </div>

      <ScrollArea className="min-h-0 flex-1 px-4 pt-3">
        <div className="flex flex-col gap-3 pb-6">
          {filteredVenues.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No venues found
            </p>
          ) : (
            filteredVenues.map((venue) => (
              <LocationItem
                key={venue.event.name}
                name={venue.event.name}
                address={venue.event.address}
                distance={venue.distance ?? ""}
                genre={venue.event.dj.genre}
                imageSrc={venue.event.image}
                dj={venue.event.dj.name}
                isLive={venue.live}
                onGoNow={() => {}}
                className="m-1.5"
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
