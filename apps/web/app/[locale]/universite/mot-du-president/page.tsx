import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PhotoHero } from '@/components/patterns/PhotoHero';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { CTABanner } from '@/components/home/CTABanner';
import { Icon } from '@/components/ui/Icon';
import { PAGE_HERO_IMAGE } from '@/lib/page-heroes';
import { cn } from '@/lib/utils';
import type { Locale } from '@unm/types';

// ════════════════════════════════════════════════════════════════
// "Mot du Président" — institutional vision letter.
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

const PILLARS_FR = [
  {
    title: 'Excellence académique internationale',
    body: 'Des standards alignés sur les meilleures grandes écoles européennes.',
  },
  {
    title: 'Innovation pédagogique',
    body: "Une approche orientée action, cas réels et retours d'expérience.",
  },
  {
    title: 'Flexibilité numérique',
    body: 'Un format pensé pour les professionnels en activité, partout en Afrique.',
  },
  {
    title: 'Impact concret sur les organisations',
    body: 'Des compétences directement applicables et mesurables au retour au bureau.',
  },
] as const;

const PILLARS_EN = [
  {
    title: 'International academic excellence',
    body: 'Standards aligned with the top European business schools.',
  },
  {
    title: 'Pedagogical innovation',
    body: 'An action-oriented approach built on real cases and field experience.',
  },
  {
    title: 'Digital flexibility',
    body: 'A format designed for working professionals, anywhere in Africa.',
  },
  {
    title: 'Concrete impact on organisations',
    body: 'Skills you can apply and measure as soon as you’re back at the office.',
  },
] as const;

