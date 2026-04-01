"use client";

import { BuildingIcon, MapPinIcon } from "lucide-react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MapControls,
} from "@/components/ui/map";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MOCK_VENUES, type MockVenue } from "./mock-venues";

const MAKATI_CENTER: [number, number] = [121.0244, 14.5547];

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
  return (
    <div className={cn("space-y-3", className)}>
      <Tabs
        value={mode}
        onValueChange={(v) => onModeChange(v as "map" | "venue")}
      >
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
            <div className="h-56 overflow-hidden rounded-xl border border-border">
              <Map
                className="h-full w-full"
                center={[coordinates.lng, coordinates.lat]}
                zoom={14}
              >
                <MapControls position="bottom-right" showZoom />
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
                      >
                        <path
                          d="M18 0C8.059 0 0 8.059 0 18c0 12.6 18 28 18 28s18-15.4 18-28C36 8.059 27.941 0 18 0z"
                          fill="currentColor"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="8"
                          fill="white"
                          fillOpacity="0.9"
                        />
                      </svg>
                    </div>
                  </MarkerContent>
                </MapMarker>
              </Map>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="venue">
          <Select
            value={selectedVenueId}
            onValueChange={(id) => {
              const venue = MOCK_VENUES.find((v) => v.id === id);
              if (venue) onVenueSelect(id, venue);
            }}
          >
            <SelectTrigger className="h-12 w-full rounded-xl dark:bg-card">
              <SelectValue placeholder="Select a venue" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_VENUES.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  <span className="font-medium">{venue.name}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    — {venue.address}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TabsContent>
      </Tabs>
    </div>
  );
}
