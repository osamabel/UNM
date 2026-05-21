import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Faculty, Locale } from '@unm/types';
import { facultyPath, localized } from '@/lib/utils';
import { ButtonLink } from '@/components/ui/Button';

interface Props {
  faculties: Faculty[];
}

// ════════════════════════════════════════════════════════════════
// Editorial showcase of UNM faculties for the /facultes index page.
//
// Two distinct visual treatments:
//   • The operational faculty (UNM Business School) gets a wide,
//     editorially-styled hero card with brand colour and a CTA.
//   • The faculties in preparation are shown smaller, in a separate
//     section, in a neutral palette — clearly NOT in the same league.
//
// No grid sticking the four together: the active one stands alone,
// the upcoming ones live below as a distinct programmatic block.
// ════════════════════════════════════════════════════════════════
export function FacultiesShowcase({ faculties }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('nav');
  const isEn = locale === 'en';

  const ordered = [...faculties].sort(
    (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999),
  );
  const active = ordered.filter((f) => !f.comingSoon);
  const upcoming = ordered.filter((f) => f.comingSoon);

  return (
    <div className="container-page space-y-20 py-16 lg:py-20">
      {/* Active faculty — hero card */}
      {active.length > 0 && (
        <section aria-labelledby="active-faculties-heading">
          <header className="mb-10 flex items-baseline justify-between">
            <p
              id="active-faculties-heading"
              className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-primary"
            >
              {isEn ? 'In operation' : 'Faculté en activité'}
            </p>
            <p className="font-sans text-[11px] text-secondary-400">
              {active.length} / {ordered.length}
            </p>
          </header>

          <div className="space-y-8">
            {active.map((f) => (
              <ActiveFacultyCard key={f.id} faculty={f} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming faculties — secondary, neutral palette */}
      {upcoming.length > 0 && (
        <section aria-labelledby="upcoming-faculties-heading">
          <header className="mb-10 flex items-baseline justify-between border-t border-warm-200 pt-8">
            <div>
              <p
                id="upcoming-faculties-heading"
                className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-400"
              >
                {isEn ? 'In preparation' : 'Facultés en préparation'}
              </p>
              <p className="mt-2 max-w-xl text-sm text-secondary-400">
                {isEn
                  ? "UNM is preparing the next generation of faculties — opening dates will be announced over the coming intakes."
                  : "L'UNM prépare la prochaine génération de facultés — les dates d'ouverture seront annoncées au fil des rentrées."}
              </p>
            </div>
            <p className="font-sans text-[11px] text-secondary-400 shrink-0">
              {upcoming.length} / {ordered.length}
            </p>
          </header>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((f) => (
              <UpcomingFacultyCard key={f.id} faculty={f} locale={locale} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Active faculty — full-width editorial card with brand accent
// ─────────────────────────────────────────────────────────────────
function ActiveFacultyCard({ faculty: f, locale }: { faculty: Faculty; locale: Locale }) {
  const isEn = locale === 'en';
  const count = f.programCount ?? 0;
  return (
    <article className="overflow-hidden rounded-card border border-warm-200 bg-white">
      <div className="grid lg:grid-cols-[1fr_2fr]">
        {/* Coloured sidebar — brand identity */}
        <div
          className="relative px-8 py-10 text-warm-50"
          style={{ backgroundColor: f.color || '#B5341A' }}
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-warm-100">
            UNM
          </p>
          <h2 className="mt-4 font-display text-display-lg text-warm-50">
            {localized(f.name, locale).replace(/^UNM\s+/, '')}
          </h2>
          <p className="mt-8 font-sans text-3xl font-light text-warm-50">
            {count}
          </p>
          <p className="font-sans text-xs uppercase tracking-wider text-warm-100">
            {isEn
              ? count > 1 ? 'programmes' : 'programme'
              : count > 1 ? 'programmes' : 'programme'}
          </p>
        </div>

        {/* Editorial body */}
        <div className="flex flex-col justify-between gap-6 px-8 py-10 lg:px-10">
          <p className="text-secondary leading-relaxed">
            {localized(f.description, locale)}
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={facultyPath(f.slug, locale)}>
              {isEn ? 'Explore the faculty' : 'Découvrir la faculté'}
            </ButtonLink>
            <ButtonLink href={locale === 'en' ? '/en/programs' : '/programmes'} variant="ghost">
              {isEn ? 'See all programmes' : 'Voir tous les programmes'}
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────
// Upcoming faculty — compact, neutral, clearly a different tier
// ─────────────────────────────────────────────────────────────────
function UpcomingFacultyCard({ faculty: f, locale }: { faculty: Faculty; locale: Locale }) {
  const t = useTranslations('nav');
  return (
    <li className="rounded-card border border-warm-200 bg-warm-100/40 p-6">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary-400">
        UNM
      </p>
      <h3 className="mt-2 font-display text-lg text-secondary-400">
        {localized(f.name, locale).replace(/^UNM\s+/, '')}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-secondary-400 line-clamp-4">
        {localized(f.description, locale)}
      </p>
      <p className="mt-6 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary-400">
        {t('comingSoon')}
      </p>
    </li>
  );
}
