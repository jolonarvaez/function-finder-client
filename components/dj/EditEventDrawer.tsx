"use client";

import { useCallback, useState } from "react";
import { format } from "date-fns";
import { ChevronDownIcon, PhilippinePesoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { GenreSelector } from "@/components/GenreSelector";
import { LocationPicker } from "@/components/event/LocationPicker";
import { reverseGeocode } from "@/lib/geocode";
import type { MockVenue } from "@/components/event/mock-venues";
import {
  draftFromEvent,
  draftToPartial,
  type DJEvent,
  type EditDraft,
} from "./dj-event.types";

function FieldLabel({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p className="text-sm font-medium text-muted-foreground">{children}</p>
  );
}

export type EditEventDrawerProps = {
  event: DJEvent | null;
  onSave: (updated: Partial<DJEvent>) => void;
  onClose: () => void;
};

export function EditEventDrawer({ event, onSave, onClose }: EditEventDrawerProps) {
  const [draft, setDraft] = useState<EditDraft | null>(null);

  const open = event !== null;
  if (open && draft === null) setDraft(draftFromEvent(event!));
  if (!open && draft !== null) setDraft(null);

  const handleCoordinatesChange = useCallback(
    (coords: { lng: number; lat: number }) => {
      setDraft((d) => d && { ...d, coordinates: coords });
      reverseGeocode(coords.lat, coords.lng).then((result) => {
        if (result) setDraft((d) => d && { ...d, address: result });
      });
    },
    [],
  );

  const handleVenueSelect = useCallback(
    (id: string, venue: MockVenue) => {
      setDraft((d) =>
        d && {
          ...d,
          selectedVenueId: id,
          address: `${venue.address}, ${venue.city}`,
          coordinates: { lng: venue.lng, lat: venue.lat },
        },
      );
    },
    [],
  );

  const handleSave = () => {
    if (!draft || !event) return;
    onSave(draftToPartial(draft, event));
  };

  return (
    <Drawer open={open} onOpenChange={(o) => { if (!o) onClose(); }} direction="bottom">
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Event</DrawerTitle>
          <DrawerDescription>{event?.name}</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-4">
          {draft && (
            <>
              {/* Event name */}
              <div className="space-y-1.5">
                <FieldLabel>Event Name</FieldLabel>
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft((d) => d && { ...d, name: e.target.value })}
                  className="h-10 rounded-lg dark:bg-background"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <FieldLabel>Date</FieldLabel>
                <Popover
                  open={draft.dateOpen}
                  onOpenChange={(o) => setDraft((d) => d && { ...d, dateOpen: o })}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 w-full justify-between rounded-lg font-normal dark:bg-background"
                    >
                      {format(draft.date, "PPP")}
                      <ChevronDownIcon className="size-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={draft.date}
                      defaultMonth={draft.date}
                      captionLayout="dropdown"
                      onSelect={(d) => {
                        if (d) setDraft((prev) => prev && { ...prev, date: d, dateOpen: false });
                      }}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Start / End time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel>Start</FieldLabel>
                  <Input
                    type="time"
                    value={draft.startTime}
                    onChange={(e) => setDraft((d) => d && { ...d, startTime: e.target.value })}
                    className="h-10 rounded-lg dark:bg-background [&::-webkit-calendar-picker-indicator]:hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>End</FieldLabel>
                  <Input
                    type="time"
                    value={draft.endTime}
                    onChange={(e) => setDraft((d) => d && { ...d, endTime: e.target.value })}
                    className="h-10 rounded-lg dark:bg-background [&::-webkit-calendar-picker-indicator]:hidden"
                  />
                </div>
              </div>

              {/* Entry price */}
              <div className="space-y-1.5">
                <FieldLabel>
                  Entry Price{" "}
                  <span className="text-muted-foreground/60">(leave blank for free)</span>
                </FieldLabel>
                <div className="relative">
                  <PhilippinePesoIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={draft.entryPrice}
                    onChange={(e) => setDraft((d) => d && { ...d, entryPrice: e.target.value })}
                    placeholder="0.00"
                    className="h-10 rounded-lg pl-9 dark:bg-background"
                  />
                </div>
              </div>

              {/* Genres */}
              <div className="space-y-1.5">
                <FieldLabel>Genres</FieldLabel>
                <GenreSelector
                  selected={draft.genres}
                  onChange={(genres) => setDraft((d) => d && { ...d, genres })}
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <FieldLabel>Location</FieldLabel>
                <LocationPicker
                  mode={draft.locationMode}
                  onModeChange={(m) => setDraft((d) => d && { ...d, locationMode: m })}
                  coordinates={draft.coordinates}
                  onCoordinatesChange={handleCoordinatesChange}
                  selectedVenueId={draft.selectedVenueId}
                  onVenueSelect={handleVenueSelect}
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <FieldLabel>Address</FieldLabel>
                <Input
                  value={draft.address}
                  onChange={(e) => setDraft((d) => d && { ...d, address: e.target.value })}
                  className="h-10 rounded-lg dark:bg-background"
                />
              </div>
            </>
          )}
        </div>

        <DrawerFooter>
          <Button className="rounded-lg" onClick={handleSave}>
            Save changes
          </Button>
          <Button variant="outline" className="rounded-lg" onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
