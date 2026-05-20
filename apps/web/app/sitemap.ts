import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/api';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unm.ma';

// Static pages — emitted in both locales.
const STATIC = [
  { fr: '/', en: '/en', priority: 1.0 },
  { fr: '/universite', en: '/en/university', priority: 0.7 },
  { fr: '/facultes', en: '/en/faculties', priority: 0.8 },
  { fr: '/programmes', en: '/en/programs', priority: 0.9 },
  { fr: '/admissions', en: '/en/admissions', priority: 0.95 },
  { fr: '/actualites', en: '/en/news', priority: 0.6 },
  { fr: '/partenaires', en: '/en/partners', priority: 0.5 },
  { fr: '/contact', en: '/en/contact', priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let dynamic: { programs: string[]; faculties: string[]; articles: string[] } = {
    programs: [],
    faculties: [],
    articles: [],
  };
  try {
    dynamic = await getAllSlugs();
  } catch {
    // CMS unavailable at build time — sitemap remains valid with static entries only
  }

  const now = new Date();
  const items: MetadataRoute.Sitemap = [];

  for (const s of STATIC) {
    items.push({
      url: `${BASE}${s.fr}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: s.priority,
      alternates: {
        languages: { fr: `${BASE}${s.fr}`, en: `${BASE}${s.en}`, 'x-default': `${BASE}${s.fr}` },
      },
    });
  }

  for (const slug of dynamic.programs) {
    items.push({
      url: `${BASE}/programmes/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${BASE}/programmes/${slug}`,
          en: `${BASE}/en/programs/${slug}`,
          'x-default': `${BASE}/programmes/${slug}`,
        },
      },
    });
  }
  for (const slug of dynamic.faculties) {
    items.push({
      url: `${BASE}/facultes/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${BASE}/facultes/${slug}`,
          en: `${BASE}/en/faculties/${slug}`,
          'x-default': `${BASE}/facultes/${slug}`,
        },
      },
    });
  }
  for (const slug of dynamic.articles) {
    items.push({
      url: `${BASE}/actualites/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          fr: `${BASE}/actualites/${slug}`,
          en: `${BASE}/en/news/${slug}`,
          'x-default': `${BASE}/actualites/${slug}`,
        },
      },
    });
  }
  return items;
}
