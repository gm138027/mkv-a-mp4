import type { Locale } from '@/lib/i18n/types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/i18n/types';

export type AlternateLanguages = Record<string, string>;

const buildPath = (locale: Locale, path?: string): string => {
  const suffix = path ? `/${path}` : '';
  if (locale === DEFAULT_LOCALE) {
    return suffix || '/';
  }
  return `/${locale}${suffix}`;
};

export const buildAlternates = (path?: string): AlternateLanguages => {
  const languages: AlternateLanguages = {};
  SUPPORTED_LOCALES.forEach((config) => {
    languages[config.code] = buildPath(config.code as Locale, path);
  });
  languages['x-default'] = buildPath(DEFAULT_LOCALE, path);
  return languages;
};

export const buildCanonical = (locale: Locale, path?: string): string => buildPath(locale, path);

export const buildMetadataAlternates = (locale: Locale, path?: string) => ({
  canonical: buildCanonical(locale, path),
  languages: buildAlternates(path),
});
