'use client';

import { Suspense, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { OrientationWizard } from '@/components/orientation/OrientationWizard';
import { AFRICAN_HERO } from '@/lib/page-heroes';

function WizardSkeleton() {
  return (
    <div className="orientation-home-skel" aria-hidden>
      <div className="orientation-home-skel-line w-40" />
      <div className="orientation-home-skel-line short" />
      <div className="orientation-home-skel-bar" />
      <div className="orientation-home-skel-title" />
      <div className="orientation-home-skel-grid">
        <div />
        <div />
      </div>
      <div className="orientation-home-skel-cta" />
    </div>
  );
}

export function OrientationHomeSection() {
  const t = useTranslations('orientation');
  const cardRef = useRef<HTMLDivElement>(null);

  function startOrientation() {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => {
      const firstControl = cardRef.current?.querySelector<HTMLElement>(
        '.orientation-segment-btn, .orientation-select, .orientation-option-card',
      );
      firstControl?.focus();
    }, 350);
  }

  return (
    <section id="orientation" className="orientation-home" aria-labelledby="orientation-home-title">
      <div className="orientation-home-media" aria-hidden>
        <Image
          src={AFRICAN_HERO.seminar}
          alt=""
          fill
          sizes="(max-width: 960px) 100vw, 48vw"
          className="orientation-home-media-img"
        />
        <div className="orientation-home-media-veil" />
      </div>

      <SectionWrapper tone="canvas" className="orientation-home-inner !bg-transparent">
        <div className="orientation-home-grid">
          <ScrollReveal from="up" className="orientation-home-copy">
            <p className="orientation-home-aside">{t('homeAside')}</p>
            <h2 id="orientation-home-title" className="orientation-home-title">
              {t('homeTitle')}
            </h2>
            <p className="orientation-home-lead">{t('homeLead')}</p>
            <Button
              type="button"
              size="lg"
              className="orientation-home-cta"
              onClick={startOrientation}
              trailingIcon={<Icon name="arrow-right" size={18} />}
            >
              {t('homeStart')}
            </Button>
            <p className="orientation-home-note">{t('homeNote')}</p>
          </ScrollReveal>

          <ScrollReveal from="up" delay={160} className="orientation-home-card-wrap">
            <div ref={cardRef} className="orientation-home-card">
              <Suspense fallback={<WizardSkeleton />}>
                <OrientationWizard mode="embed" />
              </Suspense>
            </div>
          </ScrollReveal>
        </div>
      </SectionWrapper>
    </section>
  );
}
