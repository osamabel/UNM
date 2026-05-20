import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import type { Locale, Program } from '@unm/types';
import { facultyPath, localized } from '@/lib/utils';

interface Props {
  program: Program;
}

// Editorial hero — dark brown background (HBS / Wharton brochure style),
// eyebrow + serif H1 + vocation paragraph + key specs row. The CTAs live
// in the sticky sidebar of the page layout, so the hero stays clean and
// content-focused.
export function ProgramHero({ program }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  const facLabel = program.faculty?.name ? localized(program.faculty.name, locale) : '';

  return (
    <section className="bg-secondary text-warm-50">
      <div className="container-page py-20 lg:py-24">
        <p className="eyebrow text-primary-200">
          <Badge variant="program-type" type={program.type} className="mr-3 align-middle">
            {program.type}
          </Badge>
          {program.faculty?.slug && (
            <Link
              href={facultyPath(program.faculty.slug, locale)}
              className="text-warm-200 hover:text-white hover:underline"
            >
              {facLabel}
            </Link>
          )}
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-display-xl text-warm-50">
          {localized(program.title, locale)}
        </h1>
        {program.vocation && localized(program.vocation, locale) && (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-warm-100">
            {localized(program.vocation, locale)}
          </p>
        )}

        {/* Specs row — minimal, no card chrome */}
        <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-6 border-t border-warm-500/30 pt-8 sm:grid-cols-3">
          <Spec label={t('duration')} value={program.duration} />
          <Spec label={t('format')} value={program.format} />
          <Spec
            label={t('language')}
            value={program.language.map((l) => l.toUpperCase()).join(' · ')}
          />
        </dl>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-200">
        {label}
      </dt>
      <dd className="mt-2 font-display text-2xl text-warm-50">{value}</dd>
    </div>
  );
}
