import { AxiosError } from "axios";
import api from "@/lib/axios";
import { type EventStatus, type Genre } from "@/lib/constants";
import type { EventImage } from "@/components/dj/dj-event.types";

// ── API response types ────────────────────────────────────────

type ApiUser = {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  bio: string | null;
  genre_tags: string[];
  country: string | null;
  socmed_links: Record<string, string> | null;
  profile_type: string;
  avatar_url: string | null;
};

type ApiCustomLocation = {
  latitude: number;
  longitude: number;
  address: string;
};

type ApiEvent = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  date: string;
  start_time: string;
  end_time: string;
  entry_price: number | null;
  featured: boolean | null;
  category: string;
  created_by: string;
  created_at: string;
  genres: string[];
  custom_location: ApiCustomLocation | null;
  /** Pre-sorted: index 0 is the cover. */
  event_images: EventImage[];
  users: ApiUser;
  status: Exclude<EventStatus, "all">;
};

type ApiResponse = {
  status: number;
  message: string;
  data: ApiEvent[];
};

type ApiSingleResponse = {
  status: number;
  message: string;
  data: ApiEvent;
};

// ── Helpers ───────────────────────────────────────────────────

/** "10:00:00+08" → "10:00" */
function formatTime(raw: string): string {
  return raw.slice(0, 5);
}

/** Returns the browser's UTC offset as "+HH:MM" or "-HH:MM" */
function getTimezoneOffset(): string {
  const offsetMinutes = -new Date().getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const mins = String(abs % 60).padStart(2, "0");
  return `${sign}${hours}:${mins}`;
}

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Image-API error surfaced to the UI. Use `code === "image_limit"` for the
 * server-enforced 5-image cap (HTTP 400).
 */
export class EventImageError extends Error {
  code: "image_limit" | "network" | "unknown";
  constructor(message: string, code: EventImageError["code"]) {
    super(message);
    this.code = code;
  }
}

function toImageError(err: unknown): EventImageError {
  if (err instanceof AxiosError) {
    if (err.response?.status === 400) {
      const message =
        (err.response.data as { message?: string } | undefined)?.message ??
        "Maximum of 5 images per event.";
      return new EventImageError(message, "image_limit");
    }
    return new EventImageError(err.message, "network");
  }
  return new EventImageError("Unexpected error.", "unknown");
}

// ── Service ───────────────────────────────────────────────────

type GetEventsParams = {
  startDate?: Date;
  endDate?: Date;
  genres?: Genre[];
  status?: EventStatus;
};

export type CreateEventBody = {
  name: string;
  description?: string | null;
  category: string;
  date: string;
  start_time: string;
  end_time: string;
  entry_price: number | null;
  genres: Genre[];
  created_by: string;
  location: string | null;
  custom_location: ApiCustomLocation | null;
};

export type UpdateEventBody = {
  name: string;
  description?: string | null;
  category: string;
  date: string;
  start_time: string;
  end_time: string;
  entry_price: number | null;
  genres: Genre[];
  custom_location: ApiCustomLocation | null;
};

async function createEvent(body: CreateEventBody): Promise<ApiEvent> {
  const { data } = await api.post<ApiSingleResponse>("/events", body);
  return data.data;
}

async function updateEvent(id: string, body: UpdateEventBody): Promise<void> {
  await api.patch(`/events/${id}`, body);
}

async function getEvent(id: string, signal?: AbortSignal): Promise<ApiEvent> {
  const { data } = await api.get<ApiSingleResponse>(`/events/${id}`, { signal });
  return data.data;
}

async function getEventsList({ startDate, endDate, genres, status }: GetEventsParams = {}): Promise<
  ApiEvent[]
> {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = toIsoDate(startDate);
  if (endDate) params.endDate = toIsoDate(endDate);
  if (genres && genres.length > 0) params.genres = genres.map((g) => g.toLowerCase()).join(",");
  if (status && status !== "all") params.status = status;
  const { data } = await api.get<ApiResponse>("/events", { params });
  return data.data;
}

async function addEventImages(eventId: string, urls: string[]): Promise<ApiEvent> {
  try {
    const { data } = await api.post<ApiSingleResponse>(`/events/${eventId}/images`, { urls });
    return data.data;
  } catch (err) {
    throw toImageError(err);
  }
}

async function deleteEventImage(eventId: string, imageId: string): Promise<ApiEvent> {
  try {
    const { data } = await api.delete<ApiSingleResponse>(`/events/${eventId}/images/${imageId}`);
    return data.data;
  } catch (err) {
    throw toImageError(err);
  }
}

async function reorderEventImages(eventId: string, imageIds: string[]): Promise<ApiEvent> {
  try {
    const { data } = await api.patch<ApiSingleResponse>(`/events/${eventId}/images/order`, {
      imageIds,
    });
    return data.data;
  } catch (err) {
    throw toImageError(err);
  }
}

export type { ApiEvent, ApiUser };
export {
  getEventsList,
  getEvent,
  createEvent,
  updateEvent,
  addEventImages,
  deleteEventImage,
  reorderEventImages,
  toIsoDate,
  formatTime,
  getTimezoneOffset,
};
