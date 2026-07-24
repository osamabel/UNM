/**
 * Specialty cover photos for each MBA / DBA programme.
 * Thematic images under /programs; EBS assets under /partners/ebs.
 */
const PROGRAM_COVERS: Record<string, string> = {
  // DBA
  'dba-business-administration': '/programs/dba-business-administration.jpg',

  // MBA specialties
  'mba-banques-assurances': '/programs/mba-banques-assurances.jpg',
  'mba-comptabilite-controle-audit': '/programs/mba-comptabilite-controle-audit.jpg',
  'mba-fiscalite-finances-publiques': '/programs/mba-fiscalite-finances-publiques.jpg',
  'mba-gouvernance-management-public': '/programs/mba-gouvernance-management-public.jpg',
  'mba-gouvernance-ressources-minieres': '/programs/mba-gouvernance-ressources-minieres.jpg',
  'mba-management-projets': '/programs/mba-management-projets.jpg',
  'mba-management-strategique-intelligence-economique':
    '/programs/mba-management-strategique-intelligence-economique.jpg',
  'mba-marketing-digital-communication': '/programs/mba-marketing-digital-communication.jpg',
  'mba-tourisme-hospitality': '/programs/mba-tourisme-hospitality.jpg',
};

/**
 * Fallback per programme type, and the covers shown on the home "type" cards.
 * Executive-appropriate frames — the EBS campus set shows undergraduates.
 * Each type gets a distinct photo: these three render side by side on the
 * homepage, so any reuse reads immediately as a mistake.
 */
const TYPE_COVERS: Record<string, string> = {
  DBA: '/programs/dba-business-administration.jpg',
  MBA: '/hero-seminar.jpg',
  Certificate: '/programs/certificate-executive.jpg',
  Bachelor: '/faculties/business-school.jpg',
};

export function getProgramCoverSrc(slug: string, type?: string): string {
  return PROGRAM_COVERS[slug] ?? (type ? TYPE_COVERS[type] : undefined) ?? TYPE_COVERS.MBA;
}

export function getProgramTypeCoverSrc(type: string): string {
  return TYPE_COVERS[type] ?? TYPE_COVERS.MBA;
}

export const EBS_PHOTOS = {
  campus: '/partners/ebs/campus.jpg',
  campusLife: '/partners/ebs/campus-life.jpg',
  students: '/partners/ebs/students.jpg',
  program: '/partners/ebs/program.jpg',
  event: '/partners/ebs/event.jpg',
  businessSchool: '/partners/ebs/business-school.jpg',
  featuredDba: '/partners/ebs/featured-dba.jpg',
  featuredMba: '/partners/ebs/featured-mba.jpg',
  featuredCertificate: '/partners/ebs/featured-certificate.jpg',
} as const;
