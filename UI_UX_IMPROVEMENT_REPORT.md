# UNM-WWW — UI/UX Improvement Report

**Project:** Université Numérique du Maroc (UNM) marketing site  
**Stack:** Next.js 14 · Tailwind · next-intl (FR/EN) · Payload CMS  
**Audience:** Human development team (design, frontend, content, QA)  
**Goal:** Elevate the site from “competent AI-generated template” to **human-crafted institutional quality** — the kind of polish you expect from Wharton, INSEAD, or a top Moroccan business school, built by developers who care about editorial rhythm, photography, and restraint.

**Date:** May 2026  
**Scope:** `apps/web` (primary); CMS/content implications noted where relevant.

---

## 1. Executive Summary

UNM-WWW already has a **strong anti-slop foundation**: warm neutrals instead of pure white, terracotta/brown brand palette (no purple gradients), Source Serif 4 + Inter typography, flat bordered cards, and intentional comments in code rejecting “SaaS landing page” patterns. The engineering team clearly aimed for institutional credibility.

However, the **live experience still reads as text-first and under-photographed**, with several **consistency and i18n gaps** that undermine trust:

| Area | Status | Impact |
|------|--------|--------|
| Typography system | Implemented in code; **LAUNCH_CHECKLIST contradicts it** | Confuses QA and future contractors |
| Imagery | **5 files** use `next/image`; homepage hero is text-only | Weak first impression; hurts LCP story |
| Mobile conversion | `CTABar` only on program pages; global `pb-20` padding | Uneven mobile UX; wasted safe-area |
| i18n | Many hardcoded FR/EN strings; **404 is French-only** | Broken EN journey |
| Floating CTAs | WhatsApp + CTABar overlap on mobile program pages | Cluttered, unprofessional |
| Social proof | Testimonials CMS supports `avatar`; UI ignores it | Quotes feel anonymous |

**Recommendation:** Treat this as a **three-phase human polish pass** — not a redesign. Keep the existing palette, type scale, and component architecture. Add photography, fix i18n/CTA collisions, align documentation, and extend the design system so every page feels edited by a communications team, not generated.

**Estimated effort (team of 1 designer + 1–2 frontend devs):**

- **Phase 1:** 1–2 days — doc alignment, i18n extraction, 404, CTA collision fix  
- **Phase 2:** ~1 week — hero imagery, testimonial photos, global mobile CTA strategy, image audit  
- **Phase 3:** 2+ weeks — design system docs, page-by-page imagery, Lighthouse mobile pass, CMS editorial workflow

---

## 2. Design Philosophy — Human-Crafted Institutional Site

### 2.1 What “human-crafted” means for UNM

This site should feel like it was built by **UNM’s communication service + a senior frontend contractor**, not by a generic “university website” prompt. Concretely:

| Do | Don’t |
|----|-------|
| Real campus and classroom photography (Marrakech, Laâyoune) | Stock “diverse students laughing” or AI faces |
| Source Serif 4 headlines + Inter UI at modest sizes | Cormorant Garamond, DM Sans, Playfair (reads as AI 2023–2024) |
| `#FDFAF7` warm backgrounds, `#B5341A` / `#3D1A0B` only | Purple/violet accents, blue-gray neutrals, neon gradients |
| Flat `border-warm-200` cards, thin rules, eyebrows | Identical 3-column card grids with drop shadows and icons |
| Editorial section rhythm: eyebrow → H2 → prose → CTA | Hero with 72px headline + radial gradient blob |
| “En préparation” / “In preparation” for upcoming faculties | “Bientôt”, “Coming soon!” with countdown timers |
| Uppercase nav with tight tracking (HBS/Wharton) | Rounded pill nav, hamburger-only desktop |
| One primary conversion path per viewport | Three competing floating buttons |

### 2.2 Reference anchors (mood, not copy)

- **Editorial:** Financial Times, Bloomberg Education, Wharton executive education PDFs  
- **Structure:** INSEAD program pages, Stanford GSB executive programs  
- **Moroccan context:** Authentic architecture, faculty portraits, partnership ceremony photos — not generic “Africa tech” stock

### 2.3 Brand tokens (source of truth)

Already codified — **do not drift**:

