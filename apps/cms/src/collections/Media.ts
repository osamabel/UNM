import type { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: '../media',
    // SVG is included for vector logos (EBS, accreditations, etc.).
    // Sharp does not rasterise SVGs by default, so we skip the resize step
    // for them and serve the original file directly.
    mimeTypes: [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'application/pdf',
    ],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  admin: { group: 'Médiathèque' },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Texte alternatif (accessibilité + SEO)' },
    },
  ],
};
