import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PageHeader } from '@/components/patterns/PageHeader';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Icon } from '@/components/ui/Icon';
import { FacultiesShowcase } from '@/components/faculty/FacultiesShowcase';
import { CTABanner } from '@/components/home/CTABanner';
import { getFaculties } from '@/lib/api';
import type { Locale } from '@unm/types';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'facultiesIndex' });
  return { title: t('metaTitle') };
}

export default async function FacultiesIndex({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [faculties, t, tb] = await Promise.all([
    getFaculties(),
    getTranslations({ locale: params.locale, namespace: 'facultiesIndex' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
  ]);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const facultiesUrl = isEn ? '/en/faculties' : '/facultes';
  const active = faculties.filter((f) => !f.comingSoon).length;
  const upcoming = faculties.filter((f) => f.comingSoon).length;

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: facultiesUrl },
        ]}
      />

      <SectionWrapper tone="soft" className="!pb-10 sm:!pb-12">
        <PageHeader
          icon="landmark"
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('subtitle', { active, upcoming })}
          className="border-0 pb-0"
        />
        <ul className="mt-6 flex flex-wrap gap-2 sm:mt-8">
          <li className="glass-pill flex items-center gap-1.5 text-xs font-medium text-secondary/75">
            <Icon name="check-circle" size={14} className="text-primary/90" />
            {t('trustActive', { count: active })}
          </li>
          <li className="glass-pill flex items-center gap-1.5 text-xs font-medium text-secondary/75">
            <Icon name="library" size={14} className="text-primary/90" />
            {t('trustUpcoming', { count: upcoming })}
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <FacultiesShowcase faculties={faculties} />
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
