# UNM — Architecture Document

**Project:** Université Numérique du Maroc (UNM) — Official Website
**Document owner:** Lead engineering
**Last updated:** 2026-05-11
**Status:** Approved for build

This document defines the technology stack, source layout, data model, API surface, and delivery pipeline for the UNM website. Every decision below is anchored in the four product constraints that drive the project:

1. **Recruitment conversion** — registration reachable in ≤ 2 clicks from any page.
2. **Mobile Core Web Vitals** — LCP ≤ 2.5s, INP < 200ms, CLS < 0.1.
3. **Bilingual FR (default) + EN** — no Arabic, no RTL.
4. **Non-technical content management** — editors must operate the site without engineering help.

---

## 1.1 Technology Stack

### 1.1.1 Selection criteria

Every component was evaluated against the same five-axis rubric:

- **Mobile Core Web Vitals** under simulated 3G — can the tool meet LCP ≤ 2.5s without heavy mitigation?
- **Native SEO** — server rendering, canonical/hreflang management, dynamic metadata for bilingual content.
- **Non-technical CMS** — can a content editor publish without engineering involvement?
- **Long-term maintainability** — open source or low vendor lock-in; TypeScript-native preferred.
- **Cost efficiency** for a Moroccan/francophone scale (10–100k monthly sessions in year one).

### 1.1.2 Approved stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | Next.js (App Router) | 14.2.x |
| Language | TypeScript (strict) | 5.4.x |
| Styling | Tailwind CSS | 3.4.x |
| CMS | Payload CMS | 2.x |
| Database | PostgreSQL | 15.x |
| Auth (CMS) | Payload built-in | — |
| Auth (future SSO) | NextAuth.js | 4.x |
| Search | MeiliSearch (self-hosted) | 1.7.x |
| Transactional email | Resend | API |
| Lead CRM sink | Notion or Airtable via webhook | API |
| Analytics | Plausible | self-hosted or cloud |
| Internationalization | next-intl | 3.x |
| Hosting (web) | Vercel | — |
| Hosting (CMS + DB) | Railway (managed) or OVH VPS (Casablanca region preferred) | — |
| CDN / images | Vercel Edge + next/image | — |
| CI/CD | GitHub Actions → Vercel | — |
| Monorepo | Turborepo + pnpm workspaces | 1.13.x |

### 1.1.3 Justifications

**Next.js 14 App Router.** Streaming SSR + RSC produce excellent LCP without sacrificing dynamic content. The App Router's segment-level `generateMetadata` is essential for emitting per-page bilingual `<title>`, `description`, hreflang, and Open Graph tags from the CMS.

**TypeScript strict.** All Payload collections export typed clients consumed by the Next.js app via the shared `@unm/types` package — eliminating a whole class of locale and field-shape bugs across the FR/EN boundary.

**Tailwind CSS v3.** Utility-first matches our brand-token strategy: every UNM color (`#B5341A`, `#3D1A0B`, `#FDFAF7`) is exposed as a single source of truth in `tailwind.config.ts`, so the design system cannot drift out of brand by accident. Tailwind's JIT produces minimal CSS, which directly serves the LCP budget.

**Payload CMS 2.x.** Self-hosted, TypeScript-native, schemas-as-code, REST + GraphQL out of the box. No vendor lock-in (unlike Contentful/Sanity for an institutional client) and field-level localization is first class — perfect for the `LocalizedField { fr; en }` shape. Editors get a modern admin UI without engineering involvement.

**PostgreSQL 15.** Payload's recommended relational adapter. Native JSONB columns store localized content efficiently; full-text indexes are available as a fallback if MeiliSearch is unavailable.

**MeiliSearch.** Sub-50ms typo-tolerant search out of the box, supports French + English analyzers natively, FOSS, easy to self-host alongside the CMS. Algolia was rejected on cost and Moroccan/EU data-residency grounds.

**Resend + Notion/Airtable webhook.** Resend handles transactional email (lead confirmations, brochure delivery, admissions notifications) with React Email templates. A simple webhook forwards every Lead into Notion or Airtable so the admissions team can work in tools they already use — no full CRM build needed in year one.

**Plausible Analytics.** GDPR-compliant by design; no cookie banner required. Lightweight script (≤ 1 KB) keeps the performance budget intact.

**next-intl v3.** App Router-native, supports `localePrefix: 'as-needed'` so French URLs stay clean (`/programmes/...`) while English is prefixed (`/en/programs/...`). Hreflang and canonical generation are first-class.

**Vercel + Railway.** Vercel for the edge-rendered front-end (free tier covers year one). Railway hosts Payload + PostgreSQL + MeiliSearch with managed backups; OVH VPS in Roubaix or future Casablanca region is a drop-in replacement for data-residency requirements.

