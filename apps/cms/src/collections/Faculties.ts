import type { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { localizedText, seoFields } from './_helpers';

export const Faculties: CollectionConfig = {
  slug: 'faculties',
  admin: {
    useAsTitle: 'name.fr',
    group: 'Académique',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'displayOrder',
      type: 'number',
      required: true,
      defaultValue: 100,
      index: true,
      admin: { description: 'Ordre d\'affichage (le plus petit en premier).' },
    },
    localizedText('name', { required: true }),
    localizedText('description', { required: true, type: 'textarea' }),
    {
      name: 'comingSoon',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        description:
          'Faculty announced but not yet open. Rendered as a non-clickable card with a "Bientôt" badge.',
      },
    },
    {
      name: 'domains',
      type: 'array',
      labels: { singular: 'Domaine', plural: 'Domaines couverts' },
      admin: { description: 'Domaines disciplinaires couverts par la faculté.' },
      fields: [localizedText('name', { required: true })],
    },
    { name: 'icon', type: 'text', required: false, admin: { description: 'Icon key (e.g. management)' } },
    {
      name: 'color',
      type: 'text',
      required: true,
      defaultValue: '#B5341A',
      admin: { description: 'Hex from UNM palette only — never blue/green/purple.' },
    },
    {
      name: 'outcomes',
      type: 'array',
      fields: [localizedText('text', { required: true })],
    },
    {
      name: 'strengths',
      type: 'array',
      fields: [localizedText('text', { required: true })],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    ...seoFields,
  ],
};
