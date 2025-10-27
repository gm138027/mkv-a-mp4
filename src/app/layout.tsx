import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@/lib/init';

import esMessages from '@/messages/es/common.json';
import { GoogleAnalytics } from '@/app/components/GoogleAnalytics';

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
    canonical: '/',
    languages: {
      es: '/',
      en: '/en',
      ja: '/ja',
      fr: '/fr',
      de: '/de',
      'x-default': '/',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <head>
        <GoogleAnalytics />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link rel='dns-prefetch' href='https://fonts.googleapis.com' />
        <link rel='dns-prefetch' href='https://fonts.gstatic.com' />
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=5' />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}



