'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslation, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n';
import { useAnalytics } from '@/app/hooks/useAnalytics';

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
  const pathname = usePathname();

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

  const currentLanguage = SUPPORTED_LOCALES.find((l) => l.code === locale);

  const buildTargetHref = (targetLocale: Locale) => {
    const legalMatch = pathname.match(/^\/(?:([a-z]{2})\/)?(privacy|terms)(\/.*)?$/);
    if (legalMatch) {
      const [, , slug, rest] = legalMatch;
      return targetLocale === 'es' ? `/${slug}${rest ?? ''}` : `/${targetLocale}/${slug}${rest ?? ''}`;
    }
    return targetLocale === 'es' ? '/' : `/${targetLocale}`;
  };

  const handleLanguageChange = (targetLocale: Locale) => {
    trackLanguageChange(locale, targetLocale);
    changeLocale(targetLocale);
    document.cookie = `preferred-locale=${targetLocale}; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    setIsOpen(false);
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="language-switcher__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('languageSwitcher.ariaLabel')}
        aria-expanded={isOpen}
        disabled={isLoading}
      >
        <span className="language-switcher__flag">{LANGUAGE_FLAGS[locale]}</span>
        <span className="language-switcher__name">{currentLanguage?.nativeName}</span>
        <span className={`language-switcher__arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="language-switcher__dropdown">
          {SUPPORTED_LOCALES.map((lang) => {
            if (lang.code === locale) {
              return (
                <span
                  key={lang.code}
                  className="language-switcher__option active"
                  aria-current="true"
                >
                  <span className="language-switcher__option-flag">{LANGUAGE_FLAGS[lang.code]}</span>
                  <span className="language-switcher__option-name">{lang.nativeName}</span>
                  <span className="language-switcher__check">✔</span>
                </span>
              );
            }

            const href = buildTargetHref(lang.code as Locale);

            return (
              <Link
                key={lang.code}
                href={href}
                className="language-switcher__option"
                onClick={() => handleLanguageChange(lang.code as Locale)}
              >
                <span className="language-switcher__option-flag">{LANGUAGE_FLAGS[lang.code]}</span>
                <span className="language-switcher__option-name">{lang.nativeName}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
