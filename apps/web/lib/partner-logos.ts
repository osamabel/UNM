import type { Partner } from '@unm/types';
import { LOGO_ALT, LOGO_SRC } from '@/lib/logo';

export type AllianceLogoEntry = {
  id: string;
  name: string;
  src: string;
  scale: number;
  /** SVG wordmark needs matte blend on light bands. */
  kind: 'svg-wordmark' | 'jpeg';
};

/**
 * Local fallback logos in /public/LOGS.
 * CMS partner uploads are the source of truth; these are only used when a
 * partner has no usable CMS logo yet.
 */
const FALLBACK_PARTNER_LOGO_BY_NAME: Record<string, string> = {
  'European Business School (EBS Paris)': '/LOGS/EBS.jpeg',
  EFMD: '/LOGS/EFMD.jpeg',
  'AACSB Business Education Alliance': '/LOGS/aac.jpeg',
  CEFDG: '/LOGS/cef.jpeg',
  'Ministère des Mines (Maroc)': '/LOGS/minstry.jpeg',
  'OCP Group': '/LOGS/ocp.jpeg',
  'Confédération Générale des Entreprises du Maroc': '/LOGS/cgem.jpeg',
  'Bank Al-Maghrib': '/LOGS/bankmagreb.jpeg',
};

/** Fuzzy fallback when CMS partner name differs slightly from seed labels. */
const FALLBACK_PARTNER_LOGO_BY_KEYWORD: { keyword: string; src: string }[] = [
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

/** Tight scale tweaks so wordmarks sit evenly in fixed white cards. */
const PARTNER_LOGO_SCALE_BY_KEYWORD: { keyword: string; scale: number }[] = [
  { keyword: 'ocp', scale: 0.92 },
  { keyword: 'ebs', scale: 0.94 },
  { keyword: 'mines', scale: 0.94 },
  { keyword: 'maghrib', scale: 0.96 },
  { keyword: 'bank al', scale: 0.96 },
  { keyword: 'cgem', scale: 0.96 },
  { keyword: 'efmd', scale: 0.98 },
  { keyword: 'aacsb', scale: 1 },
  { keyword: 'cefdg', scale: 1 },
];

function normalizeCmsMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/LOGS/')) return url;
  if (url.startsWith('/')) {
    const cmsBase = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001';
    return `${cmsBase}${url}`;
  }
  return url;
}

export function getPartnerLogoSrc(partner: Pick<Partner, 'name' | 'logo'>): string | null {
  const cmsUrl = normalizeCmsMediaUrl(partner.logo?.url);
  if (cmsUrl) return cmsUrl;

  const exact = FALLBACK_PARTNER_LOGO_BY_NAME[partner.name];
  if (exact) return exact;

  const lower = partner.name.toLowerCase();
  for (const { keyword, src } of FALLBACK_PARTNER_LOGO_BY_KEYWORD) {
    if (lower.includes(keyword)) return src;
  }

  return null;
}

const DEFAULT_EBS_ALLIANCE_LOCKUP: AllianceLogoEntry[] = [
  { id: 'unm', name: LOGO_ALT, src: LOGO_SRC, scale: 1.02, kind: 'jpeg' },
  { id: 'ebs', name: 'EBS Paris', src: '/LOGS/EBS.jpeg', scale: 0.86, kind: 'jpeg' },
];

function findEbsPartner(partners: Partner[] = []): Partner | undefined {
  return partners.find((partner) => {
    const name = partner.name.toLowerCase();
    return name.includes('ebs') || name.includes('european business school');
  });
}

/** UNM × EBS lockup — both sides prefer CMS (Site Settings brandLogo + Partners EBS). */
export function getEbsAllianceLockup(
  partners: Partner[] = [],
  brandLogoSrc?: string | null,
): AllianceLogoEntry[] {
  const [fallbackUnm, fallbackEbs] = DEFAULT_EBS_ALLIANCE_LOCKUP;
  const ebsPartner = findEbsPartner(partners);
  const cmsEbsLogo = ebsPartner ? getPartnerLogoSrc(ebsPartner) : null;

  return [
    {
      ...fallbackUnm,
      src: brandLogoSrc || fallbackUnm.src,
    },
    {
      ...fallbackEbs,
      name: ebsPartner?.name ?? fallbackEbs.name,
      src: cmsEbsLogo ?? fallbackEbs.src,
      scale: ebsPartner ? getPartnerLogoScale(ebsPartner.name) : fallbackEbs.scale,
    },
  ];
}

/** Accreditation wordmarks in the alliance section (home). */
export const ACCREDITATION_LOGOS: AllianceLogoEntry[] = [
  { id: 'efmd', name: 'EFMD', src: '/LOGS/EFMD.jpeg', scale: 0.94, kind: 'jpeg' },
  { id: 'aacsb', name: 'AACSB', src: '/LOGS/aac.jpeg', scale: 1.04, kind: 'jpeg' },
  { id: 'cefdg', name: 'CEFDG', src: '/LOGS/cef.jpeg', scale: 1.08, kind: 'jpeg' },
];

export function getPartnerLogoScale(name: string): number {
  const lower = name.toLowerCase();
  for (const { keyword, scale } of PARTNER_LOGO_SCALE_BY_KEYWORD) {
    if (lower.includes(keyword)) return scale;
  }
  return 1;
}
