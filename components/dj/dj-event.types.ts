import { parseISO } from "date-fns";
import { MAKATI_CENTER } from "@/lib/constants";
import type { Genre } from "@/lib/constants";

// ── Core type ────────────────────────────────────────────────

export type EventImage = {
  id: string;
  event_id: string;
  url: string;
  sort_order: number;
};

export const MAX_EVENT_IMAGES = 5;

/** Placeholder used when an event has no images at all. */
export const PLACEHOLDER_EVENT_IMAGE = "https://placehold.co/400x533/1a1a1a/666666?text=No+Image";

export type DJEvent = {
  id: string;
  name: string;
  description?: string;
  venue: string;
  address: string;
  category: string;
  /** ISO date string "YYYY-MM-DD" */
  date: string;
  startTime: string;
  endTime: string;
  entryPrice?: number;
  genres: Genre[];
  coordinates?: { lng: number; lat: number };
  eventImages?: EventImage[];
};

export type EventStatus = "live" | "upcoming" | "past" | "all";

/** Resolves the cover URL for an event, falling back to the placeholder. */
export function getEventCover(event: {
  event_images?: EventImage[] | null;
  eventImages?: EventImage[];
}): string {
  const images = event.event_images ?? event.eventImages;
  return images && images.length > 0 ? images[0]!.url : PLACEHOLDER_EVENT_IMAGE;
}

/**
 * Like {@link getEventCover} but returns `null` when no image exists.
 * Use when the caller wants to hide the slot entirely (e.g. compact cards).
 */
export function getEventCoverOrNull(event: {
  event_images?: EventImage[] | null;
  eventImages?: EventImage[];
}): string | null {
  const images = event.event_images ?? event.eventImages;
  return (images && images.length > 0 ? images[0]?.url : null) ?? null;
}

// ── Edit draft ───────────────────────────────────────────────

export type EditDraft = {
  name: string;
  description: string;
  category: string;
  date: Date;
  dateOpen: boolean;
  startTime: string;
  endTime: string;
  entryPrice: string;
  genres: Genre[];
  locationMode: "map" | "venue";
  coordinates: { lng: number; lat: number };
  address: string;
  selectedVenueId: string;
};

// ── Helpers ──────────────────────────────────────────────────

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function nextDayISO(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type StatusFields = { date: string; startTime: string; endTime: string };

function sameDayStatus(event: StatusFields, today: string, nowTime: string): EventStatus {
  if (event.date < today) return "past";
  if (event.date > today) return "upcoming";
  if (nowTime < event.startTime) return "upcoming";
  if (nowTime > event.endTime) return "past";
  return "live";
}

function overnightStatus(event: StatusFields, today: string, nowTime: string): EventStatus {
  const nextDay = nextDayISO(event.date);
  if (today < event.date) return "upcoming";
  if (today === event.date) return nowTime >= event.startTime ? "live" : "upcoming";
  if (today === nextDay) return nowTime <= event.endTime ? "live" : "past";
  return "past";
}

export function getStatus(event: StatusFields): EventStatus {
  const today = todayISO();
  const now = new Date();
  const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return event.endTime >= event.startTime
    ? sameDayStatus(event, today, nowTime)
    : overnightStatus(event, today, nowTime);
}

export function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}

export function draftFromEvent(e: DJEvent): EditDraft {
  return {
    name: e.name,
    description: e.description ?? "",
    category: e.category,
    date: parseISO(e.date),
    dateOpen: false,
    startTime: e.startTime,
    endTime: e.endTime,
    entryPrice: e.entryPrice != null ? String(e.entryPrice) : "",
    genres: [...e.genres],
    locationMode: "map",
    coordinates: e.coordinates ?? { lng: MAKATI_CENTER[0], lat: MAKATI_CENTER[1] },
    address: e.address,
    selectedVenueId: "",
  };
}

export function draftToPartial(draft: EditDraft, original: DJEvent): Partial<DJEvent> {
  return {
    name: draft.name.trim() || original.name,
    description: draft.description.trim() || undefined,
    category: draft.category || original.category,
    date: `${draft.date.getFullYear()}-${String(draft.date.getMonth() + 1).padStart(2, "0")}-${String(draft.date.getDate()).padStart(2, "0")}`,
    startTime: draft.startTime,
    endTime: draft.endTime,
    entryPrice: draft.entryPrice ? Number(draft.entryPrice) : undefined,
    genres: draft.genres,
    coordinates: draft.coordinates,
    address: draft.address,
  };
}
