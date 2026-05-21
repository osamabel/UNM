'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { Logo } from '@/components/layout/Logo';
import type { Locale } from '@unm/types';

type FooterLink = { label: string; fr: string; en: string };

function buildColumns(isEn: boolean): { titleKey: 'university' | 'academic' | 'resources'; links: FooterLink[] }[] {
  return [
    {
      titleKey: 'university',
      links: isEn
        ? [
            { label: 'About', fr: '/universite', en: '/en/university' },
            { label: 'Faculties', fr: '/facultes', en: '/en/faculties' },
            { label: 'Partners', fr: '/partenaires', en: '/en/partners' },
            { label: 'News', fr: '/actualites', en: '/en/news' },
          ]
        : [
            { label: 'Présentation', fr: '/universite', en: '/en/university' },
            { label: 'Facultés', fr: '/facultes', en: '/en/faculties' },
            { label: 'Partenaires', fr: '/partenaires', en: '/en/partners' },
            { label: 'Actualités', fr: '/actualites', en: '/en/news' },
          ],
    },
    {
      titleKey: 'academic',
      links: isEn
        ? [
            { label: 'Programs', fr: '/programmes', en: '/en/programs' },
            { label: 'Admissions', fr: '/admissions', en: '/en/admissions' },
          ]
        : [
            { label: 'Programmes', fr: '/programmes', en: '/en/programs' },
            { label: 'Admissions', fr: '/admissions', en: '/en/admissions' },
          ],
    },
    {
      titleKey: 'resources',
      links: isEn
        ? [
            { label: 'Contact', fr: '/contact', en: '/en/contact' },
            { label: 'Organizations', fr: '/organisations', en: '/en/organisations' },
            { label: 'Data & cookies', fr: '/confidentialite', en: '/en/privacy' },
          ]
        : [
            { label: 'Contact', fr: '/contact', en: '/en/contact' },
            { label: 'Organisations', fr: '/organisations', en: '/en/organisations' },
            { label: 'Données & cookies', fr: '/confidentialite', en: '/en/privacy' },
          ],
    },
  ];
}

function FooterNavTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-warm-50">
      <span className="h-px w-5 bg-primary/70" aria-hidden />
      {children}
    </h3>
  );
}

export function Footer() {
  const locale = useLocale() as Locale;
  const t = useTranslations('footer');
  const year = new Date().getFullYear();
  const isEn = locale === 'en';
  const homeHref = isEn ? '/en' : '/';
  const columns = buildColumns(isEn);

  const legalLinks = [
    { href: isEn ? '/en/legal-notice' : '/mentions-legales', label: t('legal') },
    { href: isEn ? '/en/terms-of-use' : '/cgu', label: t('termsOfUse') },
    { href: isEn ? '/en/terms-of-sale' : '/cgv', label: t('termsOfSale') },
  ];

  return (
    <footer className="glass-footer relative mt-auto overflow-hidden text-warm-100">
      <div className="hero-panel-pattern pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl motion-reduce:hidden"
        aria-hidden
      />

      <div className="container-page relative py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 xl:col-span-4">
            <Link href={homeHref} className="inline-block transition-opacity duration-300 hover:opacity-90">
              <Logo surface="dark" className="!inline-flex sm:[&_.logo-wordmark]:h-11" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-warm-200/90">{t('tagline')}</p>
            <NewsletterForm className="mt-8 max-w-md" />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:gap-10 xl:col-span-8">
            {columns.map((col) => (
              <nav key={col.titleKey} aria-label={t(col.titleKey)}>
                <FooterNavTitle>{t(col.titleKey)}</FooterNavTitle>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={isEn ? l.en : l.fr} className="link-on-dark">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="divider-fine mt-12 flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-warm-300/90">{t('copyright', { year })}</p>
          <nav
            className="flex flex-wrap items-center gap-x-1 gap-y-2 text-xs"
            aria-label={isEn ? 'Legal' : 'Mentions légales'}
          >
            {legalLinks.map((link, i) => (
              <span key={link.href} className="inline-flex items-center gap-1">
                {i > 0 && (
                  <span className="text-warm-500/60" aria-hidden>
                    ·
                  </span>
                )}
                <Link href={link.href} className="link-on-dark">
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
