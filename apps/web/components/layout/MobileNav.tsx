'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LOGO_SRC } from '@/lib/logo';
import { PORTAL_URL } from '@/lib/portal';
import type { Locale } from '@unm/types';
import { cn } from '@/lib/utils';

type NavKey =
  | 'university' | 'faculties' | 'programs' | 'admissions' | 'contact' | 'organisations'
  | 'manifesto' | 'presidentWord' | 'partners' | 'newsUnm' | 'events' | 'newsroom'
  | 'facultyBusinessSchool' | 'facultyGovernance' | 'facultyTechnology' | 'facultySportBusiness'
  | 'programDba' | 'programMba' | 'programCertificate';

interface LeafItem { kind: 'leaf'; key: NavKey; fr: string; en: string; comingSoon?: boolean; }
interface ParentItem { kind: 'parent'; key: NavKey; fr: string; en: string; children: LeafItem[]; }
type Item = LeafItem | ParentItem;

const UNIVERSITY_SUB: LeafItem[] = [
  { kind: 'leaf', key: 'manifesto', fr: '/universite/manifeste', en: '/en/university/manifeste' },
  { kind: 'leaf', key: 'presidentWord', fr: '/universite/mot-du-president', en: '/en/university/mot-du-president' },
  { kind: 'leaf', key: 'partners', fr: '/partenaires', en: '/en/partners' },
  { kind: 'leaf', key: 'newsUnm', fr: '/actualites', en: '/en/news' },
];

const FACULTIES_SUB: LeafItem[] = [
  { kind: 'leaf', key: 'facultyBusinessSchool', fr: '/facultes/business-school', en: '/en/faculties/business-school' },
  { kind: 'leaf', key: 'facultyGovernance', fr: '/facultes/school-of-governance', en: '/en/faculties/school-of-governance' },
  { kind: 'leaf', key: 'facultyTechnology', fr: '/facultes/school-of-technology', en: '/en/faculties/school-of-technology', comingSoon: true },
  { kind: 'leaf', key: 'facultySportBusiness', fr: '/facultes/school-of-sport-business', en: '/en/faculties/school-of-sport-business', comingSoon: true },
];

const PROGRAMS_SUB: LeafItem[] = [
  { kind: 'leaf', key: 'programDba', fr: '/programmes?type=DBA', en: '/en/programs?type=DBA' },
  { kind: 'leaf', key: 'programMba', fr: '/programmes?type=MBA', en: '/en/programs?type=MBA' },
  { kind: 'leaf', key: 'programCertificate', fr: '/programmes?type=Certificate', en: '/en/programs?type=Certificate' },
];

