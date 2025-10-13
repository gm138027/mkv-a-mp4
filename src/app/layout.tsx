import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// 初始化应用服务
import '@/lib/init';

// i18n Provider（根：默认西语）
import { LocaleProvider, DEFAULT_LOCALE } from '@/lib/i18n';
import { ClientLayout } from '@/app/components/ClientLayout';

// 字体优化：添加 display swap 避免 FOIT
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

export const metadata: Metadata = {
  // 站点级别的基础域名（用于 canonical/alternates 生成绝对 URL）
  metadataBase: new URL('https://mkvamp4.com'),
  title: 'Convertidor MKV a MP4 gratis en línea',
  description:
    'Convierte en el navegador conservando calidad, audio y subtítulos, sin subir vídeos a servidores. Ideal para quienes desean reproducir MKV en el móvil o Smart TV, publicarlos en redes sociales o compartirlos fácilmente con otras personas.',
  
  // Icons
  icons: {
    icon: [
      { url: '/logo/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/logo/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  
  manifest: '/logo/site.webmanifest',
  
  // Open Graph
  openGraph: {
    title: 'Convertidor MKV a MP4 gratis en línea',
    description: 'Convierte en el navegador conservando calidad, audio y subtítulos, sin subir vídeos a servidores. Ideal para quienes desean reproducir MKV en el móvil o Smart TV, publicarlos en redes sociales o compartirlos fácilmente con otras personas.',
    url: 'https://mkvamp4.com/',
    siteName: 'MKV to MP4 Converter',
    locale: 'es',
    type: 'website',
    images: [
      {
        url: 'https://mkvamp4.com/logo/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'MKV to MP4 Converter Logo',
      }
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary',
    title: 'Convertidor MKV a MP4 gratis en línea',
    description: 'Convierte en el navegador conservando calidad, audio y subtítulos, sin subir vídeos a servidores.',
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
    <html lang="es">
      <head>
        {/* 资源提示 - 优化字体和关键资源加载 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS预解析 */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Viewport优化 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        <LocaleProvider initialLocale={DEFAULT_LOCALE}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LocaleProvider>
      </body>
    </html>
  );
}
