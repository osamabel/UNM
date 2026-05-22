import type { IconName } from '@/components/ui/Icon';
import type { LocalizedField } from '@unm/types';

export interface NewsroomResourceStub {
  key: string;
  icon: IconName;
  name: LocalizedField;
  size: LocalizedField;
}

export const NEWSROOM_RESOURCES_STUB: NewsroomResourceStub[] = [
  {
    key: 'kit',
    icon: 'megaphone',
    name: { fr: 'Kit presse complet', en: 'Full press kit' },
    size: { fr: 'PDF · à venir', en: 'PDF · coming soon' },
  },
  {
    key: 'logos',
    icon: 'badge',
    name: { fr: 'Logos UNM (SVG + PNG)', en: 'UNM logos (SVG + PNG)' },
    size: { fr: 'ZIP · à venir', en: 'ZIP · coming soon' },
  },
  {
    key: 'photos',
    icon: 'image',
    name: { fr: 'Photos institutionnelles', en: 'Institutional photos' },
    size: { fr: 'ZIP · à venir', en: 'ZIP · coming soon' },
  },
  {
    key: 'brand',
    icon: 'palette',
    name: { fr: 'Charte graphique', en: 'Brand guidelines' },
    size: { fr: 'PDF · à venir', en: 'PDF · coming soon' },
  },
];
