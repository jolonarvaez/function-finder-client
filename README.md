# Function Finder

A Next.js web app for discovering music events, venues, and DJs on an interactive map. Event-goers browse what's happening nearby; DJs and hosts publish and manage their own events.

The app is built mobile-first and currently centred on Metro Manila (`MAKATI_CENTER` in `lib/constants.ts`).

---

## Table of contents

- [What it does](#what-it-does)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Routes](#routes)
- [State management](#state-management)
- [The map system](#the-map-system)
- [Styling and design system](#styling-and-design-system)
- [Storybook](#storybook)
- [Scripts](#scripts)
- [CI](#ci)
- [Conventions](#conventions)
- [Known gaps](#known-gaps)

---

## What it does

There are three user roles (`ROLES` in `lib/constants.ts`):

| Role         | What they get                                                                          |
| ------------ | -------------------------------------------------------------------------------------- |
| `event-goer` | Browse the map and event list, filter by genre/date/status, view event and DJ profiles |
| `dj`         | Everything above, plus an Events Manager and the ability to create/edit events         |
| `host`       | Same tooling as a DJ, scoped to venue-hosted events                                    |

Core flows:

1. **Discover** — the map (`/`) plots events as pins; nearby events collapse into clusters that split apart as you zoom in. The list view (`/events`) shows the same filtered set as cards.
2. **Filter** — genre, event status (`live` / `upcoming` / `done`), and a date range. Filters live in one shared store, so the map and list stay in sync.
3. **Onboarding** — a 4-step flow (role → profile → genres → summary) that runs after signup.
4. **Manage** — DJs and hosts create events with images, a location picker with address autocomplete, and a performer lineup.

---

## Tech stack

| Concern            | Choice                                                                           |
| ------------------ | -------------------------------------------------------------------------------- |
| Framework          | Next.js 16 (App Router, Turbopack) + React 19                                    |
| Language           | TypeScript (strict)                                                              |
| Styling            | Tailwind CSS v4, CSS variables for theming                                       |
| Components         | shadcn/ui primitives in `components/ui/`                                         |
| Map                | MapLibre GL + `supercluster` for clustering                                      |
| Auth & storage     | Supabase (auth, avatar/event image buckets)                                      |
| Data               | A separate backend API, proxied through Next (see [Architecture](#architecture)) |
| HTTP               | axios, with a Supabase JWT interceptor                                           |
| State              | Zustand (feature-scoped stores), `next-themes` for theme                         |
| Component workshop | Storybook 10 (`@storybook/nextjs-vite`)                                          |
| Tooling            | ESLint, Prettier                                                                 |

---

## Quick start

**Prerequisites:** Node 20+ and npm.

```bash
git clone <repo-url>
cd function-finder-client
npm install
```

Create `.env.local` in the project root — see [Environment variables](#environment-variables):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_API_URL=https://<your-backend>/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<key>
```

Then:

```bash
npm run dev          # http://localhost:3000
npm run storybook    # http://localhost:6006
```

The app fails fast with a clear error if the Supabase variables are missing (`lib/supabase.ts`). The other two degrade rather than crash: without `NEXT_PUBLIC_API_URL` no backend rewrite is registered and API calls 404; without the Maps key the geocode routes return HTTP 500.

---

## Environment variables

All four are read at build time. There is no committed `.env.example` — this table is the reference.

| Variable                          | Required           | Used by             | Purpose                                                      |
| --------------------------------- | ------------------ | ------------------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`        | Yes                | `lib/supabase.ts`   | Supabase project URL                                         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Yes                | `lib/supabase.ts`   | Supabase public anon key                                     |
| `NEXT_PUBLIC_API_URL`             | Yes                | `next.config.ts`    | Backend origin. Registers the `/api/backend/*` rewrite       |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | For address search | `app/api/geocode/*` | Google Places autocomplete, place details, reverse geocoding |

Basemap tiles come from **Carto** (`basemaps.cartocdn.com`, light + dark styles in `components/ui/map.tsx`) and need no key.

---

## Architecture

### Two backends

The app talks to two separate systems:

```
                    ┌──────────────────────────────┐
   browser ────────▶│  Supabase                    │  auth, session, image storage
                    └──────────────────────────────┘

                    ┌──────────────────────────────┐
   browser ──▶ /api/backend/*  ──rewrite──▶  NEXT_PUBLIC_API_URL
                    └──────────────────────────────┘  events, users, lineups

                    ┌──────────────────────────────┐
   browser ──▶ /api/geocode/*  ──server route──▶  Google Places
                    └──────────────────────────────┘  address search
```

**Supabase** owns identity and file storage. **The backend API** owns domain data (events, users, performers) and is never called directly from the browser — `next.config.ts` rewrites `/api/backend/:path*` to `NEXT_PUBLIC_API_URL/:path*`, so the origin stays out of the client and there is no CORS setup to maintain.

`lib/axios.ts` is the single client for that API. Its request interceptor pulls the current Supabase session and attaches `Authorization: Bearer <jwt>` to every call, reading from the in-memory session cache rather than making a network round-trip.

Endpoints in use: `/auth/login`, `/events`, `/users/*`.

### Auth model

`components/providers/AuthProvider.tsx` wraps the whole app and does something worth understanding:

**Visitors without a session are signed in anonymously.** On first load, if `getSession()` returns nothing, the provider calls `supabase.auth.signInAnonymously()`. That way public pages (map, events) still make authenticated API requests without forcing anyone to register.

This makes the distinction between two flags important:

- `user` — present for both anonymous and real accounts
- `isAuthenticated` — `!!user && !user.is_anonymous`, i.e. **a real account only**

UI that should only appear for registered users must check `isAuthenticated`, not `user`. On `SIGNED_OUT` the provider clears the profile store and immediately signs in anonymously again, so the app never sits in a session-less state.

Profiles are fetched once per real sign-in and cached in `useUserStore`.

### Route protection

`components/auth/AuthGuard.tsx` redirects to `/login?next=<path>` when there's no real account, showing a spinner while auth resolves. It is applied **per page, not per layout** — every page under `/dj/*`, `/host/*`, and `/settings` wraps itself. Adding a new authenticated page means adding the guard explicitly; the `(app)` layout will not do it for you.

### Geocoding proxy

Address autocomplete would otherwise expose a Google key and hit CORS, so three server routes proxy it:

| Route                     | Google endpoint     |
| ------------------------- | ------------------- |
| `app/api/geocode/search`  | Places Autocomplete |
| `app/api/geocode/place`   | Place Details       |
| `app/api/geocode/reverse` | Reverse geocoding   |

`lib/services/geocode/geocode.ts` is the client wrapper.

---

## Project structure

```
app/
  (app)/                  authenticated shell — sidebar + top nav + footer
    page.tsx              map (home)
    map/  events/  venues/  profile/[id]/  settings/
    dj/     create-event, edit-event/[id], event-manager
    host/   create-event, edit-event/[id], event-manager
  (legal)/                standalone shell — privacy, terms
  api/geocode/            server-side Google Places proxy
  login/  signup/  onboarding/  auth/callback/
  layout.tsx              root: fonts, metadata, ThemeProvider, AuthProvider, Toaster
  robots.ts  sitemap.ts

components/
  ui/                     shadcn/ui primitives ONLY — never feature code
  auth/                   login, signup, AuthGuard, user store
  providers/              AuthProvider, ThemeProvider
  sidebar/                app shell: TopNav, AppSidebar, ProfileFooter
  map/                    MapView, markers, filters, geolocation
    clusters/             supercluster hook + cluster bubble marker
  event/                  list, detail, cards, image gallery
    event-form/           create/edit form, location picker, performer selector
  dj/                     DJ-specific event views
  onboarding/             4-step flow + store
  profile/  settings/  venues/  legal/
  shared/                 cross-feature widgets (Logo, GenreSelector, Footer…)
  reusables/              generic helpers (PageContainer, CountrySelect…)

lib/
  axios.ts                API client + JWT interceptor
  supabase.ts             lazily-constructed Supabase client
  constants.ts            roles, genres, categories, countries, map defaults
  utils.ts                cn()
  services/               auth, events, users, storage, geocode
  hooks/

hooks/use-mobile.ts       768px breakpoint hook (drives sidebar behaviour)
stories/                  Storybook, mirroring the components/ tree
```

### Feature-folder rule

Related components are grouped into a feature folder under `components/` rather than left loose at the top level. `components/ui/` is reserved exclusively for shadcn primitives — feature components never go there.

---

## Routes

| Path                                          | Auth        | Description                     |
| --------------------------------------------- | ----------- | ------------------------------- |
| `/`                                           | Public      | Map view (home)                 |
| `/map`                                        | Public      | Same map view                   |
| `/events`                                     | Public      | Filterable event grid           |
| `/events/[id]`                                | Public      | Event detail                    |
| `/venues`                                     | Public      | Venue list                      |
| `/profile/[id]`                               | Public      | Public user profile             |
| `/settings`                                   | **Guarded** | Account, profile, genres, theme |
| `/dj/event-manager`                           | **Guarded** | DJ's events                     |
| `/dj/create-event`, `/dj/edit-event/[id]`     | **Guarded** | DJ event form                   |
| `/host/event-manager`                         | **Guarded** | Host's events                   |
| `/host/create-event`, `/host/edit-event/[id]` | **Guarded** | Host event form                 |
| `/login`, `/signup`                           | Public      | Auth (email + Google OAuth)     |
| `/onboarding`                                 | Post-signup | 4-step setup                    |
| `/auth/callback`                              | —           | OAuth redirect target           |
| `/privacy`, `/terms`                          | Public      | Legal pages                     |

---

## State management

Zustand stores live **beside the feature they belong to**, not in a central store directory.

| Store                | Location                                        | Holds                                                                            |
| -------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------- |
| `useMapFilterStore`  | `components/map/use-map-filter-store.ts`        | Genres, query, event status, date range. Shared by the map _and_ the events list |
| `useUserStore`       | `components/auth/use-user-store.ts`             | Cached profile + loading flag                                                    |
| `useOnboardingStore` | `components/onboarding/use-onboarding-store.ts` | Step, role, display name, bio, country, genres                                   |

Theme is handled by `next-themes` (`ThemeProvider`), not Zustand.

`useMapFilterStore` is the one to know about: because the map and the events page read the same store, changing a filter in one place changes both. Its `setDateRange(type, ref)` derives `startDate`/`endDate` from a `"day" | "week" | "month"` type plus a reference date, so components set intent rather than raw dates.

---

## The map system

### Primitives

`components/ui/map.tsx` is a self-contained MapLibre wrapper exposing a declarative API: `Map`, `MapMarker`, `MarkerContent`, `MarkerPopup`, `MarkerTooltip`, `MarkerLabel`, `MapPopup`, `MapControls`, `MapRoute`, `MapClusterLayer`, and the `useMap` hook.

Markers are real DOM nodes rendered through `createPortal` into a MapLibre `Marker` element — which is what lets `VenueMarker` have a hover flyer card, a pulsing "live" badge, and status-driven colours. A GL layer could not do that.

The map auto-detects light/dark by watching the `<html>` class with a `MutationObserver`, so it follows `next-themes` without being passed a prop.

### Clustering

Nearby events collapse into a bubble that splits apart as you zoom in (`components/map/clusters/`).

- `use-venue-clusters.ts` — wraps `supercluster`. Reads `map.getBounds()` on every `move`, converts to a bbox, and asks for clusters at the current zoom. Because `move` fires every frame, it keys on a rounded bbox/zoom string and bails when nothing meaningful changed.
- `VenueClusterMarker.tsx` — the bubble. A real `<button>` (keyboard-reachable), sized in three steps by event count.

How placement works, briefly: supercluster projects every event into normalised Mercator and precomputes a cluster tree for **every** zoom level up front — zooming just swaps which precomputed set is displayed. Two events merge when they're within **60 screen pixels** of each other, which is why the ground distance that represents halves with each zoom step (~1.1 km at z12, ~550 m at z13, ~280 m at z14). A bubble sits at the **count-weighted average position** of the events inside it, so it generally sits where no single event actually is. Clicking one calls `getClusterExpansionZoom` and eases to exactly the zoom where that cluster breaks apart.

Clustering stops entirely at `maxZoom` (16).

> `MapClusterLayer` in `components/ui/map.tsx` is an _alternative_ implementation using MapLibre's native GeoJSON source clustering. It renders everything as GL circles, so it can't preserve the custom pin design — it is currently **unused**.

### Geolocation

`use-geolocation.ts` wraps `watchPosition` with a `granted | denied | prompt` status. The map silently snaps to the user's location once on load _if permission was already granted before this visit_, without showing the marker or toggle; the explicit toggle animates and shows the marker. Denial surfaces a dismissible banner.

---

## Styling and design system

**All colour comes from CSS variables in `app/globals.css`.** No hex values, no `rgb()`, no Tailwind colour utilities (`blue-500`, `indigo-600`) in components. Anything blue uses `bg-primary` / `text-primary` / `border-primary`.

This is what makes dark mode work: both palettes are defined as variables, so components written against `bg-background`, `text-foreground`, `border-border`, `bg-card`, `bg-muted`, `text-muted-foreground` adapt automatically. **Do not** use Tailwind's `dark:` variant to re-specify a colour the theme already handles.

Other conventions:

- **`cn()`** from `lib/utils.ts` for every conditional or merged class (clsx + tailwind-merge)
- **CVA** (`class-variance-authority`) for multi-variant components
- **`@/`** path alias maps to the project root
- Components are PascalCase, functional, TypeScript, `"use client"` where needed
- Props typed as inline `Readonly<{…}>` or a named `XxxProps` interface
- Accessibility target is WCAG AA: semantic HTML, visible focus states, `aria-label` on icon-only buttons, 44×44px touch targets, `prefers-reduced-motion` respected

Adding a shadcn component:

```bash
npx shadcn@latest add <component>
```

---

## Storybook

Stories mirror the component tree: component stories in `stories/<feature>/`, page-level stories in `stories/Pages/<feature>/`. Titles use `/` to reflect the hierarchy (e.g. `Pages/Event/EventsView`).

Two layout rules:

- **Component stories** wrap the decorator in `<div className="mx-auto max-w-200 bg-background p-6">` so previews never exceed 800px.
- **Page stories** (`stories/Pages/`) use `layout: "fullscreen"` and wrap in `<div className="mx-auto w-full max-w-107.5 overflow-hidden bg-background">` to simulate a 430px mobile viewport. Don't force `dark` — let the theme stay fluid.

For pages that fetch their own data, export a display-only sub-component that takes data as props (e.g. `EventsContent` alongside `EventsView`) and write the story against that. `.storybook/main.ts` forwards `NEXT_PUBLIC_*` variables into the Vite build so Supabase-dependent components don't explode.

---

## Scripts

| Command                   | Does                       |
| ------------------------- | -------------------------- |
| `npm run dev`             | Dev server on :3000        |
| `npm run build`           | Production build           |
| `npm run start`           | Serve the production build |
| `npm run lint`            | ESLint                     |
| `npm run format`          | Prettier, writes in place  |
| `npm run storybook`       | Storybook on :6006         |
| `npm run build-storybook` | Static Storybook build     |

**Run `npm run format` and `npm run lint` after every change and resolve everything before considering work done.**

---

## CI

`.github/workflows/ci.yml` runs on pushes and PRs to `main`: `npm ci` → `npm run lint` → `npm run build`, on Node 20, with the `NEXT_PUBLIC_*` variables supplied from repository secrets. A separate `vulnerability-scan.yml` workflow and Dependabot config also live in `.github/`.

There is currently **no automated test suite** — no unit, integration, or E2E tests run in CI.

---

## Conventions

Project-specific rules are documented in `CLAUDE.md` and summarised above. In short:

1. Group related components into feature folders; keep `components/ui/` for shadcn primitives only.
2. Mirror that structure in `stories/`.
3. Use `cn()` for class merging and CVA for variants.
4. Never hardcode a colour — map it to the nearest `globals.css` variable.
5. Add a Storybook story for every new component and page.
6. Format and lint before finishing.

---

## Known gaps

Worth knowing before you go looking:

- **No tests.** There is no test runner wired up. A Cypress setup (config, support files, auth specs) exists on the separate `cypress` branch but has not been merged.
- **Stadia Maps references are stale.** `CLAUDE.md` documents a `NEXT_PUBLIC_STADIA_API_KEY` and a `StadiaStyleId` type in `lib/maps/types.ts`; neither exists. The map uses keyless Carto basemaps. CI still passes the unused secret.
- **`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is misleadingly named.** It is only read by server routes under `app/api/geocode/`, so the `NEXT_PUBLIC_` prefix is unnecessary and signals the key is browser-safe when it should be server-only. Renaming it to `GOOGLE_MAPS_API_KEY` would match how it's actually used.
- **`storybook-static/` is committed**, so `npm run lint` reports thousands of warnings from bundled vendor code. Scope linting to source (`npx eslint components app lib hooks stories`) for a clean signal.
- **A Supabase storage hostname is hardcoded** in `next.config.ts` (`images.remotePatterns`). Pointing at a different Supabase project needs that updated too.
- **`MapClusterLayer` is dead code** — superseded by `components/map/clusters/`.