- `apps/web/tailwind.config.ts` — colors, `fontFamily`, `fontSize` display scale  
- `apps/web/app/globals.css` — base layer, `.eyebrow`, `.card-flat`, `.container-page`  
- `HANDOVER.md` §9 — architectural decisions (typography, colors, faculty wording)

---

## 3. Current State — Strengths & Gaps

### 3.1 Strengths (keep and extend)

1. **Anti-AI visual baseline**  
   - Warm palette, no pure white/black, restrained shadows (`tailwind.config.ts`)  
   - Comments in `HeroSection.tsx`, `FacultyGrid.tsx`, `ProgramHero.tsx` document intent  
   - DBA section uses dedicated editorial components (`apps/web/components/dba/`)

2. **Information architecture**  
   - Clear locale routing: FR unprefixed, EN under `/en` (`apps/web/i18n.ts`)  
   - Program canonical URLs + `/dba` 301 redirects (`apps/web/next.config.js`)  
   - JSON-LD on program pages (`apps/web/lib/schema.ts`, `JsonLd.tsx`)

3. **Component quality**  
   - Two-tier header (`Header.tsx`, `TopBar.tsx`, `Nav.tsx`)  
   - Program page layout: hero + sticky sidebar CTA + sections (`programmes/[slug]/page.tsx`)  
   - Forms use React Hook Form + Zod with rate limiting (`apps/web/lib/rate-limit.ts`)

4. **Accessibility baseline**  
   - Skip link, `focus-visible` rings, `prefers-reduced-motion` in globals  
   - Testimonials slider respects reduced motion (`TestimonialsSlider.tsx`)

5. **i18n infrastructure**  
   - `messages/fr.json` and `messages/en.json` cover nav, home, program, forms  
   - `next-intl` wired in locale layout

### 3.2 Gaps (prioritized)

| Gap | Evidence | User impact |
|-----|----------|-------------|
| **Doc/implementation typo mismatch** | `LAUNCH_CHECKLIST.md` L12 cites Cormorant Garamond + DM Sans; code uses Source Serif 4 + Inter | QA signs off wrong fonts |
| **Sparse imagery** | Only 5 imports of `next/image` in `apps/web` | Site feels like a wireframe |
| **Text-only homepage hero** | `HeroSection.tsx` — no photo, no texture | Weak brand moment |
| **CTABar scope** | `CTABar` only in `programmes/[slug]/page.tsx` | Mobile users on home/admissions lack sticky apply |
| **Layout `pb-20`** | `app/[locale]/layout.tsx` L93 — padding for bar that isn’t global | Awkward bottom whitespace on most pages |
| **404 French-only** | `app/not-found.tsx` | EN users hit French error |
| **Hardcoded i18n** | admissions, footer, ApplicationForm, programmes index, program page `L` object, HeroSection eyebrow, etc. | Maintenance debt; inconsistent EN |
| **WhatsApp vs CTABar** | `WhatsAppButton` `bottom-20` on mobile; CTABar `z-20` fixed bottom on program pages | Two WhatsApp entry points; overlap |
| **Testimonials without photos** | CMS `avatar` field unused in `TestimonialsSlider.tsx` | Low trust social proof |
| **Lighthouse CI desktop-only** | `lighthouserc.json` preset `desktop` | Mobile perf regressions undetected |
| **OG image / favicon** | Checklist items; verify assets in `public/` | Weak social sharing |

---

## 4. Full Improvement Backlog

### 4.1 Visual design & brand consistency

| ID | Item | Notes |
|----|------|-------|
| V-01 | Align `LAUNCH_CHECKLIST.md` typography with implementation | Replace Cormorant/DM Sans/Source Sans 3 with Source Serif 4 + Inter |
| V-02 | Audit all pages for forbidden colors (blue, purple, cool gray) | Use grep + visual pass |
| V-03 | Replace text-only homepage hero with editorial photo + optional thin rule | Marrakech campus or executive classroom; preload LCP image |
| V-04 | Add faculty/program hero images from CMS | Extend Payload `Programs` / `Faculties` media fields if missing |
| V-05 | Standardize on `.eyebrow` class vs ad-hoc `font-heading uppercase` | Many components duplicate eyebrow styles |
| V-06 | Create `/public/og-image.jpg` (1200×630) with real photography | Referenced in `layout.tsx` metadata |
| V-07 | Favicon set from logo mark | `app/icon.svg` exists; verify `.ico` + PNG variants |
| V-08 | Partner logos: prefer SVG/PNG via `next/image` | `PartnerLogos.tsx` already uses Image; audit alt text |
| V-09 | President’s letter page: verify portrait uses optimized Image | `universite/mot-du-president/page.tsx` |
| V-10 | DBA page: add 1–2 authentic partnership/campus photos | `HeroDBA.tsx` is strong typographically but still image-light |

