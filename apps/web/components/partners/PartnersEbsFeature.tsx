import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Icon } from '@/components/ui/Icon';
import { EbsSourceLinks } from '@/components/partners/EbsSourceLinks';
import { LOGO_ALT, LOGO_SRC } from '@/lib/logo';
import type { Locale } from '@unm/types';

const ALLIANCE_BG_SRC = '/partners/ebs/alliance-collage.jpg';
const EBS_WORDMARK_SRC = '/partners/ebs/logo-european.svg';

const PRINCIPLES = ['principle1', 'principle2', 'principle3', 'principle4'] as const;
const WHY = [
  { title: 'why1Title', body: 'why1Body' },
  { title: 'why2Title', body: 'why2Body' },
  { title: 'why3Title', body: 'why3Body' },
  { title: 'why4Title', body: 'why4Body' },
] as const;

export async function PartnersEbsFeature({ locale }: { locale: Locale }) {
  const [tIndex, t] = await Promise.all([
    getTranslations({ locale, namespace: 'partnersIndex' }),
    getTranslations({ locale, namespace: 'ebs' }),
  ]);
  const programsHref = locale === 'en' ? '/en/programs' : '/programmes';

  return (
    <article className="relative overflow-hidden rounded-2xl border border-warm-200/60 bg-warm-50/80 shadow-sm">
      <div className="grid min-w-0 lg:grid-cols-12">
        <div className="partners-ebs-feature-media relative lg:col-span-5 lg:min-h-full">
          <Image
            src={ALLIANCE_BG_SRC}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="partners-ebs-feature-bg"
            aria-hidden
          />
          <div className="partners-ebs-feature-scrim" aria-hidden />
          <div className="partners-ebs-feature-logos">
            <div className="partners-ebs-feature-logo-slot partners-ebs-feature-logo-slot--ebs">
              <Image
                src={EBS_WORDMARK_SRC}
                alt="European Business School"
                width={320}
                height={130}
                className="partners-ebs-feature-logo-img partners-ebs-feature-logo-img--ebs"
              />
            </div>
            <span className="partners-ebs-feature-logos-x" aria-hidden>
              ×
            </span>
            <div className="partners-ebs-feature-logo-slot partners-ebs-feature-logo-slot--unm">
              <Image
                src={LOGO_SRC}
                alt={LOGO_ALT}
                width={320}
                height={148}
                className="partners-ebs-feature-logo-img partners-ebs-feature-logo-img--unm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-7 lg:p-10">
          <p className="eyebrow">{tIndex('ebsEyebrow')}</p>
          <h2 className="mt-3 font-display text-2xl text-secondary text-balance sm:text-3xl">
            {tIndex('ebsTitle')}
          </h2>
          <p className="mt-4 text-base font-medium leading-snug text-secondary/80 sm:text-lg">
            {tIndex('ebsTagline')}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-secondary/70 sm:text-[0.95rem]">
            {t('intro1')}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-secondary/68 sm:text-[0.95rem]">
            {t('intro2')}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-secondary/68 sm:text-[0.95rem]">
            {t('intro3')}
          </p>

          <Link
            href={programsHref}
            className="btn-uni btn-uni-primary mt-7 inline-flex h-11 w-fit items-center gap-2 rounded-lg px-5 text-sm"
          >
            {tIndex('ebsCta')}
            <Icon name="arrow-right" size={16} className="btn-arrow" />
          </Link>
        </div>
      </div>

      <div className="border-t border-warm-200/70 px-6 py-8 sm:px-8 lg:px-10">
        <h3 className="font-display text-xl text-secondary sm:text-2xl">{t('allianceTitle')}</h3>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-secondary/68 sm:text-[0.95rem]">
          {t('allianceLead')}
        </p>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          {t('principlesLabel')}
        </p>
        <ul className="mt-4 max-w-3xl space-y-2.5">
          {PRINCIPLES.map((key) => (
            <li
              key={key}
              className="flex gap-2.5 text-sm leading-relaxed text-secondary/70 sm:text-[0.95rem]"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-10 font-display text-xl text-secondary sm:text-2xl">{t('whyTitle')}</h3>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {WHY.map((item) => (
            <li key={item.title} className="min-w-0">
              <h4 className="font-heading text-sm font-semibold text-secondary sm:text-base">
                {t(item.title)}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-secondary/65">{t(item.body)}</p>
            </li>
          ))}
        </ul>

        <EbsSourceLinks variant="panel" className="mt-10" />
      </div>
    </article>
  );
}