**GitHub Actions → Vercel.** Lint, typecheck, unit tests, build, and Lighthouse CI on every PR. Production deploy is automatic on merge to `main`; PR previews on every push.

**Turborepo + pnpm.** Single repository hosting `apps/web`, `apps/cms`, and shared `packages/types`. Build cache slashes CI time; pnpm workspaces enforce a strict dependency graph.

---

## 1.2 Project File Structure

```
unm-website/
├── apps/
│   ├── web/                          # Next.js 14 frontend
│   │   ├── app/
│   │   │   ├── [locale]/             # i18n routing — fr (default) / en
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx          # Home
│   │   │   │   ├── universite/       # FR slug · /en/university EN slug
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── facultes/         # FR · /en/faculties EN
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   ├── programmes/       # FR · /en/programs EN
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   ├── admissions/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── actualites/       # FR · /en/news EN
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   ├── partenaires/      # FR · /en/partners EN
│   │   │   │   │   └── page.tsx
│   │   │   │   └── contact/
│   │   │   │       └── page.tsx
│   │   │   ├── api/
│   │   │   │   ├── leads/route.ts
│   │   │   │   ├── applications/route.ts
│   │   │   │   ├── search/route.ts
│   │   │   │   └── newsletter/route.ts
│   │   │   ├── globals.css
│   │   │   ├── robots.ts
│   │   │   └── sitemap.ts
│   │   ├── components/
│   │   │   ├── ui/                   # Design-system primitives
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Breadcrumb.tsx
│   │   │   │   └── SectionWrapper.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Nav.tsx
│   │   │   │   ├── MobileNav.tsx
│   │   │   │   ├── LanguageSwitcher.tsx
│   │   │   │   └── Logo.tsx
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FacultyGrid.tsx
│   │   │   │   ├── FeaturedPrograms.tsx
│   │   │   │   ├── StatsBar.tsx
│   │   │   │   ├── TestimonialsSlider.tsx
│   │   │   │   ├── PartnerLogos.tsx
│   │   │   │   └── CTABanner.tsx
│   │   │   ├── programs/
│   │   │   │   ├── ProgramHero.tsx
│   │   │   │   ├── StickyProgramCTA.tsx
│   │   │   │   ├── ProgramOverview.tsx
│   │   │   │   ├── SkillsGrid.tsx
│   │   │   │   ├── OutcomesSection.tsx
│   │   │   │   ├── CalendarSection.tsx
│   │   │   │   ├── AdmissionSection.tsx
│   │   │   │   ├── TuitionSection.tsx
│   │   │   │   ├── ProgramFAQ.tsx
│   │   │   │   └── RelatedPrograms.tsx
│   │   │   ├── faculty/
│   │   │   │   ├── FacultyHero.tsx
│   │   │   │   ├── ProgramsList.tsx
│   │   │   │   ├── StrengthsSection.tsx
│   │   │   │   └── FacultyCTA.tsx
│   │   │   ├── forms/
│   │   │   │   ├── LeadForm.tsx
│   │   │   │   ├── ApplicationForm.tsx
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   ├── CallbackForm.tsx
│   │   │   │   └── NewsletterForm.tsx
│   │   │   └── shared/
│   │   │       ├── CTABar.tsx
│   │   │       ├── WhatsAppButton.tsx
│   │   │       ├── SearchModal.tsx
│   │   │       ├── ProgramFilter.tsx
│   │   │       └── BrochureDownload.tsx
│   │   ├── lib/
│   │   │   ├── api.ts                # Payload CMS API client
│   │   │   ├── schema.ts             # JSON-LD generators
│   │   │   ├── locale.ts             # locale helpers
│   │   │   ├── rate-limit.ts
│   │   │   └── utils.ts
│   │   ├── messages/
│   │   │   ├── fr.json               # PRIMARY language
│   │   │   └── en.json               # Secondary language
│   │   ├── public/
│   │   │   ├── logo-unm.svg
│   │   │   ├── logo-unm-mark.svg
│   │   │   └── og-image.jpg
│   │   ├── middleware.ts             # i18n locale detection
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── cms/                          # Payload CMS backend
│       ├── src/
│       │   ├── collections/
│       │   │   ├── Faculties.ts
│       │   │   ├── Programs.ts
│       │   │   ├── Articles.ts
│       │   │   ├── Testimonials.ts
│       │   │   ├── Partners.ts
│       │   │   ├── Leads.ts
│       │   │   ├── Applications.ts
│       │   │   ├── Media.ts
│       │   │   └── Users.ts
│       │   ├── globals/
│       │   │   ├── SiteSettings.ts
│       │   │   └── Navigation.ts
│       │   ├── access/
│       │   │   ├── isAdmin.ts
│       │   │   ├── isAdminOrEditor.ts
│       │   │   └── isAdmissionsOfficer.ts
│       │   ├── hooks/
│       │   │   ├── notifyOnLead.ts
│       │   │   └── syncToMeili.ts
│       │   ├── seed.ts
│       │   ├── server.ts
│       │   └── payload.config.ts
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   └── types/
│       ├── src/index.ts              # Shared TS types
│       ├── tsconfig.json
│       └── package.json
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── lighthouse.yml
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── .gitignore
├── .editorconfig
├── ARCHITECTURE.md
├── SETUP.md
└── LAUNCH_CHECKLIST.md
```

