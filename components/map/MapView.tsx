"use client";

import { useEffect, useRef, useState } from "react";
import { Map, MapControls, type MapRef } from "@/components/ui/map";
import { MapFilters } from "@/components/map/MapFilters";
import { MobileMapFilters } from "@/components/map/MobileMapFilters";
import { VenueMarker } from "@/components/map/VenueMarker";
import { UserLocationMarker } from "@/components/map/UserLocationMarker";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import { useGeolocation } from "@/components/map/use-geolocation";
import { Locate, LocateOff, X, MapIcon } from "lucide-react";
import { MAKATI_CENTER, DEFAULT_ZOOM, type Genre } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getEventsList, formatTime, type ApiEvent } from "@/lib/services/events";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserStore } from "@/components/auth/use-user-store";
import type { VenueEvent } from "@/components/map/VenueInfo";
import { PageHeader } from "../reusables/PageContainer";

export type MapEvents = Readonly<{
  lng: number;
  lat: number;
  distance?: string;
  event: VenueEvent;
}>;

function toMapVenue(event: ApiEvent): MapEvents | null {
  if (!event.custom_location) return null;
  return {
    lng: event.custom_location.longitude,
    lat: event.custom_location.latitude,
    event: {
      id: event.id,
      name: event.name,
      image: event.flyer_url ?? undefined,
      address: event.custom_location.address,
      category: event.category,
      date: event.date,
      startTime: formatTime(event.start_time),
      endTime: formatTime(event.end_time),
      entryPrice: event.entry_price ?? undefined,
      featured: event.featured ?? false,
      attending: 0,
      status: event.status,
      created_by: event.created_by,
      dj: {
        name: event.users.display_name,
        avatar: event.users.avatar_url ?? undefined,
        genre: event.genres as Genre[],
      },
    },
  };
}

export type MapViewProps = Readonly<{
  defaultDate?: Date;
  venues?: MapEvents[];
}>;

export function MapView({ defaultDate, venues: initialVenues }: MapViewProps) {
  const selectedGenres = useMapFilterStore((s) => s.selectedGenres);
  const eventStatus = useMapFilterStore((s) => s.eventStatus);
  const startDate = useMapFilterStore((s) => s.startDate);
  const endDate = useMapFilterStore((s) => s.endDate);
  const setSelectedGenres = useMapFilterStore((s) => s.setSelectedGenres);
  const profile = useUserStore((s) => s.profile);
  const profileLoading = useUserStore((s) => s.loading);
  const { loading: authLoading } = useAuth();

  const [venues, setVenues] = useState<MapEvents[]>(initialVenues ?? []);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const mapRef = useRef<MapRef>(null);
  const hasCenteredRef = useRef(false);

  const { coords, status, start, stop } = useGeolocation();
  const [locationVisible, setLocationVisible] = useState(false);
  const [deniedDismissed, setDeniedDismissed] = useState(false);

  const flyToLocation = (c: { lng: number; lat: number }) => {
    mapRef.current?.flyTo({
      center: [c.lng, c.lat],
      zoom: DEFAULT_ZOOM,
      duration: 1500,
    });
  };

  // Center when coords arrive after the toggle (first fix)
  useEffect(() => {
    if (!coords || hasCenteredRef.current) return;
    hasCenteredRef.current = true;
    flyToLocation(coords);
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

  // Seed genres from profile on first load if user hasn't manually filtered yet
  useEffect(() => {
    if (profile?.genre_tags?.length && selectedGenres.length === 0) {
      setSelectedGenres(profile.genre_tags);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    if (!startDate || authLoading || profileLoading) return;
    getEventsList({
      startDate,
      endDate,
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      status: eventStatus,
    })
      .then((events) => {
        const venues = events.flatMap((e) => {
          const v = toMapVenue(e);
          return v ? [v] : [];
        });
        setVenues(venues);
      })
      .catch(() => setVenues([]));
  }, [startDate, endDate, selectedGenres, eventStatus, authLoading, profileLoading]);

  const isDenied = status === "denied";
  const showDeniedBanner = isDenied && !deniedDismissed;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Mobile filter bar */}
      <div className="absolute inset-x-0 top-0 z-10 border-b border-border bg-card px-4 py-3 sm:hidden">
        <PageHeader title="Map View" icon={MapIcon} />
        <MobileMapFilters defaultDate={defaultDate} />
      </div>

      {/* Desktop floating filter panel */}
      <div className="absolute left-4 top-4 z-20 hidden sm:block">
        <MapFilters defaultOpen defaultDate={defaultDate} />
      </div>

      {/* Full-screen map */}
      <Map
        ref={mapRef}
        className="h-full w-full"
        center={MAKATI_CENTER}
        zoom={DEFAULT_ZOOM}
        onViewportChange={(vp) => setZoom(vp.zoom)}
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
                ? "bg-primary text-white hover:bg-blue-600"
                : "border-border bg-background text-foreground hover:bg-accent dark:hover:bg-accent/40"
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
        {venues.map((venue) => (
          <VenueMarker
            key={venue.event.name}
            longitude={venue.lng}
            latitude={venue.lat}
            event={venue.event}
            zoom={zoom}
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
          <p className="text-sm text-foreground">
            Location access denied please check your browser settings.
          </p>
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
