import type { Locale } from '@unm/types';
import { PHONE_COUNTRIES_DATA } from './phone-countries-data';

export interface PhoneCountry {
  iso: string;
  dial: string;
  name: { fr: string; en: string };
}

export const DEFAULT_PHONE_COUNTRY = 'MA';

export const PHONE_COUNTRIES: PhoneCountry[] = PHONE_COUNTRIES_DATA;

const DIAL_SORTED = [...PHONE_COUNTRIES].sort((a, b) => {
  const byLength = b.dial.length - a.dial.length;
  if (byLength !== 0) return byLength;
  return PHONE_COUNTRIES.indexOf(a) - PHONE_COUNTRIES.indexOf(b);
});

export function countryFlag(iso: string): string {
  const code = iso.toUpperCase();
  if (code.length !== 2) return '🌍';
  return String.fromCodePoint(...[...code].map((char) => 127397 + char.charCodeAt(0)));
}

export function getPhoneCountry(iso: string): PhoneCountry {
  return PHONE_COUNTRIES.find((c) => c.iso === iso) ?? PHONE_COUNTRIES[0];
}

export function countryLabel(country: PhoneCountry, locale: Locale): string {
  return `${countryFlag(country.iso)} ${country.dial} ${country.name[locale]}`;
}

export function formatPhone(iso: string, local: string): string {
  const country = getPhoneCountry(iso);
  const digits = local.replace(/\D/g, '');
  if (!digits) return '';
  return `${country.dial} ${digits}`;
}

export function parsePhone(value: string): { iso: string; local: string } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { iso: DEFAULT_PHONE_COUNTRY, local: '' };
  }

  const compact = trimmed.replace(/[\s\-()]/g, '');
  if (!compact.startsWith('+')) {
    return { iso: DEFAULT_PHONE_COUNTRY, local: compact.replace(/\D/g, '') };
  }

  const digits = compact.slice(1);
  for (const country of DIAL_SORTED) {
    const dialDigits = country.dial.slice(1);
    if (digits.startsWith(dialDigits)) {
      return { iso: country.iso, local: digits.slice(dialDigits.length) };
    }
  }

  return { iso: DEFAULT_PHONE_COUNTRY, local: digits };
}

export const PHONE_VALUE_RE = /^\+[0-9\s\-()]{8,20}$/;
