'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { Faculty, Locale } from '@unm/types';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { getFacultyCoverSrc } from '@/lib/faculty-images';
import { facultyPath, localized } from '@/lib/utils';
import type { BreadcrumbItem } from '@/lib/schema';

interface Props {
  faculty: Faculty;
  breadcrumbItems?: BreadcrumbItem[];
}

export function FacultyComingSoon({ faculty, breadcrumbItems }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('facultyPage');
  const accent = faculty.color || '#B5341A';
  const cover = getFacultyCoverSrc(faculty);
  const title = localized(faculty.name, locale);
  const description = localized(faculty.description, locale);
  const fromCms = cover.startsWith('/cms-media/');
  const contactHref = locale === 'en' ? '/en/contact' : '/contact';
  const facultiesHref = locale === 'en' ? '/en/faculties' : '/facultes';

  const crumbs: BreadcrumbItem[] = breadcrumbItems ?? [
    { name: locale === 'en' ? 'Home' : 'Accueil', url: locale === 'en' ? '/en' : '/' },
    {
      name: locale === 'en' ? 'Faculties' : 'Facultés',
      url: facultiesHref,
    },
    { name: title, url: facultyPath(faculty.slug, locale) },
  ];

  return (
    <>
      <section className="faculty-hero faculty-hero--coming relative flex flex-col overflow-hidden">
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
          <div className="min-w-0 lg:col-span-8 xl:col-span-7">
            <ScrollReveal from="up" duration={900}>
              <div className="faculty-hero-meta">
                <p className="faculty-hero-eyebrow">{t('eyebrow')}</p>
                <span className="faculty-hero-rule" aria-hidden />
              </div>
              <h1 className="faculty-hero-title">{title}</h1>
              <p className="faculty-hero-desc">{description}</p>

              <div className="faculty-coming-status">
                <span className="faculty-coming-badge">
                  <Icon name="library" size={14} />
                  {t('comingSoonBadge')}
                </span>
                <p className="faculty-coming-note">{t('comingSoonNote')}</p>
              </div>

              <div className="faculty-coming-actions">
                <ButtonLink
                  href={contactHref}
                  size="lg"
                  trailingIcon={<Icon name="mail" size={18} />}
                >
                  {t('getNotified')}
                </ButtonLink>
                <ButtonLink
                  href={facultiesHref}
                  size="lg"
                  variant="ghost"
                  className="faculty-coming-ghost"
                  trailingIcon={<Icon name="arrow-right" size={16} />}
                >
                  {t('backToFaculties')}
                </ButtonLink>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="faculty-coming-band">
        <div className="container-page">
          <ScrollReveal>
            <div className="faculty-coming-panel">
              <div className="faculty-coming-panel-copy">
                <p className="faculty-coming-panel-eyebrow">{t('comingSoonPanelEyebrow')}</p>
                <h2 className="faculty-coming-panel-title">{t('comingSoonPanelTitle')}</h2>
                <p className="faculty-coming-panel-text">{t('comingSoonPanelBody')}</p>
              </div>
              <ul className="faculty-coming-steps">
                <li>
                  <span className="faculty-coming-step-num" aria-hidden>
                    01
                  </span>
                  <div>
                    <p className="faculty-coming-step-title">{t('comingSoonStep1Title')}</p>
                    <p className="faculty-coming-step-text">{t('comingSoonStep1Body')}</p>
                  </div>
                </li>
                <li>
                  <span className="faculty-coming-step-num" aria-hidden>
                    02
                  </span>
                  <div>
                    <p className="faculty-coming-step-title">{t('comingSoonStep2Title')}</p>
                    <p className="faculty-coming-step-text">{t('comingSoonStep2Body')}</p>
                  </div>
                </li>
                <li>
                  <span className="faculty-coming-step-num" aria-hidden>
                    03
                  </span>
                  <div>
                    <p className="faculty-coming-step-title">{t('comingSoonStep3Title')}</p>
                    <p className="faculty-coming-step-text">{t('comingSoonStep3Body')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
