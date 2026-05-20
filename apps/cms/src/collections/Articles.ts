import type { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { localizedText, seoFields } from './_helpers';

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title.fr',
    group: 'Contenu',
    defaultColumns: ['title', 'category', 'publishedAt'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    localizedText('title', { required: true }),
    localizedText('excerpt', { required: true, type: 'textarea' }),
    localizedText('body', { required: true, type: 'textarea' }),
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'author',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', required: true },
        localizedText('bio', { type: 'textarea' }),
        { name: 'avatar', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Campus', value: 'campus' },
        { label: 'Recherche', value: 'recherche' },
        { label: 'Partenariats', value: 'partenariats' },
        { label: 'Événements', value: 'evenements' },
      ],
    },
    { name: 'publishedAt', type: 'date', required: true, index: true },
    { name: 'readingTime', type: 'number', required: true, defaultValue: 5 },
    ...seoFields,
  ],
};
