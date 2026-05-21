'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Icon } from '@/components/ui/Icon';
import { PartnerLogoTile } from '@/components/home/PartnerLogos';
import {
  PARTNER_CATEGORIES,
  iconForPartnerCategory,
  partnerCategoryLabel,
} from '@/lib/partner-category';
import type { Locale, Partner } from '@unm/types';

interface Props {
  partners: Partner[];
}

export function PartnersShowcase({ partners }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('partnersIndex');

  const grouped = useMemo(() => {
    const map: Record<Partner['category'], Partner[]> = {
      academic: [],
      industry: [],
      government: [],
    };
    for (const p of partners) {
      map[p.category]?.push(p);
    }
    return map;
  }, [partners]);

  if (partners.length === 0) {
    return (
      <div className="card-flat px-6 py-16 text-center">
        <p className="text-secondary/60">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 sm:space-y-14">
      {PARTNER_CATEGORIES.map((category, sectionIndex) => {
        const list = grouped[category];
        if (list.length === 0) return null;
        const catIcon = iconForPartnerCategory(category);

        return (
          <section key={category}>
            <ScrollReveal delay={sectionIndex * 40}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="icon-box h-10 w-10 shrink-0">
                  <Icon name={catIcon} size={20} />
                </span>
                <div>
                  <p className="eyebrow">{partnerCategoryLabel(category, locale)}</p>
                  <h2 className="mt-1 font-display text-xl text-secondary sm:text-2xl">
                    {t(`categoryTitle.${category}`)}
                  </h2>
                </div>
              </div>
            </ScrollReveal>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {list.map((p, i) => (
                <li key={p.id} className="min-w-0">
                  <ScrollReveal delay={80 + i * 45}>
                    <PartnerLogoTile partner={p} layout="grid" />
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
