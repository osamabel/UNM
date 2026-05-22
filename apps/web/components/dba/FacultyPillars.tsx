import { useLocale } from 'next-intl';
import type { Locale } from '@unm/types';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { IconBox, type IconName } from '@/components/ui/Icon';
import { dbaContent } from '@/lib/dba-content';
import { localized } from '@/lib/utils';

const PILLAR_ICONS: IconName[] = ['graduation', 'briefcase', 'user-check'];

export function FacultyPillars() {
  const locale = useLocale() as Locale;
  const { faculty } = dbaContent;
  return (
    <SectionWrapper id="intervenants" tone="default">
      <div className="max-w-3xl">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {localized(faculty.eyebrow, locale)}
        </p>
        <h2 className="mt-3 font-display text-display-lg text-secondary">
          {localized(faculty.title, locale)}
        </h2>
        <p className="mt-4 text-secondary-400">
          {localized(faculty.intro, locale)}
        </p>
      </div>

      <ul className="mt-12 grid gap-6 lg:grid-cols-3">
        {faculty.pillars.map((p, i) => (
          <li key={i} className="card-interactive p-8">
            <IconBox name={PILLAR_ICONS[i] ?? 'graduation'} size="md" className="mb-5" />
            <h3 className="font-display text-xl text-secondary">
              {localized(p.title, locale)}
            </h3>
            <p className="mt-3 text-secondary-400">
              {localized(p.body, locale)}
            </p>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}
