import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { UniversitySubHero } from '@/components/university/UniversitySubHero';
import { CTABanner } from '@/components/home/CTABanner';
import { Icon } from '@/components/ui/Icon';
import type { Locale } from '@unm/types';

// ════════════════════════════════════════════════════════════════
// UNM Manifesto — official text approved by the UNM communication team.
// Bilingual: French is the source of truth, English is the faithful
// translation kept in sync.
// ════════════════════════════════════════════════════════════════

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const isEn = params.locale === 'en';
  return {
    title: isEn ? 'Manifesto' : "Manifeste de l'UNM",
    description: isEn
      ? "Forming the Africa that decides — UNM's manifesto: actionable knowledge, African anchoring, executive education for leadership."
      : "Former l'Afrique qui décide — le manifeste de l'UNM : savoir actionnable, ancrage africain, formation Executive au service du leadership.",
  };
}

interface Pillar { title: string; body: string }
interface Principle { title: string; body: string }
interface Value { title: string; body: string; icon: string }

const BASELINE_FR = [
  "Former l'Afrique qui décide.",
  'Penser le monde depuis les réalités africaines.',
  "Produire un savoir qui transforme l'action.",
];
const BASELINE_EN = [
  'Form the Africa that decides.',
  'Think the world from African realities.',
  'Produce knowledge that transforms action.',
];

const VISION_FR: Pillar[] = [
  { title: 'Pour les professionnels et les dirigeants', body: "Une université pensée pour ceux qui décident, agissent et transforment, avec un rythme et un format adaptés aux contraintes du monde réel." },
  { title: 'Numérique, agile et internationale', body: "Une pédagogie native du digital, qui rapproche l'excellence académique mondiale des participants où qu'ils soient." },
  { title: 'Africaine par son ancrage, globale par ses standards', body: "Une lecture profonde des réalités du continent, articulée aux meilleurs standards internationaux." },
  { title: "Tournée vers l'action, l'innovation et la transformation", body: "Former pour décider, innover, et conduire le changement dans les organisations africaines." },
];
const VISION_EN: Pillar[] = [
  { title: 'For professionals and senior leaders', body: 'A university built for those who decide, act and transform — with a rhythm and format that fit real-world constraints.' },
  { title: 'Digital, agile, international', body: 'Digital-native pedagogy that brings world-class academic excellence to participants wherever they are.' },
  { title: 'African in its anchoring, global in its standards', body: 'A deep reading of the continent’s realities, articulated with the best international standards.' },
  { title: 'Oriented toward action, innovation and transformation', body: 'We train you to decide, to innovate, and to lead change in African organisations.' },
];

const PRINCIPLES_FR: Principle[] = [
  { title: 'Le savoir doit être actionnable', body: "Les enseignements doivent permettre une application immédiate dans les organisations, les entreprises et les administrations." },
  { title: "L'Afrique doit produire ses propres modèles", body: "Les réalités africaines nécessitent des approches contextualisées, capables d'intégrer les dimensions économiques, culturelles, institutionnelles et territoriales du continent." },
  { title: "Le numérique doit démocratiser l'excellence", body: "L'enseignement en ligne permet d'ouvrir l'accès à des formations internationales de haut niveau à travers toute l'Afrique." },
  { title: 'La formation Executive doit respecter le rythme des dirigeants', body: "Les programmes sont conçus pour des professionnels à haut niveau de responsabilité, avec une pédagogie flexible, intensive et compatible avec les contraintes opérationnelles." },
  { title: "L'université doit produire de l'impact", body: "Former ne suffit plus. Une institution moderne doit contribuer à transformer les organisations et à renforcer durablement les capacités stratégiques des décideurs." },
];
const PRINCIPLES_EN: Principle[] = [
  { title: 'Knowledge must be actionable', body: 'Teaching must enable immediate application in organisations, businesses and administrations.' },
  { title: 'Africa must produce its own models', body: 'African realities require contextualised approaches that integrate the continent’s economic, cultural, institutional and territorial dimensions.' },
  { title: 'Digital must democratise excellence', body: 'Online education opens access to high-level international training across the entire continent.' },
  { title: 'Executive education must respect leaders’ rhythm', body: 'Programmes are designed for senior professionals, with a flexible, intensive pedagogy compatible with operational constraints.' },
  { title: 'A university must produce impact', body: 'Training alone is no longer enough. A modern institution must transform organisations and durably strengthen the strategic capabilities of decision-makers.' },
];

