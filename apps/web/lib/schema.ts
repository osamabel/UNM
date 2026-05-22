import type { Article, Faculty, Locale, Program, ProgramFAQItem } from '@unm/types';
import { localized } from './utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unm.ma';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Université Numérique du Maroc',
    alternateName: 'UNM',
    url: SITE_URL,
    logo: `${SITE_URL}/unmtrans.png`,
    sameAs: [
      'https://www.linkedin.com/school/unm-ma',
      'https://www.facebook.com/unm.ma',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MA',
      addressLocality: 'Casablanca',
    },
  };
}

export function courseSchema(program: Program, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: localized(program.title, locale),
    description: localized(program.metaDescription, locale),
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Université Numérique du Maroc',
      sameAs: SITE_URL,
    },
    educationalCredentialAwarded: program.type,
    inLanguage: program.language,
    timeRequired: program.duration,
    ...(program.tuitionFee != null && {
      offers: {
        '@type': 'Offer',
        price: program.tuitionFee,
        priceCurrency: 'MAD',
      },
    }),
  };
}

export function faqSchema(items: ProgramFAQItem[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: localized(it.question, locale),
      acceptedAnswer: {
        '@type': 'Answer',
        text: localized(it.answer, locale),
      },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

export function articleSchema(article: Article, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: localized(article.title, locale),
    description: localized(article.excerpt, locale),
    image: article.coverImage?.url,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: article.author.name },
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'Université Numérique du Maroc',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/unmtrans.png` },
    },
  };
}

export function facultySchema(faculty: Faculty, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: localized(faculty.name, locale),
    description: localized(faculty.description, locale),
    parentOrganization: {
      '@type': 'EducationalOrganization',
      name: 'Université Numérique du Maroc',
      url: SITE_URL,
    },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data);
}
