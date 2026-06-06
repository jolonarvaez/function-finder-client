import { parseISO } from "date-fns";
import { toast } from "sonner";
import { EventImageError, type ApiEvent } from "@/lib/services/events";
import type { Genre } from "@/lib/constants";
import { DEFAULT_COORDINATES } from "./constants";

export type InitialState = {
  name: string;
  description: string;
  category: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  entryPrice: string;
  genres: Genre[];
  address: string;
  coordinates: { lng: number; lat: number };
};

export function buildInitialState(
  initialEvent: ApiEvent | undefined,
  fallbackGenres: Genre[]
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
      genres: fallbackGenres,
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
    startTime: initialEvent.start_time.slice(0, 5),
    endTime: initialEvent.end_time.slice(0, 5),
    entryPrice: initialEvent.entry_price != null ? String(initialEvent.entry_price) : "",
    genres: initialEvent.genres as Genre[],
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
