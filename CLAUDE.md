# Function Finder Client

A Next.js web app for discovering music venues and DJs, featuring an interactive map interface.

## Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run storybook    # Start Storybook (port 6006)
npm run build-storybook  # Build Storybook
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (strict)
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix Nova style)
- **Maps**: MapLibre GL + react-map-gl + Stadia Maps API
- **Icons**: Lucide React + HugeIcons
- **Theming**: next-themes (light/dark)
- **Dev**: Storybook 10 (Vite)

## Project Structure

```
app/                    # Next.js App Router pages and layouts
  components/maps/      # Map-specific components
app/map/page.tsx        # Map page route
components/             # Shared feature components
  ui/                   # shadcn/ui primitives
lib/
  maps/                 # Stadia Maps helpers and types
  utils.ts              # cn() utility (clsx + tailwind-merge)
stories/                # Storybook stories
.storybook/             # Storybook config
```

## Conventions

- **Components**: PascalCase, functional with TypeScript, `"use client"` where needed
- **Props**: Typed as `Readonly<{...}>` inline or as `XxxProps` interface
- **Styling**: Always use `cn()` from `lib/utils.ts` for conditional/merged classes
- **Variants**: Use `class-variance-authority` (CVA) for multi-variant components
- **Path alias**: `@/` maps to the project root
- **Stories**: Mirror component files with `.stories.tsx` suffix in `stories/`

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_STADIA_API_KEY` | Stadia Maps API key (falls back to MapLibre demo tiles) |

## State Management

No global state library. Use:
- `useState` for local component state
- Props + callbacks for parent-child communication
- `next-themes` context for theme state

## Key Patterns

**Adding a shadcn component**: `npx shadcn@latest add <component>`

**Using the cn utility**:
```ts
import { cn } from "@/lib/utils"
className={cn("base-classes", condition && "conditional-class", className)}
```

**Map style selection**: Use `StadiaStyleId` union type from `lib/maps/types.ts` for type-safe style IDs.

**New components**: Add a corresponding Storybook story in `stories/` for isolated development.

---

# Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Components & Styling
- **Use shadcn/ui components** from `components/ui/` before building anything custom. Check what's available there first.
- **Rely on `globals.css`** for all colors, spacing tokens, and theme variables — do not hardcode hex values or invent new CSS variables.
- **Dark mode**: use the CSS variables defined in `globals.css` (e.g. `bg-background`, `text-foreground`, `border`) so components automatically adapt. Never use Tailwind's `dark:` variant to duplicate color values already handled by the theme.
- **Primary color**: use `bg-primary`, `text-primary`, `border-primary`, etc. for anything blue. Never use Tailwind blue/indigo/sky utilities (e.g. `blue-500`, `indigo-600`) — always defer to the `--primary` variable.
- **Strictly no raw colors**: do not use any hardcoded hex values, `rgb()`, or Tailwind color utilities for UI colors. Every color must come from a `globals.css` CSS variable. This is non-negotiable for dark mode compatibility.
- **Mapping raw colors**: if given a hex or `rgb()` value, read `globals.css`, find the closest matching CSS variable by visual similarity, and use that variable instead. Never use the raw value as-is.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
