import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/i18n/types';
import { redirect } from 'next/navigation';
import { SiteShell } from '@/app/components/SiteShell';
import { loadCommonMessages } from '@/lib/i18n/server';
import { buildCanonical, buildAlternates } from '@/lib/seo/alternates';

const SUPPORTED_CODES = new Set<Locale>(SUPPORTED_LOCALES.map((item) => item.code as Locale));

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

const toLocale = (value: string): Locale => {
  return SUPPORTED_CODES.has(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = toLocale(locale);
  const meta = META_MAP[safeLocale];
  const { messages } = await loadCommonMessages(safeLocale);
  const canonical = buildCanonical(safeLocale);
  const languages = buildAlternates();

  return {
    title: meta.title,
    description: meta.description,
    keywords: messages.meta.keywords,
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
      languages,
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

  try {
    const { locale: resolvedLocale, messages } = await loadCommonMessages(safeLocale);

    return (
      <SiteShell locale={resolvedLocale} messages={messages}>
        {children}
      </SiteShell>
    );
  } catch (error) {
    console.error(`[i18n] Failed to load locale "${safeLocale}"`, error);
    redirect('/');
  }
}
