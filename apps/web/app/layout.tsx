// Root layout — required by Next.js for the top-level not-found page.
// The actual <html>/<body> live in [locale]/layout.tsx so we can set the
// `lang` attribute per request locale.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
