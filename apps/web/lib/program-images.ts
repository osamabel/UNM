/**
 * Local cover images for MBA / DBA specialties.
 * EBS campus photos live under /partners/ebs; thematic covers under /programs.
 */
const PROGRAM_COVERS: Record<string, string> = {
  'dba-business-administration': '/partners/ebs/students.jpg',
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

const TYPE_COVERS: Record<string, string> = {
  DBA: '/partners/ebs/program.jpg',
  MBA: '/partners/ebs/campus-life.jpg',
  Certificate: '/partners/ebs/event.jpg',
};

export function getProgramCoverSrc(slug: string): string | undefined {
  return PROGRAM_COVERS[slug];
}

export function getProgramTypeCoverSrc(type: string): string | undefined {
  return TYPE_COVERS[type];
}

export const EBS_PHOTOS = {
  campus: '/partners/ebs/campus.jpg',
  campusLife: '/partners/ebs/campus-life.jpg',
  students: '/partners/ebs/students.jpg',
  program: '/partners/ebs/program.jpg',
  event: '/partners/ebs/event.jpg',
  businessSchool: '/partners/ebs/business-school.jpg',
} as const;
