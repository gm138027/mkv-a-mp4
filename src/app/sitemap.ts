import type { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/i18n/types';

/**
 * 动态生成sitemap.xml
 * 包含所有语言版本和hreflang信息
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mkvamp4.com';
  const lastModified = new Date();

  // 生成语言映射对象（用于首页alternates）
  const languagesMap = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [
      locale.code,
      locale.code === DEFAULT_LOCALE ? `${base}/` : `${base}/${locale.code}`,
    ])
  );
  languagesMap['x-default'] = `${base}/`;

  // 1. 首页所有语言版本
  const homeUrls: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((locale) => ({
    url: locale.code === DEFAULT_LOCALE ? `${base}/` : `${base}/${locale.code}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: locale.code === DEFAULT_LOCALE ? 1.0 : 0.9,
    alternates: {
      languages: languagesMap,
    },
  }));

  // 2. 法律页面（隐私政策 - 所有语言版本）
  const privacyUrls: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((locale) => ({
    url: locale.code === DEFAULT_LOCALE ? `${base}/privacy` : `${base}/${locale.code}/privacy`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    alternates: {
      languages: {
        es: `${base}/privacy`,
        en: `${base}/en/privacy`,
        ja: `${base}/ja/privacy`,
        fr: `${base}/fr/privacy`,
        de: `${base}/de/privacy`,
        'x-default': `${base}/privacy`,
      },
    },
  }));

  // 3. 法律页面（服务条款 - 所有语言版本）
  const termsUrls: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((locale) => ({
    url: locale.code === DEFAULT_LOCALE ? `${base}/terms` : `${base}/${locale.code}/terms`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    alternates: {
      languages: {
        es: `${base}/terms`,
        en: `${base}/en/terms`,
        ja: `${base}/ja/terms`,
        fr: `${base}/fr/terms`,
        de: `${base}/de/terms`,
        'x-default': `${base}/terms`,
      },
    },
  }));

  return [...homeUrls, ...privacyUrls, ...termsUrls];
}
