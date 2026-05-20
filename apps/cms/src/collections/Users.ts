import type { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,
    tokenExpiration: 7 * 24 * 60 * 60, // 7 days
  },
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },
  access: {
    create: isAdmin,
    read: ({ req: { user } }) => Boolean(user),
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Super Admin', value: 'admin' },
        { label: 'Content Editor', value: 'editor' },
        { label: 'Admissions Officer', value: 'admissions' },
      ],
    },
  ],
};
