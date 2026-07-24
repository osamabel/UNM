'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
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

export function FacultyHero({ faculty, breadcrumbItems }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('facultyPage');
  const ts = useTranslations('facultiesShowcase');
  const accent = faculty.color || '#B5341A';
  const count = faculty.programCount ?? 0;
  const programLabel = count > 1 ? ts('programPlural') : ts('programSingular');
  const cover = getFacultyCoverSrc(faculty);
  const title = localized(faculty.name, locale);
  const description = localized(faculty.description, locale);
  const fromCms = cover.startsWith('/cms-media/');

  const crumbs: BreadcrumbItem[] = breadcrumbItems ?? [
    { name: locale === 'en' ? 'Home' : 'Accueil', url: locale === 'en' ? '/en' : '/' },
    {
      name: locale === 'en' ? 'Faculties' : 'Facultés',
      url: locale === 'en' ? '/en/faculties' : '/facultes',
    },
    { name: title, url: facultyPath(faculty.slug, locale) },
  ];

  return (
    <section className="faculty-hero relative flex flex-col overflow-hidden">
      <Image
        src={cover}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_30%]"
        unoptimized={fromCms}
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

      <div className="container-page relative z-10 mt-auto grid gap-8 pb-12 pt-10 sm:pb-14 sm:pt-12 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-16 lg:pt-16">
        <div className="min-w-0 lg:col-span-7 xl:col-span-6">
          <ScrollReveal from="up" duration={900}>
            <div className="faculty-hero-meta">
              <p className="faculty-hero-eyebrow">{t('eyebrow')}</p>
              <span className="faculty-hero-rule" aria-hidden />
            </div>
            <h1 className="faculty-hero-title">{title}</h1>
            <p className="faculty-hero-desc">{description}</p>
            {count > 0 ? (
              <ul className="faculty-hero-trust">
                <li>
                  <Icon name="library" size={15} className="text-[rgba(255,196,170,0.95)]" />
                  {count} {programLabel}
                </li>
              </ul>
            ) : null}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
