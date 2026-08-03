# Frontend Architecture

This document describes the current implementation of the Function Finder client: routing, components, state, data layer, plugins, and styling. It reflects the actual code as of 2026-07-21.

> **Note on `CLAUDE.md`**: the root `CLAUDE.md` "Project Structure" and "Map style selection" sections describe an older layout (`app/components/maps/`, `lib/maps/types.ts`, a `StadiaStyleId` type, Stadia Maps tiles). That structure no longer exists in the codebase — it was superseded by a refactor to Google Maps geocoding and a hand-rolled MapLibre wrapper in `components/ui/map.tsx`. This document describes what's actually there today; `CLAUDE.md` should be updated to match.

## 1. Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript 5, `strict: true`, path alias `@/*` → repo root
- **Styling**: Tailwind CSS 4 (CSS-first config, no `tailwind.config.ts`) + shadcn/ui (`radix-nova` style)
- **Maps**: MapLibre GL, wrapped by a custom component (`components/ui/map.tsx`), Carto basemap tiles
- **Geocoding**: Google Maps Geocoding / Places APIs, proxied through Next.js API routes
- **Auth/Data**: Supabase (`@supabase/supabase-js`) for auth session + storage; a separate REST backend (via `axios`, rewritten through `/api/backend/*`) for events/users
- **State**: Zustand (3 stores), React Context for auth/theme
- **Icons**: `lucide-react` (dominant in practice), plus `@hugeicons/react` and `react-icons` as secondary dependencies
- **Dev tooling**: Storybook 10 (Vite builder), ESLint 9 (flat config), Prettier 3
- **No test runner** — there is no Jest/Vitest/Playwright/RTL in the project; Storybook is the only verification surface beyond manual testing and lint/typecheck.

## 2. Routing (App Router)

```
app/
  layout.tsx                       root layout: fonts, ThemeProvider, AuthProvider, global Toaster
  login/page.tsx                   public
  signup/page.tsx                  public
  onboarding/page.tsx              public (post-signup flow)
  auth/callback/page.tsx           Supabase OAuth/magic-link callback
  api/geocode/{reverse,search,place}/route.ts   server-side Google Maps proxy
  (app)/                           route group — authenticated shell
    layout.tsx                     wraps children in <TopNav> (sidebar + topbar chrome)
    page.tsx                       "/" — AuthGuard + MapView (home is the map)
    map/page.tsx                   "/map" — MapView again, but NOT wrapped in AuthGuard
    events/page.tsx                AuthGuard + EventsView
    events/[id]/page.tsx           AuthGuard + EventDetailView
    venues/page.tsx                VenueListView
    profile/[id]/page.tsx          AuthGuard + ProfileView
    settings/page.tsx              AuthGuard + SettingsView
    dj/create-event/page.tsx       AuthGuard + CreateEventView
    dj/edit-event/[id]/page.tsx    AuthGuard + EditEventView
    dj/event-manager/page.tsx      AuthGuard + DJEventsView
```

**Known issues to be aware of:**

- `/` and `/map` both render `MapView`, but only `/` is behind `AuthGuard` — `/map` is reachable unauthenticated. Confirm whether that's intentional before "fixing" it.
- `app/(app)/venues/page.tsx` renders `VenueListView` but the page function itself is still named `ProfilePage` — copy-paste leftover, harmless but worth renaming next time that file is touched.

`AuthGuard` (`components/auth/AuthGuard.tsx`) redirects unauthenticated users to `/login?next=<path>`.

## 3. Components

Feature folders under `components/`, one per domain, mirroring the `stories/` tree:

