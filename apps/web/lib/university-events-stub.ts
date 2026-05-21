import type { IconName } from '@/components/ui/Icon';
import type { LocalizedField } from '@unm/types';

export type UniversityEventKind = 'openDay' | 'webinar' | 'masterclass';

export interface UniversityEventStub {
  kind: UniversityEventKind;
  date: LocalizedField;
  title: LocalizedField;
  location: LocalizedField;
}

export const UNIVERSITY_EVENTS_STUB: UniversityEventStub[] = [
  {
    kind: 'openDay',
    date: { fr: '12 juin 2026', en: 'June 12, 2026' },
    title: {
      fr: 'JPO Campus Marrakech — Programmes MBA & DBA',
      en: 'Open Day Marrakech Campus — MBA & DBA programmes',
    },
    location: { fr: 'Borj Menara I, Marrakech', en: 'Borj Menara I, Marrakech' },
  },
  {
    kind: 'webinar',
    date: { fr: '24 juin 2026', en: 'June 24, 2026' },
    title: {
      fr: 'MBA Ressources Minières : enjeux ESG en Afrique',
      en: 'Mining Resources MBA: ESG stakes in Africa',
    },
    location: { fr: 'En ligne', en: 'Online' },
  },
  {
    kind: 'masterclass',
    date: { fr: '8 juillet 2026', en: 'July 8, 2026' },
    title: {
      fr: 'Intelligence économique appliquée aux décisions publiques',
      en: 'Business intelligence applied to public decision-making',
    },
    location: { fr: 'EBS Paris — Hybride', en: 'EBS Paris — Hybrid' },
  },
];

export const EVENT_KIND_ICON: Record<UniversityEventKind, IconName> = {
  openDay: 'users',
  webinar: 'globe',
  masterclass: 'sparkles',
};
