import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CTABanner } from '@/components/home/CTABanner';
import type { Locale } from '@unm/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const isEn = params.locale === 'en';
  return {
    title: isEn ? 'Events' : 'Événements',
    description: isEn
      ? 'Upcoming events, masterclasses and open days at the Digital University of Morocco.'
      : "Événements à venir, masterclasses et journées portes ouvertes à l'Université Numérique du Maroc.",
  };
}

// Stub event entries — to be replaced by a CMS collection in a later
// iteration. Kept here so the page reads as complete.
const EVENTS_FR = [
  {
    date: '12 juin 2026',
    kind: 'Journée Portes Ouvertes',
    title: 'JPO Campus Marrakech — Programmes MBA & DBA',
    location: 'Borj Menara I, Marrakech',
  },
  {
    date: '24 juin 2026',
    kind: 'Webinaire',
    title: 'MBA Ressources Minières : enjeux ESG en Afrique',
    location: 'En ligne',
  },
  {
    date: '8 juillet 2026',
    kind: 'Masterclass',
    title: 'Intelligence économique appliquée aux décisions publiques',
    location: 'EBS Paris — Hybride',
  },
];
const EVENTS_EN = [
  {
    date: 'June 12, 2026',
    kind: 'Open Day',
    title: 'Open Day Marrakech Campus — MBA & DBA programmes',
    location: 'Borj Menara I, Marrakech',
  },
  {
    date: 'June 24, 2026',
    kind: 'Webinar',
    title: 'Mining Resources MBA: ESG stakes in Africa',
    location: 'Online',
  },
  {
    date: 'July 8, 2026',
    kind: 'Masterclass',
    title: 'Business intelligence applied to public decision-making',
    location: 'EBS Paris — Hybrid',
  },
];

export default function EventsPage({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);
  const isEn = params.locale === 'en';
  const events = isEn ? EVENTS_EN : EVENTS_FR;
  return (
    <>
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          { name: isEn ? 'University' : "L'Université", url: isEn ? '/en/university' : '/universite' },
          { name: isEn ? 'Events' : 'Événements', url: isEn ? '/en/university/evenements' : '/universite/evenements' },
        ]}
      />

      <SectionWrapper>
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {isEn ? 'Campus life' : 'Vie du campus'}
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-display-lg text-secondary">
          {isEn ? 'Events & open days' : 'Événements & portes ouvertes'}
        </h1>
        <p className="mt-4 max-w-2xl text-secondary-400">
          {isEn
            ? 'Rencontrez nos équipes, nos diplômés et nos partenaires lors de nos prochains rendez-vous.'
            : 'Rencontrez nos équipes, nos diplômés et nos partenaires lors de nos prochains rendez-vous.'}
        </p>

        <ul className="mt-12 space-y-4">
          {events.map((e, i) => (
            <li
              key={i}
              className="grid gap-4 rounded-card border border-warm-200 bg-white p-6 shadow-card sm:grid-cols-[160px_1fr]"
            >
              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">
                  {e.kind}
                </p>
                <p className="mt-1 font-display text-xl text-secondary">{e.date}</p>
              </div>
              <div>
                <h3 className="font-display text-lg text-secondary">{e.title}</h3>
                <p className="mt-1 text-sm text-secondary-400">📍 {e.location}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-secondary-400">
          {isEn
            ? "These events are illustrative — a public registration page will be added shortly."
            : "Ces événements sont donnés à titre indicatif — une page d'inscription publique sera ajoutée prochainement."}
        </p>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
