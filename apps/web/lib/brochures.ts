/** Local brochure PDFs under /public/brochures */

const BROCHURE_BY_SLUG: Record<string, string> = {
  'mba-tourisme-hospitality': 'mba-tourisme-hospitality.pdf',
  'mba-marketing-digital-communication': 'mba-marketing-digital-communication.pdf',
  'mba-management-strategique-intelligence-economique':
    'mba-management-strategique-intelligence-economique.pdf',
  'mba-gouvernance-management-public': 'mba-gouvernance-management-public.pdf',
};

const FALLBACK_BROCHURE = 'catalogue-unm.pdf';

export function getBrochureFilename(programSlug: string): string {
  return BROCHURE_BY_SLUG[programSlug] ?? FALLBACK_BROCHURE;
}

/** Public URL used after email gate. */
export function getBrochurePublicUrl(programSlug: string): string {
  return `/brochures/${getBrochureFilename(programSlug)}`;
}

export function hasDedicatedBrochure(programSlug: string): boolean {
  return Boolean(BROCHURE_BY_SLUG[programSlug]);
}
