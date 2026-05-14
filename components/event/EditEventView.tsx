"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { reverseGeocode } from "@/lib/geocode";
import {
  SparklesIcon,
  TagIcon,
  ChevronDownIcon,
  PhilippinePesoIcon,
  ImageIcon,
  XIcon,
  PencilLineIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { GenreSelector } from "@/components/GenreSelector";
import { LocationPicker } from "./LocationPicker";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { cn } from "@/lib/utils";
import { EVENT_CATEGORIES, MAKATI_CENTER, type Genre } from "@/lib/constants";
import { getEvent, updateEvent, toIsoDate, type ApiEvent } from "@/lib/services/events";
import { uploadEventImage } from "@/lib/services/storage";
import { useUserStore } from "@/components/auth/use-user-store";
import { toast } from "sonner";
import { type AddressSuggestion } from "@/lib/geocode";
import { PageContainer, PageHeader } from "../reusables/PageContainer";

function SectionHeader({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}

type Props = Readonly<{ eventId: string }>;

export function EditEventView({ eventId }: Props) {
  const { profile } = useUserStore();
  const router = useRouter();
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getEvent(eventId)
      .then((e) => {
        if (profile && e.created_by !== profile.id) {
          toast.error("You are not authorized to edit this event.");
          router.replace("/dj/event-manager");
          return;
        }
        setEvent(e);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [eventId, profile, router]);

  if (loading) return <EditEventSkeleton />;

  if (error || !event) {
    return (
      <PageContainer>
        <PageHeader title="Edit Event" showBack />
        <p className="mt-6 text-center text-muted-foreground">Event not found.</p>
      </PageContainer>
    );
  }

  return <EditEventContent eventId={eventId} event={event} />;
}

export function EditEventContent({ eventId, event }: { eventId: string; event: ApiEvent }) {
  const router = useRouter();
  const { profile } = useUserStore();
  const [submitting, setSubmitting] = useState(false);

  const [eventName, setEventName] = useState(event.name);
  const [category, setCategory] = useState(event.category);
  const [date, setDate] = useState<Date>(parseISO(event.date));
  const [dateOpen, setDateOpen] = useState(false);
  const [startTime, setStartTime] = useState(event.start_time.slice(0, 5));
  const [endTime, setEndTime] = useState(event.end_time.slice(0, 5));
  const [entryPrice, setEntryPrice] = useState(
    event.entry_price != null ? String(event.entry_price) : ""
  );
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(event.genres as Genre[]);
  const [address, setAddress] = useState(event.custom_location?.address ?? "");
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number }>(
    event.custom_location
      ? { lng: event.custom_location.longitude, lat: event.custom_location.latitude }
      : { lng: MAKATI_CENTER[0], lat: MAKATI_CENTER[1] }
  );
  const [existingFlyerUrl, setExistingFlyerUrl] = useState<string | null>(event.flyer_url);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);

  const handleCoordinatesChange = useCallback((coords: { lng: number; lat: number }) => {
    setCoordinates(coords);
    reverseGeocode(coords.lat, coords.lng).then((result) => {
      if (result) setAddress(result);
    });
  }, []);

  function handleAddressSelect(suggestion: AddressSuggestion) {
    setAddress(suggestion.display_name);
    setCoordinates({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
  }

  function handleFlyerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFlyerFile(file);
    setFlyerPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleFlyerClear() {
    setFlyerFile(null);
    setFlyerPreview(null);
    setExistingFlyerUrl(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);
    try {
      let flyerUrl: string | null = existingFlyerUrl;
      if (flyerFile) {
        flyerUrl = await uploadEventImage(flyerFile, profile.id);
      }
      await updateEvent(eventId, {
        name: eventName.trim(),
        category,
        date: toIsoDate(date),
        start_time: startTime,
        end_time: endTime,
        entry_price: entryPrice ? Number.parseFloat(entryPrice) : null,
        genres: selectedGenres,
        custom_location: {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          address: address.trim(),
        },
        flyer_url: flyerUrl,
      });
      router.push("/dj/event-manager");
      toast.success("Event updated successfully.");
    } catch {
      toast.error("Failed to update event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const displayFlyer = flyerPreview ?? existingFlyerUrl;

  const isValid =
    eventName.trim() &&
    category &&
    date &&
    startTime &&
    endTime &&
    selectedGenres.length > 0 &&
    address.trim();

  return (
    <PageContainer>
      <a
        href="#edit-event-form"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to form
      </a>

      <PageHeader title="Edit Event" icon={PencilLineIcon} showBack />

      <div className="flex-1">
        <form id="edit-event-form" onSubmit={handleSubmit} className="space-y-4 pb-6">
          {/* ── Details ─────────────────────────────────── */}
          <SectionHeader>Details</SectionHeader>

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

          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category" className="h-11 w-full rounded-lg dark:bg-card">
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

          <Field>
            <FieldLabel htmlFor="date-picker">Date</FieldLabel>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="outline"
                  className={cn("h-11 w-full justify-between rounded-lg font-normal dark:bg-card")}
                >
                  {format(date, "PPP")}
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
                    if (d) {
                      setDate(d);
                      setDateOpen(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>

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

          <Field>
            <FieldLabel htmlFor="entry-price">
              Entry Price <span className="text-muted-foreground">(Optional)</span>
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

          <GenreSelector selected={selectedGenres} onChange={setSelectedGenres} />

          {/* ── Location ────────────────────────────────── */}
          <div className="border-t border-border pt-4">
            <SectionHeader>Location</SectionHeader>
          </div>

          <Field>
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <AddressAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={handleAddressSelect}
            />
          </Field>

          <LocationPicker coordinates={coordinates} onCoordinatesChange={handleCoordinatesChange} />

          {/* ── Flyer ───────────────────────────────────── */}
          <div className="border-t border-border pt-4">
            <SectionHeader>Flyer / Cover Image</SectionHeader>
          </div>

          <Field>
            <FieldLabel>
              Image <span className="text-muted-foreground">(Optional)</span>
            </FieldLabel>
            {displayFlyer ? (
              <div className="relative overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={displayFlyer} alt="Flyer preview" className="w-full object-contain" />
                <button
                  type="button"
                  onClick={handleFlyerClear}
                  aria-label="Remove image"
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
                >
                  <XIcon className="size-4" />
                </button>
              </div>
            ) : (
              <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:bg-muted">
                <ImageIcon className="size-6" />
                <span className="text-sm">Upload flyer</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFlyerChange}
                />
              </label>
            )}
          </Field>
        </form>
      </div>

      {/* Sticky submit */}
      <div className="sticky bottom-0 z-20 border-t border-border bg-background py-3">
        <Button
          type="submit"
          form="edit-event-form"
          disabled={!isValid || submitting}
          className="h-12 w-full rounded-lg text-sm font-semibold"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </PageContainer>
  );
}

function EditEventSkeleton() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-5 pt-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-4 w-24 mt-2" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-11 rounded-lg" />
          <Skeleton className="h-11 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-4 w-20 mt-2" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </PageContainer>
  );
}
