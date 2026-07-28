'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { getFacultyCoverSrc } from '@/lib/faculty-images';
import { facultyPath, localized } from '@/lib/utils';
import type { BreadcrumbItem } from '@/lib/schema';
import type { Faculty, Locale } from '@unm/types';

interface Props {
  faculty: Faculty;
  breadcrumbItems?: BreadcrumbItem[];
}

/** Keep the lead intro; drop the EBS-1967 history paragraph. */
function leadDescription(text: string) {
  return (
    text
      .split(/\n\n+/)
      .map((p) => p.trim())
      .find((p) => p.length > 0 && !/1967/.test(p)) ?? ''
  );
}

export function FacultyHero({ faculty, breadcrumbItems }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('facultyPage');
  const te = useTranslations('ebs');
  const ts = useTranslations('facultiesShowcase');
  const accent = faculty.color || '#B5341A';
  const count = faculty.programCount ?? 0;
  const programLabel = count > 1 ? ts('programPlural') : ts('programSingular');
  const cover = getFacultyCoverSrc(faculty);
  const isBusinessSchool = faculty.slug === 'business-school';
  const isEn = locale === 'en';
  const title = isBusinessSchool
    ? t('businessSchoolTitle')
    : localized(faculty.name, locale);
  const description = isBusinessSchool
    ? te('tagline')
    : leadDescription(localized(faculty.description, locale));
  const fromCms = cover.startsWith('/cms-media/');
  const programsHref = isBusinessSchool
    ? '#programmes'
    : isEn
      ? '/en/programs'
      : '/programmes';
  const admissionsHref = isEn ? '/en/admissions' : '/admissions';

  const crumbs: BreadcrumbItem[] = breadcrumbItems ?? [
    { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
    {
      name: isEn ? 'Faculties' : 'Facultés',
      url: isEn ? '/en/faculties' : '/facultes',
    },
    { name: title, url: facultyPath(faculty.slug, locale) },
  ];

  return (
    <section
      className={`faculty-hero relative flex flex-col overflow-hidden${
        isBusinessSchool ? ' faculty-hero--business' : ''
      }`}
    >
      <Image
        src={cover}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_30%]"
        unoptimized={fromCms}
        aria-hidden
      />
      <div className="faculty-hero-scrub" aria-hidden />
      <div
        className="faculty-hero-accent"
        style={{
          background: `radial-gradient(ellipse 55% 50% at 78% 35%, ${accent}55, transparent 65%)`,
        }}
        aria-hidden
      />

      <div className="container-page relative z-10 pt-5 sm:pt-6">
        <Breadcrumb items={crumbs} tone="onDark" />
      </div>

      <div className="container-page relative z-10 mt-auto pb-12 pt-10 sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-16">
        <div className="faculty-hero-copy min-w-0 max-w-3xl lg:max-w-4xl">
          <ScrollReveal from="up" duration={900}>
            <div className="faculty-hero-meta">
              <p className="faculty-hero-eyebrow">{t('eyebrow')}</p>
              <span className="faculty-hero-rule" aria-hidden />
            </div>
            <h1 className="faculty-hero-title">{title}</h1>
            {description ? <p className="faculty-hero-desc">{description}</p> : null}

            {isBusinessSchool ? (
              <div className="faculty-hero-actions">
                <ButtonLink
                  href={programsHref}
                  size="lg"
                  className="hero-cta-primary w-full sm:w-auto"
                  trailingIcon={<Icon name="arrow-right" size={18} />}
                >
                  {t('heroCtaPrograms')}
                </ButtonLink>
                <ButtonLink
                  href={admissionsHref}
                  variant="ghost"
                  size="lg"
                  className="hero-cta-secondary w-full sm:w-auto"
                >
                  {t('heroCtaApply')}
                </ButtonLink>
              </div>
            ) : null}

            {count > 0 ? (
              <ul className="faculty-hero-trust">
                <li>
                  <Icon name="library" size={15} className="text-[rgba(255,196,170,0.95)]" />
                  {count} {programLabel}
                </li>
                {isBusinessSchool ? (
                  <li>
                    <Icon name="globe" size={15} className="text-[rgba(255,196,170,0.95)]" />
                    {t('heroTrustAlliance')}
                  </li>
                ) : null}
              </ul>
            ) : null}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
