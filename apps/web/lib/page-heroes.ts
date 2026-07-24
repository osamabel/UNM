/** Shared African photography for page heroes (local public assets). */
export const AFRICAN_HERO = {
  /** UNM African graduates — celebration / community */
  graduates: '/home1.png',
  /** African executive at work — leadership / programmes */
  executive: '/programme.jpg',
} as const;

export type AfricanHeroKey = keyof typeof AFRICAN_HERO;

/**
 * Page → image assignment.
 * Only brand African assets (graduates + executive). The old walking-stock
 * photo (`section1.jpeg`) is retired site-wide.
 */
export const PAGE_HERO_IMAGE = {
  university: AFRICAN_HERO.graduates,
  manifesto: AFRICAN_HERO.graduates,
  president: AFRICAN_HERO.graduates,
  events: AFRICAN_HERO.graduates,
  newsroom: AFRICAN_HERO.executive,
  programs: AFRICAN_HERO.executive,
  faculties: AFRICAN_HERO.graduates,
  admissions: AFRICAN_HERO.executive,
  contact: AFRICAN_HERO.executive,
  news: AFRICAN_HERO.graduates,
  organisations: AFRICAN_HERO.executive,
  partners: AFRICAN_HERO.executive,
  /** Editorial side figures (Manifeste intro, etc.) */
  editorial: AFRICAN_HERO.executive,
} as const;
