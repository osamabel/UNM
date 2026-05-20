import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@unm/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const isEn = params.locale === 'en';
  return {
    title: isEn ? 'Newsroom — Press centre' : 'Newsroom — Espace presse',
    description: isEn
      ? 'Press kit, official statements and media contacts of the Digital University of Morocco.'
      : "Kit presse, communiqués officiels et contacts médias de l'Université Numérique du Maroc.",
  };
}

const RESOURCES_FR = [
  { name: 'Kit presse complet', size: 'PDF · à venir', icon: '📦' },
  { name: 'Logos UNM (SVG + PNG)', size: 'ZIP · à venir', icon: '🎨' },
  { name: 'Photos institutionnelles', size: 'ZIP · à venir', icon: '📸' },
  { name: 'Charte graphique', size: 'PDF · à venir', icon: '📐' },
];
const RESOURCES_EN = [
  { name: 'Full press kit', size: 'PDF · coming soon', icon: '📦' },
  { name: 'UNM logos (SVG + PNG)', size: 'ZIP · coming soon', icon: '🎨' },
  { name: 'Institutional photos', size: 'ZIP · coming soon', icon: '📸' },
  { name: 'Brand guidelines', size: 'PDF · coming soon', icon: '📐' },
];

export default function NewsroomPage({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);
  const isEn = params.locale === 'en';
  const resources = isEn ? RESOURCES_EN : RESOURCES_FR;
  return (
    <>
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          { name: isEn ? 'University' : "L'Université", url: isEn ? '/en/university' : '/universite' },
          { name: 'Newsroom', url: isEn ? '/en/university/newsroom' : '/universite/newsroom' },
        ]}
      />

      <SectionWrapper>
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {isEn ? 'Press centre' : 'Espace presse'}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-display-lg text-secondary">
          Newsroom
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-secondary">
          {isEn
            ? 'Press kit, official statements and direct contacts for media coverage of the Digital University of Morocco.'
            : "Kit presse, communiqués officiels et contacts directs pour la couverture médiatique de l'Université Numérique du Maroc."}
        </p>
      </SectionWrapper>

      <SectionWrapper tone="alt">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="font-display text-display-md text-secondary">
              {isEn ? 'Press resources' : 'Ressources presse'}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {resources.map((r) => (
                <li
                  key={r.name}
                  className="flex items-center gap-4 rounded-card border border-warm-200 bg-white p-5"
                >
                  <span aria-hidden="true" className="text-2xl">{r.icon}</span>
                  <div>
                    <p className="font-heading font-semibold text-secondary">{r.name}</p>
                    <p className="text-xs text-secondary-400">{r.size}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-card bg-secondary p-8 text-warm-50 lg:sticky lg:top-24 h-fit">
            <p className="font-heading text-xs font-semibold uppercase tracking-wider text-primary-200">
              {isEn ? 'Press contact' : 'Contact presse'}
            </p>
            <p className="mt-3 font-display text-2xl">
              {isEn ? 'Communication office' : 'Direction de la communication'}
            </p>
            <ul className="mt-6 space-y-2 text-warm-100">
              <li>
                <a href="mailto:presse@unm.ma" className="hover:text-white hover:underline">
                  ✉ presse@unm.ma
                </a>
              </li>
              <li>
                <a href="tel:+212662626219" className="hover:text-white hover:underline">
                  📞 +212 6 62 62 62 19
                </a>
              </li>
            </ul>
            <p className="mt-6 text-sm text-warm-200">
              {isEn
                ? 'For interview requests, please allow 48 hours.'
                : "Pour toute demande d'interview, merci de prévoir 48 heures."}
            </p>
            <a href="mailto:presse@unm.ma" className="mt-6 inline-flex">
              <Button>{isEn ? 'Request an interview' : 'Demander une interview'}</Button>
            </a>
          </aside>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="font-display text-display-md text-secondary">
          {isEn ? 'Latest press releases' : 'Derniers communiqués'}
        </h2>
        <div className="mt-8 rounded-card border border-warm-200 bg-warm-100 p-10 text-center text-secondary-400">
          {isEn
            ? 'Press releases will be published here. This page will be enriched soon.'
            : 'Les communiqués seront publiés ici. Cette page sera enrichie prochainement.'}
        </div>
      </SectionWrapper>
    </>
  );
}
