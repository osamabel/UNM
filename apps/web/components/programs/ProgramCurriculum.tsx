import { useLocale } from 'next-intl';
import type { CurriculumModule, Locale } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  modules?: CurriculumModule[];
  programType?: string;
}

/**
 * Editorial curriculum renderer.
 * - When modules are grouped (e.g. "Première année" / "Deuxième année" for
 *   the DBA), shows year/group headers above the list.
 * - When no grouping, renders a flat numbered list (used by the 9 MBAs
 *   that ship M1…M12 without further structure).
 * - Hidden when no modules are attached.
 */
export function ProgramCurriculum({ modules, programType }: Props) {
  const locale = useLocale() as Locale;
  if (!modules || modules.length === 0) return null;

  // Group modules by `group` (preserving order of first occurrence).
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
    ? (isEn
        ? 'A 2-year journey: high-level academic seminars, then progressive support toward the production of a managerially impactful thesis.'
        : "Un parcours sur 2 années : séminaires académiques de haut niveau, puis accompagnement progressif vers la production d'une thèse à fort impact managérial.")
    : (isEn
        ? '12 seminars structured to cover the strategic, economic, regulatory and operational dimensions of the sector.'
        : '12 séminaires structurés pour couvrir les dimensions stratégiques, économiques, réglementaires et opérationnelles du secteur.');

  return (
    <section>
      <p className="eyebrow">{isEn ? 'Curriculum' : 'Programme'}</p>
      <h2 className="mt-3 font-display text-2xl text-secondary">{heading}</h2>
      <p className="mt-4 max-w-3xl text-secondary-400">{intro}</p>

      <div className="mt-10 space-y-12">
        {groups.map((g) => (
          <div key={g.key}>
            {hasGrouping && g.label && (
              <h3 className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {g.label}
              </h3>
            )}
            <ol className="grid gap-3 sm:grid-cols-2">
              {g.items.map((m) => (
                <li
                  key={m.code}
                  className="border-l-2 border-primary/40 pl-5 py-3"
                >
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                    {m.code}
                  </p>
                  <p className="mt-1 font-display text-lg text-secondary">
                    {localized(m.title, locale)}
                  </p>
                  {m.description && localized(m.description, locale) && (
                    <p className="mt-2 text-sm leading-relaxed text-secondary-400">
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
