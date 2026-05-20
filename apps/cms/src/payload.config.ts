import path from 'path';
import { buildConfig } from 'payload/config';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { slateEditor } from '@payloadcms/richtext-slate';
import { webpackBundler } from '@payloadcms/bundler-webpack';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Faculties } from './collections/Faculties';
import { Programs } from './collections/Programs';
import { Articles } from './collections/Articles';
import { Testimonials } from './collections/Testimonials';
import { Partners } from './collections/Partners';
import { Leads } from './collections/Leads';
import { Applications } from './collections/Applications';
import { SiteSettings } from './globals/SiteSettings';
import { Navigation } from './globals/Navigation';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  editor: slateEditor({}),
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '— UNM CMS',
      favicon: '/favicon.ico',
    },
    // Admin URL moved away from /admin in production for security.
    // The express server mounts the admin at /studio.
  },
  collections: [
    Users,
    Media,
    Faculties,
    Programs,
    Articles,
    Testimonials,
    Partners,
    Leads,
    Applications,
  ],
  globals: [SiteSettings, Navigation],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  cors: [
    process.env.PAYLOAD_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ].filter(Boolean),
  csrf: [
    process.env.PAYLOAD_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ].filter(Boolean),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  upload: {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  },
  rateLimit: { max: 200 },
});
