import type { CollectionConfig } from 'payload/types';
import { isAdmissionsOfficer } from '../access/isAdmissionsOfficer';
import { isAdmin } from '../access/isAdmin';
import { notifyOnLead } from '../hooks/notifyOnLead';

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    group: 'Admissions',
    defaultColumns: ['email', 'lastName', 'programInterest', 'status', 'createdAt'],
  },
  access: {
    // Public POST allowed via API token; reads restricted.
    create: () => true,
    read: isAdmissionsOfficer,
    update: isAdmissionsOfficer,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [notifyOnLead],
  },
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'phone', type: 'text' },
    { name: 'programInterest', type: 'relationship', relationTo: 'programs' },
    { name: 'source', type: 'text', defaultValue: 'direct' },
    { name: 'medium', type: 'text', defaultValue: 'website' },
    { name: 'campaign', type: 'text', defaultValue: 'organic' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Nouveau', value: 'new' },
        { label: 'Contacté', value: 'contacted' },
        { label: 'Qualifié', value: 'qualified' },
        { label: 'Inscrit', value: 'enrolled' },
        { label: 'Perdu', value: 'lost' },
      ],
    },
    { name: 'consentGiven', type: 'checkbox', required: true },
    { name: 'consentTimestamp', type: 'date' },
    { name: 'notes', type: 'textarea' },
  ],
  endpoints: [
    {
      path: '/export.csv',
      method: 'get',
      handler: async (req, res) => {
        if (!['admin', 'admissions'].includes(req.user?.role ?? '')) {
          return res.status(403).send('forbidden');
        }
        const result = await req.payload.find({ collection: 'leads', limit: 5000 });
        const rows = result.docs.map((d: any) =>
          [d.firstName, d.lastName, d.email, d.phone, d.status, d.createdAt]
            .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
            .join(','),
        );
        const csv = ['firstName,lastName,email,phone,status,createdAt', ...rows].join('\n');
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename="leads.csv"');
        return res.send(csv);
      },
    },
  ],
};
