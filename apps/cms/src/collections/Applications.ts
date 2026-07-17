import type { CollectionConfig } from 'payload/types';
import { isAdmissionsOfficer } from '../access/isAdmissionsOfficer';
import { isAdmin } from '../access/isAdmin';

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'lastName',
    group: 'Admissions',
    defaultColumns: ['lastName', 'firstName', 'program', 'experienceLevel', 'status', 'submittedAt'],
  },
  access: {
    create: () => true,
    read: isAdmissionsOfficer,
    update: isAdmissionsOfficer,
    delete: isAdmin,
  },
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'country', type: 'text', required: true },
    { name: 'highestDegree', type: 'text', required: true },
    {
      name: 'experienceLevel',
      type: 'select',
      required: true,
      options: [
        { label: '0 – 5 ans', value: '0-5' },
        { label: '5 – 10 ans', value: '5-10' },
        { label: '10 – 15 ans', value: '10-15' },
        { label: '15 ans et +', value: '15+' },
      ],
    },
    { name: 'program', type: 'relationship', relationTo: 'programs', required: true },
    { name: 'consentGiven', type: 'checkbox', required: true },
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
    { name: 'submittedAt', type: 'date', defaultValue: () => new Date() },
    { name: 'reviewedAt', type: 'date' },
    { name: 'reviewerNotes', type: 'textarea' },
  ],
};
