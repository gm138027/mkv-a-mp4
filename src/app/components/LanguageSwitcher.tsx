'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslation, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { useAnalytics } from '@/app/hooks/useAnalytics';

/**
 * 语言旗帜 Emoji 映射
 */
const LANGUAGE_FLAGS: Record<Locale, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  ja: '🇯🇵',
  fr: '🇫🇷',
  de: '🇩🇪',
};

export const LanguageSwitcher = () => {
  const { locale, changeLocale, isLoading } = useLocale();
  const { t } = useTranslation();
  const { trackLanguageChange } = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 当前语言配置
  const currentLanguage = SUPPORTED_LOCALES.find((l) => l.code === locale);

  // 处理语言切换
  const handleLanguageChange = (newLocale: Locale) => {
    // 追踪语言切换事件
    trackLanguageChange(locale, newLocale);
    
    changeLocale(newLocale);
    document.cookie = `preferred-locale=${newLocale}; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    
    // 获取当前路径
    const currentPath = window.location.pathname;
    
    const legalMatch = currentPath.match(/^\/(?:([a-z]{2})\/)?(privacy|terms)(\/.*)?$/);
    if (legalMatch) {
      const [, pathLocale, slug, rest] = legalMatch;
      const target =
        newLocale === 'es'
          ? `/${slug}${rest ?? ''}`
          : `/${newLocale}/${slug}${rest ?? ''}`;
      router.push(target);
      setIsOpen(false);
      return;
    }

    // 默认：跳转到对应语言的首页
    const target = newLocale === 'es' ? '/' : `/${newLocale}`;
    router.push(target);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      {/* 当前语言按钮 */}
      <button
        className="language-switcher__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('languageSwitcher.ariaLabel')}
        aria-expanded={isOpen}
        disabled={isLoading}
      >
        <span className="language-switcher__flag">
          {LANGUAGE_FLAGS[locale]}
        </span>
        <span className="language-switcher__name">
          {currentLanguage?.nativeName}
        </span>
        <span className={`language-switcher__arrow ${isOpen ? 'open' : ''}`}>
          ▼
        </span>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="language-switcher__dropdown">
          {SUPPORTED_LOCALES.map((lang) => (
            <button
              key={lang.code}
              className={`language-switcher__option ${locale === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
              disabled={locale === lang.code}
            >
              <span className="language-switcher__option-flag">
                {LANGUAGE_FLAGS[lang.code]}
              </span>
              <span className="language-switcher__option-name">
                {lang.nativeName}
              </span>
              {locale === lang.code && (
                <span className="language-switcher__check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
