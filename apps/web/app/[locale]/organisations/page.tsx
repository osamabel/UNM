import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PageHeader } from '@/components/patterns/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Icon, IconBox, type IconName } from '@/components/ui/Icon';
import { JsonLd } from '@/components/shared/JsonLd';
import { CTABanner } from '@/components/home/CTABanner';
import { organisationsContent as c } from '@/lib/organisations-content';
import { localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export const revalidate = 600;

interface Params {
  params: { locale: Locale };
}

const THREE_WAY_ICONS: IconName[] = ['handshake', 'users', 'medal'];
const EXPERIENCE_ICONS: IconName[] = ['library', 'globe', 'target', 'star'];

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

function BulletList({ items, locale }: { items: { text: { fr: string; en: string } }[]; locale: Locale }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((b, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-secondary/80 sm:text-base">
          <Icon name="check-circle" size={18} className="mt-0.5 shrink-0 text-primary" />
          {localized(b.text, locale)}
        </li>
      ))}
    </ul>
  );
}

function SplitBlock({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-12">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          {step}
        </p>
        <h2 className="mt-3 font-display text-display-md text-secondary">{title}</h2>
      </div>
      <div className="min-w-0 space-y-5 text-secondary/80">{children}</div>
    </div>
  );
}

export default function OrganisationsPage({ params }: Params) {
  unstable_setRequestLocale(params.locale);
  const locale = params.locale;
  const isEn = locale === 'en';
  const contactOrg = isEn ? '/en/contact?subject=organisations' : '/contact?subject=organisations';
  const contactHref = isEn ? '/en/contact' : '/contact';
  const orgUrl = isEn ? c.meta.canonicalPath.en : c.meta.canonicalPath.fr;

  return (
    <>
      <JsonLd data={organisationsSchema(locale)} />
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          { name: isEn ? 'Organizations' : 'Organisations', url: orgUrl },
        ]}
      />

      <SectionWrapper tone="soft" className="!pb-10 sm:!pb-12">
        <PageHeader
          icon="users"
          eyebrow={localized(c.hero.eyebrow, locale)}
          title={localized(c.hero.title, locale)}
          description={localized(c.hero.tagline, locale)}
          className="border-0 pb-0"
        />
        <div className="prose prose-secondary mt-6 max-w-3xl space-y-4 text-secondary/80 sm:mt-8">
          {c.hero.paragraphs.map((p, i) => (
            <p key={i}>{localized(p, locale)}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink
            href={contactOrg}
            size="lg"
            fullWidth
            className="sm:!w-auto"
            trailingIcon={<Icon name="mail" size={18} />}
          >
            {localized(c.hero.ctas.primary.label, locale)}
          </ButtonLink>
          <ButtonLink href={contactHref} variant="ghost" size="lg" fullWidth className="sm:!w-auto">
            {localized(c.hero.ctas.secondary.label, locale)}
          </ButtonLink>
        </div>
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <p className="eyebrow">{localized(c.threeWays.eyebrow, locale)}</p>
        <h2 className="mt-3 font-display text-display-md text-secondary">
          {localized(c.threeWays.title, locale)}
        </h2>
        <ol className="mt-8 grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {c.threeWays.items.map((it, i) => (
            <li key={i} className="card-interactive flex h-full flex-col p-6">
              <IconBox name={THREE_WAY_ICONS[i] ?? 'handshake'} size="sm" className="mb-4" />
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary/45">
                0{i + 1}
              </p>
              <h3 className="mt-2 font-display text-xl text-secondary">{localized(it.title, locale)}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-secondary/65">
                {localized(it.body, locale)}
              </p>
            </li>
          ))}
        </ol>
      </SectionWrapper>

      <SectionWrapper tone="soft" id="programmes-sur-mesure">
        <SplitBlock step="01" title={localized(c.custom.title, locale)}>
          {c.custom.paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed sm:text-lg">
              {localized(p, locale)}
            </p>
          ))}
          <div className="card-flat p-5 sm:p-6">
            <h3 className="font-display text-xl text-secondary">{localized(c.custom.subTitle, locale)}</h3>
            <BulletList items={c.custom.bullets} locale={locale} />
          </div>
          <p className="text-sm italic text-secondary/55">{localized(c.custom.closing, locale)}</p>
        </SplitBlock>
      </SectionWrapper>

      <SectionWrapper tone="canvas" id="cohortes-dediees">
        <SplitBlock step="02" title={localized(c.cohorts.title, locale)}>
          {c.cohorts.paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed sm:text-lg">
              {localized(p, locale)}
            </p>
          ))}
          <div className="card-flat p-5 sm:p-6">
            <h3 className="font-display text-xl text-secondary">{localized(c.cohorts.subTitle, locale)}</h3>
            <BulletList items={c.cohorts.bullets} locale={locale} />
          </div>
        </SplitBlock>
      </SectionWrapper>

      <SectionWrapper tone="soft" id="academies-institutionnelles">
        <SplitBlock step="03" title={localized(c.academies.title, locale)}>
          {c.academies.paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed sm:text-lg">
              {localized(p, locale)}
            </p>
          ))}
          <div className="card-flat p-5 sm:p-6">
            <h3 className="font-display text-xl text-secondary">{localized(c.academies.subTitle, locale)}</h3>
            <BulletList items={c.academies.bullets} locale={locale} />
          </div>
        </SplitBlock>
      </SectionWrapper>

      <SectionWrapper tone="canvas">
        <div className="max-w-3xl">
          <p className="eyebrow">{localized(c.partners.eyebrow, locale)}</p>
          <h2 className="mt-3 font-display text-display-md text-secondary">
            {localized(c.partners.title, locale)}
          </h2>
          <p className="mt-4 text-secondary/65">{localized(c.partners.intro, locale)}</p>
        </div>
        <ul className="mt-8 space-y-3 sm:mt-10">
          {c.partners.categories.map((cat, i) => (
            <li key={i} className="card-flat p-5 sm:p-6">
              <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-8">
                <h3 className="font-display text-lg text-secondary">{localized(cat.title, locale)}</h3>
                <p className="text-sm leading-relaxed text-secondary/65 sm:text-base">
                  {localized(cat.body, locale)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <SectionWrapper tone="soft">
        <p className="eyebrow">{localized(c.experience.eyebrow, locale)}</p>
        <h2 className="mt-3 font-display text-display-md text-secondary">
          {localized(c.experience.title, locale)}
        </h2>
        <ul className="mt-8 grid min-w-0 gap-5 sm:grid-cols-2 lg:gap-6">
          {c.experience.pillars.map((p, i) => (
            <li key={i} className="card-interactive p-6">
              <IconBox name={EXPERIENCE_ICONS[i] ?? 'star'} size="sm" className="mb-4" />
              <h3 className="font-display text-xl text-secondary">{localized(p.title, locale)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary/65">{localized(p.body, locale)}</p>
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
