import type { IconName } from '@/components/ui/Icon';

/** Map domain label (FR or EN) to the closest UNM icon. */
export function iconForDomain(label: string): IconName {
  const n = label.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

  if (n.includes('finance') || n.includes('fiscal') || n.includes('tax')) return 'briefcase';
  if (n.includes('gouvernance') || n.includes('governance') || n.includes('politique') || n.includes('policy'))
    return 'scale';
  if (n.includes('marketing') || n.includes('communication')) return 'sparkles';
  if (n.includes('intelligence') || n.includes('strateg')) return 'target';
  if (n.includes('management public') || n.includes('public management') || n.includes('administration'))
    return 'landmark';
  if (n.includes('management') || n.includes('leadership')) return 'users';
  if (n.includes('transformation') || n.includes('digital') || n.includes('technolog') || n.includes('data'))
    return 'cpu';
  if (n.includes('tourisme') || n.includes('tourism') || n.includes('hospitality') || n.includes('hotel'))
    return 'map-pin';
  if (n.includes('miniere') || n.includes('mining') || n.includes('ressource')) return 'award';
  if (n.includes('sport')) return 'trophy';
  if (n.includes('education') || n.includes('formation')) return 'graduation';
  return 'book';
}