### 4.2 UX & navigation

| ID | Item | Notes |
|----|------|-------|
| N-01 | Define global mobile conversion bar strategy | Apply on admissions, home, faculties — or document why program-only |
| N-02 | Resolve `pb-20` on `<main>` — tie to CTABar presence or remove | `layout.tsx` L93 |
| N-03 | Fix WhatsApp + CTABar collision on program pages | Hide floating WhatsApp when CTABar visible, or merge into bar |
| N-04 | Ensure registration ≤ 2 clicks from any page | Walk nav tree; add persistent Apply in `TopBar` on mobile if needed |
| N-05 | Breadcrumb i18n — move Home/Accueil to messages | `programmes/page.tsx`, `admissions/page.tsx` |
| N-06 | Search modal: i18n for “Recent” / “Récent” | `SearchModal.tsx` |
| N-07 | Faculty grid hardcoded eyebrow | `FacultyGrid.tsx` L28–29 |
| N-08 | Featured programs “View all” | `FeaturedPrograms.tsx` |
| N-09 | Sticky program CTA vs mobile CTABar — clarify hierarchy | `StickyProgramCTA.tsx` desktop; `CTABar.tsx` mobile |

### 4.3 Content & imagery

| ID | Item | Notes |
|----|------|-------|
| C-01 | Commission photoshoot: campus, classrooms, graduation, EBS partnership | Brief comms team |
| C-02 | Wire CMS `Testimonials.avatar` to UI | `Testimonials.ts` → `TestimonialsSlider.tsx` |
| C-03 | News articles: hero image required in CMS workflow | `actualites/[slug]/page.tsx` uses Image |
| C-04 | Events page: replace placeholder copy with CMS-driven events | `universite/evenements/page.tsx` has hardcoded events |
| C-05 | Stats bar: verify numbers with comms; add source footnote if needed | `StatsBar.tsx` |
| C-06 | Manifeste / president pages: editorial pull quotes with real signatures | Typography already strong |

### 4.4 Forms & conversion

| ID | Item | Notes |
|----|------|-------|
| F-01 | ApplicationForm step labels i18n | `STEP_LABELS` French-only in `ApplicationForm.tsx` |
| F-02 | Format enum `Présentiel|Distanciel|Hybride` — localize display labels | Schema L26 |
| F-03 | Application reference ID — use server-returned ID, not `Math.random()` | `ApplicationForm.tsx` L94 |
| F-04 | Brochure download gating — verify email capture flow | `BrochureDownload.tsx` |
| F-05 | UTM capture on all lead forms | Per `LAUNCH_CHECKLIST.md` |
| F-06 | GDPR consent copy in both locales — audit all forms | `LeadForm`, `ContactForm`, `NewsletterForm`, `ApplicationForm` |
| F-07 | Form error states: ensure visible, translatable messages | `Input.tsx`, `Select.tsx` |

### 4.5 Mobile

| ID | Item | Notes |
|----|------|-------|
| M-01 | Global CTABar or contextual bottom bar | See N-01 |
| M-02 | Safe-area insets for iOS (`env(safe-area-inset-bottom)`) | CTABar, WhatsApp |
| M-03 | Touch targets ≥ 44px on mobile nav and CTABar | `MobileNav.tsx`, `CTABar.tsx` (h-14 = 56px ✓) |
| M-04 | Test program page scroll with sticky anchor nav + CTABar | `StickyAnchorNav.tsx` on DBA |
| M-05 | Lighthouse mobile preset in CI | `lighthouserc.json` |

### 4.6 Internationalization (i18n)

