"use client";

import { useDeferredValue, useMemo } from "react";
import { LocationItem } from "@/components/LocationItem";
import { SearchBar } from "@/components/SearchBar";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getStatus } from "@/components/dj/dj-event.types";
import type { MapEvents } from "@/components/map/MapView";

export type VenueListViewProps = Readonly<{
  venues?: MapEvents[];
  defaultDate?: Date;
}>;

function venueMatchesGenres(venue: MapEvents, genres: string[]): boolean {
  const djGenres = Array.isArray(venue.event.dj.genre)
    ? venue.event.dj.genre
    : [venue.event.dj.genre];
  return djGenres.some((g) => genres.includes(g));
}

function venueMatchesQuery(venue: MapEvents, query: string): boolean {
  const q = query.toLowerCase();
  return (
    venue.event.name.toLowerCase().includes(q) ||
    venue.event.address.toLowerCase().includes(q) ||
    venue.event.dj.name.toLowerCase().includes(q)
  );
}

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function venueMatchesDateRange(venue: MapEvents, startDate: Date, endDate: Date): boolean {
  if (!venue.event.date) return true;
  return venue.event.date >= toIsoDate(startDate) && venue.event.date <= toIsoDate(endDate);
}

export function VenueListView({ venues = [], defaultDate }: VenueListViewProps) {
  const selectedGenres = useMapFilterStore((s) => s.selectedGenres);
  const query = useMapFilterStore((s) => s.query);
  const activeFilter = useMapFilterStore((s) => s.activeFilter);
  const startDate = useMapFilterStore((s) => s.startDate);
  const endDate = useMapFilterStore((s) => s.endDate);

  const deferredGenres = useDeferredValue(selectedGenres);
  const deferredQuery = useDeferredValue(query);
  const deferredStartDate = useDeferredValue(startDate);
  const deferredEndDate = useDeferredValue(endDate);

  const filteredVenues = useMemo(() => {
    let result = venues;

    if (deferredQuery) {
      result = result.filter((v) => venueMatchesQuery(v, deferredQuery));
    }

    if (deferredGenres.length > 0) {
      result = result.filter((v) => venueMatchesGenres(v, deferredGenres));
    }

    if (deferredStartDate && deferredEndDate) {
      result = result.filter((v) => venueMatchesDateRange(v, deferredStartDate, deferredEndDate));
    }

    switch (activeFilter) {
      case "live-now":
        result = result.filter((v) => {
          const { date, startTime, endTime } = v.event;
          return date && getStatus({ date, startTime, endTime }) === "live";
        });
        break;
      case "nearest":
        break;
      case "best-match":
        break;
    }

    return result;
  }, [venues, deferredQuery, deferredGenres, deferredStartDate, deferredEndDate, activeFilter]);

  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="px-4 pt-4">
        <h2 className="mb-3 text-lg font-semibold">Venues</h2>
        <SearchBar showStatus defaultDate={defaultDate} />
      </div>

      <ScrollArea className="min-h-0 flex-1 px-4 pt-3">
        <div className="flex flex-col gap-3 pb-6">
          {filteredVenues.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No venues found</p>
          ) : (
            filteredVenues.map((venue) => (
              <LocationItem
                key={venue.event.name}
                name={venue.event.name}
                address={venue.event.address}
                distance={venue.distance ?? ""}
                genre={venue.event.dj.genre}
                imageSrc={venue.event.event_images?.[0]?.url}
                dj={venue.event.dj.name}
                isLive={
                  !!venue.event.date &&
                  getStatus({
                    date: venue.event.date,
                    startTime: venue.event.startTime,
                    endTime: venue.event.endTime,
                  }) === "live"
                }
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
