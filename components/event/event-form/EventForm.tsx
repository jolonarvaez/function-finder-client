"use client";

import { useCallback, useState } from "react";
import { format } from "date-fns";
import {
  SparklesIcon,
  TagIcon,
  ChevronDownIcon,
  PhilippinePesoIcon,
  GlobeIcon,
  AlignLeftIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { GenreSelector } from "@/components/GenreSelector";
import { LocationPicker } from "./LocationPicker";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { EventImageManager } from "./EventImageManager";
import { StagedImagePicker } from "./StagedImagePicker";
import { cn } from "@/lib/utils";
import { EVENT_CATEGORIES, type Genre } from "@/lib/constants";
import { toIsoDate, getTimezoneOffset, type ApiEvent } from "@/lib/services/events";
import { useUserStore } from "@/components/auth/use-user-store";
import { reverseGeocode, type AddressSuggestion } from "@/lib/services/geocode/geocode";
import { PageContainer, PageHeader } from "../../reusables/PageContainer";
import { MAX_EVENT_IMAGES } from "@/components/dj/dj-event.types";
import { MODE_CONFIG } from "./constants";
import { buildInitialState } from "./utils";
import type { EventFormMode, EventFormValues } from "./types";

export type { EventFormMode, EventFormValues };

type EventFormProps = Readonly<{
  mode: EventFormMode;
  initialEvent?: ApiEvent;
  onSubmit: (values: EventFormValues, pendingImages: File[]) => Promise<void>;
}>;

function SectionHeader({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}

export function EventForm({ mode, initialEvent, onSubmit }: EventFormProps) {
  const { profile } = useUserStore();
  const isEdit = mode === "edit";
  const config = MODE_CONFIG[mode];
  const initial = buildInitialState(initialEvent, profile?.genre_tags ?? []);

  const [eventName, setEventName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [category, setCategory] = useState(initial.category);
  const [date, setDate] = useState<Date | undefined>(initial.date);
  const [dateOpen, setDateOpen] = useState(false);
  const [startTime, setStartTime] = useState(initial.startTime);
  const [endTime, setEndTime] = useState(initial.endTime);
  const [entryPrice, setEntryPrice] = useState(initial.entryPrice);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(initial.genres);
  const [address, setAddress] = useState(initial.address);
  const [coordinates, setCoordinates] = useState(initial.coordinates);

  // Edit mode: live event reflecting any image-manager mutations.
  const [liveEvent, setLiveEvent] = useState<ApiEvent | undefined>(initialEvent);

  // Create mode: image files staged in memory, uploaded after the event is created.
  const [staged, setStaged] = useState<{ file: File; preview: string }[]>([]);

  const [submitting, setSubmitting] = useState(false);

  const handleCoordinatesChange = useCallback((coords: { lng: number; lat: number }) => {
    setCoordinates(coords);
    reverseGeocode(coords.lat, coords.lng).then((result) => {
      if (result) setAddress(result);
    });
  }, []);

  function handleAddressSelect(suggestion: AddressSuggestion) {
    setAddress(suggestion.display_name);
    setCoordinates({
      lat: Number.parseFloat(suggestion.lat),
      lng: Number.parseFloat(suggestion.lon),
    });
  }

  function handleStagedAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (incoming.length === 0) return;

    if (staged.length + incoming.length > MAX_EVENT_IMAGES) {
      toast.error(`Maximum of ${MAX_EVENT_IMAGES} images per event.`);
      return;
    }
    setStaged([
      ...staged,
      ...incoming.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  }

  function handleStagedRemove(index: number) {
    const item = staged[index];
    if (item) URL.revokeObjectURL(item.preview);
    setStaged(staged.filter((_, i) => i !== index));
  }

  function handleStagedReorder(from: number, to: number) {
    const next = [...staged];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    setStaged(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !profile) return;

    setSubmitting(true);
    try {
      await onSubmit(
        {
          name: eventName.trim(),
          description: description.trim() || null,
          category,
          date: toIsoDate(date),
          start_time: `${startTime}:00${getTimezoneOffset()}`,
          end_time: `${endTime}:00${getTimezoneOffset()}`,
          entry_price: entryPrice ? Number.parseFloat(entryPrice) : null,
          genres: selectedGenres,
          custom_location: {
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            address: address.trim(),
          },
        },
        isEdit ? [] : staged.map((s) => s.file)
      );
    } catch {
      toast.error(config.errorMessage);
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
    address.trim();

  const submitLabel = submitting ? config.busyLabel : config.idleLabel;

  return (
    <PageContainer>
      <a
        href={`#${config.formId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to form
      </a>

      <PageHeader title={config.headerTitle} icon={config.headerIcon} showBack />

      <div className="flex-1">
        <form id={config.formId} onSubmit={handleSubmit} className="space-y-4 pb-6">
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
            <FieldLabel htmlFor="description">
              Description <span className="text-muted-foreground">(Optional)</span>
            </FieldLabel>
            <div className="relative">
              <AlignLeftIcon className="absolute left-3 top-3 size-4 shrink-0 text-muted-foreground" />
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell people what to expect at your event..."
                className="min-h-24 rounded-lg pl-10 dark:bg-card"
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
                  className={cn(
                    "h-11 w-full justify-between rounded-lg font-normal dark:bg-card",
                    !date && "text-muted-foreground"
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
                    if (d) {
                      setDate(d);
                      setDateOpen(false);
                    }
                  }}
                  disabled={
                    isEdit ? undefined : (d) => d < new Date(new Date().setHours(0, 0, 0, 0))
                  }
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

          {!isEdit && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <GlobeIcon className="size-3 shrink-0" />
              <span>
                {Intl.DateTimeFormat().resolvedOptions().timeZone} (UTC{getTimezoneOffset()})
              </span>
            </div>
          )}

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

          {/* ── Images ──────────────────────────────────── */}
          <div className="border-t border-border pt-4">
            <SectionHeader>Images</SectionHeader>
          </div>

          {isEdit && liveEvent && profile ? (
            <EventImageManager
              eventId={liveEvent.id}
              userId={profile.id}
              images={liveEvent.event_images}
              onChange={setLiveEvent}
            />
          ) : (
            <StagedImagePicker
              previews={staged.map((s) => s.preview)}
              onAdd={handleStagedAdd}
              onRemove={handleStagedRemove}
              onSetCover={(i) => handleStagedReorder(i, 0)}
              onReorder={handleStagedReorder}
            />
          )}
        </form>
      </div>

      {/* Sticky submit */}
      <div className="sticky bottom-0 z-20 border-t border-border bg-background py-3">
        <Button
          type="submit"
          form={config.formId}
          disabled={!isValid || submitting}
          className="h-12 w-full rounded-lg text-sm font-semibold"
        >
          {submitLabel}
        </Button>
      </div>
    </PageContainer>
  );
}
