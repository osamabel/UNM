import type { Partner } from '@unm/types';

/**
 * Real partner logos in /public/LOGS (user-provided assets).
 * Always preferred over CMS uploads (which may still be placeholders).
 */
export const PARTNER_LOGO_BY_NAME: Record<string, string> = {
  'European Business School (EBS Paris)': '/LOGS/EBS.jpeg',
  EFMD: '/LOGS/EFMD.jpeg',
  'AACSB Business Education Alliance': '/LOGS/aac.jpeg',
  CEFDG: '/LOGS/cef.jpeg',
  'Ministère des Mines (Maroc)': '/LOGS/minstry.jpeg',
  'OCP Group': '/LOGS/ocp.jpeg',
  'Confédération Générale des Entreprises du Maroc': '/LOGS/cgem.jpeg',
  'Bank Al-Maghrib': '/LOGS/bankmagreb.jpeg',
};

/** Fuzzy match when CMS partner name differs slightly from seed labels. */
const PARTNER_LOGO_BY_KEYWORD: { keyword: string; src: string }[] = [
  { keyword: 'ebs', src: '/LOGS/EBS.jpeg' },
  { keyword: 'efmd', src: '/LOGS/EFMD.jpeg' },
  { keyword: 'aacsb', src: '/LOGS/aac.jpeg' },
  { keyword: 'cefdg', src: '/LOGS/cef.jpeg' },
  { keyword: 'mines', src: '/LOGS/minstry.jpeg' },
  { keyword: 'ocp', src: '/LOGS/ocp.jpeg' },
  { keyword: 'cgem', src: '/LOGS/cgem.jpeg' },
  { keyword: 'maghrib', src: '/LOGS/bankmagreb.jpeg' },
  { keyword: 'bank al', src: '/LOGS/bankmagreb.jpeg' },
];

/** Visual scale tweaks so wordmarks feel balanced in the same tile. */
const PARTNER_LOGO_SCALE_BY_KEYWORD: { keyword: string; scale: number }[] = [
  { keyword: 'ocp', scale: 0.8 },
  { keyword: 'ebs', scale: 0.86 },
  { keyword: 'mines', scale: 0.88 },
  { keyword: 'maghrib', scale: 0.9 },
  { keyword: 'bank al', scale: 0.9 },
  { keyword: 'cgem', scale: 0.92 },
  { keyword: 'efmd', scale: 0.94 },
  { keyword: 'aacsb', scale: 1.04 },
  { keyword: 'cefdg', scale: 1.08 },
];

export function getPartnerLogoSrc(partner: Pick<Partner, 'name' | 'logo'>): string | null {
  const exact = PARTNER_LOGO_BY_NAME[partner.name];
  if (exact) return exact;

  const lower = partner.name.toLowerCase();
  for (const { keyword, src } of PARTNER_LOGO_BY_KEYWORD) {
    if (lower.includes(keyword)) return src;
  }

  const cmsUrl = partner.logo?.url ?? '';
  if (cmsUrl.includes('/LOGS/')) return cmsUrl;

  return null;
}

export function getPartnerLogoScale(name: string): number {
  const lower = name.toLowerCase();
  for (const { keyword, scale } of PARTNER_LOGO_SCALE_BY_KEYWORD) {
    if (lower.includes(keyword)) return scale;
  }
  return 1;
}
