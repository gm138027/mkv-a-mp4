'use client';

import { useEffect } from 'react';
import { useLocale, SUPPORTED_LOCALES } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

interface Props {
  locale: string; // ⚠️ 改为 string，因为URL参数可能是任意值（如 'privacy'）
}

export default function LocaleSync({ locale }: Props) {
  const { changeLocale } = useLocale();

  useEffect(() => {
    // ✅ 验证 locale 是否是支持的语言代码
    const isValidLocale = SUPPORTED_LOCALES.some(l => l.code === locale);
    
    if (isValidLocale) {
      // 有效的语言代码，执行切换
      changeLocale(locale as Locale);
    } else {
      // 无效的语言代码（如 'privacy'），不执行切换，保持当前语言
      console.warn(`[LocaleSync] 无效的语言代码: ${locale}，已忽略切换请求`);
    }
  }, [locale, changeLocale]);

  return null;
}
