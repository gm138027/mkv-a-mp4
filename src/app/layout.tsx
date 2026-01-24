import type { Metadata, Viewport } from 'next';
import { cookies, headers } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@/lib/init';

import esMessages from '@/messages/es/common.json';
import { GoogleAnalytics } from '@/app/components/GoogleAnalytics';
import { buildAlternates } from '@/lib/seo/alternates';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/types';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const defaultMeta = esMessages.meta;

export const metadata: Metadata = {
  metadataBase: new URL('https://mkvamp4.com'),
  title: defaultMeta.title,
  description: defaultMeta.description,
  keywords: defaultMeta.keywords,
  icons: {
    icon: [
      { url: '/logo/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/logo/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/logo/site.webmanifest',
  openGraph: {
    title: defaultMeta.title,
    description: defaultMeta.description,
    url: '/',
    siteName: 'MKV to MP4 Converter',
    locale: 'es',
    type: 'website',
    images: [
      {
        url: 'https://mkvamp4.com/logo/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'MKV to MP4 Converter Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: defaultMeta.title,
    description: defaultMeta.description,
    images: ['https://mkvamp4.com/logo/android-chrome-512x512.png'],
  },
  alternates: {
    canonical: 'https://mkvamp4.com',
    languages: buildAlternates(),
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const resolveLocale = (value: string | null | undefined): Locale => {
  if (!value) {
    return DEFAULT_LOCALE;
  }

  const matched = SUPPORTED_LOCALES.find((item) => item.code === value);
  return matched?.code ?? DEFAULT_LOCALE;
};

const getRequestLocale = async (): Promise<Locale> => {
  const headerList = await headers();
  const headerLocale = headerList.get('x-locale');
  if (headerLocale) {
    return resolveLocale(headerLocale);
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('preferred-locale')?.value;
  return resolveLocale(cookieLocale);
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale}>
      <head>
        <GoogleAnalytics />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link rel='dns-prefetch' href='https://fonts.googleapis.com' />
        <link rel='dns-prefetch' href='https://fonts.gstatic.com' />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}

