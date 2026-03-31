// ── Onboarding ──────────────────────────────────────────────

export const ONBOARDING_STEP_COUNT = 3;

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

// ── Venue Filters ───────────────────────────────────────────

export const VENUE_FILTERS = ["live-now", "nearest", "best-match"] as const;

export type VenueFilter = (typeof VENUE_FILTERS)[number];

export const VENUE_FILTER_LABELS: Record<VenueFilter, string> = {
  "live-now": "Live Now",
  nearest: "Nearest",
  "best-match": "Best Match",
};
