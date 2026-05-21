# UNM Web — Design System

Warm, institutional palette derived from the UNM logo. No pure white or black.

## Section backgrounds

| Tone | Use |
|------|-----|
| `default` / `canvas` | Transparent — page mesh shows through |
| `soft` | Light cream band (`bg-soft`) |
| `alt` | Sand band (`bg-warm-100`) |
| `blush` | Deeper warm accent |
| `dark` | Glass dark band (stats, faculty CTA) |

Use `<SectionWrapper tone="default|soft|alt|blush|dark" />`.

## Brand

- **Primary:** `#B5341A` (terracotta)
- **Secondary:** `#3D1A0B` (chocolate)
- **Ink:** `#1A0A05` (body text)
- **Canvas:** `#FDFAF7`

## Surfaces (single glass system)

Prefer design-system classes over repeating `border` + `bg-white` + `shadow-card`:

| Class | Use |
|-------|-----|
| `.glass` | Base frosted surface |
| `.glass-strong` | Nav dropdown, forms, faculty grid shell |
| `.glass-soft` | Subtle panels |
| `.glass-pill` | Hero proof chips, badges |
| `.glass-dark` | Hero panel, CTA banner, dark sections |
| `.glass-stat` | Stat tiles on dark backgrounds |
| `.card-flat` | Static cards (= `.glass` + radius) |
| `.card-interactive` | Hover-lift cards |
| `.form-panel` | Form shells |
| `.icon-box` | Icon containers |
| `.link-on-dark` | Footer / topbar links |

Layout shells: `.glass-nav`, `.glass-topbar`, `.glass-footer`, `.glass-dropdown`.

## Icons (`components/ui/Icon.tsx`)

Single UNM stroke set (terracotta via `currentColor`) — prefer extending this over a second library.

| Icon | Typical use |
|------|-------------|
| `calendar` / `clock` | Dates, reading time, deadlines |
| `map-pin` | Campus, locations |
| `sparkles` | Partnerships |
| `flask` | Research |
| `newspaper` | News |
| `graduation` / `program` | Programmes, faculties |
| `shield` | Accreditations, trust |

Category chips: `lib/article-category.ts` · domain chips: `lib/domain-icons.ts`.

## Typography

- **Display:** Source Serif 4 — H1–H3
- **UI:** Inter — body, nav, buttons

## Responsive UX

**Default rule for all UI work:** design mobile-first, then enhance from `sm` / `lg` breakpoints. Stack columns, full-width CTAs, and readable type on narrow viewports before adding side-by-side layouts.

- Program cards: `scroll-carousel` below `sm`, grid above
- Section headers: title and action link stack until `lg`
- Hero panels: scaled type (`text-3xl` → `sm:text-4xl` → `text-display-xl`), reduced vertical padding on mobile
- Faculty/program heroes: faculty colour as soft blur accents only — never a full solid brand block behind copy
- `.touch-target` (44px min), safe-area on mobile nav
- `ScrollReveal` + `hero-enter`; respects `prefers-reduced-motion`
