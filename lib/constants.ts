// ── Onboarding ──────────────────────────────────────────────

export const ONBOARDING_STEP_COUNT = 4;

export const ROLES = ["dj", "host", "event-goer"] as const;

export type OnboardingRole = (typeof ROLES)[number];

export const ROLE_LABELS: Record<OnboardingRole, string> = {
  dj: "DJ",
  host: "Host",
  "event-goer": "Event-Goer",
};

// ── Genres ───────────────────────────────────────────────────

export const GENRES = [
  "House",
  "Techno",
  "DnB",
  "Hip-Hop",
  "RnB",
  "Afrobeats",
  "Dancehall",
  "Reggaeton",
  "Pop",
  "Latin",
  "Soul",
  "Disco",
] as const;

export type Genre = (typeof GENRES)[number];

// ── Event Categories ─────────────────────────────────────────

export const EVENT_CATEGORIES = [
  "Nightclub",
  "Bar",
  "Lounge",
  "Club",
  "Underground",
  "Festival",
  "Rooftop",
  "Others",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

// ── Countries ────────────────────────────────────────────────

/** Maps country name to ISO 3166-1 alpha-2 code */
export const COUNTRY_ISO: Record<string, string> = {
  Afghanistan: "AF",
  Albania: "AL",
  Algeria: "DZ",
  Argentina: "AR",
  Australia: "AU",
  Austria: "AT",
  Bangladesh: "BD",
  Belgium: "BE",
  Bolivia: "BO",
  Brazil: "BR",
  Cambodia: "KH",
  Canada: "CA",
  Chile: "CL",
  China: "CN",
  Colombia: "CO",
  Croatia: "HR",
  "Czech Republic": "CZ",
  Denmark: "DK",
  Ecuador: "EC",
  Egypt: "EG",
  Ethiopia: "ET",
  Finland: "FI",
  France: "FR",
  Germany: "DE",
  Ghana: "GH",
  Greece: "GR",
  Guatemala: "GT",
  Hungary: "HU",
  India: "IN",
  Indonesia: "ID",
  Iran: "IR",
  Iraq: "IQ",
  Ireland: "IE",
  Israel: "IL",
  Italy: "IT",
  Japan: "JP",
  Jordan: "JO",
  Kazakhstan: "KZ",
  Kenya: "KE",
  Kuwait: "KW",
  Malaysia: "MY",
  Mexico: "MX",
  Morocco: "MA",
  Myanmar: "MM",
  Nepal: "NP",
  Netherlands: "NL",
  "New Zealand": "NZ",
  Nigeria: "NG",
  Norway: "NO",
  Pakistan: "PK",
  Peru: "PE",
  Philippines: "PH",
  Poland: "PL",
  Portugal: "PT",
  Romania: "RO",
  Russia: "RU",
  "Saudi Arabia": "SA",
  Senegal: "SN",
  Serbia: "RS",
  Singapore: "SG",
  "South Africa": "ZA",
  "South Korea": "KR",
  Spain: "ES",
  "Sri Lanka": "LK",
  Sweden: "SE",
  Switzerland: "CH",
  Taiwan: "TW",
  Tanzania: "TZ",
  Thailand: "TH",
  Turkey: "TR",
  Ukraine: "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  Uruguay: "UY",
  Uzbekistan: "UZ",
  Venezuela: "VE",
  Vietnam: "VN",
  Yemen: "YE",
  Zimbabwe: "ZW",
};

export const COUNTRIES = Object.keys(COUNTRY_ISO);

// ── Map Defaults ─────────────────────────────────────────────

/** Default map center — Metro Manila, Philippines [lng, lat] */
export const MAKATI_CENTER: [number, number] = [121.0244, 14.5995];

/** Default zoom level — fits all of Metro Manila */
export const DEFAULT_ZOOM = 11;

// ── Event Status ─────────────────────────────────────────────

export const EVENT_STATUSES = ["all", "live", "upcoming", "done"] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  all: "All",
  live: "Live",
  upcoming: "Upcoming",
  done: "Done",
};

// ── Venue Filters ───────────────────────────────────────────

export const VENUE_FILTERS = ["live-now", "nearest", "best-match"] as const;

export type VenueFilter = (typeof VENUE_FILTERS)[number];

export const VENUE_FILTER_LABELS: Record<VenueFilter, string> = {
  "live-now": "Live Now",
  nearest: "Nearest",
  "best-match": "Best Match",
};

// ── Social Media Links  ───────────────────────────────────────────

export type SocialPlatform =
  | "twitter"
  | "instagram"
  | "facebook"
  | "soundcloud"
  | "youtube"
  | "tiktok"
  | "spotify"
  | "website";

export type SocialEntry = { platform: SocialPlatform | ""; value: string };

export const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: "twitter", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "soundcloud", label: "SoundCloud" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "spotify", label: "Spotify" },
  { value: "website", label: "Website" },
];
