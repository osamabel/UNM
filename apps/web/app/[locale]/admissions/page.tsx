import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Icon } from '@/components/ui/Icon';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { CTABanner } from '@/components/home/CTABanner';
import { getPrograms, getSiteSettings } from '@/lib/api';
import { mergeSiteSettings, digitsOnly } from '@/lib/site-settings';
import type { Locale } from '@unm/types';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'admissions' });
  return { title: t('title'), description: t('metaDescription') };
}

function FormSkeleton() {
  return (
    <div className="form-panel animate-pulse space-y-6" aria-hidden>
      <div className="space-y-3 border-b border-warm-150/60 pb-6">
        <div className="h-3 w-28 rounded bg-warm-200/80" />
        <div className="h-7 w-44 rounded bg-warm-200/80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-11 rounded-xl bg-warm-200" />
        <div className="h-11 rounded-xl bg-warm-200" />
        <div className="h-11 rounded-xl bg-warm-200" />
        <div className="h-11 rounded-xl bg-warm-200" />
        <div className="h-11 rounded-xl bg-warm-200" />
        <div className="h-11 rounded-xl bg-warm-200" />
      </div>
      <div className="h-11 w-40 rounded-xl bg-warm-300" />
    </div>
  );
}

export default async function AdmissionsPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [programs, t, tb, rawSettings] = await Promise.all([
    getPrograms({ limit: 200 }),
    getTranslations({ locale: params.locale, namespace: 'admissions' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
    getSiteSettings(),
  ]);
  const settings = mergeSiteSettings(rawSettings);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const admissionsUrl = isEn ? '/en/admissions' : '/admissions';
  const phoneDigits = digitsOnly(settings.contact.phone);

  const steps = [
    { num: '01', title: t('step1Title'), body: t('step1Body'), icon: 'document' as const },
    { num: '02', title: t('step2Title'), body: t('step2Body'), icon: 'mail' as const },
    { num: '03', title: t('step3Title'), body: t('step3Body'), icon: 'check-circle' as const },
  ];

  const trusts = [
    { label: t('stepsHint'), icon: 'clock' as const },
    { label: t('trustSecure'), icon: 'shield' as const },
    { label: t('trustResponse'), icon: 'mail' as const },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: admissionsUrl },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-warm-150/40 bg-soft/80">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            background:
              'radial-gradient(ellipse 65% 50% at 8% 15%, rgba(181,52,26,0.10), transparent 55%), radial-gradient(ellipse 45% 40% at 92% 80%, rgba(61,26,11,0.05), transparent 50%)',
          }}
          aria-hidden
        />
        <div className="container-page relative py-12 sm:py-14 lg:py-16">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-primary">{t('formEyebrow')}</p>
              <h1 className="mt-4 font-display text-[2.15rem] leading-[1.12] text-secondary sm:text-5xl lg:text-[3.1rem]">
                {t('heroTitle')}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-secondary/70 sm:text-lg">
                {t('intro')}
              </p>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {trusts.map((item) => (
                  <li key={item.label} className="inline-flex items-center gap-2 text-sm text-secondary/70">
                    <Icon name={item.icon} size={16} className="text-primary/80" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Process */}
      <SectionWrapper tone="canvas" className="!py-10 sm:!py-12">
        <ScrollReveal>
          <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            {t('processEyebrow')}
          </p>
          <h2 className="mt-2 font-display text-2xl text-secondary sm:text-3xl">{t('processTitle')}</h2>
        </ScrollReveal>

        <ol className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {steps.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 70}>
              <li className="relative">
                {i < steps.length - 1 && (
                  <span
                    className="pointer-events-none absolute left-[calc(50%+2.5rem)] top-5 hidden h-px w-[calc(100%-2.5rem)] bg-warm-200/90 sm:block"
                    aria-hidden
                  />
                )}
                <div className="flex items-start gap-3 sm:flex-col sm:items-start sm:gap-4">
                  <span className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-warm-200/80 bg-white font-heading text-xs font-semibold text-primary shadow-sm">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-secondary">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-secondary/65">{step.body}</p>
                  </div>
                </div>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </SectionWrapper>

      {/* Form + help */}
      <SectionWrapper tone="soft" className="!py-12 sm:!py-14 lg:!py-16" id="formulaire">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start lg:gap-10 xl:gap-12">
          <ScrollReveal>
            <div className="mb-6">
              <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                {t('formEyebrow')}
              </p>
              <h2 className="mt-2 font-display text-2xl text-secondary sm:text-3xl">{t('formTitle')}</h2>
              <p className="mt-2 text-sm text-secondary/60">{t('formHint')}</p>
            </div>
            <Suspense fallback={<FormSkeleton />}>
              <ApplicationForm programs={programs} />
            </Suspense>
          </ScrollReveal>

          <aside className="space-y-5 lg:sticky lg:top-28">
            <ScrollReveal delay={80}>
              <div className="rounded-2xl border border-warm-200/70 bg-white p-5 sm:p-6">
                <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                  {t('helpTitle')}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-secondary/70">{t('helpBody')}</p>

                <div className="mt-5 border-t border-warm-150/80 pt-5">
                  <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary/40">
                    {t('contactEyebrow')}
                  </p>
                  <ul className="mt-3 space-y-3 text-sm text-secondary/80">
                    <li>
                      <a
                        href={`mailto:${settings.contact.email}`}
                        className="inline-flex items-center gap-2.5 transition-colors hover:text-primary"
                      >
                        <Icon name="mail" size={16} className="shrink-0 text-primary/75" />
                        {settings.contact.email}
                      </a>
                    </li>
                    {phoneDigits && (
                      <li>
                        <a
                          href={`tel:${phoneDigits}`}
                          className="inline-flex items-center gap-2.5 transition-colors hover:text-primary"
                        >
                          <Icon name="phone" size={16} className="shrink-0 text-primary/75" />
                          {settings.contact.phone}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <ul className="space-y-3 rounded-2xl border border-warm-200/60 bg-white/70 p-5">
                {trusts.map((item) => (
                  <li key={item.label} className="flex items-start gap-3 text-sm text-secondary/70">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                      <Icon name={item.icon} size={14} />
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </aside>
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
