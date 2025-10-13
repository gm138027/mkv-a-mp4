/**
 * 翻译 Hook
 * 提供翻译函数和语言信息
 */

'use client';

import { useCallback } from 'react';
import { useLocale } from './context';
import type { TranslateFunction } from './types';

interface UseTranslationReturn {
  t: TranslateFunction;
  locale: string;
  isLoading: boolean;
}

/**
 * 使用翻译 Hook
 * 
 * @example
 * const { t } = useTranslation();
 * const text = t('common.button.selectFile');
 * const textWithVar = t('errors.fileSize', { size: '2GB' });
 */
export const useTranslation = (): UseTranslationReturn => {
  const { locale, messages, isLoading } = useLocale();

  /**
   * 翻译函数
   * 支持嵌套键和变量替换
   * 
   * @param key - 翻译键，支持点号分隔的嵌套键 (例: 'common.button.selectFile')
   * @param variables - 可选的变量对象，用于替换翻译文本中的占位符
   * @returns 翻译后的文本，如果找不到则返回键本身
   */
  const t: TranslateFunction = useCallback(
    (key: string, variables?: Record<string, string>) => {
      if (!messages) {
        console.warn(`[i18n] 翻译消息未加载，返回键: ${key}`);
        return key;
      }

      // 按点号分割键，遍历对象获取值
      const keys = key.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: any = messages;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.warn(`[i18n] 翻译键不存在: ${key}`);
          return key;
        }
      }

      // 如果最终值不是字符串，返回键
      if (typeof value !== 'string') {
        console.warn(`[i18n] 翻译键值不是字符串: ${key}`);
        return key;
      }

      // 如果有变量，替换占位符 {variableName}
      if (variables) {
        return value.replace(/\{(\w+)\}/g, (match, varName: string) => {
          return variables[varName] !== undefined ? variables[varName] : match;
        });
      }

      return value;
    },
    [messages]
  );

  return {
    t,
    locale,
    isLoading,
  };
};
