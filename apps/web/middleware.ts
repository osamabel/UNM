import createMiddleware from 'next-intl/middleware';

// French is the default and unprefixed (/programmes/...).
// English is prefixed (/en/programs/...).
// No Arabic, no RTL.
//
// localeDetection: false  →  do NOT auto-redirect visitors with an
// English browser to /en. UNM is a Moroccan institution; the default
// experience is French. Users can opt into English with the FR/EN
// switcher (the choice is persisted by the next-intl cookie).
export default createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
