/**
 * i18n Context
 * 提供语言和翻译消息的全局状态管理
 */

'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Locale, Messages } from './types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './types';

// ✅ 同步导入默认语言的翻译文件，避免初始化时的警告
import defaultMessages from '@/messages/es/common.json';

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

/**
 * 语言提供者组件
 */
export const LocaleProvider = ({ children, initialLocale = DEFAULT_LOCALE, initialMessages }: LocaleProviderProps) => {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  // ✅ 使用默认翻译消息初始化，避免 null 状态
  const [messages, setMessages] = useState<Messages | null>(initialMessages || (defaultMessages as Messages));
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 加载翻译文件
   */
  const loadMessages = useCallback(async (newLocale: Locale) => {
    // ✅ 双重保护：验证 locale 是否在支持列表中
    const validLocale = SUPPORTED_LOCALES.find(l => l.code === newLocale);
    
    if (!validLocale) {
      console.error(`[i18n] 不支持的语言代码: ${newLocale}，已拒绝加载`);
      return; // 直接返回，不尝试加载
    }
    
    setIsLoading(true);
    try {
      // 动态导入翻译文件
      const messagesModule = await import(`@/messages/${newLocale}/common.json`);
      setMessages(messagesModule.default);
      console.log(`[i18n] 已加载语言: ${newLocale}`);
    } catch (error) {
      console.error(`[i18n] 加载语言失败: ${newLocale}`, error);
      // 如果加载失败，回退到默认语言
      if (newLocale !== DEFAULT_LOCALE) {
        console.log(`[i18n] 回退到默认语言: ${DEFAULT_LOCALE}`);
        try {
          const fallbackModule = await import(`@/messages/${DEFAULT_LOCALE}/common.json`);
          setMessages(fallbackModule.default);
        } catch (fallbackError) {
          console.error(`[i18n] 加载默认语言也失败`, fallbackError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 切换语言
   */
  const changeLocale = useCallback((newLocale: Locale) => {
    // ✅ 验证 newLocale 是否是支持的语言代码
    const isValidLocale = SUPPORTED_LOCALES.some(l => l.code === newLocale);
    
    if (!isValidLocale) {
      console.error(`[i18n] 拒绝切换到无效的语言代码: ${newLocale}`);
      return;
    }
    
    if (newLocale === locale) {
      return;
    }
    
    console.log(`[i18n] 切换语言: ${locale} → ${newLocale}`);
    setLocale(newLocale);
    
    // 保存到 localStorage（已验证有效后才保存）
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
    
    // 加载新语言的翻译文件
    void loadMessages(newLocale);
  }, [locale, loadMessages]);

  // ✅ 初始化：仅在非默认语言或没有 messages 时加载
  useEffect(() => {
    // 如果当前语言不是默认语言，需要加载对应的翻译文件
    if (locale !== DEFAULT_LOCALE && messages === defaultMessages) {
      void loadMessages(locale);
    }
  }, [locale, messages, loadMessages]);

  // 从 localStorage 恢复语言设置（仅在客户端初始化时执行一次）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as string | null;
      
      if (savedLocale) {
        // ✅ 验证 savedLocale 是否是支持的语言代码
        const isValidLocale = SUPPORTED_LOCALES.some(l => l.code === savedLocale);
        
        if (isValidLocale && savedLocale !== locale && savedLocale !== DEFAULT_LOCALE) {
          console.log(`[i18n] 从 localStorage 恢复语言: ${savedLocale}`);
          setLocale(savedLocale as Locale);
        } else if (!isValidLocale) {
          // ✅ 清理无效的 localStorage 数据
          console.warn(`[i18n] 检测到无效的语言代码 "${savedLocale}"，已自动清理`);
          localStorage.removeItem('locale');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ 只在挂载时执行一次

  const value: LocaleContextValue = {
    locale,
    messages,
    changeLocale,
    isLoading,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

/**
 * 使用语言 Context
 */
export const useLocale = (): LocaleContextValue => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale 必须在 LocaleProvider 内部使用');
  }
  return context;
};
