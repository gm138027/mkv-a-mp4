import type { Metadata } from 'next';
import type { Locale, Messages } from '@/lib/i18n/types';
import { redirect } from 'next/navigation';
import { SiteShell } from '@/app/components/SiteShell';
import esMessages from '@/messages/es/common.json';
import enMessages from '@/messages/en/common.json';
import frMessages from '@/messages/fr/common.json';
import deMessages from '@/messages/de/common.json';
import jaMessages from '@/messages/ja/common.json';

const SUPPORTED_LOCALES: Locale[] = ['es', 'en', 'ja', 'fr', 'de'];

const META_MAP: Record<Locale, { title: string; description: string }> = {
  es: {
    title: 'Convertidor MKV a MP4 gratis en linea',
    description:
      'Convierte videos MKV a MP4 en el navegador conservando calidad, audio y subtitulos. No se suben archivos.',
  },
  en: {
    title: 'Free Online MKV to MP4 Converter',
    description:
      'Convert MKV to MP4 in your browser while keeping quality, audio, and subtitles. No upload required.',
  },
  ja: {
    title: 'MKV to MP4 converter online',
    description:
      'Convert mkv files to mp4 directly in the browser. Fast, secure, and keeps audio and subtitles.',
  },
  fr: {
    title: 'Convertisseur MKV vers MP4 en ligne',
    description:
      'Convertissez vos fichiers MKV en MP4 dans le navigateur en conservant la qualite, l audio et les sous-titres.',
  },
  de: {
    title: 'MKV zu MP4 Konverter online',
    description:
      'Wandeln Sie MKV-Dateien im Browser nach MP4 um und behalten Sie Qualitat, Audio und Untertitel.',
  },
};

const MESSAGE_MAP: Record<Locale, Messages> = {
  es: esMessages as Messages,
  en: enMessages as Messages,
  fr: frMessages as Messages,
  de: deMessages as Messages,
  ja: jaMessages as Messages,
};

const toLocale = (value: string): Locale => {
  return SUPPORTED_LOCALES.includes(value as Locale) ? (value as Locale) : 'es';
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = toLocale(locale);
  const meta = META_MAP[safeLocale];
  const canonical = safeLocale === 'es' ? '/' : `/${safeLocale}`;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://mkvamp4.com${canonical}`,
      siteName: 'MKV to MP4 Converter',
      locale: safeLocale,
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
      title: meta.title,
      description: meta.description,
      images: ['https://mkvamp4.com/logo/android-chrome-512x512.png'],
    },
    alternates: {
      canonical,
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
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = toLocale(locale);
  const messages = MESSAGE_MAP[safeLocale];

  if (!messages) {
    redirect('/');
  }

  return (
    <SiteShell locale={safeLocale} messages={messages}>
      {children}
    </SiteShell>
  );
}