export default function PresidentWordPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const isEn = params.locale === 'en';
  const pillars = isEn ? PILLARS_EN : PILLARS_FR;
  const manifestoHref = isEn ? '/en/university/manifeste' : '/universite/manifeste';
  const programsHref = isEn ? '/en/programs' : '/programmes';

  return (
    <>
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          {
            name: isEn ? 'University' : "L'Université",
            url: isEn ? '/en/university' : '/universite',
          },
          {
            name: isEn ? "President's word" : 'Mot du Président',
            url: isEn ? '/en/university/mot-du-president' : '/universite/mot-du-president',
          },
        ]}
      />

      <PhotoHero
        eyebrow={isEn ? "President's word" : 'Mot du Président'}
        title={
          isEn
            ? 'Forming the leaders of tomorrow’s Africa.'
            : "Former les leaders de l'Afrique de demain."
        }
        imageSrc={PAGE_HERO_IMAGE.president}
        imageAlt={
          isEn
            ? 'African graduates — Université Numérique du Maroc'
            : 'Diplômés africains — Université Numérique du Maroc'
        }
        imagePosition="center 28%"
        className="photo-hero--tall"
      />

      {/* ── Letter: sticky rail + editorial column ── */}
      <SectionWrapper tone="canvas" className="!py-12 sm:!py-16 lg:!py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[minmax(0,15rem)_minmax(0,38rem)_minmax(0,1fr)] xl:gap-20">
          {/* Left rail */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <ScrollReveal>
              <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary/40">
                {isEn ? 'In this letter' : 'Dans cette lettre'}
              </p>
              <ol className="mt-5 space-y-3 border-l border-warm-200/80 pl-4">
                {(isEn
                  ? ['Context', 'Vision', 'Ambition', 'Commitment']
                  : ['Contexte', 'Vision', 'Ambition', 'Engagement']
                ).map((label, i) => (
                  <li key={label} className="flex items-baseline gap-2.5">
                    <span className="font-heading text-[10px] font-semibold tabular-nums text-primary/70">
                      0{i + 1}
                    </span>
                    <span className="text-sm text-secondary/70">{label}</span>
                  </li>
                ))}
              </ol>
            </ScrollReveal>
          </aside>

          {/* Main letter */}
          <article className="min-w-0">
            <ScrollReveal>
              <p
                className={cn(
                  'text-[1.125rem] leading-[1.75] text-secondary sm:text-[1.2rem] sm:leading-[1.8]',
                  'first-letter:float-left first-letter:mr-3 first-letter:mt-1',
                  'first-letter:font-display first-letter:text-[3.5rem] first-letter:leading-[0.85]',
                  'first-letter:text-primary sm:first-letter:text-[4.25rem]',
                )}
              >
                {isEn
                  ? "Africa is entering a new phase of its economic, institutional and technological history. This transformation calls for leaders capable of understanding the complexity of today's world while remaining deeply connected to African realities."
                  : "L'Afrique entre dans une nouvelle phase de son histoire économique, institutionnelle et technologique. Cette transformation exige des dirigeants capables de comprendre la complexité du monde contemporain tout en restant profondément connectés aux réalités du terrain africain."}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={60}>
              <p className="mt-6 text-[1.125rem] font-medium leading-[1.75] text-secondary sm:text-[1.2rem]">
                {isEn
                  ? 'It is in this perspective that the Digital University of Morocco was born.'
                  : "C'est dans cette perspective qu'est née l'Université Numérique du Maroc."}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={90}>
              <p className="mt-6 text-[1.0625rem] leading-[1.75] text-secondary/80 sm:text-lg">
                {isEn
                  ? 'UNM is not simply a digital academic institution. It is a vision — that of building an African Executive university able to combine four foundations.'
                  : "L'UNM n'est pas simplement une institution académique digitale. Elle est une vision : construire une université Executive africaine capable d'allier quatre fondements."}
              </p>
            </ScrollReveal>

            {/* Vision foundations — list, not cards */}
            <ScrollReveal delay={110}>
              <ol className="mt-12 space-y-0 border-t border-warm-200/70">
                {pillars.map((p, i) => (
                  <li
                    key={p.title}
                    className="grid gap-2 border-b border-warm-200/70 py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-6"
                  >
                    <span className="font-display text-2xl tabular-nums text-primary/55 sm:pt-0.5">
                      0{i + 1}
                    </span>
                    <div>
                      <h2 className="font-display text-xl leading-snug text-secondary sm:text-[1.35rem]">
                        {p.title}
                      </h2>
                      <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-secondary/65">
                        {p.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="mt-14 space-y-6">
                <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                  {isEn ? 'Our ambition' : 'Notre ambition'}
                </p>
                <p className="text-[1.125rem] leading-[1.75] text-secondary sm:text-[1.2rem]">
                  {isEn
                    ? 'Democratise access to high-level Executive education across Africa — so executives, leaders, entrepreneurs and public officials can train without interrupting their professional responsibilities.'
                    : "Démocratiser l'accès à des formations Executive de haut niveau à travers l'Afrique — pour que cadres, dirigeants, entrepreneurs et responsables publics se forment sans interrompre leurs responsabilités professionnelles."}
                </p>
                <p className="text-[1.0625rem] leading-[1.75] text-secondary/80 sm:text-lg">
                  {isEn
                    ? 'We chose an action-oriented pedagogy: case studies, field feedback, real organisational challenges, and African contextualisation of teaching. Through international academic partnerships — notably with European Business School — we build bridges between global standards and the continent’s specific stakes.'
                    : "Nous avons choisi une pédagogie orientée action : études de cas, retours d'expérience, problématiques réelles des organisations, contextualisation africaine des enseignements. À travers nos partenariats académiques internationaux — notamment avec European Business School — nous créons des passerelles entre standards globaux et enjeux spécifiques du continent."}
                </p>
              </div>
            </ScrollReveal>
          </article>

          {/* Right spacer on xl keeps the letter centered in the reading column */}
          <div className="hidden xl:block" aria-hidden />
        </div>
      </SectionWrapper>

      {/* ── Closing — light pull-quote (distinct from dark footer) ── */}
      <SectionWrapper tone="soft" className="!py-14 sm:!py-16 lg:!py-20">
        <ScrollReveal>
          <figure className="mx-auto max-w-3xl">
            <div className="relative rounded-2xl border border-warm-200/70 bg-white px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
              <span
                className="absolute left-0 top-8 bottom-8 w-1 rounded-full bg-primary sm:top-10 sm:bottom-10"
                aria-hidden
              />
              <blockquote>
                <Icon name="quote" size={28} className="text-primary/70" />
                <p className="mt-5 font-display text-xl leading-snug text-secondary sm:text-2xl lg:text-[1.85rem] lg:leading-[1.3]">
                  {isEn
                    ? 'UNM aims to form a new generation of African leaders — able to transform organisations, produce useful knowledge and build models tailored to the continent’s realities.'
                    : "L'UNM veut former une nouvelle génération de leaders africains — capables de transformer les organisations, de produire du savoir utile et de construire des modèles adaptés aux réalités du continent."}
                </p>
              </blockquote>
              <figcaption className="mt-8 font-display text-base italic text-secondary/70 sm:text-lg">
                {isEn
                  ? 'Welcome to the Digital University of Morocco.'
                  : "Bienvenue à l'Université Numérique du Maroc."}
              </figcaption>
            </div>
          </figure>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <li>
              <Link
                href={manifestoHref}
                className="inline-flex items-center gap-2 rounded-xl border border-warm-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:border-primary/30 hover:text-primary"
              >
                {isEn ? 'Read the manifesto' : 'Lire le manifeste'}
                <Icon name="arrow-right" size={16} />
              </Link>
            </li>
            <li>
              <Link
                href={programsHref}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                {isEn ? 'Discover programmes' : 'Découvrir les programmes'}
                <Icon name="arrow-right" size={16} />
              </Link>
            </li>
          </ul>
        </ScrollReveal>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
