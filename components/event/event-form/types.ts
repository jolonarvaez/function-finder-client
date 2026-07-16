import type { Genre } from "@/lib/constants";
import type { EventPerformerInput } from "@/lib/services/events";

export type EventFormMode = "create" | "edit";

/** Profile fields the lineup UI needs — structurally assignable from both `ApiUser` and `UserProfile`. */
export type PerformerProfile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  genre_tags: string[];
};

export type Performer = PerformerProfile & {
  /** Form-local set times as "HH:MM"; empty string when unset. */
  set_start_time: string;
  set_end_time: string;
};

export type EventFormValues = {
  name: string;
  description: string | null;
  category: string;
  date: string;
  start_time: string;
  end_time: string;
  entry_price: number | null;
  genres: Genre[];
  event_performers: EventPerformerInput[];
  custom_location: {
    latitude: number;
    longitude: number;
    address: string;
  };
};
