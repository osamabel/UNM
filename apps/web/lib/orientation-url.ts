import type { Locale } from '@unm/types';
import type {
  DiplomaLevel,
  ExperienceBand,
  OrientationAnswers,
  OrientationDomain,
  OrientationGoal,
} from '@/lib/orientation-match';

const EXPERIENCE = new Set<ExperienceBand>(['0-5', '5-10', '10-15', '15+']);
const DIPLOMAS = new Set<DiplomaLevel>(['bac3', 'bac5', 'doctorat']);
const DOMAINS = new Set<OrientationDomain>([
  'finance',
  'marketing',
  'projects',
  'strategy',
  'tourism',
  'public',
  'mining',
  'research',
]);
const GOALS = new Set<OrientationGoal>(['leadership', 'specialization', 'doctorate']);

export function orientationPath(locale: Locale): string {
  return locale === 'en' ? '/en/orientation' : '/orientation';
}

export function buildOrientationResultsHref(locale: Locale, answers: OrientationAnswers): string {
  const q = new URLSearchParams({
    exp: answers.experience,
    dip: answers.diploma,
    dom: answers.domain,
    goal: answers.goal,
  });
  return `${orientationPath(locale)}?${q.toString()}`;
}

export function parseOrientationAnswers(
  params: URLSearchParams | { get(name: string): string | null },
): OrientationAnswers | null {
  const experience = params.get('exp') as ExperienceBand | null;
  const diploma = params.get('dip') as DiplomaLevel | null;
  const domain = params.get('dom') as OrientationDomain | null;
  const goal = params.get('goal') as OrientationGoal | null;
  if (
    !experience ||
    !diploma ||
    !domain ||
    !goal ||
    !EXPERIENCE.has(experience) ||
    !DIPLOMAS.has(diploma) ||
    !DOMAINS.has(domain) ||
    !GOALS.has(goal)
  ) {
    return null;
  }
  return { experience, diploma, domain, goal };
}
