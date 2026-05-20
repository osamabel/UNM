import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import type { Locale } from '@unm/types';

interface FooterColumn {
  title: string;
  links: { label: string; fr: string; en: string }[];
}

const COLUMNS_FR: FooterColumn[] = [
  {
    title: "L'Université",
    links: [
      { label: 'Présentation', fr: '/universite', en: '/en/university' },
      { label: 'Facultés', fr: '/facultes', en: '/en/faculties' },
      { label: 'Partenaires', fr: '/partenaires', en: '/en/partners' },
      { label: 'Actualités', fr: '/actualites', en: '/en/news' },
    ],
  },
  {
    title: 'Académique',
    links: [
      { label: 'Programmes', fr: '/programmes', en: '/en/programs' },
      { label: 'Admissions', fr: '/admissions', en: '/en/admissions' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Contact', fr: '/contact', en: '/en/contact' },
      { label: 'Mentions légales', fr: '/mentions-legales', en: '/en/legal-notice' },
      { label: "Conditions d'utilisation", fr: '/cgu', en: '/en/terms-of-use' },
      { label: 'Conditions de vente', fr: '/cgv', en: '/en/terms-of-sale' },
      { label: 'Données & cookies', fr: '/confidentialite', en: '/en/privacy' },
    ],
  },
];

const COLUMNS_EN: FooterColumn[] = [
  {
    title: 'University',
    links: [
      { label: 'About', fr: '/universite', en: '/en/university' },
      { label: 'Faculties', fr: '/facultes', en: '/en/faculties' },
      { label: 'Partners', fr: '/partenaires', en: '/en/partners' },
      { label: 'News', fr: '/actualites', en: '/en/news' },
    ],
  },
  {
    title: 'Academic',
    links: [
      { label: 'Programs', fr: '/programmes', en: '/en/programs' },
      { label: 'Admissions', fr: '/admissions', en: '/en/admissions' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Contact', fr: '/contact', en: '/en/contact' },
      { label: 'Legal notice', fr: '/mentions-legales', en: '/en/legal-notice' },
      { label: 'Terms of use', fr: '/cgu', en: '/en/terms-of-use' },
      { label: 'Terms of sale', fr: '/cgv', en: '/en/terms-of-sale' },
      { label: 'Data & cookies', fr: '/confidentialite', en: '/en/privacy' },
    ],
  },
];

export function Footer() {
  const locale = useLocale() as Locale;
  const t = useTranslations('footer');
  const columns = locale === 'en' ? COLUMNS_EN : COLUMNS_FR;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-warm-100">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <Logo tone="inherit" className="text-warm-50" />
            <p className="mt-4 max-w-xs text-sm text-warm-200">
              {locale === 'en'
                ? 'Building the digital generation of Morocco through excellence and innovation.'
                : "Construire la génération numérique du Maroc à travers l'excellence et l'innovation."}
            </p>
            <NewsletterForm className="mt-6" />
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-warm-50">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={locale === 'en' ? l.en : l.fr}
                      className="text-sm text-warm-200 hover:text-white hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-warm-500/30 pt-6">
          <p className="font-heading text-xs font-semibold uppercase tracking-wider text-warm-50">
            {locale === 'en' ? 'Partnership & accreditations' : 'Partenariat & accréditations'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['EBS Paris', 'EFMD', 'AACSB Business Education Alliance', 'CEFDG'].map((label) => (
              <span
                key={label}
                className="rounded-full border border-warm-500/40 bg-secondary-700/40 px-3 py-1 text-xs font-medium text-warm-100"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-warm-500/30 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-warm-300">
            {t('copyright', { year })}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-warm-300">
            <Link className="hover:text-white" href={locale === 'en' ? '/en/legal-notice' : '/mentions-legales'}>
              {t('legal')}
            </Link>
            <span aria-hidden="true">·</span>
            <Link className="hover:text-white" href={locale === 'en' ? '/en/terms-of-use' : '/cgu'}>
              {locale === 'en' ? 'Terms of use' : "Conditions d'utilisation"}
            </Link>
            <span aria-hidden="true">·</span>
            <Link className="hover:text-white" href={locale === 'en' ? '/en/terms-of-sale' : '/cgv'}>
              {locale === 'en' ? 'Terms of sale' : 'Conditions de vente'}
            </Link>
            <span aria-hidden="true">·</span>
            <Link className="hover:text-white" href={locale === 'en' ? '/en/privacy' : '/confidentialite'}>
              {t('privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
