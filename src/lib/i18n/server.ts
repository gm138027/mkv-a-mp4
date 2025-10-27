import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale, type Messages } from '@/lib/i18n/types';

const SUPPORTED_SET = new Set<Locale>(SUPPORTED_LOCALES.map((item) => item.code as Locale));

export const resolveLocale = (value: string | undefined | null): Locale => {
  if (value && SUPPORTED_SET.has(value as Locale)) {
    return value as Locale;
  }
  return DEFAULT_LOCALE;
};

export const loadCommonMessages = async (
  value: string | undefined | null
): Promise<{ locale: Locale; messages: Messages }> => {
  const locale = resolveLocale(value);
  try {
    const mod = await import(`@/messages/${locale}/common.json`);
    return { locale, messages: mod.default as Messages };
  } catch (error) {
    if (locale !== DEFAULT_LOCALE) {
      const fallback = await import(`@/messages/${DEFAULT_LOCALE}/common.json`);
      return { locale: DEFAULT_LOCALE, messages: fallback.default as Messages };
    }
    throw error;
  }
};
