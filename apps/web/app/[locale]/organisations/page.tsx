import type { Metadata } from 'next';
import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/shared/JsonLd';
import { organisationsContent as c } from '@/lib/organisations-content';
import { localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export const revalidate = 600;

interface Params {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unm.ma';
  const fr = c.meta.canonicalPath.fr;
  const en = c.meta.canonicalPath.en;
  return {
    title: localized(c.meta.title, params.locale),
    description: localized(c.meta.description, params.locale),
    openGraph: {
      title: localized(c.meta.title, params.locale),
      description: localized(c.meta.description, params.locale),
      locale: params.locale === 'en' ? 'en_US' : 'fr_MA',
    },
    alternates: {
      canonical: params.locale === 'en' ? `${base}${en}` : `${base}${fr}`,
      languages: { fr: `${base}${fr}`, en: `${base}${en}`, 'x-default': `${base}${fr}` },
    },
  };
}

function organisationsSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: localized(c.hero.title, locale),
    description: localized(c.meta.description, locale),
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Université Numérique du Maroc',
      url: 'https://www.unm.ma',
    },
    areaServed: 'Africa',
    audience: { '@type': 'OrganizationRole', roleName: 'Executive' },
  };
}

export default function OrganisationsPage({ params }: Params) {
  unstable_setRequestLocale(params.locale);
  const locale = params.locale;
  const isEn = locale === 'en';

  return (
    <>
      <JsonLd data={organisationsSchema(locale)} />
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          { name: isEn ? 'Organizations' : 'Organisations', url: isEn ? c.meta.canonicalPath.en : c.meta.canonicalPath.fr },
        ]}
      />

      {/* ────── HERO ────── */}
      <section className="bg-warm-50">
        <div className="container-page py-20 lg:py-24">
          <p className="eyebrow">{localized(c.hero.eyebrow, locale)}</p>
          <h1 className="mt-5 max-w-3xl font-display text-display-xl text-secondary">
            {localized(c.hero.title, locale)}
          </h1>
          <p className="mt-4 max-w-3xl font-display text-2xl italic text-secondary-400">
            {localized(c.hero.tagline, locale)}
          </p>
          <div className="mt-8 max-w-3xl space-y-4 text-secondary">
            {c.hero.paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed">{localized(p, locale)}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={c.hero.ctas.primary.href}>
              <Button>{localized(c.hero.ctas.primary.label, locale)}</Button>
            </Link>
            <Link href={c.hero.ctas.secondary.href}>
              <Button variant="ghost">{localized(c.hero.ctas.secondary.label, locale)}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ────── THREE WAYS ────── */}
      <SectionWrapper tone="alt">
        <p className="eyebrow">{localized(c.threeWays.eyebrow, locale)}</p>
        <h2 className="mt-3 font-display text-display-md text-secondary">
          {localized(c.threeWays.title, locale)}
        </h2>
        <ol className="mt-10 grid gap-6 lg:grid-cols-3">
          {c.threeWays.items.map((it, i) => (
            <li key={i} className="card-flat p-6 h-full">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                0{i + 1}
              </p>
              <h3 className="mt-3 font-display text-xl text-secondary">
                {localized(it.title, locale)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary-400">
                {localized(it.body, locale)}
              </p>
            </li>
          ))}
        </ol>
      </SectionWrapper>

      {/* ────── CUSTOM PROGRAMS ────── */}
      <SectionWrapper id="programmes-sur-mesure">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">01</p>
            <h2 className="mt-3 font-display text-display-md text-secondary">
              {localized(c.custom.title, locale)}
            </h2>
          </div>
          <div className="space-y-5 text-secondary">
            {c.custom.paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed">{localized(p, locale)}</p>
            ))}
            <div className="mt-8">
              <h3 className="font-display text-xl text-secondary">
                {localized(c.custom.subTitle, locale)}
              </h3>
              <ul className="mt-4 space-y-2 text-secondary">
                {c.custom.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1 w-3 flex-shrink-0 bg-primary" />
                    {localized(b.text, locale)}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 text-sm italic text-secondary-400">
              {localized(c.custom.closing, locale)}
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* ────── COHORTS ────── */}
      <SectionWrapper id="cohortes-dediees" tone="alt">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">02</p>
            <h2 className="mt-3 font-display text-display-md text-secondary">
              {localized(c.cohorts.title, locale)}
            </h2>
          </div>
          <div className="space-y-5 text-secondary">
            {c.cohorts.paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed">{localized(p, locale)}</p>
            ))}
            <div className="mt-8">
              <h3 className="font-display text-xl text-secondary">
                {localized(c.cohorts.subTitle, locale)}
              </h3>
              <ul className="mt-4 space-y-2 text-secondary">
                {c.cohorts.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1 w-3 flex-shrink-0 bg-primary" />
                    {localized(b.text, locale)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ────── ACADEMIES ────── */}
      <SectionWrapper id="academies-institutionnelles">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">03</p>
            <h2 className="mt-3 font-display text-display-md text-secondary">
              {localized(c.academies.title, locale)}
            </h2>
          </div>
          <div className="space-y-5 text-secondary">
            {c.academies.paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed">{localized(p, locale)}</p>
            ))}
            <div className="mt-8">
              <h3 className="font-display text-xl text-secondary">
                {localized(c.academies.subTitle, locale)}
              </h3>
              <ul className="mt-4 space-y-2 text-secondary">
                {c.academies.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1 w-3 flex-shrink-0 bg-primary" />
                    {localized(b.text, locale)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ────── PARTNERS ────── */}
      <SectionWrapper tone="alt">
        <div className="max-w-3xl">
          <p className="eyebrow">{localized(c.partners.eyebrow, locale)}</p>
          <h2 className="mt-3 font-display text-display-md text-secondary">
            {localized(c.partners.title, locale)}
          </h2>
          <p className="mt-4 text-secondary-400">{localized(c.partners.intro, locale)}</p>
        </div>
        <ul className="mt-12 divide-y divide-warm-200 border-y border-warm-200">
          {c.partners.categories.map((cat, i) => (
            <li key={i} className="grid gap-2 py-6 sm:grid-cols-[1fr_1.6fr] sm:gap-12">
              <h3 className="font-display text-lg text-secondary">
                {localized(cat.title, locale)}
              </h3>
              <p className="text-secondary-400">{localized(cat.body, locale)}</p>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      {/* ────── UNM EXPERIENCE ────── */}
      <SectionWrapper>
        <p className="eyebrow">{localized(c.experience.eyebrow, locale)}</p>
        <h2 className="mt-3 font-display text-display-md text-secondary">
          {localized(c.experience.title, locale)}
        </h2>
        <ul className="mt-10 grid gap-6 lg:grid-cols-2">
          {c.experience.pillars.map((p, i) => (
            <li key={i} className="card-flat p-6 h-full">
              <h3 className="font-display text-xl text-secondary">{localized(p.title, locale)}</h3>
              <p className="mt-3 text-secondary-400">{localized(p.body, locale)}</p>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      {/* ────── CLOSING CTA ────── */}
      <section id="contact" className="bg-secondary text-warm-50">
        <div className="container-page py-20 lg:py-24">
          <h2 className="max-w-3xl font-display text-display-md text-warm-50">
            {localized(c.closing.title, locale)}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-warm-100">
            {localized(c.closing.body, locale)}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={c.closing.ctas.primary.href}>
              <Button>{localized(c.closing.ctas.primary.label, locale)}</Button>
            </Link>
            <Link href={c.closing.ctas.secondary.href}>
              <Button variant="ghost" className="border border-warm-50/30 text-warm-50 hover:bg-warm-50/10">
                {localized(c.closing.ctas.secondary.label, locale)}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
