'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Icon, IconBox } from '@/components/ui/Icon';
import type { Locale } from '@unm/types';

const PILLAR_KEYS = ['pillar1', 'pillar2', 'pillar3'] as const;
const PILLAR_ICONS = ['award', 'globe', 'shield'] as const;

export function EBSPartnership() {
  const locale = useLocale() as Locale;
  const t = useTranslations('ebs');

  return (
    <SectionWrapper id="partenariat" tone="alt">
      <div className="grid min-w-0 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
        <ScrollReveal>
          <div>
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="mt-3 font-display text-display-md text-secondary">{t('title')}</h2>
            <p className="mt-4 leading-relaxed text-secondary/75">{t('description')}</p>
            <Link href={locale === 'en' ? '/en/university' : '/universite'} className="link-arrow mt-6">
              {t('learnMore')}
              <Icon name="arrow-right" size={16} className="btn-arrow" />
            </Link>
            <div className="mt-8 flex flex-wrap gap-2">
              {['EFMD', 'AACSB', 'CEFDG'].map((label) => (
                <span key={label} className="glass-pill text-xs font-semibold">
                  <Icon name="shield" size={12} className="text-primary" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ul className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLAR_KEYS.map((key, i) => (
            <li key={key}>
              <ScrollReveal delay={i * 100} className="h-full">
                <div className="card-interactive group h-full p-6">
                  <IconBox name={PILLAR_ICONS[i]} size="sm" className="mb-4" />
                  <h3 className="font-display text-lg font-semibold text-secondary group-hover:text-primary">
                    {t(`${key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary/70">{t(`${key}Body`)}</p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
