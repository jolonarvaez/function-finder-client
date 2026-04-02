"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Map, MapControls, type MapRef } from "@/components/ui/map";
import { SearchBar } from "@/components/SearchBar";
import { VenueMarker } from "@/components/map/VenueMarker";
import { ConnectedTopNav } from "@/components/map/ConnectedTopNav";
import { UserLocationMarker } from "@/components/map/UserLocationMarker";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import { useGeolocation } from "@/components/map/use-geolocation";
import { Button } from "@/components/ui/button";
import { Locate, LocateOff, X } from "lucide-react";
import { MAKATI_CENTER, DEFAULT_ZOOM } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { VenueEvent } from "@/components/map/VenueInfo";

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
  if (!venue.event.date) return true;
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return venue.event.date === iso;
}

export function MapView({ venues = [], defaultDate }: MapViewProps) {
  const selectedGenres = useMapFilterStore((s) => s.selectedGenres);
  const selectedDate = useMapFilterStore((s) => s.selectedDate);
  const deferredGenres = useDeferredValue(selectedGenres);
  const deferredDate = useDeferredValue(selectedDate);

  const mapRef = useRef<MapRef>(null);
  const hasCenteredRef = useRef(false);

  const { coords, status, start, stop } = useGeolocation();
  const [locationVisible, setLocationVisible] = useState(false);
  const [deniedDismissed, setDeniedDismissed] = useState(false);

  const flyToLocation = (c: { lng: number; lat: number }) => {
    mapRef.current?.flyTo({ center: [c.lng, c.lat], zoom: DEFAULT_ZOOM, duration: 1500 });
  };

  // Center when coords arrive after the toggle (first fix)
  useEffect(() => {
    if (!coords || hasCenteredRef.current) return;
    hasCenteredRef.current = true;
    flyToLocation(coords);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  const handleLocationToggle = () => {
    if (!locationVisible) {
      start();
      setLocationVisible(true);
      setDeniedDismissed(false);
      hasCenteredRef.current = false; // reset so re-enabling always re-centers
      if (coords) flyToLocation(coords); // fly immediately if already have a fix
    } else {
      stop();
      setLocationVisible(false);
    }
  };

  const handleRetry = () => {
    start();
    setDeniedDismissed(false);
  };

  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      if (deferredGenres.length > 0 && !venueMatchesGenres(v, deferredGenres)) return false;
      if (deferredDate && !venueMatchesDate(v, deferredDate)) return false;
      return true;
    });
  }, [venues, deferredGenres, deferredDate]);

  const isDenied = status === "denied";
  const showDeniedBanner = isDenied && !deniedDismissed;

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* Top nav + search panel */}
      <div className="absolute inset-x-0 top-0 z-10 bg-card px-4 py-4 space-y-3 border-b border-border">
        <ConnectedTopNav />
        <SearchBar showFilter defaultDate={defaultDate} />
      </div>

      {/* Full-screen map */}
      <Map
        ref={mapRef}
        className="h-full w-full"
        center={MAKATI_CENTER}
        zoom={DEFAULT_ZOOM}
      >
        <MapControls position="bottom-right" showZoom showCompass />

        {/* Location toggle */}
        <div className="absolute bottom-10 left-2 z-10">
          <button
            type="button"
            onClick={handleLocationToggle}
            aria-label={locationVisible ? "Hide my location" : "Show my location"}
            aria-pressed={locationVisible}
            className={cn(
              "flex size-8 items-center justify-center rounded-md border shadow-sm transition-colors",
              locationVisible && status === "granted"
                ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
                : "border-border bg-background text-foreground hover:bg-accent dark:hover:bg-accent/40",
            )}
          >
            {locationVisible && !isDenied ? (
              <Locate className="size-4" />
            ) : (
              <LocateOff className="size-4" />
            )}
          </button>
        </div>

        {/* User location marker */}
        {locationVisible && coords && (
          <UserLocationMarker longitude={coords.lng} latitude={coords.lat} />
        )}

        {/* Venue markers */}
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

      {/* Location denied banner */}
      {showDeniedBanner && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-16 left-1/2 z-20 flex w-max -translate-x-1/2 items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg"
        >
          <LocateOff className="size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-foreground">Location access denied.</p>
          <Button size="sm" onClick={handleRetry}>
            Enable permissions
          </Button>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setDeniedDismissed(true)}
            className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
