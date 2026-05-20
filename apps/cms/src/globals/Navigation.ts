import type { GlobalConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { localizedText } from '../collections/_helpers';

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: { group: 'Configuration' },
  access: { read: () => true, update: isAdmin },
  fields: [
    {
      name: 'primary',
      type: 'array',
      labels: { singular: 'Lien', plural: 'Liens' },
      fields: [
        localizedText('label', { required: true }),
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
};
