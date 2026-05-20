import type { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { localizedText } from './_helpers';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'authorName', group: 'Contenu' },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    localizedText('quote', { required: true, type: 'textarea' }),
    { name: 'authorName', type: 'text', required: true },
    localizedText('authorRole', { required: true }),
    { name: 'program', type: 'relationship', relationTo: 'programs' },
    { name: 'graduationYear', type: 'number' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
};
