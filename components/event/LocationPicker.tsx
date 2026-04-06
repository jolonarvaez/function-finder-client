"use client";

import { useRef, useState } from "react";
import { BuildingIcon, Locate, LocateOff, MapPinIcon } from "lucide-react";
import { Map, MapMarker, MarkerContent, MapControls, type MapRef } from "@/components/ui/map";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { MOCK_VENUES, type MockVenue } from "./mock-venues";

type LocationStatus = "idle" | "loading" | "granted" | "denied" | "unavailable";

export type LocationPickerProps = Readonly<{
  mode: "map" | "venue";
  onModeChange: (mode: "map" | "venue") => void;
  coordinates: { lng: number; lat: number };
  onCoordinatesChange: (coords: { lng: number; lat: number }) => void;
  selectedVenueId: string;
  onVenueSelect: (venueId: string, venue: MockVenue) => void;
  className?: string;
}>;

export function LocationPicker({
  mode,
  onModeChange,
  coordinates,
  onCoordinatesChange,
  selectedVenueId,
  onVenueSelect,
  className,
}: LocationPickerProps) {
  const mapRef = useRef<MapRef>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");

  const handleLocate = () => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("unavailable");
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lng: pos.coords.longitude, lat: pos.coords.latitude };
        setLocationStatus("granted");
        onCoordinatesChange(coords);
        mapRef.current?.flyTo({ center: [coords.lng, coords.lat], zoom: 15, duration: 1200 });
      },
      (err) => {
        setLocationStatus(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Tabs value={mode} onValueChange={(v) => onModeChange(v as "map" | "venue")}>
        <TabsList className="w-full">
          <TabsTrigger value="map" className="flex-1 gap-1.5">
            <MapPinIcon className="size-3.5" />
            Pin on Map
          </TabsTrigger>
          <TabsTrigger value="venue" className="flex-1 gap-1.5">
            <BuildingIcon className="size-3.5" />
            Existing Venue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <div className="space-y-2">
            <section
              aria-label="Event location map — drag the pin to set location"
              className="relative h-56 overflow-hidden rounded-lg border border-border"
            >
              <Map
                ref={mapRef}
                className="h-full w-full"
                center={[coordinates.lng, coordinates.lat]}
                zoom={14}
              >
                <MapControls position="bottom-right" showZoom />

                {/* Current location toggle */}
                <div className="absolute bottom-2 left-2 z-10">
                  <button
                    type="button"
                    onClick={handleLocate}
                    disabled={locationStatus === "loading"}
                    aria-label="Use my current location"
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg border shadow-sm transition-colors",
                      locationStatus === "granted"
                        ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
                        : "border-border bg-background text-foreground hover:bg-accent dark:hover:bg-accent/40",
                      locationStatus === "loading" && "pointer-events-none opacity-70"
                    )}
                  >
                    {locationStatus === "loading" ? (
                      <Spinner className="size-4" />
                    ) : locationStatus === "denied" ? (
                      <LocateOff className="size-4" />
                    ) : (
                      <Locate className="size-4" />
                    )}
                  </button>
                </div>

                <MapMarker
                  longitude={coordinates.lng}
                  latitude={coordinates.lat}
                  draggable
                  anchor="bottom"
                  onDragEnd={(lngLat) => onCoordinatesChange(lngLat)}
                >
                  <MarkerContent>
                    <div className="relative flex flex-col items-center drop-shadow-lg">
                      <svg
                        width="36"
                        height="46"
                        viewBox="0 0 36 46"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                        role="img"
                        aria-label="Draggable location pin"
                      >
                        <path
                          d="M18 0C8.059 0 0 8.059 0 18c0 12.6 18 28 18 28s18-15.4 18-28C36 8.059 27.941 0 18 0z"
                          fill="currentColor"
                        />
                        <circle cx="18" cy="18" r="8" fill="white" fillOpacity="0.9" />
                      </svg>
                    </div>
                  </MarkerContent>
                </MapMarker>
              </Map>
            </section>

            {/* Denied notice */}
            {locationStatus === "denied" && (
              <p role="alert" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <LocateOff className="size-3.5 shrink-0" />
                Location access denied. Enable it in your browser settings and try again.
              </p>
            )}
            {locationStatus === "unavailable" && (
              <p role="alert" className="text-xs text-muted-foreground">
                Location unavailable on this device.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="venue">
          <Select
            value={selectedVenueId}
            onValueChange={(id) => {
              const venue = MOCK_VENUES.find((v) => v.id === id);
              if (venue) onVenueSelect(id, venue);
            }}
            aria-label="Select a venue"
          >
            <SelectTrigger className="h-12 w-full rounded-xl dark:bg-card">
              <SelectValue placeholder="Select a venue" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_VENUES.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  <span className="font-medium">{venue.name}</span>
                  <span className="text-muted-foreground"> — {venue.address}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TabsContent>
      </Tabs>
    </div>
  );
}
