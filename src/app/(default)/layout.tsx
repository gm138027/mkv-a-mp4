import type { Metadata } from 'next';
import '../globals.css';
import '@/lib/init';

import esMessages from '@/messages/es/common.json';
import { buildAlternates } from '@/lib/seo/alternates';
import {
  bodyClassName,
  metadataBase,
  sharedIcons,
  sharedManifest,
  sharedViewport,
  SharedHead,
} from '@/app/shared-layout';

const defaultMeta = esMessages.meta;

export const metadata: Metadata = {
  metadataBase,
  title: defaultMeta.title,
  description: defaultMeta.description,
  keywords: defaultMeta.keywords,
  icons: sharedIcons,
  manifest: sharedManifest,
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

export const viewport = sharedViewport;

export default function DefaultRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <SharedHead />
      </head>
      <body className={bodyClassName}>{children}</body>
    </html>
  );
}
