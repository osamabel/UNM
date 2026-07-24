import { EBS_PHOTOS } from '@/lib/program-images';
import type { Faculty } from '@unm/types';

/** Dedicated local covers — Business School uses EBS programme photography. */
const FACULTY_COVERS: Record<string, string> = {
  'business-school': EBS_PHOTOS.businessSchool,
  'school-of-governance': '/programs/mba-gouvernance-management-public.jpg',
  'school-of-technology': EBS_PHOTOS.featuredCertificate,
  'school-of-sport-business': EBS_PHOTOS.campusLife,
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

  return EBS_PHOTOS.campus;
}
