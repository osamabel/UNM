import type { GlobalConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { localizedText } from '../collections/_helpers';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Configuration' },
  access: { read: () => true, update: isAdmin },
  fields: [
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'phone', type: 'text', required: true },
        { name: 'whatsapp', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        localizedText('address', { required: true }),
      ],
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'linkedin', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
    {
      name: 'legal',
      type: 'group',
      fields: [
        localizedText('legalNotice', { type: 'textarea' }),
        localizedText('privacyPolicy', { type: 'textarea' }),
      ],
    },
  ],
};
