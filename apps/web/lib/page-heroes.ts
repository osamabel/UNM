/**
 * Shared photography for page heroes (local public assets).
 *
 * Chosen for the Executive audience: senior decision-makers (40+), not
 * undergraduates. Sourced from Pexels (free licence, no attribution required).
 * See CONTENT_MANAGEMENT.md for the sourcing/licence notes before swapping.
 */
export const AFRICAN_HERO = {
  /** Senior executive on institutional steps — wide, copy-safe on the left */
  leadership: '/hero-leadership.jpg',
  /** Suit-led boardroom session, Lagos — collective decision-making */
  boardroom: '/hero-boardroom-lagos.jpg',
  /** Executive seminar audience — the learning context */
  seminar: '/hero-seminar.jpg',
  /** Bright open boardroom, standing collaboration */
  boardroomBright: '/faculties/business-school.jpg',
  /** Training room with a presenter — short-format learning */
  training: '/programs/certificate-executive.jpg',
  /** Portrait of a senior executive — for tall editorial figures */
  portrait: '/portrait-executive.jpg',
} as const;

export type AfricanHeroKey = keyof typeof AFRICAN_HERO;

/**
 * Page → image assignment. Varied deliberately so neighbouring pages never
 * repeat the same photograph.
 */
export const PAGE_HERO_IMAGE = {
  university: AFRICAN_HERO.leadership,
  manifesto: AFRICAN_HERO.boardroom,
  president: AFRICAN_HERO.leadership,
  events: AFRICAN_HERO.training,
  newsroom: AFRICAN_HERO.boardroomBright,
  programs: AFRICAN_HERO.seminar,
  // not boardroomBright: that photo is the Business School card on this page
  faculties: AFRICAN_HERO.leadership,
  admissions: AFRICAN_HERO.training,
  contact: AFRICAN_HERO.boardroom,
  news: AFRICAN_HERO.seminar,
  organisations: AFRICAN_HERO.boardroomBright,
  partners: AFRICAN_HERO.boardroom,
  /** Editorial side figures (Manifeste intro, etc.) — tall crop */
  editorial: AFRICAN_HERO.portrait,
} as const;
