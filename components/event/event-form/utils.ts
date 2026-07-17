import { parseISO } from "date-fns";
import { toast } from "sonner";
import {
  EventImageError,
  formatTime,
  getEventPerformers,
  type ApiEvent,
} from "@/lib/services/events";
import type { Genre } from "@/lib/constants";
import { DEFAULT_COORDINATES } from "./constants";
import type { Performer, PerformerProfile } from "./types";

export type InitialState = {
  name: string;
  description: string;
  category: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  entryPrice: string;
  genres: Genre[];
  performers: Performer[];
  address: string;
  coordinates: { lng: number; lat: number };
};

export function toPerformer(
  user: PerformerProfile & { set_start_time?: string | null; set_end_time?: string | null }
): Performer {
  return {
    id: user.id,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
    genre_tags: user.genre_tags,
    // API times are "HH:MM:SS+off" — keep only "HH:MM" for the form inputs.
    set_start_time: user.set_start_time ? formatTime(user.set_start_time) : "",
    set_end_time: user.set_end_time ? formatTime(user.set_end_time) : "",
  };
}

export function buildInitialState(
  initialEvent: ApiEvent | undefined,
  currentUser?: PerformerProfile | null
): InitialState {
  if (!initialEvent) {
    return {
      name: "",
      description: "",
      category: "",
      date: undefined,
      startTime: "",
      endTime: "",
      entryPrice: "",
      genres: (currentUser?.genre_tags ?? []) as Genre[],
      // Creator is pre-added to the lineup, removable.
      performers: currentUser ? [toPerformer(currentUser)] : [],
      address: "",
      coordinates: DEFAULT_COORDINATES,
    };
  }
  const loc = initialEvent.custom_location;
  return {
    name: initialEvent.name,
    description: initialEvent.description ?? "",
    category: initialEvent.category,
    date: parseISO(initialEvent.date),
    startTime: formatTime(initialEvent.start_time),
    endTime: formatTime(initialEvent.end_time),
    entryPrice: initialEvent.entry_price != null ? String(initialEvent.entry_price) : "",
    genres: initialEvent.genres as Genre[],
    performers: getEventPerformers(initialEvent).map((p) =>
      toPerformer({ ...p.users, set_start_time: p.set_start_time, set_end_time: p.set_end_time })
    ),
    address: loc?.address ?? "",
    coordinates: loc ? { lng: loc.longitude, lat: loc.latitude } : DEFAULT_COORDINATES,
  };
}

export function reportError(err: unknown, fallback: string) {
  if (err instanceof EventImageError) {
    toast.error(err.message);
    return;
  }
  toast.error(fallback);
}
