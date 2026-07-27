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
import { Icon } from '@/components/ui/Icon';
import { PORTAL_URL } from '@/lib/portal';
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
      <div
        className={cn(
          'header-bar container-page',
          scrolled ? 'is-compact' : '',
        )}
      >
        <Link
          href={locale === 'en' ? '/en' : '/'}
          aria-label="UNM — Université Numérique du Maroc"
          className="header-logo"
        >
          <Logo surface="light" />
        </Link>

        <nav aria-label="Primary" className="header-nav">
          <Nav />
        </nav>

        <div className="header-actions">
          <LanguageSwitcher className="hidden sm:flex" />
          <span aria-hidden className="header-actions-rule hidden sm:inline-block" />
          <SearchModal />
          <a
            href={PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={tCommon('portalAccessAria')}
            className="header-portal-link"
          >
            <Icon name="laptop" size={15} aria-hidden />
            <span className="header-portal-label">{tCommon('portalAccess')}</span>
          </a>
          <ButtonLink href={applyHref} size="sm" className="header-apply-btn">
            {tCommon('apply')}
          </ButtonLink>
          <div className="header-mobile-trigger">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
