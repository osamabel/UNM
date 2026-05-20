import type { Locale } from '@unm/types';

export const LOCALES: Locale[] = ['fr', 'en'];
export const DEFAULT_LOCALE: Locale = 'fr';

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export function alternateUrls(pathFr: string, pathEn: string): {
  canonical: string;
  alternates: Record<string, string>;
} {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unm.ma';
  return {
    canonical: `${base}${pathFr}`,
    alternates: {
      fr: `${base}${pathFr}`,
      en: `${base}/en${pathEn}`,
      'x-default': `${base}${pathFr}`,
    },
  };
}
