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
        'glass-nav sticky top-0 z-40 transition-[height,background,box-shadow] duration-300 ease-smooth',
        scrolled && 'is-scrolled',
      )}
    >
      {/*
        Breakpoints:
        - < xl: logo + utilities + hamburger
        - ≥ xl: desktop nav + Apply CTA (premium laptop coverage)
      */}
      <div
        className={cn(
          'container-page flex min-w-0 items-center gap-3 sm:gap-4 xl:gap-5',
          scrolled ? 'h-[4.25rem] sm:h-[4.5rem]' : 'h-[4.5rem] sm:h-[5rem] xl:h-[5.25rem]',
        )}
      >
        <Link
          href={locale === 'en' ? '/en' : '/'}
          aria-label="UNM — Université Numérique du Maroc"
          className="flex shrink-0 items-center transition-opacity duration-300 hover:opacity-90"
        >
          <Logo surface="light" />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden min-w-0 flex-1 items-center justify-center overflow-visible xl:flex"
        >
          <Nav />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5 xl:gap-2.5">
          <LanguageSwitcher className="hidden sm:flex" />
          <span aria-hidden className="hidden h-4 w-px bg-warm-200/80 sm:inline-block" />
          <SearchModal />
          <ButtonLink
            href={applyHref}
            size="sm"
            className="hidden xl:inline-flex"
          >
            {tCommon('apply')}
          </ButtonLink>
          <div className="xl:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
