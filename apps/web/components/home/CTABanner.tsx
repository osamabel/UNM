'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Icon } from '@/components/ui/Icon';
import { LOGO_SRC } from '@/lib/logo';
import type { Locale } from '@unm/types';

export function CTABanner() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const isEn = locale === 'en';

  const admissionsHref = isEn ? '/en/admissions' : '/admissions';
  const contactHref = isEn ? '/en/contact' : '/contact';

  const proofs = [
    t('ctaBannerProof1'),
    t('ctaBannerProof2'),
    t('ctaBannerProof3'),
  ] as const;

  return (
    <SectionWrapper id="candidater" tone="canvas" className="cta-banner-section !border-b-0 !py-12 sm:!py-14 lg:!pb-16">
      <ScrollReveal from="up" duration={900}>
        <div className="cta-banner">
          <div className="cta-banner-glow" aria-hidden />
          <div className="cta-banner-ring cta-banner-ring--a" aria-hidden />
          <div className="cta-banner-ring cta-banner-ring--b" aria-hidden />
          <div className="cta-banner-grain" aria-hidden />

          <div className="cta-banner-logo-bg" aria-hidden>
            <Image
              src={LOGO_SRC}
              alt=""
              width={720}
              height={334}
              className="cta-banner-logo-img"
              unoptimized
            />
          </div>

          <div className="cta-banner-layout">
            <div className="cta-banner-copy">
              <div className="cta-banner-meta">
                <span className="cta-banner-index" aria-hidden>
                  04
                </span>
                <p className="cta-banner-eyebrow">{t('ctaBannerEyebrow')}</p>
                <span className="cta-banner-rule" aria-hidden />
              </div>

              <h2 className="cta-banner-title">{t('ctaBannerTitle')}</h2>
              <p className="cta-banner-subtitle">{t('ctaBannerSubtitle')}</p>

              <ul className="cta-banner-proofs">
                {proofs.map((label) => (
                  <li key={label} className="cta-banner-proof">
                    <span className="cta-banner-proof-dot" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>

              <div className="cta-banner-actions">
                <ButtonLink
                  href={admissionsHref}
                  size="lg"
                  className="cta-banner-btn-primary"
                  trailingIcon={<Icon name="arrow-right" size={18} />}
                >
                  {tc('applyNow')}
                </ButtonLink>
                <ButtonLink
                  href={contactHref}
                  variant="ghost"
                  size="lg"
                  className="cta-banner-btn-ghost"
                >
                  {tc('contactUs')}
                </ButtonLink>
              </div>
            </div>

            <aside className="cta-banner-panel">
              <Link
                href={admissionsHref}
                className="cta-banner-panel-inner"
                aria-label={`${t('ctaBannerPanelTitle')} — ${tc('applyNow')}`}
              >
                <p className="cta-banner-panel-eyebrow">{t('ctaBannerPanelEyebrow')}</p>
                <p className="cta-banner-panel-title">{t('ctaBannerPanelTitle')}</p>
                <p className="cta-banner-panel-hint">{t('ctaBannerPanelHint')}</p>
                <span className="cta-banner-panel-arrow" aria-hidden>
                  <Icon name="arrow-right" size={28} />
                </span>
              </Link>
            </aside>
          </div>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}
