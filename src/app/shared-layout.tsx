import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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

export const metadataBase = new URL('https://mkvamp4.com');

export const sharedIcons: Metadata['icons'] = {
  icon: [
    { url: '/logo/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { url: '/logo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { url: '/logo/favicon.ico', sizes: 'any' },
  ],
  apple: [{ url: '/logo/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
};

export const sharedManifest = '/logo/site.webmanifest';

export const sharedViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const bodyClassName = `${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`;

export const SharedHead = () => {
  return (
    <>
      <GoogleAnalytics />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
    </>
  );
};
