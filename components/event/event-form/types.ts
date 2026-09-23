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
  ticket_link: string | null;
  genres: Genre[];
  event_performers: EventPerformerInput[];
  custom_location: {
    latitude: number;
    longitude: number;
    address: string;
  };
};

export type SummaryPerformer = {
  id: string;
  name: string;
  genres: string[];
  avatarUrl?: string;
  /** Pre-formatted range, e.g. "10PM - 12AM". Undefined when no set times were given. */
  setTime?: string;
};

/**
 * Display-ready projection of the create-event form — no `Date`, no `File`, no
 * `null` to branch on at render time. Built by `toSummaryData` in `./utils`.
 */
export type EventSummaryData = {
  name: string;
  /** "" when the optional description is blank. */
  description: string;
  category: string;
  /** "Friday, July 19, 2026" */
  dateLabel: string;
  /** "10PM - 4AM" */
  timeLabel: string;
  /** "Asia/Manila (UTC+08:00)" */
  timezoneLabel: string;
  /** "₱500" or "Free entry" */
  entryLabel: string;
  /** Normalized absolute URL, or null when left empty. */
  ticketLink: string | null;
  genres: Genre[];
  performers: SummaryPerformer[];
  address: string;
  /** Already sanitized by `toSummaryData`; index 0 is the cover. */
  imagePreviews: string[];
};
