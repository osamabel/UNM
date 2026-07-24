import type { Partner } from '@unm/types';
import { LOGO_ALT, LOGO_SRC } from '@/lib/logo';
import { toPublicMediaUrl } from '@/lib/cms-media';

/** Local fallback only when CMS has no EBS logo uploaded. */
export const EBS_LOGO_FALLBACK_SRC = '/partners/ebs/logo-wordmark.png';

export type AllianceLogoEntry = {
  id: string;
  name: string;
  /** Public URL from CMS (`/cms-media/...`) or local fallback. Empty when missing. */
  src: string;
  scale: number;
  kind: 'svg-wordmark' | 'jpeg';
};

/** Tight scale tweaks so wordmarks sit evenly in fixed white cards. */
const PARTNER_LOGO_SCALE_BY_KEYWORD: { keyword: string; scale: number }[] = [
  { keyword: 'ocp', scale: 0.92 },
  { keyword: 'ebs', scale: 1 },
  { keyword: 'european business', scale: 1 },
  { keyword: 'mines', scale: 0.94 },
  { keyword: 'maghrib', scale: 0.96 },
  { keyword: 'bank al', scale: 0.96 },
  { keyword: 'cgem', scale: 0.96 },
  { keyword: 'efmd', scale: 0.98 },
  { keyword: 'aacsb', scale: 1 },
  { keyword: 'cefdg', scale: 1 },
];

function isEbsPartner(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.includes('ebs') || lower.includes('european business');
}

/**
 * Partner logo URL — always prefer CMS media.
 * Local EBS wordmark is used only when the CMS upload is missing.
 */
export function getPartnerLogoSrc(partner: Pick<Partner, 'name' | 'logo'>): string | null {
  const fromCms = toPublicMediaUrl(partner.logo?.url);
  if (fromCms) return fromCms;
  if (isEbsPartner(partner.name)) return EBS_LOGO_FALLBACK_SRC;
  return null;
}

export function getPartnerLogoScale(name: string): number {
  const lower = name.toLowerCase();
  for (const { keyword, scale } of PARTNER_LOGO_SCALE_BY_KEYWORD) {
    if (lower.includes(keyword)) return scale;
  }
  return 1;
}

function findPartnerByKeywords(partners: Partner[], keywords: string[]): Partner | undefined {
  return partners.find((partner) => {
    const name = partner.name.toLowerCase();
    return keywords.some((k) => name.includes(k));
  });
}

function partnerToAllianceEntry(
  id: string,
  partner: Partner | undefined,
  fallbackName: string,
  defaultScale: number,
): AllianceLogoEntry {
  const src = partner ? getPartnerLogoSrc(partner) : null;
  return {
    id,
    name: partner?.name ?? fallbackName,
    src: src ?? '',
    scale: partner ? getPartnerLogoScale(partner.name) : defaultScale,
    kind: 'jpeg',
  };
}

/**
 * UNM × EBS lockup — brand logo + CMS EBS partner logo (local fallback).
 */
export function getEbsAllianceLockup(
  partners: Partner[] = [],
  brandLogoSrc?: string | null,
): AllianceLogoEntry[] {
  const ebsPartner = findPartnerByKeywords(partners, ['ebs', 'european business school']);
  const ebsSrc = ebsPartner
    ? getPartnerLogoSrc(ebsPartner)
    : EBS_LOGO_FALLBACK_SRC;

  return [
    {
      id: 'unm',
      name: LOGO_ALT,
      src: brandLogoSrc || LOGO_SRC,
      scale: 1.05,
      kind: 'jpeg',
    },
    {
      id: 'ebs',
      name: ebsPartner?.name ?? 'EBS Paris',
      src: ebsSrc || EBS_LOGO_FALLBACK_SRC,
      scale: ebsPartner ? getPartnerLogoScale(ebsPartner.name) : 1,
      kind: 'jpeg',
    },
  ];
}

/**
 * Accreditation logos from CMS Partners (EFMD / AACSB / CEFDG).
 * Only returns entries that have a CMS media upload.
 */
export function getAccreditationLogos(partners: Partner[] = []): AllianceLogoEntry[] {
  const specs = [
    { id: 'efmd', keywords: ['efmd'], fallbackName: 'EFMD', scale: 0.98 },
    { id: 'aacsb', keywords: ['aacsb'], fallbackName: 'AACSB', scale: 1 },
    { id: 'cefdg', keywords: ['cefdg'], fallbackName: 'CEFDG', scale: 1 },
  ] as const;

  return specs
    .map((spec) => {
      const partner = findPartnerByKeywords(partners, [...spec.keywords]);
      return partnerToAllianceEntry(spec.id, partner, spec.fallbackName, spec.scale);
    })
    .filter((entry) => Boolean(entry.src));
}
