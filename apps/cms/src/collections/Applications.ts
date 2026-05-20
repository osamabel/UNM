import type { CollectionConfig } from 'payload/types';
import { isAdmissionsOfficer } from '../access/isAdmissionsOfficer';
import { isAdmin } from '../access/isAdmin';

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'id',
    group: 'Admissions',
    defaultColumns: ['id', 'program', 'status', 'submittedAt'],
  },
  access: {
    create: () => true,
    read: isAdmissionsOfficer,
    update: isAdmissionsOfficer,
    delete: isAdmin,
  },
  fields: [
    { name: 'lead', type: 'relationship', relationTo: 'leads' },
    { name: 'program', type: 'relationship', relationTo: 'programs', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'submitted',
      options: [
        { label: 'Soumise', value: 'submitted' },
        { label: 'En revue', value: 'under_review' },
        { label: 'Acceptée', value: 'accepted' },
        { label: 'Refusée', value: 'rejected' },
        { label: 'Liste d’attente', value: 'waitlisted' },
      ],
    },
    {
      name: 'documents',
      type: 'array',
      fields: [{ name: 'file', type: 'upload', relationTo: 'media' }],
    },
    { name: 'submittedAt', type: 'date', defaultValue: () => new Date() },
    { name: 'reviewedAt', type: 'date' },
    { name: 'reviewerNotes', type: 'textarea' },
  ],
};
