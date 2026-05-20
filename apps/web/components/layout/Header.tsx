'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Logo } from './Logo';
import { Nav } from './Nav';
import { MobileNav } from './MobileNav';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';
import type { Locale } from '@unm/types';

// Two-tier institutional header:
//   • TopBar (utility) — Contact · Actualités · FR/EN · search · Apply
//   • Header  (primary) — Logo · UPPERCASE main navigation · mobile menu
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const locale = useLocale() as Locale;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={cn(
        'sticky top-0 z-30 transition-colors',
        scrolled
          ? 'bg-warm-50/95 backdrop-blur border-b border-warm-200'
          : 'bg-warm-50',
      )}
    >
      <TopBar />
      <header>
        <div className="container-page flex h-16 sm:h-20 items-center justify-between gap-4">
          <Link
            href={locale === 'en' ? '/en' : '/'}
            aria-label="UNM Home"
            className="flex items-center"
          >
            <Logo className="hidden sm:block" />
            <Logo variant="mark" className="sm:hidden" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <Nav />
          </nav>

          <div className="flex items-center gap-3">
            <MobileNav />
          </div>
        </div>
      </header>
    </div>
  );
}
