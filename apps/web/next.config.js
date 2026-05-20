/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n.ts');

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cms.unm.ma' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '147.79.100.45' },
    ],
    // SVG support for partner / accreditation logos.
    // CSP locks scripts out of the SVG renderer so malicious vectors
    // cannot execute JS in the user's browser.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/en/home', destination: '/en', permanent: true },
      // /dba was a marketing URL of its own. It now redirects to the
      // canonical programme page so we keep one URL per programme (SEO).
      { source: '/dba', destination: '/programmes/dba-business-administration', permanent: true },
      { source: '/en/dba', destination: '/en/programs/dba-business-administration', permanent: true },
    ];
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = withNextIntl(nextConfig);
