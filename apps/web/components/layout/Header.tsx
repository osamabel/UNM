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
      <div className="container-page flex h-14 min-w-0 items-center justify-between gap-2 sm:h-16 sm:gap-3 lg:h-[4.5rem] lg:gap-4">
        <Link
          href={locale === 'en' ? '/en' : '/'}
          aria-label="UNM Home"
          className="flex min-w-0 shrink items-center transition-opacity duration-300 hover:opacity-90"
        >
          <Logo surface="light" className="hidden sm:inline-flex" />
          <Logo variant="mark" className="sm:hidden" />
        </Link>

        <nav aria-label="Primary" className="hidden min-w-0 lg:block">
          <Nav />
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 lg:gap-2">
          <LanguageSwitcher />
          <span aria-hidden className="hidden h-4 w-px bg-warm-200/80 sm:inline-block" />
          <SearchModal />
          <ButtonLink href={applyHref} size="sm" className="!shadow-lg hidden lg:inline-flex">
            {tCommon('apply')}
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
