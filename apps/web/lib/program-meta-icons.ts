import type { IconName } from '@/components/ui/Icon';
import type { ProgramType } from '@unm/types';

/** Icon for programme delivery format (Distanciel, Hybride, Présentiel, etc.). */
export function iconForProgramFormat(format: string): IconName {
  const n = format
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

  if (
    n.includes('distance') ||
    n.includes('distanc') ||
    n.includes('online') ||
    n.includes('ligne') ||
    n.includes('remote') ||
    n.includes('virtuel')
  ) {
    return 'laptop';
  }
  if (n.includes('hybr') || n.includes('blend') || n.includes('mix')) {
    return 'layers';
  }
  if (
    n.includes('present') ||
    n.includes('présent') ||
    n.includes('campus') ||
    n.includes('sur site') ||
    n.includes('on-site') ||
    n.includes('face')
  ) {
    return 'building';
  }
  return 'laptop';
}

/** Icon for programme type badge (MBA, DBA, etc.). */
export function iconForProgramType(type: ProgramType): IconName {
  switch (type) {
    case 'MBA':
      return 'briefcase';
    case 'DBA':
      return 'award';
    case 'Bachelor':
      return 'graduation';
    case 'Certificate':
      return 'badge';
    default:
      return 'graduation';
  }
}