| Folder        | Contents                                                                                                                                                                                                                                                                                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth/`       | `AuthGuard`, `LoginPage`, `SignUpPage`, `use-user-store` (Zustand)                                                                                                                                                                                                                                                                                                     |
| `dj/`         | `DJEventsView`, `EventCard`, shared `DJEvent`/`EventImage` types                                                                                                                                                                                                                                                                                                       |
| `event/`      | `EventsView`, `EventItem`, `EventListFilters`, `EventDetailView`, `CreateEventView`, `EditEventView`, `EventImageGallery`; subfolder `event-form/` for the multi-step event creation/edit form (`EventForm`, `AddressAutocomplete`, `LocationPicker`, `PerformerSelector`, `EventImageManager`, `StagedImagePicker`)                                                   |
| `map/`        | `MapView` (page-level composition), `MapFilters`/`MobileMapFilters`, `VenueMarker`, `VenueInfo` (bottom sheet), `UserLocationMarker`, `use-geolocation`, `use-map-filter-store` (Zustand)                                                                                                                                                                              |
| `onboarding/` | `OnboardingFlow` + one component per step (`OnboardingRolePage`, `OnboardingProfilePage`, `OnboardingGenrePage`, `OnboardingSummaryPage`), `StepIndicator`, `use-onboarding-store` (Zustand)                                                                                                                                                                           |
| `profile/`    | `ProfileView`, `ProfileHeader`, `PublicLiveEvents`, `PublicUpcomingEvents`, `SocialLinks`                                                                                                                                                                                                                                                                              |
| `providers/`  | `AuthProvider` (Supabase session + syncs `use-user-store`), `ThemeProvider` (next-themes wrapper)                                                                                                                                                                                                                                                                      |
| `reusables/`  | `PageContainer`/`PageHeader`, `CopyLinkButton`, `CountrySelect`                                                                                                                                                                                                                                                                                                        |
| `settings/`   | `SettingsView`, `AvatarCropSheet` (uses `react-easy-crop`)                                                                                                                                                                                                                                                                                                             |
| `shared/`     | `GenreSelector`, `LocationItem`, `Persona`, `SearchBar`, `VenueFilterSelector`                                                                                                                                                                                                                                                                                         |
| `sidebar/`    | `AppSidebar`, `ConnectedAppSidebar` (data-connected variant), `AppTopNav`, `TopNav` (composes `SidebarProvider`/`SidebarInset`/`TooltipProvider`), `ProfileFooter`                                                                                                                                                                                                     |
| `venues/`     | `VenueListView`                                                                                                                                                                                                                                                                                                                                                        |
| `ui/`         | shadcn/Radix primitives (`avatar`, `badge`, `button`, `calendar`, `card`, `carousel`, `collapsible`, `drawer`, `field`, `hover-card`, `input`, `label`, `popover`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `tabs`, `textarea`, `tooltip`) plus the bespoke `map.tsx` (see below) |

Stories mirror this structure under `stories/<feature>/` (component-level) and `stories/Pages/<feature>/` (page-level), per the conventions in `CLAUDE.md`.

## 4. Map Feature

The map is built entirely on **`components/ui/map.tsx`**, a ~1,400-line hand-written MapLibre GL binding — not `react-map-gl` (which is still listed in `package.json` but is unused dead weight; nothing imports it).

Key exports from `map.tsx`:

- `Map` — forwardRef component taking all `MapLibreGL.MapOptions` (minus `container`/`style`) plus `theme?`, `styles?: {light, dark}`, `projection?`, and controlled `viewport?`/`onViewportChange?`.
- `useMap()` — context hook returning `{ map, isLoaded }`.
- `MapMarker`, `MarkerContent`, `MarkerPopup`, `MarkerTooltip`, `MarkerLabel` — marker primitives rendered via `createPortal` into MapLibre's own marker/popup DOM nodes.
- `MapControls` — zoom/compass/locate/fullscreen cluster.
- `MapPopup`, `MapRoute` (GeoJSON LineString layer), `MapClusterLayer<P>` (generic clustered point layer).
- Types: `MapRef`, `MapViewport`.

Default basemap tiles are **Carto** (`basemaps.cartocdn.com`, `dark-matter-gl-style` / `positron-gl-style`), auto-selected by detecting the current theme (`.dark` class on `<html>` + `prefers-color-scheme`), so it stays in sync with `next-themes` automatically. This custom primitive was pulled from a third-party shadcn-style registry, declared in `components.json` under `"registries": { "@mapcn": "https://mapcn.dev/r/{name}.json" }` — that's why it lives in `components/ui/` despite not being an official shadcn component.

`components/map/MapView.tsx` is the page-level composition: it wires up `Map`, `MapControls`, `useMapFilterStore`, `useGeolocation`, `VenueMarker`, `UserLocationMarker`, and the filter panels. It centers on `MAKATI_CENTER` (`lib/constants.ts`) at `DEFAULT_ZOOM = 11`, and fetches events via `getEventsList()` (`lib/services/events.ts`), mapping `ApiEvent → MapEvents`.

`VenueMarker.tsx` shows a hover/zoom-triggered flyer preview (auto-expands past `ALWAYS_OPEN_ZOOM = 13`) and opens the `VenueInfo` bottom sheet on click, with z-index ordering by event status (`done: 0 < upcoming: 1 < live: 2`).

**Geocoding is a separate concern from map rendering.** Address search/reverse-geocode/place-details go through Google Maps APIs, proxied server-side via `app/api/geocode/{reverse,search,place}/route.ts` (keeps `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` calls server-side-ish and centralizes the fetch shape), called from `lib/services/geocode/geocode.ts`. This is used by the event-creation `LocationPicker`/`AddressAutocomplete` flow, not by the map's basemap tiles.

## 5. State Management

Three Zustand stores, none sharing a single "global store" pattern — each is scoped to its feature:

1. **`components/auth/use-user-store.ts`** — `{ profile, loading }` + setters. Populated/cleared by `AuthProvider` on session change. Not persisted (Supabase session itself is the source of truth on reload).
2. **`components/map/use-map-filter-store.ts`** — `{ selectedGenres, query, activeFilter, eventStatus, dateRangeType, referenceDate, startDate, endDate }` + actions, plus a `computeDateRange(type, ref)` helper. **Persisted** to `localStorage` under `"map-filters"` via `zustand/middleware persist`, with a custom `partialize`/`onRehydrateStorage` pair to serialize/deserialize `Date` fields through ISO strings.
3. **`components/onboarding/use-onboarding-store.ts`** — `{ step, role, displayName, bio, country, genres }` + actions. Not persisted; scoped to the lifetime of the onboarding flow.

`next-themes` handles theme state outside Zustand, via `ThemeProvider` (`attribute="class"`, `defaultTheme="system"`).

## 6. Data Layer

- **`lib/axios.ts`** — default `api` instance, `baseURL: "/api/backend"`. `next.config.ts` rewrites `/api/backend/:path*` → `${NEXT_PUBLIC_API_URL}/:path*`, so the browser never sees the real backend origin. A request interceptor attaches `Authorization: Bearer <supabase JWT>` from `supabase.auth.getSession()` on every call.
- **`lib/services/events.ts`** — the largest service. `getEventsList()`, `getEvent()`, `getEventPerformers()` (sorted by `performance_order`), `getEventHost()`, `createEvent()`/`updateEvent()` (body includes `event_performers: EventPerformerInput[]` for the multi-performer lineup feature), image endpoints (`addEventImages`/`deleteEventImage`/`reorderEventImages`, wrapped in a custom `EventImageError` with `code: "image_limit" | "network" | "unknown"` — the backend caps events at 5 images and returns HTTP 400 at the limit), plus time helpers (`formatTime`, `toApiTime`, `getTimezoneOffset`, `toIsoDate`).
- **`lib/services/users.ts`** — `UserProfile` type, `getUser()`, `searchUsers()` (DJ-only search backing `PerformerSelector`), `getUserEvents()`/`getUserPerformers()`, `updateUser()` (the "profile API" path).
- **`lib/services/auth.ts`** — `loginWithEmail()` against a custom `/auth/login` backend endpoint. This runs **alongside** Supabase's own client-side session/auth (used everywhere else, including `AuthProvider`) — a dual-auth pattern worth confirming with the backend team rather than assuming it's redundant.
- **`lib/services/storage.ts`** — Supabase Storage upload helpers for the `event-images` and `avatars` buckets; sanitizes filenames and randomizes paths before returning public URLs.
- **`lib/services/geocode/geocode.ts`** — thin client wrapper around the three geocode API routes described above.
- **`lib/supabase.ts`** — singleton `supabase` client; throws early if `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing.

