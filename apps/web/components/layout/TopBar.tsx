'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@unm/types';
import { ButtonLink } from '@/components/ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SearchModal } from '@/components/shared/SearchModal';

// ════════════════════════════════════════════════════════════════
// Utility top bar — sits above the main header.
//   left  : Contact · Actualités
//   right : FR/EN · Search · Apply
// On mobile only the search and apply CTAs remain to keep things compact.
// ════════════════════════════════════════════════════════════════

export function TopBar() {
  const locale = useLocale() as Locale;
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const contactHref = locale === 'en' ? '/en/contact' : '/contact';
  const newsHref = locale === 'en' ? '/en/news' : '/actualites';
  const applyHref = locale === 'en' ? '/en/admissions' : '/admissions';

  return (
    <div className="bg-secondary text-warm-100">
      <div className="container-page flex h-10 items-center justify-between gap-3">
        {/* Utility links — hidden on small screens to save room */}
        <ul className="hidden items-center gap-5 text-xs sm:flex">
          <li>
            <Link
              href={contactHref}
              className="font-sans uppercase tracking-[0.12em] text-warm-200 hover:text-white"
            >
              {tNav('contact')}
            </Link>
          </li>
          <li aria-hidden="true" className="text-warm-500">|</li>
          <li>
            <Link
              href={newsHref}
              className="font-sans uppercase tracking-[0.12em] text-warm-200 hover:text-white"
            >
              {tNav('news')}
            </Link>
          </li>
        </ul>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher variant="dark" className="!gap-0.5" />
          <span aria-hidden="true" className="mx-1 hidden h-4 w-px bg-warm-500/40 sm:inline-block" />
          <SearchModal tone="dark" />
          <span aria-hidden="true" className="mx-1 hidden h-4 w-px bg-warm-500/40 sm:inline-block" />
          <ButtonLink href={applyHref} size="sm">
            {tCommon('apply')}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
