'use client';

import { useTranslation } from '@/lib/i18n';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer__container">
        {/* 版权信息 */}
        <div className="app-footer__copyright">
          {t('footer.copyright', { year: currentYear.toString() })}
        </div>

        {/* 链接 */}
        <div className="app-footer__links">
          <Link href="/privacy" className="app-footer__link">
            {t('footer.privacyPolicy')}
          </Link>
          <span className="app-footer__separator">•</span>
          <Link href="/terms" className="app-footer__link">
            {t('footer.termsOfService')}
          </Link>
        </div>

        {/* 技术信息 */}
        <div className="app-footer__tech">
          {t('footer.tech')}
        </div>
      </div>
    </footer>
  );
};
