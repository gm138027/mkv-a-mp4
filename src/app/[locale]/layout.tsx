import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n/types';
import LocaleSync from './LocaleSync';

// 每个语言的metadata配置
const localeMetadata: Record<Locale, { title: string; description: string }> = {
  es: {
    title: 'Convertidor MKV a MP4 gratis en línea',
    description: 'Convierte en el navegador conservando calidad, audio y subtítulos, sin subir vídeos a servidores. Ideal para quienes desean reproducir MKV en el móvil o Smart TV, publicarlos en redes sociales o compartirlos fácilmente con otras personas.',
  },
  en: {
    title: 'Free Online MKV to MP4 Converter',
    description: 'Convert MKV to MP4 in your browser while preserving quality, audio, and subtitles without uploading videos to servers. Perfect for playing MKV on mobile devices or Smart TVs, sharing on social media, or easily distributing to others.',
  },
  ja: {
    title: 'mkv mp4 変換 無料オンラインサイト | 無劣化コンバーター',
    description: 'ブラウザだけで mkv を mp4 に 変換。mkv mp4 変換 無劣化 に対応した無料オンラインツールで、フリーソフト不要・Windows/Mac/スマホ対応・OBS 録画 mp4 への出力も安全に行えます。',
  },
  fr: {
    title: 'Convertisseur MKV en MP4 gratuit en ligne',
    description: 'Convertissez MKV en MP4 dans votre navigateur en conservant la qualité, l\'audio et les sous-titres sans télécharger de vidéos sur les serveurs. Idéal pour lire MKV sur mobile ou Smart TV, partager sur les réseaux sociaux.',
  },
  de: {
    title: 'Kostenloser Online MKV zu MP4 Konverter',
    description: 'Konvertieren Sie MKV zu MP4 in Ihrem Browser unter Beibehaltung von Qualität, Audio und Untertiteln ohne Videos auf Server hochzuladen. Perfekt zum Abspielen von MKV auf Mobilgeräten oder Smart TVs.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params as { locale: Locale };
  const isDefault = locale === 'es';
  const canonical = isDefault ? '/' : `/${locale}`;
  
  // 获取对应语言的metadata
  const meta = localeMetadata[locale] || localeMetadata.es;
  
  // 当前URL
  const url = `https://mkvamp4.com${canonical}`;

  return {
    title: meta.title,
    description: meta.description,
    
    // Open Graph
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: url,
      siteName: 'MKV to MP4 Converter',
      locale: locale,
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
  const { locale } = await params as { locale: Locale };
  return (
    <>
      {/* 同步运行时 Context 语言，不改变现有内容结构 */}
      <LocaleSync locale={locale} />
      {children}
    </>
  );
}
