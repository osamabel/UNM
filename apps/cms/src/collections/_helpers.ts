import type { Field } from 'payload/types';

// Bilingual text field: stores { fr, en } as a group of two required strings.
// Editors see the FR and EN fields side by side in the admin UI.
export const localizedText = (
  name: string,
  opts: { required?: boolean; type?: 'text' | 'textarea'; admin?: any } = {},
): Field => {
  const fieldType = opts.type ?? 'text';
  const makeChild = (childName: 'fr' | 'en', description: string): Field =>
    fieldType === 'textarea'
      ? {
          name: childName,
          type: 'textarea',
          required: opts.required,
          admin: { description },
        }
      : {
          name: childName,
          type: 'text',
          required: opts.required,
          admin: { description },
        };
  return {
    name,
    type: 'group',
    admin: { ...opts.admin },
    fields: [
      makeChild('fr', 'Français (source de vérité)'),
      makeChild('en', 'English'),
    ],
  };
};

export const seoFields: Field[] = [
  {
    type: 'collapsible',
    label: 'SEO',
    fields: [
      localizedText('metaTitle', { required: true }),
      localizedText('metaDescription', { required: true, type: 'textarea' }),
    ],
  },
];
