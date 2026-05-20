'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import type { Locale } from '@unm/types';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
];

const SLUG_MAP: Record<string, string> = {
  // FR → EN
  facultes: 'faculties',
  programmes: 'programs',
  actualites: 'news',
  universite: 'university',
  partenaires: 'partners',
  organisations: 'organizations',
  'mentions-legales': 'legal-notice',
  cgu: 'terms-of-use',
  cgv: 'terms-of-sale',
  confidentialite: 'privacy',
  // EN → FR
  faculties: 'facultes',
  programs: 'programmes',
  news: 'actualites',
  university: 'universite',
  partners: 'partenaires',
  organizations: 'organisations',
  'legal-notice': 'mentions-legales',
  'terms-of-use': 'cgu',
  'terms-of-sale': 'cgv',
  privacy: 'confidentialite',
};

function buildHref(pathname: string, current: Locale, target: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'en') segments.shift();
  const translated = segments.map((seg) => SLUG_MAP[seg] ?? seg);
  const path = '/' + translated.join('/');
  return target === 'en' ? `/en${path === '/' ? '' : path}` : path;
}

interface Props {
  className?: string;
  /** Colour scheme — `light` (default, dark text on light bg) or `dark` (top bar). */
  variant?: 'light' | 'dark';
}

export function LanguageSwitcher({ className, variant = 'light' }: Props) {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const isDark = variant === 'dark';
  return (
    <div role="group" aria-label="Language" className={cn('flex gap-1', className)}>
      {LOCALES.map(({ code, label }) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={buildHref(pathname, locale, code)}
            hrefLang={code}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'rounded px-2 py-1 text-xs font-sans font-semibold tracking-wide transition-colors',
              active
                ? 'bg-primary text-white'
                : isDark
                  ? 'text-warm-200 hover:bg-warm-50/10 hover:text-white'
                  : 'text-secondary hover:bg-warm-100',
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
