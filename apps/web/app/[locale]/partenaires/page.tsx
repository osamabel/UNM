import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PageHeader } from '@/components/patterns/PageHeader';
import { PartnersShowcase } from '@/components/partners/PartnersShowcase';
import { CTABanner } from '@/components/home/CTABanner';
import { getPartners } from '@/lib/api';
import type { Locale } from '@unm/types';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'partnersIndex' });
  return { title: t('metaTitle') };
}

export default async function PartnersPage({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);
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

      <SectionWrapper tone="soft" className="!pb-10 sm:!pb-12">
        <PageHeader
          icon="shield"
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('subtitle')}
          className="border-0 pb-0"
        />
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <PartnersShowcase partners={partners} />
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
