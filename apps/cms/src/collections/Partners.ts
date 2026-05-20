import type { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: { useAsTitle: 'name', group: 'Contenu' },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'url', type: 'text' },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'industry',
      options: [
        { label: 'Académique', value: 'academic' },
        { label: 'Industrie', value: 'industry' },
        { label: 'Institutionnel', value: 'government' },
      ],
    },
  ],
};
