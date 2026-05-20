import type { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { localizedText, seoFields } from './_helpers';

export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'title.fr',
    group: 'Académique',
    defaultColumns: ['title', 'type', 'faculty', 'isActive', 'isFeatured'],
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
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'DBA', value: 'DBA' },
        { label: 'MBA', value: 'MBA' },
        { label: 'Bachelor', value: 'Bachelor' },
        { label: 'Certificate', value: 'Certificate' },
      ],
    },
    {
      name: 'faculty',
      type: 'relationship',
      relationTo: 'faculties',
      required: true,
    },
    { name: 'duration', type: 'text', required: true },
    {
      name: 'format',
      type: 'select',
      required: true,
      options: [
        { label: 'Présentiel', value: 'Présentiel' },
        { label: 'Distanciel', value: 'Distanciel' },
        { label: 'Hybride', value: 'Hybride' },
      ],
    },
    {
      name: 'language',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['fr'],
      options: [
        { label: 'Français', value: 'fr' },
        { label: 'English', value: 'en' },
      ],
    },
    localizedText('schedule', { required: true }),
    localizedText('admissionRequirements', { required: true, type: 'textarea' }),
    // Editorial intro paragraph displayed in the programme hero — distinct
    // from the SEO meta-description.
    localizedText('vocation', { required: false, type: 'textarea' }),
    localizedText('targetAudience', { required: true, type: 'textarea' }),
    // Narrative paragraph used in the programme page (in addition to the
    // skills[] bullets). Optional.
    localizedText('skillsNarrative', { type: 'textarea' }),
    // Narrative paragraph for career outlooks (in addition to outcomes[] bullets).
    localizedText('careerOutlooks', { type: 'textarea' }),
    {
      name: 'objectives',
      type: 'array',
      fields: [localizedText('text', { required: true })],
    },
    {
      name: 'skills',
      type: 'array',
      fields: [localizedText('text', { required: true })],
    },
    {
      name: 'outcomes',
      type: 'array',
      fields: [localizedText('text', { required: true })],
    },
    {
      // Optional curriculum — the pedagogical modules / seminars listed in
      // each official brochure (M1–M12 for MBAs, S1–S8 for the DBA).
      // Each module: short code, title and a one-sentence description.
      name: 'curriculum',
      type: 'array',
      labels: { singular: 'Module', plural: 'Modules' },
      admin: {
        description:
          'Modules / séminaires détaillés du programme (M1 → M12 pour les MBA, séminaires 1 → 8 pour le DBA). Optionnel.',
      },
      fields: [
        {
          name: 'code',
          type: 'text',
          required: true,
          admin: { description: 'Ex: M1, M2, S1, S2…' },
        },
        localizedText('title', { required: true }),
        // Optional — some programmes (e.g. the DBA) list seminars by title
        // only, without an editorial description.
        localizedText('description', { type: 'textarea' }),
        {
          name: 'group',
          type: 'text',
          admin: {
            description:
              'Optionnel — regroupement éditorial (ex: « Première année », « Deuxième année »). Si vide, les modules ne sont pas groupés.',
          },
        },
      ],
    },
    {
      name: 'tuitionFee',
      type: 'number',
      admin: { description: 'En MAD. Laisser vide pour afficher « Sur demande ».' },
    },
    {
      name: 'faq',
      type: 'array',
      fields: [
        localizedText('question', { required: true }),
        localizedText('answer', { required: true, type: 'textarea' }),
      ],
    },
    {
      name: 'brochureFile',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'startDate', type: 'date', required: true },
    { name: 'isActive', type: 'checkbox', defaultValue: true, index: true },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, index: true },
    ...seoFields,
  ],
};
