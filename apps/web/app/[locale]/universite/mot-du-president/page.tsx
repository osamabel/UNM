import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { UniversitySubHero } from '@/components/university/UniversitySubHero';
import { CTABanner } from '@/components/home/CTABanner';
import type { Locale } from '@unm/types';

// ════════════════════════════════════════════════════════════════
// "Mot du Président" — institutional vision text.
// French is the source of truth; English is the faithful translation.
// ════════════════════════════════════════════════════════════════

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const isEn = params.locale === 'en';
  return {
    title: isEn ? "President's word" : 'Mot du Président',
    description: isEn
      ? "UNM's vision: a pan-African Executive university that combines academic excellence, digital agility and concrete impact."
      : "Vision de l'UNM : une université Executive africaine alliant excellence académique, agilité numérique et impact concret.",
  };
}

interface Pillar { title: string; body: string }

const PILLARS_FR: Pillar[] = [
  { title: 'Excellence académique internationale', body: "Des standards alignés sur les meilleures grandes écoles européennes." },
  { title: 'Innovation pédagogique',                body: "Une approche orientée action, cas réels et retours d'expérience." },
  { title: 'Flexibilité numérique',                 body: "Un format pensé pour les professionnels en activité, partout en Afrique." },
  { title: 'Impact concret sur les organisations', body: "Des compétences directement applicables et mesurables au retour au bureau." },
];
const PILLARS_EN: Pillar[] = [
  { title: 'International academic excellence', body: 'Standards aligned with the top European business schools.' },
  { title: 'Pedagogical innovation',            body: 'An action-oriented approach built on real cases and field experience.' },
  { title: 'Digital flexibility',               body: 'A format designed for working professionals, anywhere in Africa.' },
  { title: 'Concrete impact on organisations',  body: 'Skills you can apply and measure as soon as you’re back at the office.' },
];

export default function PresidentWordPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const isEn = params.locale === 'en';
  const pillars = isEn ? PILLARS_EN : PILLARS_FR;

  return (
    <>
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil',              url: isEn ? '/en' : '/' },
          { name: isEn ? 'University' : "L'Université",   url: isEn ? '/en/university' : '/universite' },
          { name: isEn ? "President's word" : 'Mot du Président', url: isEn ? '/en/university/mot-du-president' : '/universite/mot-du-president' },
        ]}
      />

      <UniversitySubHero
        eyebrow={isEn ? "President's word" : 'Mot du Président'}
        title={
          isEn
            ? 'Forming the leaders of tomorrow’s Africa.'
            : "Former les leaders de l'Afrique de demain."
        }
      />

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <article className="prose prose-lg mx-auto max-w-prose space-y-5 text-secondary">
          <p className="text-lg leading-relaxed">
            {isEn
              ? "Africa is entering a new phase of its economic, institutional and technological history. This transformation calls for leaders capable of understanding the complexity of today's world while remaining deeply connected to African realities."
              : "L'Afrique entre dans une nouvelle phase de son histoire économique, institutionnelle et technologique. Cette transformation exige des dirigeants capables de comprendre la complexité du monde contemporain tout en restant profondément connectés aux réalités du terrain africain."}
          </p>
          <p className="text-lg leading-relaxed">
            {isEn
              ? 'It is in this perspective that the Digital University of Morocco was born.'
              : "C'est dans cette perspective qu'est née l'Université Numérique du Maroc."}
          </p>

          <p className="text-lg leading-relaxed">
            {isEn
              ? 'UNM is not simply a digital academic institution. It is a vision — that of building an African Executive university able to combine:'
              : "L'UNM n'est pas simplement une institution académique digitale. Elle est une vision. Une vision qui consiste à construire une université Executive africaine capable d'allier :"}
          </p>

          <ul className="not-prose grid gap-3 sm:grid-cols-2">
            {pillars.map((p) => (
              <li
                key={p.title}
                className="card-flat p-4"
              >
                <p className="font-heading font-semibold text-secondary">— {p.title}</p>
                <p className="mt-1 text-sm text-secondary-400">{p.body}</p>
              </li>
            ))}
          </ul>

          <p className="text-lg leading-relaxed">
            {isEn
              ? "Our ambition is clear: democratise access to high-level Executive education across Africa, so that executives, leaders, entrepreneurs and public officials can train without interrupting their professional responsibilities."
              : "Notre ambition est claire : démocratiser l'accès à des formations Executive de haut niveau à travers l'Afrique, en permettant aux cadres, dirigeants, entrepreneurs et responsables publics de se former sans interrompre leurs responsabilités professionnelles."}
          </p>

          <p className="text-lg leading-relaxed">
            {isEn
              ? "We have chosen an action-oriented pedagogy, built on case studies, field feedback, real organisational challenges and the African contextualisation of teaching."
              : "Nous avons fait le choix d'une pédagogie orientée vers l'action, fondée sur les études de cas, les retours d'expérience, les problématiques réelles des organisations et la contextualisation africaine des enseignements."}
          </p>

          <p className="text-lg leading-relaxed">
            {isEn
              ? "Through our international academic partnerships — notably with European Business School — we aim to create bridges between global standards and the specific stakes of the African continent."
              : "À travers nos partenariats académiques internationaux, notamment avec European Business School, nous souhaitons créer des passerelles entre les standards globaux et les enjeux spécifiques du continent africain."}
          </p>

          <div className="not-prose my-6 card-flat border-l-4 border-primary/40 pl-6">
            <p className="font-display text-xl italic text-secondary">
              {isEn
                ? 'UNM aims to form a new generation of African leaders — leaders able to transform organisations, produce useful knowledge and build models tailored to the continent’s realities.'
                : "L'UNM veut former une nouvelle génération de leaders africains : des leaders capables de transformer les organisations, de produire du savoir utile et de construire des modèles adaptés aux réalités du continent."}
            </p>
          </div>

          <p className="text-lg font-display italic text-secondary">
            {isEn ? 'Welcome to the Digital University of Morocco.' : "Bienvenue à l'Université Numérique du Maroc."}
          </p>
        </article>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
