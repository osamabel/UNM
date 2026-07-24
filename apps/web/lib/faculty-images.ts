import type { Faculty } from '@unm/types';

/**
 * Dedicated covers, one per pole, each showing that faculty's own subject.
 * Deliberately not EBS campus photography: those frames show undergraduates,
 * which misreads the Executive audience these faculties actually serve.
 */
const FACULTY_COVERS: Record<string, string> = {
  'business-school': '/faculties/business-school.jpg',
  'school-of-governance': '/programs/mba-gouvernance-management-public.jpg',
  'school-of-technology': '/faculties/technology.jpg',
  'school-of-sport-business': '/faculties/sport-business.jpg',
};

/**
 * Prefer dedicated Business School / faculty photos over CMS logos
 * so the hero always shows a real business-school image.
 */
export function getFacultyCoverSrc(faculty: Pick<Faculty, 'slug' | 'coverImage'>): string {
  const dedicated = FACULTY_COVERS[faculty.slug];
  if (dedicated) return dedicated;

  const cmsUrl = faculty.coverImage?.url?.trim();
  if (cmsUrl && !cmsUrl.includes('placeholder')) return cmsUrl;

  return FACULTY_COVERS['business-school'];
}
