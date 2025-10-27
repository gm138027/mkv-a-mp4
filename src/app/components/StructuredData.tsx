'use client';

interface StructuredDataProps {
  locale: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

const BASE_URL = 'https://mkvamp4.com';

const LOCALE_TITLES: Record<string, string> = {
  es: 'Convertidor MKV a MP4',
  en: 'MKV to MP4 Converter',
  ja: 'MKV MP4 変換',
  fr: 'Convertisseur MKV en MP4',
  de: 'MKV zu MP4 Konverter',
};

const LOCALE_DESCRIPTIONS: Record<string, string> = {
  es: 'Convertidor gratuito de MKV a MP4 en línea. Convierte en el navegador sin subir archivos a servidores.',
  en: 'Free online MKV to MP4 converter. Convert in your browser without uploading files to servers.',
  ja: '無料のオンラインMKV MP4変換ツール。ファイルをアップロードせずにブラウザで変換できます。',
  fr: 'Convertisseur MKV en MP4 gratuit en ligne. Convertissez dans le navigateur sans télécharger de fichiers.',
  de: 'Kostenloser Online-MKV-zu-MP4-Konverter. Konvertieren Sie im Browser ohne Datei-Upload.',
};

const LOCALE_LANG_CODES: Record<string, string> = {
  es: 'es-ES',
  en: 'en-US',
  ja: 'ja-JP',
  fr: 'fr-FR',
  de: 'de-DE',
};

const localeHomeUrl = (locale: string) => (locale === 'es' ? `${BASE_URL}/` : `${BASE_URL}/${locale}`);

/**
 * WebApplication 结构化数据：帮助搜索引擎理解本站是一个 Web 应用
 */
export const WebApplicationSchema = ({ locale }: StructuredDataProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: LOCALE_TITLES[locale] ?? LOCALE_TITLES.es,
    alternateName: 'MKV to MP4 Converter',
    url: BASE_URL,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any (Web Browser)',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    description: LOCALE_DESCRIPTIONS[locale] ?? LOCALE_DESCRIPTIONS.es,
    image: `${BASE_URL}/logo/android-chrome-512x512.png`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'Browser-based video conversion',
      'No file upload required',
      'Privacy-friendly (100% client-side)',
      'Preserves video quality',
      'Maintains audio tracks',
      'Keeps subtitles',
      'Supports batch conversion',
      'Free and unlimited',
    ],
    screenshot: `${BASE_URL}/logo/android-chrome-512x512.png`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

/**
 * Organization 结构化数据：用于展示品牌与联系方式
 */
export const OrganizationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MKV to MP4 Converter',
    alternateName: 'MKV a MP4',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo/android-chrome-512x512.png`,
      width: '512',
      height: '512',
    },
    sameAs: [
      `${BASE_URL}/en`,
      `${BASE_URL}/ja`,
      `${BASE_URL}/fr`,
      `${BASE_URL}/de`,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'mkvamp4@proton.me',
      availableLanguage: ['Spanish', 'English', 'Japanese', 'French', 'German'],
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

/**
 * BreadcrumbList 结构化数据：提升多语言页面的面包屑显示
 */
export const BreadcrumbSchema = ({ locale, items }: { locale: string; items?: BreadcrumbItem[] }) => {
  const homeNames: Record<string, string> = {
    es: 'Inicio',
    en: 'Home',
    ja: 'ホーム',
    fr: 'Accueil',
    de: 'Startseite',
  };

  const listItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: homeNames[locale] ?? homeNames.es,
      item: localeHomeUrl(locale),
    },
  ];

  if (items?.length) {
    items.forEach((item, index) => {
      listItems.push({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
      });
    });
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

interface LegalSchemaProps {
  locale: string;
  title: string;
  description: string;
  url: string;
  lastReviewed?: string;
  type: 'PrivacyPolicy' | 'TermsOfUse';
}

const LegalSchema = ({ locale, title, description, url, lastReviewed, type }: LegalSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description,
    url,
    inLanguage: LOCALE_LANG_CODES[locale] ?? LOCALE_LANG_CODES.es,
    ...(lastReviewed ? { dateModified: lastReviewed } : {}),
    publisher: {
      '@type': 'Organization',
      name: 'MKV to MP4 Converter',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo/android-chrome-512x512.png`,
        width: 512,
        height: 512,
      },
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

export const PrivacyPolicySchema = (props: Omit<LegalSchemaProps, 'type'>) => (
  <LegalSchema {...props} type="PrivacyPolicy" />
);

export const TermsOfServiceSchema = (props: Omit<LegalSchemaProps, 'type'>) => (
  <LegalSchema {...props} type="TermsOfUse" />
);
