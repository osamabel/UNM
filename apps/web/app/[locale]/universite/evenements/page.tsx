import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { UniversitySubHero } from '@/components/university/UniversitySubHero';
import { EventCard } from '@/components/university/EventCard';
import { CTABanner } from '@/components/home/CTABanner';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { UNIVERSITY_EVENTS_STUB } from '@/lib/university-events-stub';
import { localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'eventsIndex' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function EventsPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [t, tu, tb] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: 'eventsIndex' }),
    getTranslations({ locale: params.locale, namespace: 'universityIndex' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
  ]);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const universityUrl = isEn ? '/en/university' : '/universite';
  const eventsUrl = isEn ? '/en/university/evenements' : '/universite/evenements';

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: tu('breadcrumb'), url: universityUrl },
          { name: t('breadcrumb'), url: eventsUrl },
        ]}
      />

      <UniversitySubHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('intro')} />

      <SectionWrapper tone="canvas">
        <div className="space-y-4 sm:space-y-5">
          {UNIVERSITY_EVENTS_STUB.map((e, i) => (
            <ScrollReveal key={`${e.kind}-${i}`} delay={i * 60}>
              <EventCard
                kind={e.kind}
                kindLabel={t(`kind.${e.kind}`)}
                date={localized(e.date, params.locale)}
                title={localized(e.title, params.locale)}
                location={localized(e.location, params.locale)}
              />
            </ScrollReveal>
          ))}
        </div>

        <p className="glass-pill mt-8 inline-flex max-w-prose text-xs font-medium text-secondary/65 sm:mt-10">
          {t('disclaimer')}
        </p>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