const VALUES_FR: Value[] = [
  { icon: '◆', title: 'Excellence',             body: "Des standards académiques internationaux, des intervenants de haut niveau et une exigence constante de qualité." },
  { icon: '◇', title: 'Innovation',             body: "Une pédagogie numérique moderne, agile et orientée transformation." },
  { icon: '↑', title: 'Impact',                 body: "Des formations conçues pour produire des résultats concrets dans les organisations." },
  { icon: '✧', title: 'Ancrage africain',       body: "Une compréhension profonde des réalités, des marchés et des enjeux du continent." },
  { icon: '◐', title: 'Ouverture internationale', body: "Des partenariats académiques mondiaux et une approche globale des transformations contemporaines." },
  { icon: '✦', title: 'Engagement',             body: "Former des leaders responsables capables de contribuer durablement au développement des organisations et des territoires." },
];
const VALUES_EN: Value[] = [
  { icon: '◆', title: 'Excellence',           body: 'International academic standards, top-level lecturers and a constant requirement for quality.' },
  { icon: '◇', title: 'Innovation',           body: 'Modern, agile, transformation-oriented digital pedagogy.' },
  { icon: '↑', title: 'Impact',               body: 'Programmes designed to produce concrete results in organisations.' },
  { icon: '✧', title: 'African anchoring',    body: 'Deep understanding of the continent’s realities, markets and stakes.' },
  { icon: '◐', title: 'International openness', body: 'Global academic partnerships and a global view of contemporary transformations.' },
  { icon: '✦', title: 'Commitment',           body: 'Train responsible leaders able to durably contribute to the development of organisations and territories.' },
];