| ID | Item | Notes |
|----|------|-------|
| I-01 | 404 page: `useLocale` or middleware-detected locale | `app/not-found.tsx` |
| I-02 | Move Footer tagline + accreditation heading + legal link labels to messages | `Footer.tsx` L83–85, L113, L137–141 |
| I-03 | Admissions page title, description, breadcrumb, intro | `admissions/page.tsx` |
| I-04 | Programs index empty state + breadcrumbs | `programmes/page.tsx` |
| I-05 | Program detail section labels object `L` | `programmes/[slug]/page.tsx` L64–74 |
| I-06 | ApplicationForm: steps, recap heading, reference prefix | `ApplicationForm.tsx` |
| I-07 | HeroSection eyebrow “UNM · Maroc/Morocco” | `HeroSection.tsx` L16–17 |
| I-08 | Skip link text — move to messages | `layout.tsx` L90 |
| I-09 | CallbackRequestForm inline strings | `CallbackRequestForm.tsx` |
| I-10 | BrochureDownload CTA string | `BrochureDownload.tsx` L80 |
| I-11 | University page campus labels | `universite/page.tsx` |
| I-12 | Contact page FAQ/campus copy | `contact/page.tsx` |
| I-13 | Add ESLint rule or script: fail CI on `locale === 'en' ?` in components (allow utils) | Prevent regression |

### 4.7 Accessibility (A11y)

| ID | Item | Notes |
|----|------|-------|
| A-01 | Testimonial tab buttons: descriptive `aria-label` (author name) | `TestimonialsSlider.tsx` L51 |
| A-02 | CTABar: ensure focus order and visible focus on three actions | `CTABar.tsx` |
| A-03 | WhatsApp floating button: locale-specific `aria-label` from messages | `WhatsAppButton.tsx` |
| A-04 | Color contrast audit on `text-secondary-400` on `warm-50` | Especially footer links `text-warm-200` |
| A-05 | Modal focus trap audit | `SearchModal.tsx`, `Modal.tsx` |
| A-06 | Program FAQ accordion: `aria-expanded` on toggles | `ProgramFAQ.tsx` |
| A-07 | Run axe-core in CI on key routes | Extend `.github/workflows/` |

### 4.8 Performance

| ID | Item | Notes |
|----|------|-------|
| P-01 | Migrate all `<img>` and raw URLs to `next/image` | Audit `apps/web` |
| P-02 | Preload homepage hero image | `<link rel="preload" as="image">` in layout or page |
| P-03 | Font loading: consider `next/font` for Inter + Source Serif 4 | Reduce Google Fonts render-blocking; `layout.tsx` L75–85 |
| P-04 | `optimizePackageImports` already for lucide — audit bundle per route | `next.config.js` |
| P-05 | ISR `revalidate = 300` — confirm acceptable for launch traffic | Page files |
| P-06 | Image sizes from CMS: document max dimensions for editors | `CONTENT_MANAGEMENT.md` |
| P-07 | Add mobile Lighthouse job | `lighthouserc.json`, `.github/workflows/lighthouse.yml` |

### 4.9 Design system

| ID | Item | Notes |
|----|------|-------|
| D-01 | Document tokens in `DESIGN_SYSTEM.md` (new) | Mirror `tailwind.config.ts` |
| D-02 | Component Storybook or internal `/design-system` route (optional) | Button, Badge, Card, SectionWrapper |
| D-03 | Consolidate `font-heading` = Inter (already) — rename to `font-sans` in new code | Reduce alias confusion |
| D-04 | Button variants audit: primary/ghost/secondary usage | `Button.tsx` |
| D-05 | Badge variants for program types | `Badge.tsx` |
| D-06 | Section spacing scale: `SectionWrapper` padding standards | `SectionWrapper.tsx` |

### 4.10 Documentation

| ID | Item | Notes |
|----|------|-------|
| DOC-01 | Fix `LAUNCH_CHECKLIST.md` typography line | P0 |
| DOC-02 | Add “Photography brief” appendix for comms | New section in this report or `CONTENT_MANAGEMENT.md` |
| DOC-03 | Cross-link this report from `README.md` | |
| DOC-04 | Editor guide: when to use hero image vs text hero | `CONTENT_MANAGEMENT.md` |

---

## 5. Priority Matrix (P0 / P1 / P2)

