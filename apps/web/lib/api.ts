import type {
  Article,
  Faculty,
  Locale,
  Partner,
  Program,
  SiteSettings,
  Testimonial,
} from '@unm/types';

const CMS_API_URL = process.env.CMS_API_URL ?? 'http://localhost:3001/api';
const CMS_API_TOKEN = process.env.CMS_API_TOKEN;

interface FetchOpts {
  revalidate?: number; // seconds
  tag?: string;
}

async function cmsFetch<T>(path: string, opts: FetchOpts = {}): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(CMS_API_TOKEN ? { Authorization: `Bearer ${CMS_API_TOKEN}` } : {}),
      },
      next: {
        revalidate: opts.revalidate ?? 300,
        tags: opts.tag ? [opts.tag] : undefined,
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // CMS unreachable (e.g. during build before deploy) — let callers decide
    // on a fallback. ISR will refresh on the first runtime request.
    return null;
  }
}

// ─── Faculties ──────────────────────────────────────────

/**
 * Payload wraps localised text arrays in `{ id, <field>: { fr, en } }`.
 * The frontend expects bare `LocalizedField[]`. This helper unwraps any
 * shape returned by the CMS into a plain `LocalizedField[]`, so all
 * downstream components can call `localized(item, locale)` directly.
 */
function unwrapLocalizedArray(arr: unknown, ...keys: string[]): any[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((entry) => {
    if (!entry || typeof entry !== 'object') return entry;
    for (const k of keys) {
      if ((entry as any)[k] && typeof (entry as any)[k] === 'object') {
        return (entry as any)[k];
      }
    }
    return entry;
  });
}

/**
 * Normalises a faculty document returned by Payload so the React tree
 * receives a clean `Faculty` matching the shared type contract.
 */
function normalizeFaculty(raw: any): Faculty {
  return {
    ...raw,
    strengths: unwrapLocalizedArray(raw.strengths, 'text'),
    outcomes: unwrapLocalizedArray(raw.outcomes, 'text'),
    domains: unwrapLocalizedArray(raw.domains, 'name'),
  };
}

/**
 * Fetches all faculties sorted by `displayOrder` ASC and enriches each one
 * with `programCount` (number of active programmes attached to it).
 * The count requires a second request — the CMS doesn't expose a join
 * count natively. Both fetches run in parallel; cached for 5 minutes via
 * ISR tags. Coming-soon faculties keep programCount = 0.
 */
export async function getFaculties(): Promise<Faculty[]> {
  const [facData, progData] = await Promise.all([
    cmsFetch<{ docs: any[] }>(`/faculties?limit=100&sort=displayOrder`, {
      tag: 'faculties',
    }),
    cmsFetch<{ docs: Array<{ faculty: { id: string | number } | string | number }> }>(
      `/programs?limit=200&depth=0&where[isActive][equals]=true`,
      { tag: 'programs' },
    ),
  ]);
  const counts = new Map<string, number>();
  for (const p of progData?.docs ?? []) {
    const facId =
      typeof p.faculty === 'object' && p.faculty !== null
        ? String((p.faculty as any).id)
        : String(p.faculty);
    counts.set(facId, (counts.get(facId) ?? 0) + 1);
  }
  return (facData?.docs ?? []).map((f) => ({
    ...normalizeFaculty(f),
    programCount: counts.get(String(f.id)) ?? 0,
  }));
}