`next.config.ts` also sets image `remotePatterns` (Picsum + the project's Supabase storage domain) and baseline security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options`, restrictive `Permissions-Policy`, `Referrer-Policy`).

## 7. Styling

Tailwind 4, CSS-first — there is no `tailwind.config.ts`/`.js`; everything lives in `app/globals.css` and `postcss.config.mjs` (single plugin: `@tailwindcss/postcss`).

`app/globals.css` structure:

- Imports: Inter webfont, `tailwindcss`, `tw-animate-css`, and `shadcn/tailwind.css` (base styles from the `shadcn` npm package itself).
- `@custom-variant dark (&:is(.dark *));` — class-based dark mode, driven by `next-themes`.
- `@theme inline { ... }` — maps CSS variables to Tailwind tokens: full color set (`background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `card`, `popover`, chart-1..5, full sidebar palette), fonts (`--font-sans`, `--font-mono`, `--font-heading`), and a radius scale (`--radius-sm` … `--radius-4xl`, all derived from one `--radius` via `calc()`).
- `:root` / `.dark` blocks define the actual token values, all in **oklch()** color space (e.g. light `--primary: oklch(0.488 0.243 264.376)`, dark `--primary: oklch(0.424 0.199 265.638)`).
- A second `@theme inline` block plus `@keyframes` defines animation tokens (`--animate-collapse-down/up`, `--animate-slide-in-from-right/left`) used by Radix collapsible/sheet transitions.
- `@layer base` sets global border/outline defaults and `body`/`html` font/background wiring, plus MapLibre popup overrides (`.maplibregl-popup-content`/`.maplibregl-popup-tip` stripped of MapLibre's default chrome) — required because `MapPopup`/`MarkerPopup` render their own styled markup inside MapLibre's popup DOM container.

**shadcn config (`components.json`)**: style `radix-nova`, base color `neutral`, CSS variables on, RSC/TSX on, icon library declared as `hugeicons` — though in practice `lucide-react` is the icon set actually used across most components, with `@hugeicons/react` and `react-icons` present as secondary/lightly-used dependencies. Treat `iconLibrary` in `components.json` as aspirational rather than descriptive until the codebase is made consistent.

Per `CLAUDE.md`: component stories wrap in `max-w-200` (800px); page stories use `layout: "fullscreen"` with a `max-w-107.5` (430px) mobile-viewport wrapper and `layout: "fullscreen"`.

## 8. Plugins & Tooling

- **Storybook** (`.storybook/main.ts`): framework `@storybook/nextjs-vite`; only addon is `@storybook/addon-themes`. A custom `viteFinal` loads `.env` via `@next/env`'s `loadEnvConfig` and injects `NEXT_PUBLIC_*` vars into `process.env` at build time so stories can read them (e.g. the Google Maps key).
  - **Cleanup needed**: both `.storybook/preview.ts` and `.storybook/preview.tsx` exist side by side. Both set up `withThemeByClassName` (`light`/`dark` → `.light`/`.dark`, default light) and `controls.matchers`; the `.tsx` version additionally wraps every story in `AuthProvider`. Only one is actually loaded — this duplication should be resolved (keep the `.tsx` version with the `AuthProvider` decorator, delete the other) rather than left as-is.
  - `storybook-dark-mode` is a devDependency but isn't wired into `main.ts` addons or `preview` — dead weight, superseded by `@storybook/addon-themes`.
- **ESLint** (`eslint.config.mjs`, flat config): `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` + `eslint-plugin-storybook` recommended config. No custom rule overrides.
- **Prettier** (`.prettierrc`): double quotes, semicolons, 2-space indent, 100-char print width, ES5 trailing commas. No plugins configured — notably no `prettier-plugin-tailwindcss`, so class ordering in `className` strings isn't auto-sorted despite heavy Tailwind usage.
- **TypeScript** (`tsconfig.json`): `strict: true`, `target: ES2017`, `moduleResolution: bundler`, path alias `@/*` → repo root.

## 9. Known Cleanup Items

For quick reference, things this survey surfaced that aren't addressed here but are worth a follow-up pass:

1. `CLAUDE.md`'s Tech Stack / Project Structure / "Map style selection" sections are stale — should be rewritten to match this document.
2. `react-map-gl` dependency is unused; safe to remove from `package.json` after confirming.
3. Duplicate `preview.ts` / `preview.tsx` in `.storybook/` — consolidate into one.
4. `storybook-dark-mode` devDependency is unused — candidate for removal.
5. `app/(app)/venues/page.tsx` page function is named `ProfilePage` — rename for clarity.
6. `/map` route isn't behind `AuthGuard` while `/` is, despite both rendering the same `MapView` — confirm intent.
7. `components.json`'s `iconLibrary: "hugeicons"` doesn't reflect actual icon usage (`lucide-react` dominates) — either standardize on one icon set or update the config comment/intent.
8. Dual auth paths (Supabase session vs. custom `/auth/login` in `lib/services/auth.ts`) — confirm with backend whether both are still needed.
