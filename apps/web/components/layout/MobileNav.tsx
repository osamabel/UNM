'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { Locale } from '@unm/types';
import { cn } from '@/lib/utils';

// Mirror of the desktop Nav structure. "Université" expands into an
// accordion that lists the same 6 sub-items as the desktop dropdown.

type NavKey =
  | 'university' | 'faculties' | 'programs' | 'admissions' | 'contact' | 'organisations'
  | 'manifesto' | 'presidentWord' | 'partners' | 'newsUnm' | 'events' | 'newsroom'
  | 'facultyBusinessSchool' | 'facultyGovernance' | 'facultyTechnology' | 'facultySportBusiness';

interface LeafItem { kind: 'leaf'; key: NavKey; fr: string; en: string; comingSoon?: boolean; }
interface ParentItem { kind: 'parent'; key: NavKey; fr: string; en: string; children: LeafItem[]; }
type Item = LeafItem | ParentItem;

const UNIVERSITY_SUB: LeafItem[] = [
  { kind: 'leaf', key: 'manifesto',     fr: '/universite/manifeste',         en: '/en/university/manifeste' },
  { kind: 'leaf', key: 'presidentWord', fr: '/universite/mot-du-president',  en: '/en/university/mot-du-president' },
  { kind: 'leaf', key: 'partners',      fr: '/partenaires',                  en: '/en/partners' },
  { kind: 'leaf', key: 'newsUnm',       fr: '/actualites',                   en: '/en/news' },
  { kind: 'leaf', key: 'events',        fr: '/universite/evenements',        en: '/en/university/evenements' },
  { kind: 'leaf', key: 'newsroom',      fr: '/universite/newsroom',          en: '/en/university/newsroom' },
];

const FACULTIES_SUB: LeafItem[] = [
  { kind: 'leaf', key: 'facultyBusinessSchool', fr: '/facultes/business-school',          en: '/en/faculties/business-school' },
  { kind: 'leaf', key: 'facultyGovernance',     fr: '/facultes/school-of-governance',     en: '/en/faculties/school-of-governance' },
  { kind: 'leaf', key: 'facultyTechnology',     fr: '/facultes/school-of-technology',     en: '/en/faculties/school-of-technology', comingSoon: true },
  { kind: 'leaf', key: 'facultySportBusiness',  fr: '/facultes/school-of-sport-business', en: '/en/faculties/school-of-sport-business', comingSoon: true },
];

const ITEMS: Item[] = [
  { kind: 'parent', key: 'university',    fr: '/universite',    en: '/en/university',    children: UNIVERSITY_SUB },
  { kind: 'parent', key: 'faculties',     fr: '/facultes',      en: '/en/faculties',     children: FACULTIES_SUB },
  { kind: 'leaf',   key: 'programs',      fr: '/programmes',    en: '/en/programs'   },
  { kind: 'leaf',   key: 'admissions',    fr: '/admissions',    en: '/en/admissions' },
  { kind: 'leaf',   key: 'organisations', fr: '/organisations', en: '/en/organizations' },
  { kind: 'leaf',   key: 'contact',       fr: '/contact',       en: '/en/contact'    },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<NavKey | null>(null);
  const locale = useLocale() as Locale;
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded text-secondary hover:bg-warm-100 lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <path
            fill="currentColor"
            d={
              open
                ? 'M12 10.6 17.3 5.3l1.4 1.4-5.3 5.3 5.3 5.3-1.4 1.4-5.3-5.3-5.3 5.3-1.4-1.4 5.3-5.3-5.3-5.3 1.4-1.4z'
                : 'M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z'
            }
          />
        </svg>
      </button>

      <div
        className={cn(
          'fixed inset-0 z-40 transform bg-warm-50 transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-hidden={!open}
      >
        <div className="container-page flex h-full flex-col overflow-y-auto pt-20 pb-8">
          <ul className="flex-1 space-y-2">
            {ITEMS.map((it) =>
              it.kind === 'leaf' ? (
                <li key={it.key}>
                  <Link
                    href={locale === 'en' ? it.en : it.fr}
                    onClick={close}
                    className="block rounded-card border border-warm-200 bg-white p-4 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-secondary hover:border-primary hover:text-primary"
                  >
                    {tNav(it.key)}
                  </Link>
                </li>
              ) : (
                <li key={it.key} className="rounded-card border border-warm-200 bg-white overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={expanded === it.key}
                    aria-controls={`mobilesub-${it.key}`}
                    onClick={() => setExpanded((cur) => (cur === it.key ? null : it.key))}
                    className="flex w-full items-center justify-between p-4 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-secondary hover:text-primary"
                  >
                    <span>{tNav(it.key)}</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 12 12"
                      className={cn(
                        'h-3 w-3 transition-transform',
                        expanded === it.key && 'rotate-180',
                      )}
                    >
                      <path fill="currentColor" d="M2 4l4 4 4-4z" />
                    </svg>
                  </button>
                  {expanded === it.key && (
                    <ul
                      id={`mobilesub-${it.key}`}
                      className="border-t border-warm-200 bg-warm-100/50"
                    >
                      <li>
                        <Link
                          href={locale === 'en' ? it.en : it.fr}
                          onClick={close}
                          className="block px-4 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-primary hover:bg-warm-100"
                        >
                          {tNav(it.key)} →
                        </Link>
                      </li>
                      {it.children.map((c) =>
                        c.comingSoon ? (
                          <li key={c.key}>
                            <span
                              aria-disabled="true"
                              className="flex items-center justify-between gap-3 px-4 py-3 font-sans text-base font-medium text-secondary-400 cursor-not-allowed"
                            >
                              <span>{tNav(c.key)}</span>
                              <span className="rounded-full bg-warm-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary">
                                {tNav('comingSoon')}
                              </span>
                            </span>
                          </li>
                        ) : (
                          <li key={c.key}>
                            <Link
                              href={locale === 'en' ? c.en : c.fr}
                              onClick={close}
                              className="block px-4 py-3 font-sans text-base font-medium text-secondary hover:bg-warm-100 hover:text-primary"
                            >
                              {tNav(c.key)}
                            </Link>
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </li>
              ),
            )}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <ButtonLink
              href={locale === 'en' ? '/en/admissions' : '/admissions'}
              onClick={close}
              size="lg"
              fullWidth
            >
              {tCommon('apply')}
            </ButtonLink>
            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
