import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { LocalizedField, Locale, ProgramType } from '@unm/types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function localized(field: LocalizedField | undefined, locale: Locale): string {
  if (!field) return '';
  return field[locale] ?? field.fr ?? '';
}

export function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatCurrency(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Drop redundant type prefix when a badge already shows MBA, DBA, etc. */
export function displayProgramTitle(title: string, type?: ProgramType): string {
  if (!type) return title;
  const re = new RegExp(`^${type}\\s+`, 'i');
  return title.replace(re, '').trim() || title;
}

export function programPath(slug: string, locale: Locale): string {
  return locale === 'en' ? `/en/programs/${slug}` : `/programmes/${slug}`;
}

export function facultyPath(slug: string, locale: Locale): string {
  return locale === 'en' ? `/en/faculties/${slug}` : `/facultes/${slug}`;
}

export function articlePath(slug: string, locale: Locale): string {
  return locale === 'en' ? `/en/news/${slug}` : `/actualites/${slug}`;
}