---

## 1.3 Database Schema

All localized content is stored as `jsonb` `{ fr, en }` shapes. The shared TypeScript contract is the source of truth for both Payload field definitions and Next.js consumers.

```typescript
// packages/types/src/index.ts
// Bilingual only — French is the source of truth, English is the secondary
// translation. No Arabic, no RTL.

export interface LocalizedField {
  fr: string;
  en: string;
}

export interface Media {
  id: string;
  url: string;
  alt: string;
  filename: string;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface Faculty {
  id: string;
  slug: string;
  name: LocalizedField;
  description: LocalizedField;
  icon: string;
  color: string; // hex, must derive from UNM palette
  programs?: Program[];
  outcomes: LocalizedField[];
  strengths: LocalizedField[];
  coverImage: Media;
  metaTitle: LocalizedField;
  metaDescription: LocalizedField;
  createdAt: string;
  updatedAt: string;
}

export type ProgramType = 'DBA' | 'MBA' | 'Bachelor' | 'Certificate';
export type ProgramFormat = 'Présentiel' | 'Distanciel' | 'Hybride';
export type ProgramLanguage = 'fr' | 'en';

export interface ProgramFAQItem {
  question: LocalizedField;
  answer: LocalizedField;
}

export interface Program {
  id: string;
  slug: string;
  title: LocalizedField;
  type: ProgramType;
  faculty: Faculty;
  duration: string;
  format: ProgramFormat;
  language: ProgramLanguage[]; // fr, en — never ar
  schedule: LocalizedField;
  admissionRequirements: LocalizedField;
  targetAudience: LocalizedField;
  objectives: LocalizedField[];
  skills: LocalizedField[];
  outcomes: LocalizedField[];
  tuitionFee: number | null; // null = "Sur demande"
  faq: ProgramFAQItem[];
  brochureFile: Media;
  startDate: string; // ISO 8601
  isActive: boolean;
  isFeatured: boolean;
  metaTitle: LocalizedField;
  metaDescription: LocalizedField;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: LocalizedField;
  excerpt: LocalizedField;
  body: LocalizedField; // rich text serialized
  coverImage: Media;
  author: { name: string; bio?: LocalizedField; avatar?: Media };
  category: 'campus' | 'recherche' | 'partenariats' | 'evenements';
  publishedAt: string;
  readingTime: number; // minutes
  metaTitle: LocalizedField;
  metaDescription: LocalizedField;
}

export interface Testimonial {
  id: string;
  quote: LocalizedField;
  authorName: string;
  authorRole: LocalizedField;
  program?: Program;
  graduationYear?: number;
  avatar?: Media;
}

export interface Partner {
  id: string;
  name: string;
  logo: Media;
  url?: string;
  category: 'academic' | 'industry' | 'government';
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'enrolled' | 'lost';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  programInterest: Program;
  source: string;   // UTM source
  medium: string;   // UTM medium
  campaign: string; // UTM campaign
  status: LeadStatus;
  consentGiven: boolean;
  consentTimestamp: string;
  createdAt: string;
  notes: string;
}

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'waitlisted';

export interface Application {
  id: string;
  lead: Lead;
  program: Program;
  status: ApplicationStatus;
  documents: Media[]; // CV, diplomas, motivation letter
  submittedAt: string;
  reviewedAt: string | null;
  reviewerNotes: string;
}

export interface SiteSettings {
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: LocalizedField;
  };
  social: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  legal: {
    legalNotice: LocalizedField;
    privacyPolicy: LocalizedField;
  };
}
```

### Relational summary (PostgreSQL)

| Table | Cardinality | Notes |
|---|---|---|
| `faculties` | 4 (year one) | seeded |
| `programs` | ~20 | each FK → `faculties.id` |
| `articles` | grows | category enum |
| `testimonials` | ~10 | optional FK → `programs.id` |
| `partners` | grows | logo asset |
| `leads` | grows daily | FK → `programs.id`, indexed on `email`, `createdAt` |
| `applications` | grows | FK → `leads.id`, FK → `programs.id` |
| `media` | grows | Payload-managed |
| `users` | small | CMS staff only |

