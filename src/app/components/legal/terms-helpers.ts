import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/types';
import termsEs from '@/messages/es/terms.json';
import commonEs from '@/messages/es/common.json';

export type TermsMessages = typeof termsEs;
export type CommonMessages = typeof commonEs;

const FALLBACK_TERMS: TermsMessages = termsEs;
const FALLBACK_COMMON: CommonMessages = commonEs;

const SUPPORTED_CODES: Set<Locale> = new Set(SUPPORTED_LOCALES.map((item) => item.code as Locale));

const normalizeLocale = (locale: string): Locale => {
  if (SUPPORTED_CODES.has(locale as Locale)) {
    return locale as Locale;
  }
  return DEFAULT_LOCALE;
};

export const loadTermsMessages = async (locale: string): Promise<TermsMessages> => {
  const normalized = normalizeLocale(locale);

  if (normalized === DEFAULT_LOCALE) {
    return FALLBACK_TERMS;
  }

  try {
    const mod = await import(`@/messages/${normalized}/terms.json`);
    return mod.default as TermsMessages;
  } catch (error) {
    console.warn(`[terms] failed to load ${normalized}, falling back to ${DEFAULT_LOCALE}`, error);
    return FALLBACK_TERMS;
  }
};

export const loadCommonMessages = async (locale: string): Promise<CommonMessages> => {
  const normalized = normalizeLocale(locale);

  if (normalized === DEFAULT_LOCALE) {
    return FALLBACK_COMMON;
  }

  try {
    const mod = await import(`@/messages/${normalized}/common.json`);
    return mod.default as CommonMessages;
  } catch (error) {
    console.warn(`[common] failed to load ${normalized}, falling back to ${DEFAULT_LOCALE}`, error);
    return FALLBACK_COMMON;
  }
};
