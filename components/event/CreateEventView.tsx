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
import type { Genre } from "@/lib/constants";
import type { MockVenue } from "./mock-venues";

const CATEGORIES = [
  "Nightclub",
  "Bar",
  "Lounge",
  "Club",
  "Underground",
  "Festival",
  "Rooftop",
  "Others",
] as const;

const MAKATI_CENTER = { lng: 121.0244, lat: 14.5547 };

function SectionHeader({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

export function CreateEventView() {
  const [eventName, setEventName] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>();
  const [dateOpen, setDateOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [address, setAddress] = useState("");

  const [locationMode, setLocationMode] = useState<"map" | "venue">("map");
  const [coordinates, setCoordinates] = useState(MAKATI_CENTER);
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
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 pt-12 pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create Event
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Set up a new event at your venue
        </p>
      </div>

      {/* Form */}
      <div className="flex-1">
        <div className="space-y-4 px-4 pt-3 pb-6">
          {/* ── Details ─────────────────────────────────── */}
          <SectionHeader>Details</SectionHeader>

          {/* Event Name */}
          <Field>
            <FieldLabel htmlFor="event-name">
              Event Name
            </FieldLabel>
            <div className="relative">
              <SparklesIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="event-name"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Friday Night Fever"
                className="h-11 rounded-xl pl-10 dark:bg-card"
              />
            </div>
          </Field>

          {/* Category */}
          <Field>
            <FieldLabel>Category</FieldLabel>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="h-11 w-full rounded-xl dark:bg-card">
                <div className="flex items-center gap-2">
                  <TagIcon className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
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
            <FieldLabel>Date</FieldLabel>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-11 w-full justify-between rounded-xl font-normal dark:bg-card",
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
              <FieldLabel htmlFor="start-time">
                Start Time
              </FieldLabel>
              <Input
                id="start-time"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-11 appearance-none rounded-xl dark:bg-card [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="end-time">
                End Time
              </FieldLabel>
              <Input
                id="end-time"
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-11 appearance-none rounded-xl dark:bg-card [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
                className="h-11 rounded-xl pl-10 dark:bg-card"
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
            <FieldLabel htmlFor="address">
              Address
            </FieldLabel>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Vibe Central"
                className="h-11 rounded-xl pl-10 dark:bg-card"
              />
            </div>
          </Field>
        </div>
      </div>

      {/* Sticky submit */}
      <div className="sticky bottom-0 border-t border-border bg-background px-4 py-3">
        <Button
          disabled={!isValid}
          className="h-12 w-full rounded-xl text-sm font-semibold"
        >
          Create Event
        </Button>
      </div>
    </div>
  );
}