Effort: **S** ≤ 2h · **M** ≤ 1 day · **L** ≥ 2 days

| ID | Priority | Effort | Owner hint |
|----|----------|--------|------------|
| V-01 / DOC-01 | **P0** | S | Dev |
| I-01 (404) | **P0** | S | Dev |
| N-03 WhatsApp/CTABar overlap | **P0** | S | Dev |
| I-02–I-06 critical i18n (footer, admissions, programs, ApplicationForm, not-found) | **P0** | M | Dev |
| N-02 `pb-20` fix | **P0** | S | Dev |
| F-03 application reference ID | **P0** | S | Dev |
| V-03 Homepage hero imagery | **P1** | M | Design + Dev |
| C-02 Testimonial avatars | **P1** | M | Dev + Content |
| N-01 Global mobile CTA strategy | **P1** | M | Design + Dev |
| P-01 Image audit + next/image | **P1** | L | Dev |
| P-03 next/font migration | **P1** | M | Dev |
| M-05 Mobile Lighthouse CI | **P1** | S | DevOps |
| V-06 OG image | **P1** | M | Design |
| I-13 i18n lint rule | **P1** | M | Dev |
| A-01–A-06 a11y fixes | **P1** | M | Dev |
| C-01 Photo commission | **P2** | L | Comms |
| V-04 Program/faculty hero images | **P2** | L | Design + CMS |
| D-01 Design system doc | **P2** | M | Design + Dev |
| C-04 Events CMS-driven | **P2** | L | Dev + CMS |
| P-07 axe in CI | **P2** | M | DevOps |
| D-02 Storybook | **P2** | L | Dev |

---

## 6. Page-by-Page Checklist

Use this as a QA walkthrough (FR + EN). Status: ☐ = to verify/improve.

### Global (all pages)

| Check | FR | EN | Files |
|-------|----|----|-------|
| Skip link works | ☐ | ☐ | `app/[locale]/layout.tsx` |
| Header sticky + TopBar links | ☐ | ☐ | `components/layout/Header.tsx`, `TopBar.tsx` |
| Footer links + newsletter | ☐ | ☐ | `components/layout/Footer.tsx` |
| Language switcher preserves path | ☐ | ☐ | `components/layout/Nav.tsx` |
| No bottom CTA overlap | ☐ | ☐ | `CTABar.tsx`, `WhatsAppButton.tsx` |
| Meta title/description unique | ☐ | ☐ | per-page `generateMetadata` |
| JSON-LD valid (where applicable) | ☐ | ☐ | `lib/schema.ts` |

### Home `/` · `/en`

| Check | Notes | Files |
|-------|-------|-------|
| Hero has photography or approved visual | Text-only today | `components/home/HeroSection.tsx` |
| Faculty grid shows 1 active + 3 “En préparation” | ☐ | `components/home/FacultyGrid.tsx` |
| Featured programs link works | ☐ | `components/home/FeaturedPrograms.tsx` |
| Testimonials show avatar photos | ☐ | `components/home/TestimonialsSlider.tsx` |
| Partner logos optimized | ☐ | `components/home/PartnerLogos.tsx` |
| CTA banner converts | ☐ | `components/home/CTABanner.tsx` |

### Programs index `/programmes` · `/en/programs`

| Check | Files |
|-------|-------|
| Filters shareable (query string) | `components/shared/ProgramFilter.tsx` |
| Empty state translated | `app/[locale]/programmes/page.tsx` |
| Breadcrumb i18n | same |

### Program detail `/programmes/[slug]`

| Check | Files |
|-------|-------|
| Hero + sticky CTA desktop | `ProgramHero.tsx`, `StickyProgramCTA.tsx` |
| Mobile CTABar no overlap | `CTABar.tsx`, layout `pb-20` |
| Brochure gate | `BrochureDownload.tsx` |
| FAQ accordion a11y | `ProgramFAQ.tsx` |
| Section labels i18n | `programmes/[slug]/page.tsx` |
| Related programs | `RelatedPrograms.tsx` |

### Faculties `/facultes` · `/facultes/[slug]`

| Check | Files |
|-------|-------|
| Hero image when available | `components/faculty/FacultyHero.tsx` |
| Coming soon faculties styled separately | `FacultyComingSoon.tsx`, `FacultiesShowcase.tsx` |
| Programs list | `components/faculty/ProgramsList.tsx` |

