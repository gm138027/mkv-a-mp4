/**
 * i18n 国际化模块主入口
 * 
 * 使用示例：
 * 
 * 1. 在根组件中包裹 LocaleProvider:
 * ```tsx
 * import { LocaleProvider } from '@/lib/i18n';
 * 
 * <LocaleProvider initialLocale="es">
 *   <App />
 * </LocaleProvider>
 * ```
 * 
 * 2. 在组件中使用翻译:
 * ```tsx
 * import { useTranslation } from '@/lib/i18n';
 * 
 * const { t } = useTranslation();
 * return <button>{t('common.button.selectFile')}</button>;
 * ```
 * 
 * 3. 切换语言:
 * ```tsx
 * import { useLocale } from '@/lib/i18n';
 * 
 * const { changeLocale } = useLocale();
 * changeLocale('en');
 * ```
 */

export { LocaleProvider, useLocale } from './context';
export { useTranslation } from './use-translation';
export type { Locale, LocaleConfig, Messages, TranslateFunction } from './types';
export { SUPPORTED_LOCALES, PREFIXED_LOCALES, DEFAULT_LOCALE } from './types';
