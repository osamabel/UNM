import type { IconName } from '@/components/ui/Icon';

/** Faculty slug → semantic Lucide key (via `Icon`). */
export const FACULTY_ICONS: Record<string, IconName> = {
  'business-school': 'briefcase',
  'school-of-governance': 'scale',
  'school-of-technology': 'cpu',
  'school-of-sport-business': 'trophy',
};

export const DEFAULT_FACULTY_ICON: IconName = 'landmark';

export function iconForFacultySlug(slug?: string | null): IconName {
  if (!slug) return DEFAULT_FACULTY_ICON;
  return FACULTY_ICONS[slug] ?? DEFAULT_FACULTY_ICON;
}
