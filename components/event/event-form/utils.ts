import { format, isBefore, isValid, parseISO, startOfDay } from "date-fns";
import { toast } from "sonner";
import {
  EventImageError,
  formatTime,
  getEventPerformers,
  getTimezoneOffset,
  type ApiEvent,
  type ExtractedEvent,
} from "@/lib/services/events";
// NOTE: `formatTime` above is the PARSER ("22:00:00+08" -> "22:00"). This is its
// inverse-in-spirit, the display formatter ("22:00" -> "10PM"). Same name, opposite
// jobs — aliased so the two can never be confused at a call site.
import { formatTime as formatClockTime } from "@/components/dj/dj-event.types";
import { EVENT_CATEGORIES, GENRES, type Genre } from "@/lib/constants";
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

// ── Poster autofill ───────────────────────────────────────────

/** "Hip Hop", "hip-hop", "HIPHOP" -> "hiphop"; "Reggaetón" -> "reggaeton". */
function normalizeLabel(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Spellings flyers use that don't normalize onto a `GENRES` entry by themselves. */
const GENRE_ALIASES: Record<string, Genre> = {
  drumandbass: "DnB",
  drumnbass: "DnB",
  drumbass: "DnB",
  rhythmandblues: "RnB",
  randb: "RnB",
  rap: "Hip-Hop",
  afrobeat: "Afrobeats",
  afro: "Afrobeats",
};

function matchGenre(raw: string): Genre | null {
  const key = normalizeLabel(raw);
  return GENRES.find((g) => normalizeLabel(g) === key) ?? GENRE_ALIASES[key] ?? null;
}

function matchCategory(raw: string): string | null {
  const key = normalizeLabel(raw);
  return EVENT_CATEGORIES.find((c) => normalizeLabel(c) === key) ?? null;
}

/** Form-state values a poster can fill. Keys are absent when the poster didn't provide them. */
export type AutofillValues = Partial<
  Pick<
    InitialState,
    | "name"
    | "description"
    | "category"
    | "date"
    | "startTime"
    | "endTime"
    | "entryPrice"
    | "ticketLink"
    | "genres"
    | "address"
  >
>;

/**
 * Maps the extraction response into form-state values. Anything that can't be
 * represented by the form (a past date, a category or genre outside the fixed
 * lists) is dropped rather than half-applied. `datePassed` flags a skipped
 * past date so the UI can tell the user to pick a new one.
 */
export function mapExtractedEvent(
  extracted: ExtractedEvent,
  today: Date
): { values: AutofillValues; datePassed: boolean } {
  const values: AutofillValues = {};
  let datePassed = false;

  const trimmed = (v: string | null) => v?.trim() || undefined;

  values.name = trimmed(extracted.name);
  values.description = trimmed(extracted.description);
  values.ticketLink = trimmed(extracted.ticket_link);
  values.address = trimmed(extracted.custom_location?.address ?? null);

  if (extracted.category) values.category = matchCategory(extracted.category) ?? undefined;

  if (extracted.date) {
    const parsed = parseISO(extracted.date);
    // The create-mode calendar can't show a past date as selected, so don't set one.
    if (isValid(parsed)) {
      if (isBefore(parsed, startOfDay(today))) datePassed = true;
      else values.date = parsed;
    }
  }

  // API times are "HH:MM:SS+off" — the form inputs hold "HH:MM".
  if (extracted.start_time) values.startTime = formatTime(extracted.start_time);
  if (extracted.end_time) values.endTime = formatTime(extracted.end_time);

  if (extracted.entry_price != null) values.entryPrice = String(extracted.entry_price);

  const genres = [
    ...new Set((extracted.genres ?? []).map(matchGenre).filter((g): g is Genre => g !== null)),
  ];
  // Only replace the profile-default genres when the poster named one we support.
  if (genres.length > 0) values.genres = genres;

  // Drop the keys left undefined above, so callers can check `key in values`.
  for (const key of Object.keys(values) as (keyof AutofillValues)[]) {
    if (values[key] === undefined) delete values[key];
  }

  return { values, datePassed };
}
