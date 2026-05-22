'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { Faculty, Locale } from '@unm/types';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { FacultyHeroPanel } from '@/components/faculty/FacultyHeroPanel';
import { localized } from '@/lib/utils';

export function FacultyComingSoon({ faculty }: { faculty: Faculty }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('facultyPage');
  const accent = faculty.color || '#3D1A0B';

  return (
    <section className="relative overflow-hidden border-b border-warm-150/50 bg-canvas">
      <div
        className="hero-blob -left-12 top-0 h-56 w-56 motion-reduce:hidden"
        style={{ backgroundColor: `${accent}10` }}
        aria-hidden
      />
      <div className="hero-bg pointer-events-none absolute inset-0" aria-hidden />

      <div className="container-page relative min-w-0 py-10 sm:py-14 lg:py-16 lg:pr-[13rem] xl:pr-[15rem]">
        <FacultyHeroPanel
          eyebrow={t('eyebrow')}
          title={localized(faculty.name, locale)}
          description={localized(faculty.description, locale)}
          accent={accent}
        >
          <span className="glass-pill inline-flex max-w-full text-xs font-semibold text-secondary/80">
            <Icon name="library" size={14} className="shrink-0 text-primary" />
            {t('comingSoonBadge')}
          </span>
          <p className="max-w-md text-center font-heading text-xs font-semibold uppercase tracking-[0.14em] text-secondary/50 lg:text-left">
            {t('comingSoonNote')}
          </p>
          <div className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row lg:justify-start">
            <ButtonLink
              href={locale === 'en' ? '/en/contact' : '/contact'}
              size="lg"
              fullWidth
              className="sm:!w-auto"
              trailingIcon={<Icon name="mail" size={18} />}
            >
              {t('getNotified')}
            </ButtonLink>
            <ButtonLink
              href={locale === 'en' ? '/en/faculties' : '/facultes'}
              size="lg"
              variant="ghost"
              fullWidth
              className="sm:!w-auto"
            >
              {t('backToFaculties')}
            </ButtonLink>
          </div>
        </FacultyHeroPanel>
      </div>
    </section>
  );
}