const ITEMS: Item[] = [
  { kind: 'parent', key: 'university', fr: '/universite/manifeste', en: '/en/university/manifeste', children: UNIVERSITY_SUB },
  { kind: 'parent', key: 'faculties', fr: '/facultes', en: '/en/faculties', children: FACULTIES_SUB },
  { kind: 'parent', key: 'programs', fr: '/programmes', en: '/en/programs', children: PROGRAMS_SUB },
  { kind: 'leaf', key: 'admissions', fr: '/admissions', en: '/en/admissions' },
  { kind: 'leaf', key: 'organisations', fr: '/organisations', en: '/en/organizations' },
  { kind: 'leaf', key: 'contact', fr: '/contact', en: '/en/contact' },
];

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    style.position = 'fixed';
    style.top = `-${scrollY}px`;
    style.left = '0';
    style.right = '0';
    style.width = '100%';
    style.overflow = 'hidden';
    return () => {
      style.position = '';
      style.top = '';
      style.left = '';
      style.right = '';
      style.width = '';
      style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<NavKey | null>(null);
  const locale = useLocale() as Locale;
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const isEn = locale === 'en';

  useBodyScrollLock(open);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setExpanded(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const overlay =
    mounted && open
      ? createPortal(
          <div className="mobile-nav-root xl:hidden" role="dialog" aria-modal="true" aria-label={tNav('menu')}>
            <button type="button" className="mobile-nav-backdrop" aria-label={tCommon('close')} onClick={close} />

            <div className="mobile-nav-sheet" translate="no">
              <header className="mobile-nav-header">
                <Link href={isEn ? '/en' : '/'} onClick={close} className="mobile-nav-brand">
                  <Image src={LOGO_SRC} alt="UNM" width={120} height={40} className="h-8 w-auto object-contain" priority />
                </Link>
                <button
                  type="button"
                  onClick={close}
                  aria-label={tCommon('close')}
                  className="mobile-nav-close"
                >
                  <Icon name="close" size={20} />
                </button>
              </header>

              <nav className="mobile-nav-body">
                <p className="mobile-nav-kicker">{tNav('menu')}</p>
                <ul className="mobile-nav-list">
                  {ITEMS.map((it) =>
                    it.kind === 'leaf' ? (
                      <li key={it.key}>
                        <Link
                          href={isEn ? it.en : it.fr}
                          onClick={close}
                          className="mobile-nav-link"
                        >
                          <span>{tNav(it.key)}</span>
                          <Icon name="arrow-right" size={16} className="mobile-nav-link-arrow" />
                        </Link>
                      </li>
                    ) : (
                      <li key={it.key} className={cn('mobile-nav-group', expanded === it.key && 'is-open')}>
                        <div className="mobile-nav-group-row">
                          <Link
                            href={isEn ? it.en : it.fr}
                            onClick={close}
                            className="mobile-nav-group-main"
                          >
                            {tNav(it.key)}
                          </Link>
                          <button
                            type="button"
                            aria-expanded={expanded === it.key}
                            aria-controls={`mobilesub-${it.key}`}
                            aria-label={tNav('toggleSection')}
                            onClick={() => setExpanded((cur) => (cur === it.key ? null : it.key))}
                            className="mobile-nav-group-toggle"
                          >
                            <Icon
                              name="chevron-down"
                              size={18}
                              className={cn(expanded === it.key && 'rotate-180')}
                            />
                          </button>
                        </div>
                        <div
                          id={`mobilesub-${it.key}`}
                          className={cn(
                            'mobile-nav-subgrid',
                            expanded === it.key ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                          )}
                        >
                          <ul className="mobile-nav-sublist">
                            <li>
                              <Link
                                href={isEn ? it.en : it.fr}
                                onClick={close}
                                className="mobile-nav-sublink mobile-nav-sublink--all"
                              >
                                {tNav('seeAll')}
                                <Icon name="arrow-right" size={14} />
                              </Link>
                            </li>
                            {it.children.map((c) =>
                              c.comingSoon ? (
                                <li key={c.key}>
                                  <span className="mobile-nav-sublink is-soon">
                                    <span>{tNav(c.key)}</span>
                                    <span className="mobile-nav-soon">{tNav('comingSoon')}</span>
                                  </span>
                                </li>
                              ) : (
                                <li key={c.key}>
                                  <Link
                                    href={isEn ? c.en : c.fr}
                                    onClick={close}
                                    className="mobile-nav-sublink"
                                  >
                                    {tNav(c.key)}
                                  </Link>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </li>
                    ),
                  )}
                </ul>

                <div className="mobile-nav-quick">
                  <Link href={isEn ? '/en/contact' : '/contact'} onClick={close} className="mobile-nav-quick-chip">
                    <Icon name="mail" size={15} />
                    {tNav('contact')}
                  </Link>
                  <Link href={isEn ? '/en/programs' : '/programmes'} onClick={close} className="mobile-nav-quick-chip">
                    <Icon name="library" size={15} />
                    {tNav('programs')}
                  </Link>
                </div>
              </nav>

              <footer className="mobile-nav-footer">
                <ButtonLink
                  href={isEn ? '/en/admissions' : '/admissions'}
                  onClick={close}
                  size="lg"
                  fullWidth
                  trailingIcon={<Icon name="arrow-right" size={18} />}
                >
                  {tCommon('apply')}
                </ButtonLink>
                <a
                  href={PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  aria-label={tCommon('portalAccessAria')}
                  className="mobile-nav-portal"
                >
                  <Icon name="laptop" size={18} aria-hidden />
                  <span>{tCommon('portalAccess')}</span>
                </a>
                <div className="mobile-nav-lang">
                  <span className="mobile-nav-lang-label">{tNav('language')}</span>
                  <LanguageSwitcher />
                </div>
              </footer>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        aria-label={open ? tCommon('close') : tNav('menu')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mobile-nav-trigger xl:hidden"
      >
        <Icon name={open ? 'close' : 'menu'} size={22} weight="medium" />
      </button>
      {overlay}
    </>
  );
}
