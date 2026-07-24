'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { Logo } from '@/components/layout/Logo';
import { Icon } from '@/components/ui/Icon';
import { cn, localized } from '@/lib/utils';
import { digitsOnly } from '@/lib/site-settings';
import type { Locale, SiteSettings } from '@unm/types';

type FooterLink = { label: string; fr: string; en: string };
type SocialKey = 'whatsapp' | 'linkedin' | 'facebook' | 'instagram' | 'youtube';

function buildColumns(isEn: boolean): { titleKey: 'university' | 'academic' | 'resources'; links: FooterLink[] }[] {
  return [
    {
      titleKey: 'university',
      links: isEn
        ? [
            { label: 'About', fr: '/universite/manifeste', en: '/en/university/manifeste' },
            { label: 'Faculties', fr: '/facultes', en: '/en/faculties' },
            { label: 'Partners', fr: '/partenaires', en: '/en/partners' },
            { label: 'News', fr: '/actualites', en: '/en/news' },
          ]
        : [
            { label: 'Manifeste', fr: '/universite/manifeste', en: '/en/university/manifeste' },
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
    <h3 className="mb-3.5 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-200">
      {children}
    </h3>
  );
}

function SocialGlyph({ name }: { name: SocialKey }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true as const,
  };

  switch (name) {
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...common}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
  }
}

function SocialIconLink({
  href,
  label,
  name,
}: {
  href: string;
  label: string;
  name: SocialKey;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg',
        'border border-white/10 bg-white/[0.06] text-warm-100',
        'transition-colors duration-300 hover:border-primary/45 hover:bg-primary/25 hover:text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
      )}
    >
      <SocialGlyph name={name} />
    </a>
  );
}

function formatAddressLines(address: string): string[] {
  return address
    .split(/\s*[·•|]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function Footer({ settings }: { settings: SiteSettings }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('footer');
  const year = new Date().getFullYear();
  const isEn = locale === 'en';
  const homeHref = isEn ? '/en' : '/';
  const columns = buildColumns(isEn);
  const phoneDigits = digitsOnly(settings.contact.phone);
  const waDigits = digitsOnly(settings.contact.whatsapp);
  const address = localized(settings.contact.address, locale);
  const addressLines = address ? formatAddressLines(address) : [];

  const legalLinks = [
    { href: isEn ? '/en/legal-notice' : '/mentions-legales', label: t('legal') },
    { href: isEn ? '/en/terms-of-use' : '/cgu', label: t('termsOfUse') },
    { href: isEn ? '/en/terms-of-sale' : '/cgv', label: t('termsOfSale') },
  ];

  const social: { href: string; label: string; name: SocialKey }[] = [
    waDigits
      ? { href: `https://wa.me/${waDigits}`, label: 'WhatsApp', name: 'whatsapp' as const }
      : null,
    settings.social.linkedin
      ? { href: settings.social.linkedin, label: 'LinkedIn', name: 'linkedin' as const }
      : null,
    settings.social.facebook
      ? { href: settings.social.facebook, label: 'Facebook', name: 'facebook' as const }
      : null,
    settings.social.instagram
      ? { href: settings.social.instagram, label: 'Instagram', name: 'instagram' as const }
      : null,
    settings.social.youtube
      ? { href: settings.social.youtube, label: 'YouTube', name: 'youtube' as const }
      : null,
  ].filter((s): s is { href: string; label: string; name: SocialKey } => Boolean(s));

  return (
    <footer className="relative mt-auto overflow-hidden bg-secondary text-warm-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 0% 100%, rgba(181,52,26,0.28), transparent 55%)',
        }}
        aria-hidden
      />

      <div className="container-page relative py-12 md:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.85fr)] lg:gap-12 xl:gap-16">
          {/* Brand cluster */}
          <div className="flex max-w-md flex-col gap-5">
            <div>
              <Link
                href={homeHref}
                className="inline-block max-w-[17.5rem] transition-opacity duration-300 hover:opacity-95"
                aria-label="UNM — Université Numérique du Maroc"
              >
                <Logo
                  surface="dark"
                  className="block w-full [&_.logo-wordmark]:h-auto [&_.logo-wordmark]:w-full [&_.logo-wordmark]:max-w-none"
                />
              </Link>
              <p className="mt-3.5 max-w-[20rem] text-[0.8125rem] leading-relaxed text-warm-200/85">
                {t('tagline')}
              </p>
            </div>

            <ul className="space-y-2 text-[0.8125rem] text-warm-200/90">
              {phoneDigits && (
                <li>
                  <a href={`tel:${phoneDigits}`} className="link-on-dark !text-[0.8125rem] inline-flex items-center gap-2.5">
                    <Icon name="phone" size={14} className="shrink-0 opacity-65" />
                    {settings.contact.phone}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="link-on-dark !text-[0.8125rem] inline-flex items-center gap-2.5"
                >
                  <Icon name="mail" size={14} className="shrink-0 opacity-65" />
                  {settings.contact.email}
                </a>
              </li>
              {addressLines.length > 0 && (
                <li className="flex items-start gap-2.5 text-warm-300/90">
                  <Icon name="map-pin" size={14} className="mt-0.5 shrink-0 opacity-65" />
                  <span className="space-y-0.5">
                    {addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </li>
              )}
            </ul>

            {social.length > 0 && (
              <ul className="flex flex-wrap items-center gap-2 pt-0.5" aria-label={isEn ? 'Social media' : 'Réseaux sociaux'}>
                {social.map((s) => (
                  <li key={s.name}>
                    <SocialIconLink href={s.href} label={s.label} name={s.name} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Links + newsletter */}
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 sm:gap-x-10">
              {columns.map((col) => (
                <nav key={col.titleKey} aria-label={t(col.titleKey)}>
                  <FooterNavTitle>{t(col.titleKey)}</FooterNavTitle>
                  <ul className="space-y-2">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link href={isEn ? l.en : l.fr} className="link-on-dark !text-[0.8125rem]">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <NewsletterForm layout="stacked" />
            </div>
          </div>
        </div>

        <div className="divider-fine mt-10 flex flex-col gap-3 pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-7">
          <p className="text-[0.6875rem] text-warm-300/85">{t('copyright', { year })}</p>
          <nav
            className="flex flex-wrap items-center gap-x-1 gap-y-1.5"
            aria-label={isEn ? 'Legal' : 'Mentions légales'}
          >
            {legalLinks.map((link, i) => (
              <span key={link.href} className="inline-flex items-center gap-1">
                {i > 0 && (
                  <span className="text-warm-500/55" aria-hidden>
                    ·
                  </span>
                )}
                <Link href={link.href} className="link-on-dark !text-[0.6875rem]">
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
