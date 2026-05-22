import type { IconName } from '@/components/ui/Icon';
import type { LegalDocument } from '@/lib/legal/types';

const LEGAL_DOC_ICON: Record<LegalDocument['key'], IconName> = {
  mentions: 'landmark',
  cgu: 'document',
  cgv: 'file',
  confidentialite: 'shield',
};

export function iconForLegalDocument(key: LegalDocument['key']): IconName {
  return LEGAL_DOC_ICON[key];
}
