import type { Program } from '@unm/types';

export type ExperienceBand = '0-5' | '5-10' | '10-15' | '15+';
export type DiplomaLevel = 'bac3' | 'bac5' | 'doctorat';
export type OrientationDomain =
  | 'finance'
  | 'marketing'
  | 'projects'
  | 'strategy'
  | 'tourism'
  | 'public'
  | 'mining'
  | 'research';
export type OrientationGoal = 'leadership' | 'specialization' | 'doctorate';

export interface OrientationAnswers {
  experience: ExperienceBand;
  diploma: DiplomaLevel;
  domain: OrientationDomain;
  goal: OrientationGoal;
}

export interface OrientationMatch {
  program: Program;
  score: number;
  reasons: string[];
  /** True when returned as closest-options fallback (no strong score). */
  fallback?: boolean;
}

/** Domain → programme slug fragments / full slugs (seed-aligned). */
export const DOMAIN_SLUGS: Record<OrientationDomain, string[]> = {
  finance: [
    'mba-banques-assurances',
    'mba-fiscalite-finances-publiques',
    'mba-comptabilite-controle-audit',
  ],
  marketing: ['mba-marketing-digital-communication'],
  projects: ['mba-management-projets'],
  strategy: ['mba-management-strategique-intelligence-economique'],
  tourism: ['mba-tourisme-hospitality'],
  public: [
    'mba-gouvernance-management-public',
    'mba-fiscalite-finances-publiques',
  ],
  mining: ['mba-gouvernance-ressources-minieres'],
  research: ['dba-business-administration'],
};

const EXECUTIVE_TYPES = new Set(['MBA', 'DBA']);

function isExecutiveActive(p: Program): boolean {
  return Boolean(p.isActive) && EXECUTIVE_TYPES.has(p.type);
}

function scoreProgram(program: Program, answers: OrientationAnswers): OrientationMatch {
  let score = 0;
  const reasons: string[] = [];
  const domainSlugs = DOMAIN_SLUGS[answers.domain];

  if (domainSlugs.includes(program.slug)) {
    score += 3;
    reasons.push('domain');
  }

  if (answers.goal === 'doctorate' && program.type === 'DBA') {
    score += 4;
    reasons.push('goalDoctorate');
  } else if (
    (answers.goal === 'specialization' || answers.goal === 'leadership') &&
    program.type === 'MBA'
  ) {
    score += 2;
    reasons.push('goalMba');
  }

  const senior = answers.experience === '10-15' || answers.experience === '15+';
  if (senior && program.type === 'DBA') {
    score += 1;
    reasons.push('experienceSenior');
  } else if (!senior && program.type === 'MBA') {
    score += 1;
    reasons.push('experienceMba');
  }

  if (answers.diploma === 'doctorat' && program.type === 'DBA') {
    score += 1;
    reasons.push('diplomaDoctorat');
  } else if (answers.diploma === 'bac5' && program.type === 'MBA') {
    score += 1;
    reasons.push('diplomaMba');
  }

  if (answers.domain === 'research' && program.type === 'DBA') {
    score += 2;
    reasons.push('researchDba');
  }

  return { program, score, reasons };
}

/**
 * Rank active MBA/DBA programmes for an orientation profile.
 * Returns top matches with positive score, or featured MBAs as fallback.
 */
export function matchOrientationPrograms(
  programs: Program[],
  answers: OrientationAnswers,
  limit = 3,
): OrientationMatch[] {
  const pool = programs.filter(isExecutiveActive);
  const scored = pool
    .map((p) => scoreProgram(p, answers))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || a.program.title.fr.localeCompare(b.program.title.fr));

  if (scored.length > 0) {
    return scored.slice(0, limit);
  }

  const featured = pool
    .filter((p) => p.type === 'MBA')
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.title.fr.localeCompare(b.title.fr))
    .slice(0, limit)
    .map((program) => ({
      program,
      score: 0,
      reasons: ['fallback'] as string[],
      fallback: true,
    }));

  if (featured.length > 0) return featured;

  return pool.slice(0, limit).map((program) => ({
    program,
    score: 0,
    reasons: ['fallback'],
    fallback: true,
  }));
}
