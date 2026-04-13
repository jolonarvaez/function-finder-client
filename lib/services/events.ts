import api from "@/lib/axios";
import { type EventStatus, type Genre } from "@/lib/constants";
import type { MapEvents } from "@/components/map/MapView";

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
};

type ApiCustomLocation = {
  latitude: number;
  longitude: number;
  address: string;
};

type ApiEvent = {
  id: string;
  name: string;
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
  users: ApiUser;
};

type ApiResponse = {
  status: number;
  message: string;
  data: ApiEvent[];
};

// ── Helpers ───────────────────────────────────────────────────

/** "10:00:00+08" → "10:00" */
function formatTime(raw: string): string {
  return raw.slice(0, 5);
}

/**
 * Combines an ISO date ("2026-04-02") with a pg time-with-tz ("10:00:00+08")
 * into a full ISO-8601 string and returns a Date.
 */
function toEventDate(date: string, time: string): Date {
  // "+08" → "+08:00", "-5" → "-05:00", already "+08:00" untouched
  const normalized = time.replace(/([+-])(\d{2})$/, "$1$2:00");
  return new Date(`${date}T${normalized}`);
}

function getEventStatus(event: ApiEvent): EventStatus {
  const now = new Date();
  const start = toEventDate(event.date, event.start_time);
  const end = toEventDate(event.date, event.end_time);
  if (now >= start && now <= end) return "live";
  if (now < start) return "upcoming";
  return "done";
}

function toMapVenue(event: ApiEvent): MapEvents | null {
  // Events without coordinates can't be placed on the map
  if (!event.custom_location) return null;

  const { address } = event.custom_location;

  return {
    lng: event.custom_location.longitude,
    lat: event.custom_location.latitude,
    event: {
      name: event.name,
      address,
      category: event.category,
      date: event.date,
      startTime: formatTime(event.start_time),
      endTime: formatTime(event.end_time),
      entryPrice: event.entry_price ?? undefined,
      featured: event.featured ?? false,
      attending: 0,
      created_by: event.created_by,
      dj: {
        name: event.users.display_name,
        genre: event.genres as Genre[],
      },
    },
  };
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

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

async function getEvents({ startDate, endDate, genres, status }: GetEventsParams = {}): Promise<
  MapEvents[]
> {
  const params: Record<string, string> = {};

  if (startDate) {
    params.startDate = toIsoDate(startDate);
  }

  if (endDate) {
    params.endDate = toIsoDate(endDate);
  }

  if (genres && genres.length > 0) {
    params.genres = genres.map((g) => g.toLowerCase()).join(",");
  }

  const { data } = await api.get<ApiResponse>("/events", { params });

  const events =
    status && status !== "all" ? data.data.filter((e) => getEventStatus(e) === status) : data.data;

  return events.flatMap((e) => {
    const venue = toMapVenue(e);
    return venue ? [venue] : [];
  });
}

export type UpdateEventBody = {
  name: string;
  category: string;
  date: string;
  start_time: string;
  end_time: string;
  entry_price: number | null;
  genres: Genre[];
  custom_location: ApiCustomLocation | null;
};

async function createEvent(body: CreateEventBody): Promise<ApiEvent> {
  const { data } = await api.post<{ status: number; message: string; data: ApiEvent }>(
    "/events",
    body
  );
  return data.data;
}

async function updateEvent(id: string, body: UpdateEventBody): Promise<void> {
  await api.patch(`/events/${id}`, body);
}

export { getEvents, createEvent, updateEvent, toIsoDate };
