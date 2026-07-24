import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PartnersShowcase } from '@/components/partners/PartnersShowcase';
import { PartnersEbsFeature } from '@/components/partners/PartnersEbsFeature';
import { PartnersEbsIntro } from '@/components/partners/PartnersEbsIntro';
import { CTABanner } from '@/components/home/CTABanner';
import { getPartners } from '@/lib/api';
import type { Locale } from '@unm/types';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'partnersIndex' });
  return { title: t('metaTitle') };
}

export default async function PartnersPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [partners, t, tb] = await Promise.all([
    getPartners(),
    getTranslations({ locale: params.locale, namespace: 'partnersIndex' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
  ]);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const partnersUrl = isEn ? '/en/partners' : '/partenaires';

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: partnersUrl },
        ]}
      />

      <SectionWrapper tone="canvas" className="!pb-2 !pt-8 sm:!pb-3 sm:!pt-10">
        <header className="partners-page-header max-w-3xl">
          <div className="partners-page-header-meta">
            <p className="eyebrow !mt-0">{t('eyebrow')}</p>
            <span className="partners-page-header-rule" aria-hidden />
          </div>
          <h1 className="mt-3 font-display text-3xl text-secondary text-balance sm:text-4xl lg:text-[2.75rem]">
            {t('title')}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-secondary/70 sm:text-lg">
            {t('subtitle')}
          </p>
        </header>
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!pb-4 !pt-8 sm:!pb-5 sm:!pt-10">
        <PartnersEbsIntro locale={params.locale} />
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!pb-6 !pt-6 sm:!pb-8 sm:!pt-8">
        <PartnersEbsFeature locale={params.locale} />
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <PartnersShowcase partners={partners} />
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
