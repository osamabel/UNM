'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { Nav } from './Nav';
import { MobileNav } from './MobileNav';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SearchModal } from '@/components/shared/SearchModal';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Locale } from '@unm/types';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const locale = useLocale() as Locale;
  const tCommon = useTranslations('common');

  const applyHref = locale === 'en' ? '/en/admissions' : '/admissions';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'glass-nav sticky top-0 z-40 transition-all duration-500 ease-smooth',
        scrolled && 'shadow-[0_12px_40px_rgba(61,26,11,0.08)]',
      )}
    >
      {/*
        Breakpoints:
        - < 2xl: logo + utilities + hamburger (avoids crowded / wrapping links)
        - ≥ 2xl: single-row desktop nav + Apply CTA
      */}
      <div className="container-page flex h-16 min-w-0 items-center gap-3 sm:h-[4.25rem] sm:gap-4 2xl:h-[4.75rem] 2xl:gap-6">
        <Link
          href={locale === 'en' ? '/en' : '/'}
          aria-label="UNM — Université Numérique du Maroc"
          className="flex shrink-0 items-center transition-opacity duration-300 hover:opacity-90"
        >
          <Logo surface="light" />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden min-w-0 flex-1 items-center justify-center overflow-visible 2xl:flex"
        >
          <Nav />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5 2xl:gap-2">
          <LanguageSwitcher className="hidden sm:flex" />
          <span aria-hidden className="hidden h-4 w-px bg-warm-200/80 sm:inline-block" />
          <SearchModal />
          <ButtonLink
            href={applyHref}
            size="sm"
            className="!shadow-lg hidden 2xl:inline-flex"
          >
            {tCommon('apply')}
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
