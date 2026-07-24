import type { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { localizedText, seoFields } from './_helpers';

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title.fr',
    group: 'Contenu',
    defaultColumns: ['title', 'channel', 'category', 'publishedAt'],
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
      name: 'channel',
      type: 'select',
      required: false,
      defaultValue: 'actualite',
      index: true,
      options: [
        { label: 'Actualités', value: 'actualite' },
        { label: 'Événements', value: 'evenement' },
        { label: 'Newsroom / Presse', value: 'newsroom' },
      ],
      admin: {
        description: 'Onglet de la page Actualités unifiée (Actualités · Événements · Newsroom). Défaut : Actualités.',
      },
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
        { label: 'Presse', value: 'presse' },
      ],
    },
    {
      name: 'eventDate',
      type: 'date',
      admin: {
        condition: (_, siblingData) => siblingData?.channel === 'evenement',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Date / heure de l’événement (affichée sur la carte).',
      },
    },
    {
      name: 'eventLocation',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.channel === 'evenement',
      },
      fields: [
        { name: 'fr', type: 'text', label: 'Lieu (FR)' },
        { name: 'en', type: 'text', label: 'Location (EN)' },
      ],
    },
    {
      name: 'eventKind',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData?.channel === 'evenement',
      },
      options: [
        { label: 'Journée Portes Ouvertes', value: 'openDay' },
        { label: 'Webinaire', value: 'webinar' },
        { label: 'Masterclass', value: 'masterclass' },
        { label: 'Autre', value: 'other' },
      ],
    },
    { name: 'publishedAt', type: 'date', required: true, index: true },
    { name: 'readingTime', type: 'number', required: true, defaultValue: 5 },
    ...seoFields,
  ],
};
