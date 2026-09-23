import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  EventImageError,
  formatTime,
  getEventPerformers,
  getTimezoneOffset,
  type ApiEvent,
} from "@/lib/services/events";
// NOTE: `formatTime` above is the PARSER ("22:00:00+08" -> "22:00"). This is its
// inverse-in-spirit, the display formatter ("22:00" -> "10PM"). Same name, opposite
// jobs — aliased so the two can never be confused at a call site.
import { formatTime as formatClockTime } from "@/components/dj/dj-event.types";
import type { Genre } from "@/lib/constants";
import { DEFAULT_COORDINATES } from "./constants";
import type { EventSummaryData, Performer, PerformerProfile, SummaryPerformer } from "./types";

export type InitialState = {
  name: string;
  description: string;
  category: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  entryPrice: string;
  ticketLink: string;
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
  currentUser?: (PerformerProfile & { profile_type?: string | null }) | null
): InitialState {
  if (!initialEvent) {
    // Hosts organize the lineup but aren't performers themselves — only pre-add DJs/event-goers.
    const isHost = currentUser?.profile_type === "host";
    return {
      name: "",
      description: "",
      category: "",
      date: undefined,
      startTime: "",
      endTime: "",
      entryPrice: "",
      ticketLink: "",
      genres: (currentUser?.genre_tags ?? []) as Genre[],
      // Creator is pre-added to the lineup, removable.
      performers: currentUser && !isHost ? [toPerformer(currentUser)] : [],
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
    ticketLink: initialEvent.ticket_link ?? "",
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

/**
 * Normalizes a user-typed ticket URL for the API: trims it, prefixes a bare
 * host with `https://`, and returns null when the field is left empty.
 */
export function normalizeTicketLink(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** True when the ticket link is empty or normalizes to a parseable http(s) URL. */
export function isTicketLinkValid(raw: string): boolean {
  const normalized = normalizeTicketLink(raw);
  if (normalized === null) return true;
  try {
    return Boolean(new URL(normalized).hostname.includes("."));
  } catch {
    return false;
  }
}

/**
 * Allowlist for image `src` values: only the in-memory previews we created
 * ourselves. Never lets a remote or user-supplied string reach an <img>.
 */
export function toSafeImageSrc(preview: string): string | null {
  if (preview.startsWith("blob:")) return preview;
  if (preview.startsWith("data:image/")) return preview;
  return null;
}

/** "22:00" + "00:00" -> "10PM - 12AM". Undefined when neither time was set. */
export function formatSetTimeRange(start: string, end: string): string | undefined {
  if (!start && !end) return undefined;
  return `${start ? formatClockTime(start) : "\u2014"} - ${end ? formatClockTime(end) : "\u2014"}`;
}

/** Raw form state the summary projection is built from. */
export type SummaryInput = {
  name: string;
  description: string;
  category: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  entryPrice: string;
  ticketLink: string;
  genres: Genre[];
  performers: Performer[];
  address: string;
  imagePreviews: string[];
};

function toSummaryPerformer(p: Performer): SummaryPerformer {
  return {
    id: p.id,
    name: p.display_name,
    genres: p.genre_tags,
    avatarUrl: p.avatar_url ?? undefined,
    setTime: formatSetTimeRange(p.set_start_time, p.set_end_time),
  };
}

/**
 * Projects live form state into display-ready strings for the review step.
 * All derivation lives here so the summary component stays a pure renderer —
 * and so Storybook can pin values that would otherwise read browser globals.
 */
export function toSummaryData(input: SummaryInput): EventSummaryData {
  const price = input.entryPrice ? Number.parseFloat(input.entryPrice) : Number.NaN;

  return {
    name: input.name.trim(),
    description: input.description.trim(),
    category: input.category,
    // Same token string as EventDetailView, so review and detail read identically.
    dateLabel: input.date ? format(input.date, "EEEE, MMMM d, yyyy") : "",
    timeLabel: `${formatClockTime(input.startTime)} - ${formatClockTime(input.endTime)}`,
    timezoneLabel: `${Intl.DateTimeFormat().resolvedOptions().timeZone} (UTC${getTimezoneOffset().replace(
      /(\d{2})(\d{2})$/,
      "$1:$2"
    )})`,
    entryLabel:
      Number.isFinite(price) && price > 0 ? `\u20b1${price.toLocaleString()}` : "Free entry",
    ticketLink: normalizeTicketLink(input.ticketLink),
    genres: input.genres,
    performers: input.performers.map(toSummaryPerformer),
    address: input.address.trim(),
    // Sanitized at the boundary, where untrusted values enter — not in the component,
    // which must stay able to render ordinary URLs in Storybook.
    imagePreviews: input.imagePreviews
      .map(toSafeImageSrc)
      .filter((src): src is string => src !== null),
  };
}
