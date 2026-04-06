// ── Onboarding ──────────────────────────────────────────────

export const ONBOARDING_STEP_COUNT = 4;

export const ROLES = ["dj", "event-goer"] as const;

export type OnboardingRole = (typeof ROLES)[number];

export const ROLE_LABELS: Record<OnboardingRole, string> = {
  dj: "DJ",
  "event-goer": "Event-Goer",
};

// ── Genres ───────────────────────────────────────────────────

export const GENRES = [
  "House",
  "Techno",
  "Drum & Bass",
  "Hip-Hop",
  "R&B",
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

/** Default map center — Makati, Philippines [lng, lat] */
export const MAKATI_CENTER: [number, number] = [121.0244, 14.5547];

/** Default zoom level for venue/event maps */
export const DEFAULT_ZOOM = 14;

// ── Venue Filters ───────────────────────────────────────────

export const VENUE_FILTERS = ["live-now", "nearest", "best-match"] as const;

export type VenueFilter = (typeof VENUE_FILTERS)[number];

export const VENUE_FILTER_LABELS: Record<VenueFilter, string> = {
  "live-now": "Live Now",
  nearest: "Nearest",
  "best-match": "Best Match",
};
