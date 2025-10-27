'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Locale, Messages } from './types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './types';

interface LocaleContextValue {
  locale: Locale;
  messages: Messages | null;
  changeLocale: (newLocale: Locale) => void;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
  initialMessages?: Messages;
}

const importMessages = async (code: Locale): Promise<Messages> => {
  switch (code) {
    case 'es':
      return (await import('@/messages/es/common.json')).default as Messages;
    case 'en':
      return (await import('@/messages/en/common.json')).default as Messages;
    case 'ja':
      return (await import('@/messages/ja/common.json')).default as Messages;
    case 'fr':
      return (await import('@/messages/fr/common.json')).default as Messages;
    case 'de':
      return (await import('@/messages/de/common.json')).default as Messages;
    default:
      throw new Error(`Unsupported locale: ${code}`);
  }
};

export const LocaleProvider = ({ children, initialLocale = DEFAULT_LOCALE, initialMessages }: LocaleProviderProps) => {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Messages | null>(initialMessages ?? null);
  const [loadedLocale, setLoadedLocale] = useState<Locale | null>(initialMessages ? initialLocale : null);
  const [isLoading, setIsLoading] = useState(false);

  const loadMessages = useCallback(
    async (targetLocale: Locale) => {
      const supported = SUPPORTED_LOCALES.some((item) => item.code === targetLocale);

      if (!supported) {
        console.error(`[i18n] 不支持的语言代码: ${targetLocale}，已拒绝加载`);
        return;
      }

      setIsLoading(true);
      try {
        const data = await importMessages(targetLocale);
        setMessages(data);
        setLoadedLocale(targetLocale);
        console.log(`[i18n] 已加载语言: ${targetLocale}`);
      } catch (error) {
        console.error(`[i18n] 加载语言失败: ${targetLocale}`, error);
        if (targetLocale !== DEFAULT_LOCALE) {
          try {
            const fallback = await importMessages(DEFAULT_LOCALE);
            setMessages(fallback);
            setLoadedLocale(DEFAULT_LOCALE);
            console.log('[i18n] 已回退到默认语言');
          } catch (fallbackError) {
            console.error('[i18n] 加载默认语言也失败', fallbackError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const changeLocale = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale) {
        return;
      }

      const isValid = SUPPORTED_LOCALES.some((item) => item.code === newLocale);
      if (!isValid) {
        console.error(`[i18n] 拒绝切换到无效的语言代码: ${newLocale}`);
        return;
      }

      console.log(`[i18n] 切换语言: ${locale} -> ${newLocale}`);
      setLocale(newLocale);

      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', newLocale);
      }
    },
    [locale]
  );

  useEffect(() => {
    if (loadedLocale !== locale && !isLoading) {
      void loadMessages(locale);
    }
  }, [locale, loadedLocale, isLoading, loadMessages]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedLocale = localStorage.getItem('locale') as Locale | null;
    if (!savedLocale) {
      return;
    }

    const isValid = SUPPORTED_LOCALES.some((item) => item.code === savedLocale);
    if (!isValid) {
      console.warn(`[i18n] 检测到无效的语言代码 "${savedLocale}"，已自动清理`);
      localStorage.removeItem('locale');
      return;
    }

    if (savedLocale !== locale) {
      console.log(`[i18n] 从 localStorage 恢复语言: ${savedLocale}`);
      setLocale(savedLocale);
    }
  }, [locale]);

  const value: LocaleContextValue = {
    locale,
    messages,
    changeLocale,
    isLoading,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): LocaleContextValue => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale 必须在 LocaleProvider 内部使用');
  }
  return context;
};
