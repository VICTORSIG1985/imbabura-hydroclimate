import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE } from '@/data/config';
import '../globals.css';

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  const title = isEs ? SITE.title_es : SITE.title_en;
  const description = isEs
    ? 'Geoportal científico de tendencias hidroclimáticas, teleconexión El Niño y proyecciones CMIP6 para la provincia de Imbabura, Ecuador. 21 estaciones INAMHI · 1981–2070 · Validación científica 90/100.'
    : 'Scientific geoportal of hydroclimatic trends, El Niño teleconnection and CMIP6 projections for Imbabura Province, Ecuador. 21 INAMHI stations · 1981–2070 · Scientific validation 90/100.';
  const ogImage = `${SITE.publicUrl}og-image.jpg`;

  return {
    title,
    description,
    metadataBase: new URL(SITE.publicUrl),
    alternates: {
      canonical: SITE.publicUrl + (isEs ? 'es/' : 'en/'),
      languages: {
        'es-EC': SITE.publicUrl + 'es/',
        'en-US': SITE.publicUrl + 'en/',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isEs ? 'es_EC' : 'en_US',
      siteName: title,
      url: SITE.publicUrl + (isEs ? 'es/' : 'en/'),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'Geoportal Hidroclimático de Imbabura · Volcán Imbabura y Lago San Pablo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:wght@400;600;700&display=swap"
        />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:standard" />
        <meta name="copyright" content="© 2026 Víctor Hugo Pinto-Páez · CC BY-NC-SA 4.0 · Datos primarios © INAMHI Ecuador" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main className="flex-1 pt-[var(--nav-height)]">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
