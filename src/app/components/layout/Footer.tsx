'use client';

import Link from 'next/link';
import { useTranslation, useLocale } from '@/lib/i18n';
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/types';

export const Footer = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const currentYear = new Date().getFullYear();
  const localeHref = (code: Locale) => (code === 'es' ? '/' : `/${code}`);
  const localizedLegalLink = (path: 'privacy' | 'terms') => (locale === 'es' ? `/${path}` : `/${locale}/${path}`);

  return (
    <footer className="app-footer">
      <div className="app-footer__container">
        {/* 版权所有信息 */}
        <div className="app-footer__copyright">
          {t('footer.copyright', { year: currentYear.toString() })}
        </div>

        {/* 链接 */}
        <div className="app-footer__links">
          <Link href={localizedLegalLink('privacy')} className="app-footer__link">
            {t('footer.privacyPolicy')}
          </Link>
          <span className="app-footer__separator">|</span>
          <Link href={localizedLegalLink('terms')} className="app-footer__link">
            {t('footer.termsOfService')}
          </Link>
        </div>

        <div className="app-footer__languages" aria-label="Language links">
          {SUPPORTED_LOCALES.map((item, index) => (
            <span key={item.code}>
              <Link href={localeHref(item.code as Locale)} className="app-footer__link">
                {item.nativeName}
              </Link>
              {index < SUPPORTED_LOCALES.length - 1 && <span className="app-footer__separator">|</span>}
            </span>
          ))}
        </div>

        {/* 技术信息 */}
        <div className="app-footer__tech">
          {t('footer.tech')}
        </div>
      </div>
    </footer>
  );
};
