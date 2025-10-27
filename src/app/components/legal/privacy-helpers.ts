import type { Locale } from '@/lib/i18n/types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/i18n/types';
import privacyEs from '@/messages/es/privacy.json';
import commonEs from '@/messages/es/common.json';

const FALLBACK_LOCALE: Locale = DEFAULT_LOCALE;

export type PrivacyMessages = typeof privacyEs;
export type CommonMessages = typeof commonEs;

const FALLBACK_PRIVACY: PrivacyMessages = privacyEs;
const FALLBACK_COMMON: CommonMessages = commonEs;

const ALLOWED_CODES: Set<Locale> = new Set(SUPPORTED_LOCALES.map((item) => item.code as Locale));

const sanitizeLocale = (locale: string): Locale => {
  if (ALLOWED_CODES.has(locale as Locale)) {
    return locale as Locale;
  }
  return FALLBACK_LOCALE;
};

export const loadPrivacyMessages = async (locale: string): Promise<PrivacyMessages> => {
  const normalized = sanitizeLocale(locale);

  if (normalized === FALLBACK_LOCALE) {
    return FALLBACK_PRIVACY;
  }

  try {
    const mod = await import(`@/messages/${normalized}/privacy.json`);
    return mod.default as PrivacyMessages;
  } catch (error) {
    console.warn(`[privacy] failed to load ${normalized}, falling back to ${FALLBACK_LOCALE}`, error);
    return FALLBACK_PRIVACY;
  }
};

export const loadCommonMessages = async (locale: string): Promise<CommonMessages> => {
  const normalized = sanitizeLocale(locale);

  if (normalized === FALLBACK_LOCALE) {
    return FALLBACK_COMMON;
  }

  try {
    const mod = await import(`@/messages/${normalized}/common.json`);
    return mod.default as CommonMessages;
  } catch (error) {
    console.warn(`[common] failed to load ${normalized}, falling back to ${FALLBACK_LOCALE}`, error);
    return FALLBACK_COMMON;
  }
};
