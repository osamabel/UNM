import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { facultyPath, localized } from '@/lib/utils';
import type { Faculty, Locale } from '@unm/types';

interface Props {
  faculties: Faculty[];
}

// Editorial faculty grid — no colored circle badges (which screamed
// "Tailwind UI generated"). A thin vertical rule on the left of each card
// in the brand colour evokes a sober institutional treatment instead.
export function FacultyGrid({ faculties }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');

  const ordered = [...faculties].sort((a, b) => {
    const csDiff = Number(!!a.comingSoon) - Number(!!b.comingSoon);
    if (csDiff !== 0) return csDiff;
    return (a.displayOrder ?? 999) - (b.displayOrder ?? 999);
  });

  return (
    <SectionWrapper>
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow">{t('facultiesEyebrow')}</p>
        <h2 className="mt-3 font-display text-display-md text-secondary">
          {t('facultiesTitle')}
        </h2>
        <p className="mt-4 text-secondary-400">{t('facultiesSubtitle')}</p>
      </header>
      <div className="grid divide-warm-200 border-y border-warm-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {ordered.map((f) => (
          <FacultyCard key={f.id} faculty={f} locale={locale} />
        ))}
      </div>
    </SectionWrapper>
  );
}

function FacultyCard({ faculty: f, locale }: { faculty: Faculty; locale: Locale }) {
  const isEn = locale === 'en';
  const comingSoonLabel = isEn ? 'In preparation' : 'En préparation';
  const programWord = isEn ? 'programmes' : 'programmes';

  const inner = (
    <div
      className="relative h-full border-l-2 px-6 py-8"
      style={{ borderLeftColor: f.color || '#B5341A' }}
    >
      {f.comingSoon && (
        <span
          aria-label={comingSoonLabel}
          className="absolute right-6 top-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-warm-500"
        >
          {comingSoonLabel}
        </span>
      )}
      <h3
        className={
          f.comingSoon
            ? 'font-display text-2xl text-secondary-400'
            : 'font-display text-2xl text-secondary group-hover:text-primary'
        }
      >
        {localized(f.name, locale)}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-secondary-400 line-clamp-4">
        {localized(f.description, locale)}
      </p>
      {!f.comingSoon ? (
        <p className="mt-6 font-sans text-xs font-medium uppercase tracking-wider text-primary">
          {f.programCount ?? 0} {programWord}
          <span aria-hidden="true" className="ml-1">→</span>
        </p>
      ) : (
        <p className="mt-6 font-sans text-xs font-medium uppercase tracking-wider text-warm-500">
          {isEn ? 'Upcoming' : 'Lancement à venir'}
        </p>
      )}
    </div>
  );

  if (f.comingSoon) {
    return <article aria-disabled="true" className="opacity-95">{inner}</article>;
  }

  return (
    <Link href={facultyPath(f.slug, locale)} className="group block">
      {inner}
    </Link>
  );
}
