'use client';

interface StructuredDataProps {
  locale: string;
}

/**
 * WebApplication结构化数据（Schema.org）
 * 用于帮助Google和其他搜索引擎理解网站是一个Web应用
 */
export const WebApplicationSchema = ({ locale }: StructuredDataProps) => {
  const titles: Record<string, string> = {
    es: 'Convertidor MKV a MP4',
    en: 'MKV to MP4 Converter',
    ja: 'MKV MP4 変換',
    fr: 'Convertisseur MKV en MP4',
    de: 'MKV zu MP4 Konverter',
  };

  const descriptions: Record<string, string> = {
    es: 'Convertidor gratuito de MKV a MP4 en línea. Convierte en el navegador sin subir archivos a servidores.',
    en: 'Free online MKV to MP4 converter. Convert in your browser without uploading files to servers.',
    ja: '無料のオンラインMKV MP4変換ツール。ファイルをアップロードせずにブラウザで変換。',
    fr: 'Convertisseur MKV en MP4 gratuit en ligne. Convertissez dans le navigateur sans télécharger de fichiers.',
    de: 'Kostenloser Online-MKV-zu-MP4-Konverter. Konvertieren Sie im Browser ohne Datei-Upload.',
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": titles[locale] || titles.es,
    "alternateName": "MKV to MP4 Converter",
    "url": "https://mkvamp4.com",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any (Web Browser)",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": descriptions[locale] || descriptions.es,
    "image": "https://mkvamp4.com/logo/android-chrome-512x512.png",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "Browser-based video conversion",
      "No file upload required",
      "Privacy-friendly (100% client-side)",
      "Preserves video quality",
      "Maintains audio tracks",
      "Keeps subtitles",
      "Supports batch conversion",
      "Free and unlimited"
    ],
    "screenshot": "https://mkvamp4.com/logo/android-chrome-512x512.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * Organization结构化数据
 * 用于Google搜索结果中显示网站logo和信息
 */
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MKV to MP4 Converter",
    "alternateName": "MKV a MP4",
    "url": "https://mkvamp4.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://mkvamp4.com/logo/android-chrome-512x512.png",
      "width": "512",
      "height": "512"
    },
    "sameAs": [
      "https://mkvamp4.com/en",
      "https://mkvamp4.com/ja",
      "https://mkvamp4.com/fr",
      "https://mkvamp4.com/de"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "mkvamp4@proton.me",
      "availableLanguage": ["Spanish", "English", "Japanese", "French", "German"]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * BreadcrumbList 结构化数据
 * 提升 Google 搜索结果中的面包屑导航显示
 */
export const BreadcrumbSchema = ({ locale, pageName }: { locale: string, pageName?: string }) => {
  const homeNames: Record<string, string> = {
    es: 'Inicio',
    en: 'Home',
    ja: 'ホーム',
    fr: 'Accueil',
    de: 'Startseite',
  };

  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": homeNames[locale] || homeNames.es,
      "item": `https://mkvamp4.com${locale === 'es' ? '/' : `/${locale}`}`
    }
  ];

  if (pageName) {
    items.push({
      "@type": "ListItem",
      "position": 2,
      "name": pageName,
      "item": `https://mkvamp4.com/${pageName.toLowerCase().replace(/\s+/g, '-')}`
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
