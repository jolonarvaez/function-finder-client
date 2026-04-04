import api from "@/lib/axios";
import type { Genre } from "@/lib/constants";
import type { MapVenue } from "@/components/map/MapView";

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

function toMapVenue(event: ApiEvent): MapVenue | null {
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
      dj: {
        name: event.users.display_name,
        genre: event.genres as Genre[],
      },
    },
  };
}

// ── Service ───────────────────────────────────────────────────

type GetEventsParams = {
  date?: Date;
  genres?: Genre[];
};

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

async function getEvents({ date, genres }: GetEventsParams = {}): Promise<MapVenue[]> {
  const params: Record<string, string> = {};

  if (date) {
    params.date = toIsoDate(date);
  }

  if (genres && genres.length > 0) {
    params.genres = genres.map((g) => g.toLowerCase()).join(",");
  }

  const { data } = await api.get<ApiResponse>("/events", { params });
  return data.data.flatMap((e) => {
    const venue = toMapVenue(e);
    return venue ? [venue] : [];
  });
}

export { getEvents };
