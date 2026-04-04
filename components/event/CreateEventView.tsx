"use client";

import { useCallback, useState } from "react";
import { reverseGeocode } from "@/lib/geocode";
import { format } from "date-fns";
import {
  SparklesIcon,
  TagIcon,
  MapPinIcon,
  ChevronDownIcon,
  PhilippinePesoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { GenreSelector } from "@/components/GenreSelector";
import { LocationPicker } from "./LocationPicker";
import { cn } from "@/lib/utils";
import { EVENT_CATEGORIES, MAKATI_CENTER, type Genre } from "@/lib/constants";
import { createEvent, toIsoDate } from "@/lib/services/events";
import { useUserStore } from "@/components/auth/use-user-store";
import { toast } from "sonner";
import type { MockVenue } from "./mock-venues";

function SectionHeader({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}

export function CreateEventView() {
  const { profile } = useUserStore();
  const [eventName, setEventName] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>();
  const [dateOpen, setDateOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [locationMode, setLocationMode] = useState<"map" | "venue">("map");
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number }>({
    lng: MAKATI_CENTER[0],
    lat: MAKATI_CENTER[1],
  });
  const [selectedVenueId, setSelectedVenueId] = useState("");

  const handleCoordinatesChange = useCallback(
    (coords: { lng: number; lat: number }) => {
      setCoordinates(coords);
      reverseGeocode(coords.lat, coords.lng).then((result) => {
        if (result) setAddress(result);
      });
    },
    [],
  );

  const handleVenueSelect = (id: string, venue: MockVenue) => {
    setSelectedVenueId(id);
    setAddress(venue.address + ", " + venue.city);
    setCoordinates({ lng: venue.lng, lat: venue.lat });
    if (!category) setCategory(venue.category);
  };

  function resetForm() {
    setEventName("");
    setCategory("");
    setDate(undefined);
    setStartTime("");
    setEndTime("");
    setEntryPrice("");
    setSelectedGenres([]);
    setAddress("");
    setLocationMode("map");
    setCoordinates({ lng: MAKATI_CENTER[0], lat: MAKATI_CENTER[1] });
    setSelectedVenueId("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !profile) return;
    setSubmitting(true);
    try {
      await createEvent({
        name: eventName.trim(),
        category,
        date: toIsoDate(date),
        start_time: startTime,
        end_time: endTime,
        entry_price: entryPrice ? Number.parseFloat(entryPrice) : null,
        genres: selectedGenres,
        created_by: profile.id,
        location: locationMode === "venue" ? selectedVenueId : null,
        custom_location:
          locationMode === "map"
            ? {
                latitude: coordinates.lat,
                longitude: coordinates.lng,
                address: address.trim(),
              }
            : null,
      });
      toast.success("Event created successfully.");
      resetForm();
    } catch {
      toast.error("Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const isValid =
    eventName.trim() &&
    category &&
    date &&
    startTime &&
    endTime &&
    selectedGenres.length > 0 &&
    (locationMode === "venue" ? selectedVenueId : true) &&
    address.trim();

  return (
    <main className="flex flex-col">
      <a
        href="#create-event-form"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to form
      </a>

      {/* Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create Event
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Set up a new event at your venue
        </p>
      </div>

      {/* Form */}
      <div className="flex-1">
        <form
          id="create-event-form"
          onSubmit={handleSubmit}
          className="space-y-4 px-4 pt-3 pb-6"
        >
          {/* ── Details ─────────────────────────────────── */}
          <SectionHeader>Details</SectionHeader>

          {/* Event Name */}
          <Field>
            <FieldLabel htmlFor="event-name">Event Name</FieldLabel>
            <div className="relative">
              <SparklesIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="event-name"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Friday Night Fever"
                className="h-11 rounded-lg pl-10 dark:bg-card"
              />
            </div>
          </Field>

          {/* Category */}
          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger
                id="category"
                className="h-11 w-full rounded-lg dark:bg-card"
              >
                <div className="flex items-center gap-2">
                  <TagIcon className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* ── Date & Time ─────────────────────────────── */}
          <div className="border-t border-border pt-4">
            <SectionHeader>Date & Time</SectionHeader>
          </div>

          {/* Date */}
          <Field>
            <FieldLabel htmlFor="date-picker">Date</FieldLabel>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="outline"
                  className={cn(
                    "h-11 w-full justify-between rounded-lg font-normal dark:bg-card",
                    !date && "text-muted-foreground",
                  )}
                >
                  {date ? format(date, "PPP") : "Select date"}
                  <ChevronDownIcon className="size-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  defaultMonth={date}
                  onSelect={(d) => {
                    setDate(d);
                    setDateOpen(false);
                  }}
                  disabled={(d) =>
                    d < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
          </Field>

          {/* Start / End Time */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            <Field>
              <FieldLabel htmlFor="start-time">Start Time</FieldLabel>
              <Input
                id="start-time"
                type="time"
                step={60}
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-11 appearance-none rounded-lg dark:bg-card [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="end-time">End Time</FieldLabel>
              <Input
                id="end-time"
                type="time"
                step={60}
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-11 appearance-none rounded-lg dark:bg-card [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </Field>
          </div>

          {/* Entry Price (Optional) */}
          <Field>
            <FieldLabel htmlFor="entry-price">
              Entry Price{" "}
              <span className="text-muted-foreground">(Optional)</span>
            </FieldLabel>
            <div className="relative">
              <PhilippinePesoIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="entry-price"
                type="number"
                min="0"
                step="0.01"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="0.00"
                className="h-11 rounded-lg pl-10 dark:bg-card"
              />
            </div>
          </Field>

          {/* Genre Selection */}
          <GenreSelector
            selected={selectedGenres}
            onChange={setSelectedGenres}
          />

          {/* ── Location ────────────────────────────────── */}
          <div className="border-t border-border pt-4">
            <SectionHeader>Location</SectionHeader>
          </div>

          <LocationPicker
            mode={locationMode}
            onModeChange={setLocationMode}
            coordinates={coordinates}
            onCoordinatesChange={handleCoordinatesChange}
            selectedVenueId={selectedVenueId}
            onVenueSelect={handleVenueSelect}
          />

          {/* Address */}
          <Field>
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Vibe Central"
                className="h-11 rounded-lg pl-10 dark:bg-card"
              />
            </div>
          </Field>
        </form>
      </div>

      {/* Sticky submit */}
      <div className="sticky bottom-0 border-t border-border bg-background px-4 py-3">
        <Button
          type="submit"
          form="create-event-form"
          disabled={!isValid || submitting}
          className="h-12 w-full rounded-lg text-sm font-semibold"
        >
          {submitting ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </main>
  );
}
