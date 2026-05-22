# UNM — Pre-Launch Checklist

Every item below is verified by a named owner before sign-off. Tick the box, add the owner's initials, date the line.

---

## Brand & Visual Identity

- [ ] Logo displayed correctly on all pages (white or `warm-50` `#FDFAF7` background only — never on colored backgrounds)
- [ ] Primary color `#B5341A` applied consistently to all CTAs, active states, links, and badges
- [ ] Dark brown `#3D1A0B` used for headings, nav background, and footer — no blue, purple, or cool grays anywhere
- [ ] Typography: Source Serif 4 on display headings, Inter on UI and body (`tailwind.config.ts`, `globals.css`)
- [ ] No pure white (`#FFFFFF`) backgrounds in user-facing pages — all warm tones
- [ ] No pure black (`#000000`) text — body uses `ink` (`#1A0A05`)
- [ ] Favicon generated from UNM logo mark and placed at `/favicon.ico` + PNG variants
- [ ] OG image (`/og-image.jpg`, 1200×630) generated and uses brand palette

## Performance

- [ ] Lighthouse score ≥ 90 on **mobile** for Home, Program Detail, Faculty Detail
- [ ] LCP ≤ 2.5s on simulated 3G (Lighthouse CI passes)
- [ ] CLS < 0.1 on every measured page
- [ ] INP < 200 ms via Plausible RUM
- [ ] All images use `next/image` with explicit `width` + `height` or `fill` with aspect-ratio container
- [ ] No render-blocking fonts (preconnect + display=swap configured)
- [ ] Above-the-fold hero image preloaded
- [ ] JS bundle per route entry ≤ 150 KB gzipped

## SEO

- [ ] Every page has unique `<title>` and meta description in FR and EN via `generateMetadata()`
- [ ] hreflang tags correctly link FR ↔ EN versions on every page pair
- [ ] Canonical URL is set on every page (no duplicate `<link rel="canonical">`)
- [ ] XML sitemap accessible at `/sitemap.xml`, covers both locales, includes programs/faculties/articles
- [ ] `robots.txt` allows all bots, disallows `/api/`, `/studio/`
- [ ] Google Search Console verified for `unm.ma` and `www.unm.ma`
- [ ] Sitemap submitted to Search Console (FR + EN coverage confirmed)
- [ ] JSON-LD validates without errors in Google's Rich Results Test:
  - `EducationalOrganization` (sitewide)
  - `Course` (each program)
  - `FAQPage` (program and admissions pages)
  - `BreadcrumbList` (all inner pages)
  - `Article` (every news article)
- [ ] No noindex headers in production (staging only)
- [ ] Old domain / preview URLs do not appear in search results (block via `robots`)

## Security

- [ ] HTTPS enforced with HSTS header (max-age ≥ 6 months, includeSubDomains, preload)
- [ ] `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` all present
- [ ] Content Security Policy configured (allow self + Plausible + CMS + Resend)
- [ ] All public forms have rate limiting (max 5 submissions/hour per IP)
- [ ] File uploads validated: type (`pdf`, `png`, `jpeg`) and size (≤ 10 MB)
- [ ] GDPR consent checkbox on every lead capture form; consent timestamp persisted
- [ ] Privacy policy published in FR and EN at `/confidentialite` and `/en/privacy`
- [ ] Legal notice published in FR and EN at `/mentions-legales` and `/en/legal`
- [ ] Payload admin URL relocated from `/admin` to `/studio` in production
- [ ] CMS admin behind IP allowlist or VPN in production
- [ ] No secrets committed to the repo (run `gitleaks` or equivalent)
- [ ] All env vars set in Vercel + Railway dashboards; `.env.local` files are gitignored

## Forms & Conversion

- [ ] Lead form (Level 1 — 5 fields) submits → CMS → email to admissions
- [ ] Application form (Level 2 — 5 steps) submits with file uploads
- [ ] Confirmation email sent to the applicant within 30s of submission
- [ ] UTM params (source, medium, campaign) captured from URL and stored on the lead
- [ ] WhatsApp deep link tested on iOS Safari and Android Chrome
- [ ] Mobile CTABar appears on all pages and does not overlap forms
- [ ] Registration reachable in ≤ 2 clicks from any page (verified by walking the nav)
- [ ] Brochure download is gated by email capture; lead stored before download URL is returned

## Functionality

- [ ] Search returns correct results in FR and EN; recent searches persist in localStorage
- [ ] Language switcher FR ↔ EN works on every page (programs, faculties, articles all map correctly)
- [ ] Filter URLs are shareable (state in query string)
- [ ] 404 page renders properly with branded styling
- [ ] CMS admin UI loads and authenticates
- [ ] Analytics events firing for: lead submission, application submission, brochure download, WhatsApp click

## i18n

- [ ] Every user-facing string lives in `messages/fr.json` or `messages/en.json` — no hardcoded text in components
- [ ] FR URLs are unprefixed (`/programmes/...`), EN URLs are prefixed (`/en/programs/...`)
- [ ] No Arabic content, no RTL styles in production build
- [ ] CMS bilingual fields show FR + EN side-by-side; labels in French for editors

## CMS

- [ ] All 3 roles tested end-to-end: Super Admin / Content Editor / Admissions Officer
- [ ] Content editor can publish a new program in FR and EN without engineering help
- [ ] Content editor can publish a new article in FR and EN without engineering help
- [ ] Admissions officer can read leads + applications, cannot edit programs
- [ ] Admissions officer can export leads to CSV via `/api/leads/export.csv`
- [ ] CMS field validation enforced (required fields, allowed enums)
- [ ] Editor training delivered (video walkthrough OR live session + written guide)
- [ ] Seed script runs cleanly on a fresh database

## Backups & Operations

- [ ] PostgreSQL daily dump cron job verified running
- [ ] WAL archiving streaming to S3 (≤ 5-minute lag)
- [ ] Media folder snapshotted nightly
- [ ] Quarterly restore drill performed once before launch; success signed off
- [ ] Vercel deployment rollback rehearsed
- [ ] On-call rotation defined for the first 30 days post-launch

## Accessibility (WCAG 2.1 AA)

- [ ] Color contrast verified for every brand pairing (body ≥ 4.5:1, large text ≥ 3:1)
- [ ] All interactive components reachable by keyboard with visible focus
- [ ] Skip-to-content link present on every page
- [ ] `prefers-reduced-motion` respected on hero, sliders, animations
- [ ] All images have meaningful `alt` text (decorative images: `alt=""`)
- [ ] Form errors announced via `role="alert"` and `aria-describedby`
- [ ] Modal traps focus and restores on close

## DNS & Hosting

- [ ] `unm.ma` and `www.unm.ma` resolve to Vercel
- [ ] `cms.unm.ma` resolves to Railway (or chosen host)
- [ ] DMARC, SPF, DKIM records published for `unm.ma` (verified via Resend dashboard)
- [ ] SSL certificate auto-renewal verified
- [ ] HTTP → HTTPS redirect enforced

## Launch Day

- [ ] Production smoke tests pass (Home, one Program, one Faculty, one Article, Admissions form submit)
- [ ] Google Search Console "Request indexing" run for the 10 highest-priority URLs
- [ ] Plausible Analytics receiving production traffic
- [ ] First lead submitted from a non-team device — confirmed received in CMS and email
- [ ] Stakeholders signed off in writing (Marketing, Admissions, IT, Direction)
- [ ] Status page or fallback notice prepared in case of outage
