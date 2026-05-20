import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { JsonLd } from '@/components/shared/JsonLd';
import { organizationSchema } from '@/lib/schema';
import { isLocale } from '@/lib/locale';
import '../globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#B5341A',
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unm.ma';
  const isEn = params.locale === 'en';
  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: '%s | UNM',
      default: isEn
        ? 'UNM — Digital University of Morocco'
        : 'UNM — Université Numérique du Maroc',
    },
    description: isEn
      ? "Morocco's digital university — degree programs in management, technology, governance, and health."
      : 'Université Numérique du Maroc — programmes diplômants en management, technologie, gouvernance et santé.',
    icons: { icon: '/favicon.ico' },
    openGraph: {
      type: 'website',
      siteName: 'UNM',
      locale: isEn ? 'en_US' : 'fr_MA',
      images: ['/og-image.jpg'],
    },
    alternates: {
      canonical: baseUrl,
      languages: { fr: baseUrl, en: `${baseUrl}/en`, 'x-default': baseUrl },
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  unstable_setRequestLocale(params.locale);
  const messages = await getMessages();
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang={params.locale}>
      <head>
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_CMS_URL ?? 'https://cms.unm.ma'}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/*
          Editorial serif (display) + Inter (UI/body), the de facto institutional
          standard for top business schools. `display=swap` ensures text is
          immediately visible while the web fonts load.
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-white">
            {params.locale === 'en' ? 'Skip to content' : 'Aller au contenu'}
          </a>
          <Header />
          <main id="main" className="pb-20 lg:pb-0">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
        <JsonLd data={organizationSchema()} />
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
