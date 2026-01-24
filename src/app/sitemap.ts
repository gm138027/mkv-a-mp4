import type { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/types';

const BASE_URL = 'https://mkvamp4.com';
const LEGAL_LAST_MODIFIED = new Date('2025-10-13T00:00:00Z');

const toLocale = (value: string): Locale => value as Locale;

const buildUrl = (locale: Locale, path = ''): string => {
  const normalizedPath = path ? `/${path}` : '';
  if (locale === DEFAULT_LOCALE) {
    return `${BASE_URL}${normalizedPath}`;
  }
  return `${BASE_URL}/${locale}${normalizedPath}`;
};

const buildAlternates = (path = ''): Record<string, string> => {
  const map: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((item) => {
    map[item.code] = buildUrl(toLocale(item.code as string), path);
  });
  map['x-default'] = buildUrl(DEFAULT_LOCALE, path);
  return map;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homeEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((localeConfig) => {
    const locale = toLocale(localeConfig.code as string);
    return {
      url: buildUrl(locale),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: locale === DEFAULT_LOCALE ? 1.0 : 0.9,
      alternates: {
        languages: buildAlternates(),
      },
    };
  });

  const privacyEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((localeConfig) => {
    const locale = toLocale(localeConfig.code as string);
    return {
      url: buildUrl(locale, 'privacy'),
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: buildAlternates('privacy'),
      },
    };
  });

  const termsEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((localeConfig) => {
    const locale = toLocale(localeConfig.code as string);
    return {
      url: buildUrl(locale, 'terms'),
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: buildAlternates('terms'),
      },
    };
  });

  return [...homeEntries, ...privacyEntries, ...termsEntries];
}
