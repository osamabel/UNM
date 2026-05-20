import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { StatsBar } from '@/components/home/StatsBar';
import { CTABanner } from '@/components/home/CTABanner';
import type { Locale } from '@unm/types';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  return {
    title: params.locale === 'en' ? 'University' : "L'Université",
    description: params.locale === 'en'
      ? 'UNM, the Digital University of Morocco, is dedicated to executive education with a strong African focus.'
      : "L'Université Numérique du Maroc est dédiée à la formation Executive, avec une vocation africaine affirmée.",
  };
}

const PILLARS_FR = [
  {
    title: 'Excellence académique internationale',
    body: 'Des programmes co-construits avec EBS Paris, intégrant des standards pédagogiques internationaux et des expertises reconnues.',
  },
  {
    title: 'Ancrage local & pertinence africaine',
    body: 'Des contenus adaptés aux réalités économiques et managériales africaines, pour une application directe en contexte professionnel.',
  },
  {
    title: 'Approche orientée impact & action',
    body: 'Une pédagogie basée sur des cas réels, favorisant la montée en compétences et la transformation concrète des organisations.',
  },
];
const PILLARS_EN = [
  {
    title: 'International academic excellence',
    body: 'Programmes co-built with EBS Paris, integrating international pedagogical standards and recognised expertise.',
  },
  {
    title: 'Local anchoring & African relevance',
    body: 'Content adapted to African economic and managerial realities, for direct application in a professional context.',
  },
  {
    title: 'Impact and action-oriented approach',
    body: 'A pedagogy built on real-world cases, accelerating skill growth and tangible transformation of organisations.',
  },
];

export default function UniversityPage({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);
  const isEn = params.locale === 'en';
  const pillars = isEn ? PILLARS_EN : PILLARS_FR;
  return (
    <>
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          { name: isEn ? 'University' : "L'Université", url: isEn ? '/en/university' : '/universite' },
        ]}
      />

      <SectionWrapper>
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {isEn ? 'Who we are' : 'Qui sommes-nous'}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-display-lg text-secondary">
          {isEn ? 'Building African leadership' : 'Construire le leadership africain'}
        </h1>
        <div className="prose mt-6 max-w-prose text-secondary">
          <p>
            {isEn
              ? "The Digital University of Morocco (UNM) is a higher-education institution dedicated to executive education, with a vocation resolutely turned toward Africa and its dynamics of transformation."
              : "L'Université Numérique du Maroc est un établissement d'enseignement supérieur dédié à la formation Executive, avec une vocation résolument tournée vers l'Afrique et ses dynamiques de transformation."}
          </p>
          <p>
            {isEn
              ? 'Through an academic offering structured around executive education, UNM supports executives, leaders and future leaders in developing the strategic, managerial and decision-making skills required by African realities.'
              : "À travers une offre académique structurée autour de la formation Executive, l'université accompagne les cadres, dirigeants et futurs leaders dans le développement de compétences stratégiques, managériales et décisionnelles adaptées aux réalités africaines."}
          </p>
          <p>
            {isEn
              ? 'Positioned at the intersection of academic excellence and operational stakes, UNM favours an action-oriented approach, integrating African case studies, field experience and international openness.'
              : "Positionnée au croisement de l'excellence académique et des enjeux opérationnels, l'UNM privilégie une approche orientée vers l'action, intégrant études de cas africains, retours d'expérience terrain et ouverture internationale."}
          </p>
        </div>
      </SectionWrapper>

      <StatsBar />

      <SectionWrapper tone="alt">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {isEn ? 'A strategic alliance' : 'Une alliance stratégique'}
        </p>
        <h2 className="mt-3 font-display text-display-md text-secondary">
          UNM &times; EBS Paris
        </h2>
        <p className="mt-4 max-w-3xl text-secondary">
          {isEn
            ? 'The partnership between the Digital University of Morocco and European Business School Paris combines academic excellence, international openness and grounding in African economic realities. Together we build a hybrid academic model where international standards meet local stakes.'
            : "Le partenariat entre l'Université Numérique du Maroc et European Business School Paris combine excellence académique internationale, ouverture internationale et compréhension fine des réalités économiques du continent africain. Un modèle académique hybride, où les standards internationaux rencontrent les enjeux locaux."}
        </p>
        <ul className="mt-8 grid gap-6 lg:grid-cols-3">
          {pillars.map((p) => (
            <li key={p.title} className="rounded-card bg-white p-6 shadow-card">
              <h3 className="font-display text-xl text-secondary">{p.title}</h3>
              <p className="mt-3 text-sm text-secondary-400">{p.body}</p>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="font-display text-display-md text-secondary">
          {isEn ? 'Our mission' : 'Notre mission'}
        </h2>
        <p className="mt-4 max-w-3xl text-secondary">
          {isEn
            ? 'Contribute actively to the emergence of an innovative, responsible African leadership able to take on the continent’s economic, social and technological challenges.'
            : "Contribuer activement à l'émergence d'un leadership africain innovant, responsable et capable de relever les défis économiques, sociaux et technologiques du continent."}
        </p>

        <h2 className="mt-12 font-display text-display-md text-secondary">
          {isEn ? 'Two campuses' : 'Deux campus'}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-card border border-warm-200 bg-white p-6">
            <p className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">Marrakech</p>
            <p className="mt-2 font-display text-xl text-secondary">Borj Menara I</p>
            <p className="text-sm text-secondary-400">Av. Abdelkrim El Khattabi, Marrakech, Maroc</p>
          </div>
          <div className="rounded-card border border-warm-200 bg-white p-6">
            <p className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">Laâyoune</p>
            <p className="mt-2 font-display text-xl text-secondary">N°8, Al Bouchra</p>
            <p className="text-sm text-secondary-400">Av. Alfourssane, Laâyoune, Maroc</p>
          </div>
        </div>

        <h2 className="mt-12 font-display text-display-md text-secondary">
          {isEn ? 'Accreditations' : 'Accréditations'}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {['EFMD', 'AACSB Business Education Alliance', 'CEFDG'].map((label) => (
            <li
              key={label}
              className="rounded-full border border-warm-300 bg-warm-100 px-4 py-2 font-heading text-sm font-semibold text-secondary"
            >
              {label}
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
