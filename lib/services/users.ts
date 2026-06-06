import api from "@/lib/axios";
import type { OnboardingRole, Genre } from "@/lib/constants";
import type { DJEvent, EventImage } from "@/components/dj/dj-event.types";

// ── Types ─────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  bio: string | null;
  genre_tags: Genre[];
  country: string | null;
  socmed_links: Record<string, string> | null;
  profile_type: OnboardingRole | null;
  avatar_url: string | null;
};

type ApiUserResponse = {
  status: number;
  message: string;
  data: UserProfile;
};

type UpdateUserBody = {
  profile_type?: OnboardingRole;
  genre_tags?: Genre[];
  bio?: string | null;
  country?: string | null;
  display_name?: string;
  socmed_links?: Record<string, string> | null;
  avatar_url?: string | null;
};

type ApiEvent = {
  id: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  entry_price: number | null;
  category: string;
  genres: string[];
  custom_location: { latitude: number; longitude: number; address: string } | null;
  /** Pre-sorted: index 0 is the cover. */
  event_images: EventImage[];
};

type ApiUserEventsResponse = {
  status: number;
  message: string;
  data: ApiEvent[];
};

// ── Service functions ─────────────────────────────────────────

async function getUser(id: string): Promise<UserProfile> {
  const { data } = await api.get<ApiUserResponse>(`/users/${id}`);
  return data.data;
}

async function getUserEvents(id: string): Promise<DJEvent[]> {
  const { data } = await api.get<ApiUserEventsResponse>(`/users/${id}/events`);
  return data.data.map(
    (e): DJEvent => ({
      id: e.id,
      name: e.name,
      venue: "",
      address: e.custom_location?.address ?? "",
      category: e.category,
      date: e.date,
      startTime: e.start_time.slice(0, 5),
      endTime: e.end_time.slice(0, 5),
      entryPrice: e.entry_price ?? undefined,
      genres: e.genres as Genre[],
      coordinates: e.custom_location
        ? { lng: e.custom_location.longitude, lat: e.custom_location.latitude }
        : undefined,
      eventImages: e.event_images,
    })
  );
}

async function updateUser(id: string, body: UpdateUserBody): Promise<void> {
  await api.patch(`/users/${id}`, body);
}

export { getUser, getUserEvents, updateUser };
