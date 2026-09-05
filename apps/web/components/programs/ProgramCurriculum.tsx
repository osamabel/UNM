import { useLocale } from 'next-intl';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import type { CurriculumModule, Locale } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  modules?: CurriculumModule[];
  programType?: string;
}

export function ProgramCurriculum({ modules, programType }: Props) {
  const locale = useLocale() as Locale;
  if (!modules || modules.length === 0) return null;

  const groups: { key: string; label: string; items: CurriculumModule[] }[] = [];
  for (const m of modules) {
    const groupValue =
      m.group && typeof m.group === 'object'
        ? (m.group[locale] ?? m.group.fr)
        : ((m.group as string | undefined) ?? '');
    const key = groupValue || '__nogroup__';
    let g = groups.find((group) => group.key === key);
    if (!g) {
      g = { key, label: groupValue, items: [] };
      groups.push(g);
    }
    g.items.push(m);
  }
  const hasGrouping = groups.some((g) => g.key !== '__nogroup__');
  // Group labels render an h3, so module titles sit one level deeper when grouped.
  const ModuleTitle = hasGrouping ? 'h4' : 'h3';

  const isEn = locale === 'en';
  const intro =
    programType === 'DBA'
      ? isEn
        ? 'A 2-year journey: high-level academic seminars, then progressive support toward a thesis with managerial impact.'
        : "Un parcours sur 2 années : séminaires académiques de haut niveau, puis accompagnement progressif vers une thèse à fort impact managérial."
      : isEn
        ? 'Seminars structured to cover the strategic, economic, regulatory and operational dimensions of the sector.'
        : 'Séminaires structurés pour couvrir les dimensions stratégiques, économiques, réglementaires et opérationnelles du secteur.';

  return (
    <section>
      <SectionHeader
        eyebrow={isEn ? 'Curriculum' : 'Programme'}
        title={isEn ? 'Curriculum' : 'Programme pédagogique'}
        description={intro}
      />

      <div className="mt-8 space-y-10">
        {groups.map((g) => (
          <div key={g.key}>
            {hasGrouping && g.label ? (
              <h3 className="mb-4 flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                <span className="h-px w-5 bg-primary/50" aria-hidden />
                {g.label}
              </h3>
            ) : null}
            <ol className="grid min-w-0 items-stretch gap-4 sm:grid-cols-2">
              {g.items.map((m) => {
                const description = m.description ? localized(m.description, locale) : '';
                return (
                  <li
                    key={m.code}
                    className="group card-flat flex h-full flex-col overflow-hidden px-5 py-5 sm:px-6 sm:py-6"
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-primary/70 via-primary/25 to-transparent opacity-0 transition-opacity duration-300 ease-smooth group-hover:opacity-100"
                      aria-hidden
                    />

                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full border border-primary/20 bg-primary/[0.07] px-2 font-sans text-[11px] font-semibold uppercase tabular-nums tracking-[0.08em] text-primary">
                        {m.code}
                      </span>
                      <span className="h-px flex-1 bg-warm-150/80" aria-hidden />
                    </div>

                    <ModuleTitle className="mt-3.5 font-display text-[1.0625rem] font-medium leading-[1.3] tracking-[-0.01em] text-secondary">
                      {localized(m.title, locale)}
                    </ModuleTitle>

                    {description ? (
                      <p className="mt-2.5 font-sans text-[0.8125rem] leading-[1.65] text-secondary/60">
                        {description}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
