// ════════════════════════════════════════════════════════════════
// Shared types for legal documents (mentions, CGU, CGV, privacy).
// Each document is a structured tree with a sober reader rendering.
// ════════════════════════════════════════════════════════════════

import type { LocalizedField } from '@unm/types';

/**
 * A single block inside a legal section. We support a small set of
 * editorial blocks to keep the reader pleasant without re-implementing
 * a full rich-text engine.
 */
export type LegalBlock =
  | { type: 'p'; text: LocalizedField }
  | { type: 'lead'; text: LocalizedField }      // larger lead paragraph
  | { type: 'callout'; text: LocalizedField }   // boxed pull-quote
  | { type: 'list'; items: LocalizedField[] }
  | { type: 'definitions'; items: { term: LocalizedField; value: LocalizedField }[] }
  | { type: 'table'; headers: LocalizedField[]; rows: LocalizedField[][] };

export interface LegalSection {
  /** URL hash anchor — short, lower-kebab. */
  id: string;
  /** Optional roman-style numbering shown on the section header. */
  number?: string;
  title: LocalizedField;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  /** Internal slug — `mentions`, `cgu`, `cgv`, `confidentialite`. */
  key: 'mentions' | 'cgu' | 'cgv' | 'confidentialite';
  /** Public URL pairs. */
  href: { fr: string; en: string };
  /** Editorial short label shown in the cross-document switcher. */
  shortLabel: LocalizedField;
  title: LocalizedField;
  metaTitle: LocalizedField;
  metaDescription: LocalizedField;
  /** ISO date — rendered with the user's locale. */
  lastUpdated: string;
  /** Hero intro paragraph (just under the title). */
  intro: LocalizedField;
  sections: LegalSection[];
}