### Admissions `/admissions`

| Check | Files |
|-------|-------|
| All copy in messages | `app/[locale]/admissions/page.tsx` |
| 5-step form i18n + validation | `components/forms/ApplicationForm.tsx` |
| File upload limits communicated | same |
| Success state shows real reference | same |

### University section

| Page | Key checks | Files |
|------|------------|-------|
| `/universite` | Campus copy i18n, imagery | `app/[locale]/universite/page.tsx` |
| Mot du président | Portrait optimized | `universite/mot-du-president/page.tsx` |
| Manifeste | Editorial layout | `universite/manifeste/page.tsx` |
| Événements | CMS-driven events | `universite/evenements/page.tsx` |
| Newsroom | Press contacts | `universite/newsroom/page.tsx` |

### News `/actualites`

| Check | Files |
|-------|-------|
| List thumbnails | `app/[locale]/actualites/page.tsx` |
| Article hero image | `actualites/[slug]/page.tsx` |

### Contact `/contact`

| Check | Files |
|-------|-------|
| Forms + FAQ i18n | `app/[locale]/contact/page.tsx`, `ContactForm.tsx` |
| Campus map embed accessible | contact page |

### DBA (redirects to program)

| Check | Files |
|-------|-------|
| Redirect 301 works | `next.config.js` |
| DBA components render on program slug | `components/dba/*` |

### Legal

| Page | Files |
|------|-------|
| CGU, CGV, confidentialité, mentions | `app/[locale]/cgu/page.tsx`, etc. + `lib/legal/*` |

### 404

| Check | Files |
|-------|-------|
| Bilingual copy | `app/not-found.tsx` |
| Branded layout (inherits root layout?) | verify |

---

## 7. Roadmap

### Phase 1 — Quick wins (1–2 days)

**Focus:** Trust, consistency, no new visual design.

1. Fix `LAUNCH_CHECKLIST.md` typography (V-01)  
2. Bilingual `not-found.tsx` (I-01)  
3. Extract P0 i18n strings to `messages/fr.json` + `en.json` (I-02–I-06)  
4. WhatsApp hidden on mobile when `CTABar` mounted; or single WhatsApp in bar (N-03)  
5. Adjust `main` `pb-20` to apply only when bottom bar present (N-02)  
6. Fix application reference to use API response (F-03)  
7. CTABar “WhatsApp” label → `common.whatsapp` in messages (i18n)

**Deliverables:** PR with i18n + CTA fixes; updated checklist; no new assets required.

### Phase 2 — Visual & conversion (1 week)

**Focus:** Photography, social proof, mobile conversion.

1. Homepage hero image + preload (V-03, P-02)  
2. Testimonial avatars in slider (C-02)  
3. Global mobile CTA decision implemented (N-01, M-01)  
4. `next/image` pass on remaining content images (P-01)  
5. OG image + favicon pack (V-06, V-07)  
6. `next/font` for Inter + Source Serif 4 (P-03)  
7. Mobile Lighthouse in CI (M-05)  
8. P1 a11y fixes (A-01–A-06)

**Deliverables:** Asset folder in CMS; updated home + testimonials; CI green on mobile Lighthouse (target pages).

### Phase 3 — Institutional depth (2+ weeks)

**Focus:** Design system, CMS editorial workflow, full page polish.

1. `DESIGN_SYSTEM.md` + photography brief (D-01, DOC-02)  
2. Program + faculty hero images from CMS (V-04, C-01)  
3. Events collection + page refactor (C-04)  
4. i18n ESLint guard (I-13)  
5. axe-core in CI (P-07)  
6. Page-by-page checklist sign-off (Section 6)  
7. Content editor training update (`CONTENT_MANAGEMENT.md`)

**Deliverables:** Signed page checklist; design system doc; comms-approved image set.

---

## 8. Acceptance Criteria per Phase

### Phase 1