Indexes: `programs(slug)` unique, `faculties(slug)` unique, `articles(slug, publishedAt)`, `leads(createdAt)`, `leads(email)`, `applications(submittedAt)`.

---

## 1.4 API Routes

Public, edge-cached where possible; mutating endpoints rate-limited.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/programs` | public | List programs; query params `faculty`, `type`, `format`, `language`, `locale`, `page` |
| GET | `/api/programs/:slug` | public | Single program detail |
| GET | `/api/faculties` | public | List faculties |
| GET | `/api/faculties/:slug` | public | Single faculty + nested programs |
| GET | `/api/articles` | public | News list, paginated 12/page |
| GET | `/api/articles/:slug` | public | Single article |
| GET | `/api/search?q=&locale=` | public | MeiliSearch proxy; returns `{ programs, faculties, articles }` |
| POST | `/api/leads` | public + rate-limited | Level 1 pre-registration (5 fields) |
| POST | `/api/applications` | public + rate-limited | Level 2 application (multi-step + files) |
| POST | `/api/newsletter` | public + rate-limited | Single-field subscribe |
| GET | `/sitemap.xml` | public | Dynamic sitemap (both locales) |
| GET | `/robots.txt` | public | Static |

**Rate limiting:** Token-bucket per IP — 5 submissions/hour on `/leads`, `/applications`, `/newsletter`. Implemented via `lib/rate-limit.ts` on top of Upstash Redis (or in-memory in dev).

**Caching:**
- Read endpoints: `Cache-Control: s-maxage=300, stale-while-revalidate=86400`
- Write endpoints: never cached
- Search: 60 s edge cache per query string

---

## 1.5 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml — runs on every push and PR
name: CI
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 8 }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test --filter=web --filter=cms
      - run: pnpm build --filter=web
```

```yaml
# .github/workflows/lighthouse.yml — runs against Vercel preview URLs
name: Lighthouse
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            ${{ steps.preview.outputs.url }}/
            ${{ steps.preview.outputs.url }}/programmes/dba-management
            ${{ steps.preview.outputs.url }}/facultes/management
          configPath: ./lighthouserc.json
          uploadArtifacts: true
```

`lighthouserc.json` asserts:

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 200 }]
      }
    }
  }
}
```

**Production deploy.** Push to `main` triggers Vercel's auto-deploy. A post-deploy step pings Google Search Console with the updated sitemap URL.

**PR previews.** Every PR gets a unique Vercel URL plus an automatic Lighthouse run. Failing budgets block merge.

---

## 1.6 Security posture

- HTTPS-only, HSTS preload, `Strict-Transport-Security` header.
- CSP allowing only `'self'`, Plausible, MeiliSearch, Resend, and Vercel asset hosts.
- All form submissions validated server-side with the same Zod schema used client-side.
- File uploads (CV, diplomas) restricted to `application/pdf`, `image/png`, `image/jpeg`, max 10 MB.
- Payload admin not on `/admin` — relocated to a private path (`/studio`) and behind IP allowlist in production.
- PostgreSQL backups: daily full + 5-minute WAL streaming to S3-compatible storage; 30-day retention.

---

## 1.7 Performance budget

| Metric | Target | Enforcement |
|---|---|---|
| LCP | ≤ 2.5s (mobile, 3G fast) | Lighthouse CI |
| INP | < 200 ms | RUM via Plausible |
| CLS | < 0.1 | Lighthouse CI |
| JS bundle (route entry) | ≤ 150 KB gzipped | `next-bundle-analyzer` in CI |
| Image weight (above the fold) | ≤ 100 KB | `next/image` + AVIF/WebP |

Above-the-fold assets are preloaded via `<link rel="preload">`. All non-critical scripts (Plausible, WhatsApp deep link helper) are deferred via `<Script strategy="afterInteractive">`.

---

## 1.8 Accessibility

- WCAG 2.1 AA baseline.
- All interactive components keyboard-navigable; focus rings preserved on `:focus-visible`.
- Color contrast ≥ 4.5:1 for body, ≥ 3:1 for large text — verified against UNM palette pairings.
- `prefers-reduced-motion` respected on hero, sliders, and any motion-heavy animation.
- Forms expose `aria-describedby` for errors; required fields have visible asterisks plus `aria-required`.

---

## 1.9 Internationalization

- **next-intl** with `locales: ['fr', 'en']`, `defaultLocale: 'fr'`, `localePrefix: 'as-needed'`.
- French URLs unprefixed: `/programmes/dba-management`.
- English URLs prefixed: `/en/programs/dba-management`.
- Every page renders `<link rel="alternate" hreflang="fr|en|x-default">`.
- All UI strings live in `messages/fr.json` and `messages/en.json`.
- CMS-managed content uses the `LocalizedField` shape — editors fill FR + EN side by side.
