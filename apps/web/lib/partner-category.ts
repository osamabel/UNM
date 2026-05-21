import type { IconName } from '@/components/ui/Icon';
import type { Locale, Partner } from '@unm/types';

export const PARTNER_CATEGORIES: Partner['category'][] = ['academic', 'industry', 'government'];

export function iconForPartnerCategory(category: Partner['category']): IconName {
  const map: Record<Partner['category'], IconName> = {
    academic: 'graduation',
    industry: 'building',
    government: 'shield',
  };
  return map[category];
}

export function partnerCategoryLabel(category: Partner['category'], locale: Locale): string {
  const labels: Record<Partner['category'], { fr: string; en: string }> = {
    academic: { fr: 'Académique', en: 'Academic' },
    industry: { fr: 'Industrie', en: 'Industry' },
    government: { fr: 'Institutionnel', en: 'Government' },
  };
  return labels[category][locale];
}