export async function getFaculty(slug: string): Promise<Faculty | null> {
  const data = await cmsFetch<{ docs: any[] }>(
    `/faculties?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
    { tag: `faculty:${slug}` },
  );
  const raw = data?.docs?.[0];
  return raw ? normalizeFaculty(raw) : null;
}

// ─── Programs ───────────────────────────────────────────

export interface ProgramQuery {
  faculty?: string;
  type?: string;
  format?: string;
  language?: string;
  featured?: boolean;
  limit?: number;
}

function normalizeProgram(raw: any): Program {
  return {
    ...raw,
    objectives: unwrapLocalizedArray(raw.objectives, 'text'),
    skills:     unwrapLocalizedArray(raw.skills, 'text'),
    outcomes:   unwrapLocalizedArray(raw.outcomes, 'text'),
    // New narrative fields — pass through as plain LocalizedFields.
    vocation:        raw.vocation,
    skillsNarrative: raw.skillsNarrative,
    careerOutlooks:  raw.careerOutlooks,
    // FAQ items keep their `{ question, answer }` shape — those are
    // already plain LocalizedFields, no unwrap needed.
    // Curriculum: Payload returns `{ id, code, title: {fr,en}, description: {fr,en}, group? }`
    // which already matches our `CurriculumModule` shape. We just strip the
    // wrapper id and keep the editorial fields.
    curriculum: Array.isArray(raw.curriculum)
      ? raw.curriculum.map((m: any) => ({
          code: m.code,
          title: m.title,
          description: m.description,
          group: m.group,
        }))
      : undefined,
    faculty: raw.faculty && typeof raw.faculty === 'object' ? normalizeFaculty(raw.faculty) : raw.faculty,
  };
}

export async function getPrograms(q: ProgramQuery = {}): Promise<Program[]> {
  const params = new URLSearchParams();
  params.set('limit', String(q.limit ?? 50));
  if (q.faculty) params.set('where[faculty.slug][equals]', q.faculty);
  if (q.type) params.set('where[type][equals]', q.type);
  if (q.format) params.set('where[format][equals]', q.format);
  if (q.language) params.set('where[language][in]', q.language);
  if (q.featured) params.set('where[isFeatured][equals]', 'true');
  params.set('where[isActive][equals]', 'true');
  const data = await cmsFetch<{ docs: any[] }>(`/programs?${params}`, {
    tag: 'programs',
  });
  return (data?.docs ?? []).map(normalizeProgram);
}

export async function getProgram(slug: string): Promise<Program | null> {
  const data = await cmsFetch<{ docs: any[] }>(
    `/programs?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=2`,
    { tag: `program:${slug}` },
  );
  const raw = data?.docs?.[0];
  return raw ? normalizeProgram(raw) : null;
}

export async function getRelatedPrograms(
  facultySlug: string,
  excludeSlug: string,
  limit = 3,
): Promise<Program[]> {
  const list = await getPrograms({ faculty: facultySlug, limit: limit + 1 });
  return list.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

// ─── Articles ───────────────────────────────────────────

export async function getArticles(page = 1, perPage = 12): Promise<{ docs: Article[]; totalPages: number }> {
  const data = await cmsFetch<{ docs: Article[]; totalPages: number }>(
    `/articles?limit=${perPage}&page=${page}&sort=-publishedAt`,
    { tag: 'articles' },
  );
  return data ?? { docs: [], totalPages: 0 };
}

export async function getArticle(slug: string): Promise<Article | null> {
  const data = await cmsFetch<{ docs: Article[] }>(
    `/articles?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
    { tag: `article:${slug}` },
  );
  return data?.docs?.[0] ?? null;
}

// ─── Testimonials, Partners, Settings ───────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await cmsFetch<{ docs: Testimonial[] }>(`/testimonials?limit=20`, {
    tag: 'testimonials',
  });
  return data?.docs ?? [];
}

export async function getPartners(): Promise<Partner[]> {
  const data = await cmsFetch<{ docs: Partner[] }>(`/partners?limit=50`, {
    tag: 'partners',
  });
  return data?.docs ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return cmsFetch<SiteSettings>(`/globals/site-settings`, { tag: 'site-settings' });
}

// ─── Sitemap helpers ────────────────────────────────────

export async function getAllSlugs(): Promise<{
  programs: string[];
  faculties: string[];
  articles: string[];
}> {
  const [programs, faculties, articles] = await Promise.all([
    getPrograms({ limit: 200 }),
    getFaculties(),
    getArticles(1, 200),
  ]);
  return {
    programs: programs.map((p) => p.slug),
    faculties: faculties.map((f) => f.slug),
    articles: articles.docs.map((a) => a.slug),
  };
}
