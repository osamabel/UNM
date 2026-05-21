import { useLocale } from 'next-intl';
import type { CurriculumModule, Locale } from '@unm/types';
import { localized } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

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
      m.group && typeof m.group === 'object' ? m.group[locale] ?? m.group.fr : (m.group as string | undefined) ?? '';
    const key = groupValue || '__nogroup__';
    let g = groups.find((g) => g.key === key);
    if (!g) {
      g = { key, label: groupValue, items: [] };
      groups.push(g);
    }
    g.items.push(m);
  }
  const hasGrouping = groups.some((g) => g.key !== '__nogroup__');

  const isEn = locale === 'en';
  const heading = isEn ? 'Curriculum' : 'Programme pédagogique';
  const intro = programType === 'DBA'
    ? isEn
      ? 'A 2-year journey: high-level academic seminars, then progressive support toward the production of a managerially impactful thesis.'
      : "Un parcours sur 2 années : séminaires académiques de haut niveau, puis accompagnement progressif vers la production d'une thèse à fort impact managérial."
    : isEn
      ? '12 seminars structured to cover the strategic, economic, regulatory and operational dimensions of the sector.'
      : '12 séminaires structurés pour couvrir les dimensions stratégiques, économiques, réglementaires et opérationnelles du secteur.';

  return (
    <section className="card-flat p-6 sm:p-8">
      <p className="eyebrow">{isEn ? 'Curriculum' : 'Programme'}</p>
      <h2 className="mt-3 font-display text-display-md text-secondary">{heading}</h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-secondary/70">{intro}</p>

      <div className="mt-8 space-y-10">
        {groups.map((g) => (
          <div key={g.key}>
            {hasGrouping && g.label && (
              <h3 className="mb-4 flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                <span className="h-px w-5 bg-primary/50" aria-hidden />
                {g.label}
              </h3>
            )}
            <ol className="grid min-w-0 gap-3 sm:grid-cols-2">
              {g.items.map((m) => (
                <li
                  key={m.code}
                  className="rounded-xl border border-warm-150/80 bg-warm-50/50 px-4 py-4 transition-colors hover:border-primary/20 hover:bg-white/60"
                >
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                    {m.code}
                  </p>
                  <p className="mt-1 font-display text-lg leading-snug text-secondary">
                    {localized(m.title, locale)}
                  </p>
                  {m.description && localized(m.description, locale) && (
                    <p className="mt-2 text-sm leading-relaxed text-secondary/60">
                      {localized(m.description, locale)}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
