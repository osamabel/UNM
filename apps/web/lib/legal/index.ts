import { mentionsLegales } from './mentions-legales';
import { cgu } from './cgu';
import { cgv } from './cgv';
import { confidentialite } from './confidentialite';
import type { LegalDocument } from './types';

/**
 * Canonical ordering for the legal documents bar and the footer.
 * 1. Mentions légales (identification de l'éditeur — point d'entrée historique)
 * 2. CGU (conditions d'utilisation du site)
 * 3. CGV (engagement financier)
 * 4. Politique de protection des données (le plus consulté quand un litige éclate)
 */
export const LEGAL_DOCUMENTS: LegalDocument[] = [
  mentionsLegales,
  cgu,
  cgv,
  confidentialite,
];

export { mentionsLegales, cgu, cgv, confidentialite };
export type { LegalDocument } from './types';