- [ ] `LAUNCH_CHECKLIST.md` L12 matches `tailwind.config.ts` + `globals.css`  
- [ ] `/en/*` 404 shows English copy; FR shows French  
- [ ] Zero `locale === 'en' ?` in: `Footer.tsx`, `admissions/page.tsx`, `programmes/page.tsx`, `ApplicationForm.tsx` (step labels), `not-found.tsx`  
- [ ] On program mobile: only one WhatsApp entry visible; no overlap with CTABar  
- [ ] Non-program pages: no excessive bottom padding unless CTABar shown  
- [ ] Application success shows server-generated reference ID  
- [ ] `pnpm lint` and existing CI pass

### Phase 2

- [ ] Homepage LCP element is hero image (or documented exception) with `next/image` + priority  
- [ ] ≥ 80% of content images use `next/image` with dimensions  
- [ ] Testimonials display `avatar` when present in CMS  
- [ ] Mobile Lighthouse ≥ 90 on Home + Program detail (manual or CI)  
- [ ] OG preview correct in LinkedIn/Facebook debugger  
- [ ] Fonts self-hosted or via `next/font` with `display: swap`

### Phase 3

- [ ] `DESIGN_SYSTEM.md` published and linked from `README.md`  
- [ ] Section 6 checklist 100% signed for launch pages  
- [ ] Events page pulls from CMS  
- [ ] i18n regression script in CI  
- [ ] axe-core no critical violations on: Home, Programs index, Program detail, Admissions, Contact  
- [ ] Stakeholder sign-off: comms (imagery), legal (forms), admissions (conversion flows)

---

## 9. Codebase File References

### Design tokens & global styles

| Path | Purpose |
|------|---------|
| `apps/web/tailwind.config.ts` | Colors, typography, spacing, shadows |
| `apps/web/app/globals.css` | Base styles, `.eyebrow`, `.card-flat`, `.container-page` |
| `apps/web/app/[locale]/layout.tsx` | Fonts, skip link, `main` padding, WhatsApp, Plausible |
| `HANDOVER.md` | Architectural decisions (§9) |
| `LAUNCH_CHECKLIST.md` | Pre-launch QA (**needs typo fix**) |

### Layout & navigation

| Path | Purpose |
|------|---------|
| `apps/web/components/layout/Header.tsx` | Sticky two-tier header |
| `apps/web/components/layout/TopBar.tsx` | Utility bar + apply |
| `apps/web/components/layout/Nav.tsx` | Desktop nav |
| `apps/web/components/layout/MobileNav.tsx` | Mobile menu |
| `apps/web/components/layout/Footer.tsx` | Footer columns (**hardcoded i18n**) |
| `apps/web/components/layout/Logo.tsx` | Brand mark |

### Home

| Path | Purpose |
|------|---------|
| `apps/web/app/[locale]/page.tsx` | Home composition |
| `apps/web/components/home/HeroSection.tsx` | Text-only hero |
| `apps/web/components/home/FacultyGrid.tsx` | Faculty grid |
| `apps/web/components/home/FeaturedPrograms.tsx` | Featured programs |
| `apps/web/components/home/StatsBar.tsx` | Stats |
| `apps/web/components/home/TestimonialsSlider.tsx` | Testimonials (**no avatar**) |
| `apps/web/components/home/PartnerLogos.tsx` | Partners (**uses next/image**) |
| `apps/web/components/home/CTABanner.tsx` | Bottom CTA strip |
| `apps/web/components/home/EBSPartnership.tsx` | Partnership block |

### Programs

| Path | Purpose |
|------|---------|
| `apps/web/app/[locale]/programmes/page.tsx` | Programs index |
| `apps/web/app/[locale]/programmes/[slug]/page.tsx` | Program detail + **CTABar** |
| `apps/web/components/programs/ProgramHero.tsx` | Program hero (no image) |
| `apps/web/components/programs/StickyProgramCTA.tsx` | Desktop sticky CTA |
| `apps/web/components/shared/CTABar.tsx` | Mobile 3-column bar |
| `apps/web/components/shared/BrochureDownload.tsx` | Brochure gate |
| `apps/web/components/shared/WhatsAppButton.tsx` | Floating WhatsApp |

### Forms

| Path | Purpose |
|------|---------|
| `apps/web/app/[locale]/admissions/page.tsx` | Admissions (**hardcoded i18n**) |
| `apps/web/components/forms/ApplicationForm.tsx` | 5-step application |
| `apps/web/components/forms/LeadForm.tsx` | Lead capture |
| `apps/web/components/forms/ContactForm.tsx` | Contact |
| `apps/web/components/forms/NewsletterForm.tsx` | Footer newsletter |
| `apps/web/app/api/applications/route.ts` | Application API |