export default function ManifestoPage({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);
  const isEn = params.locale === 'en';

  const baseline   = isEn ? BASELINE_EN   : BASELINE_FR;
  const vision     = isEn ? VISION_EN     : VISION_FR;
  const principles = isEn ? PRINCIPLES_EN : PRINCIPLES_FR;
  const values     = isEn ? VALUES_EN     : VALUES_FR;

  return (
    <>
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil',              url: isEn ? '/en' : '/' },
          { name: isEn ? 'University' : "L'Université",   url: isEn ? '/en/university' : '/universite' },
          { name: isEn ? 'Manifesto' : 'Manifeste',       url: isEn ? '/en/university/manifeste' : '/universite/manifeste' },
        ]}
      />

      <UniversitySubHero
        eyebrow={isEn ? 'Manifesto' : 'Manifeste'}
        title={isEn ? 'UNM Manifesto' : "Manifeste de l'UNM"}
      >
        <ul className="mx-auto max-w-3xl space-y-4 text-left lg:mx-0">
          {baseline.map((line, i) => (
            <li
              key={i}
              className="card-flat flex gap-3 px-5 py-4 font-display text-lg leading-snug text-secondary sm:text-xl"
            >
              <Icon name="quote" size={20} className="mt-1 shrink-0 text-primary/80" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </UniversitySubHero>

      {/* ────── INTRO ────── */}
      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <div className="mx-auto max-w-3xl space-y-6 text-secondary">
          <p className="text-lg leading-relaxed">
            {isEn
              ? 'Africa is going through deep transformations: digital transition, transformation of administrations, rising geostrategic stakes, accelerating markets, innovation pressure and the emergence of new generations of leaders.'
              : "L'Afrique connaît aujourd'hui des mutations profondes : transition numérique, transformation des administrations, montée des enjeux géostratégiques, accélération des marchés, pression de l'innovation et émergence de nouvelles générations de leaders."}
          </p>
          <p className="text-lg leading-relaxed">
            {isEn
              ? 'In this context, the classical models of higher education are no longer enough.'
              : "Dans ce contexte, les modèles classiques d'enseignement supérieur ne suffisent plus."}
          </p>
          <p className="text-lg leading-relaxed">
            {isEn
              ? 'The Digital University of Morocco (UNM) was born from a simple conviction: African leaders need a high-level Executive education capable of combining international academic excellence, an understanding of local realities, and concrete impact on organisations.'
              : "L'Université Numérique du Maroc (UNM) est née d'une conviction simple : les dirigeants africains ont besoin d'une formation Executive de haut niveau, capable de conjuguer excellence académique internationale, compréhension des réalités locales et impact concret sur les organisations."}
          </p>

          <div className="my-8 card-flat border-l-4 border-primary/40 pl-6 pr-5 py-5">
            <p className="font-display text-xl italic text-secondary">
              {isEn
                ? 'We believe that an Executive degree must not only transmit knowledge. It must enable better decisions, drive transformations, create value, and produce leadership able to act in complex environments.'
                : "Nous croyons qu'un diplôme Executive ne doit pas seulement transmettre des connaissances. Il doit permettre de prendre de meilleures décisions, piloter des transformations, créer de la valeur et produire un leadership capable d'agir dans des environnements complexes."}
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* ────── VISION ────── */}
      <SectionWrapper tone="alt">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {isEn ? 'A new vision of higher education' : "Une vision nouvelle de l'enseignement supérieur"}
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-display-md text-secondary">
          {isEn ? 'UNM stands for' : "UNM se définit comme"}
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {vision.map((p, i) => (
            <li key={i} className="card-interactive p-6">
              <p className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">
                0{i + 1}
              </p>
              <h3 className="mt-2 font-display text-xl text-secondary">{p.title}</h3>
              <p className="mt-3 text-secondary-400">{p.body}</p>
            </li>
          ))}
        </ul>

        <div className="glass-dark relative mt-12 overflow-hidden rounded-2xl p-8 sm:p-10">
          <div className="hero-panel-pattern absolute inset-0" aria-hidden />
          <p className="relative font-display text-2xl leading-snug text-warm-50 sm:text-3xl">
            {isEn
              ? 'Through its programmes, UNM is a pan-African university of Executive education and of actionable knowledge in service of African organisations.'
              : "À travers ses programmes, l'UNM est une université panafricaine de formation Executive et de production de savoir actionnable au service des organisations africaines."}
          </p>
        </div>
      </SectionWrapper>

      {/* ────── PHILOSOPHIE — 5 principes ────── */}
      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {isEn ? 'UNM philosophy' : 'Philosophie UNM'}
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-display-md text-secondary">
          {isEn
            ? 'An academic philosophy oriented toward impact'
            : 'Une philosophie académique orientée impact'}
        </h2>
        <p className="mt-4 max-w-2xl text-secondary-400">
          {isEn
            ? 'Our pedagogy is built on five major principles.'
            : "L'UNM repose sur une philosophie pédagogique fondée sur cinq principes majeurs."}
        </p>

        <ol className="mt-10 space-y-4">
          {principles.map((p, i) => (
            <li
              key={i}
              className="card-flat grid gap-4 p-6 sm:grid-cols-[72px_1fr] sm:items-start"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary font-display text-2xl font-bold text-white shadow-card">
                {i + 1}
              </div>
              <div>
                <h3 className="font-display text-xl text-secondary">{p.title}</h3>
                <p className="mt-2 text-secondary-400">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </SectionWrapper>

      {/* ────── VALEURS — 6 piliers ────── */}
      <SectionWrapper tone="alt">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {isEn ? 'Our values' : 'Nos valeurs'}
        </p>
        <h2 className="mt-3 font-display text-display-md text-secondary">
          {isEn ? 'Six convictions that guide us' : 'Six convictions qui nous guident'}
        </h2>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <li
              key={v.title}
              className="card-interactive p-6"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-2xl text-primary"
              >
                {v.icon}
              </span>
              <h3 className="mt-4 font-display text-xl text-secondary">{v.title}</h3>
              <p className="mt-2 text-sm text-secondary-400">{v.body}</p>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
