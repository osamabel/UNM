import Link from 'next/link';
import { useLocale } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import type { Locale } from '@unm/types';

const PILLARS_FR = [
  { title: 'Excellence académique internationale', body: 'Programmes co-construits avec EBS Paris.' },
  { title: 'Ancrage local & pertinence africaine', body: 'Contenus adaptés aux réalités économiques africaines.' },
  { title: 'Approche orientée action', body: 'Cas réels, montée en compétences, transformation concrète.' },
];
const PILLARS_EN = [
  { title: 'International academic excellence', body: 'Programmes co-built with EBS Paris.' },
  { title: 'Local anchoring & African relevance', body: 'Content adapted to African economic realities.' },
  { title: 'Action-oriented approach', body: 'Real-world cases, skill growth, tangible transformation.' },
];

export function EBSPartnership() {
  const locale = useLocale() as Locale;
  const pillars = locale === 'en' ? PILLARS_EN : PILLARS_FR;
  return (
    <SectionWrapper tone="alt">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {locale === 'en' ? 'Strategic alliance' : 'Alliance stratégique'}
          </p>
          <h2 className="mt-3 font-display text-display-md text-secondary">
            UNM &times; EBS Paris
          </h2>
          <p className="mt-4 text-secondary-400">
            {locale === 'en'
              ? 'A partnership combining academic excellence, international openness and grounding in African economic realities. DBA, sectoral MBAs and Executive certificates.'
              : "Un partenariat qui combine excellence académique, ouverture internationale et ancrage dans les réalités africaines. DBA, MBA sectoriels et certificats Executive."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={locale === 'en' ? '/en/university' : '/universite'}
              className="font-heading text-sm font-medium text-primary hover:underline"
            >
              {locale === 'en' ? 'Learn more about the alliance' : "En savoir plus sur l'alliance"} →
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {['EFMD', 'AACSB', 'CEFDG'].map((label) => (
              <span
                key={label}
                className="rounded-full border border-warm-300 bg-white px-3 py-1 font-heading text-xs font-semibold text-secondary"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {pillars.map((p) => (
            <li key={p.title} className="rounded-card bg-white p-6 shadow-card">
              <h3 className="font-display text-lg text-secondary">{p.title}</h3>
              <p className="mt-2 text-sm text-secondary-400">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