### i18n

| Path | Purpose |
|------|---------|
| `apps/web/i18n.ts` | next-intl config |
| `apps/web/messages/fr.json` | French strings |
| `apps/web/messages/en.json` | English strings |
| `apps/web/app/not-found.tsx` | 404 (**French-only**) |
| `apps/web/lib/utils.ts` | `localized()`, path helpers |

### CMS (content model)

| Path | Purpose |
|------|---------|
| `apps/cms/src/collections/Testimonials.ts` | `avatar` field unused in UI |
| `apps/cms/src/collections/Programs.ts` | Program content |
| `apps/cms/src/collections/Faculties.ts` | Faculty content |
| `apps/cms/src/collections/Articles.ts` | News |
| `apps/cms/src/globals/SiteSettings.ts` | Site-wide settings |

### Performance & CI

| Path | Purpose |
|------|---------|
| `apps/web/next.config.js` | Images, redirects, headers |
| `lighthouserc.json` | Lighthouse CI thresholds |
| `.github/workflows/lighthouse.yml` | CI workflow |
| `.github/workflows/ci.yml` | Main CI |

### API & data

| Path | Purpose |
|------|---------|
| `apps/web/lib/api.ts` | CMS fetch (`getTestimonials`, etc.) |
| `apps/web/lib/schema.ts` | JSON-LD schemas |

### Documentation (project)

| Path | Purpose |
|------|---------|
| `README.md` | Project overview |
| `ARCHITECTURE.md` | System design |
| `CONTENT_MANAGEMENT.md` | Editor guide |
| `DEPLOYMENT.md` | Deploy guide |
| `UI_UX_IMPROVEMENT_REPORT.md` | **This document** |

---

## Appendix A — Anti-AI-Slop Quick Reference

When reviewing any new component or page, reject if you see:

- Purple/indigo/blue gradient heroes  
- Floating abstract blobs or “mesh gradients”  
- Identical icon-in-circle feature grids (4×)  
- `rounded-2xl shadow-xl` on every card  
- Inter + Playfair or Cormorant pairing  
- Stock photos with visible watermarks or obvious AI artifacts  
- “Lorem ipsum” or generic “Transform your career” without UNM specifics  
- Three competing sticky/floating CTAs  

Prefer: real photos, eyebrows, thin borders, serif headlines at **modest** sizes (`display-xl` clamp), one clear primary action.

---

## Appendix B — Suggested `messages` keys (Phase 1)

Add namespaces to reduce hardcoding (examples):

```json
// fr.json additions (illustrative)
{
  "notFound": {
    "eyebrow": "404",
    "title": "Page introuvable",
    "description": "La page que vous recherchez n'existe pas ou a été déplacée.",
    "home": "Retour à l'accueil"
  },
  "admissions": {
    "title": "Admissions",
    "intro": "Complétez votre candidature en cinq étapes..."
  },
  "application": {
    "steps": ["Identité", "Profil académique", "Programme", "Documents", "Récapitulatif"],
    "recap": "Récapitulatif",
    "referencePrefix": "Référence :"
  }
}
```

Mirror in `en.json`. Wire in components listed in Section 4.6.

---

## Appendix C — Photography Brief (for Communications)

**Deliver to comms / photographer before Phase 2:**

1. **Homepage hero:** Wide landscape, Marrakech campus exterior or executive seminar room; warm natural light; no staged handshake clichés.  
2. **Faculties:** One image per active faculty (or abstract architectural detail per pole).  
3. **Programs:** Optional banner per flagship program (MBA, DBA).  
4. **Testimonials:** Headshot per quoted alumnus (min 400×400, consistent crop).  
5. **President / leadership:** Official portrait for Mot du Président.  
6. **Partners:** Logos SVG/PNG; ceremony photo for EBS partnership block.  

**Technical:** JPEG/WebP, sRGB, max 2400px wide; alt text FR+EN in CMS.

---

*End of report. For implementation tracking, link PRs to IDs (e.g. `V-03`, `I-01`) in commit messages.*
