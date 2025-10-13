'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslation } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/types';
import Link from 'next/link';

interface PrivacyData {
  meta: {
    title: string;
    description: string;
  };
  header: {
    title: string;
    lastUpdated: string;
  };
  intro: {
    text: string;
  };
  sections: Array<{
    title: string;
    content: string;
  }>;
  footer: {
    text: string;
  };
}

export const PrivacyPolicy = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [privacyData, setPrivacyData] = useState<PrivacyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrivacyData = async () => {
      try {
        // 动态加载隐私政策翻译
        const data = await import(`@/messages/${locale}/privacy.json`);
        setPrivacyData(data.default);
      } catch (error) {
        // 如果当前语言没有翻译，回退到西班牙语
        console.warn(`隐私政策翻译不存在: ${locale}，使用西班牙语`);
        const fallbackData = await import('@/messages/es/privacy.json');
        setPrivacyData(fallbackData.default);
      } finally {
        setLoading(false);
      }
    };

    void loadPrivacyData();
  }, [locale]);

  if (loading) {
    return (
      <div className="privacy-loading">
        <div className="privacy-loading__spinner"></div>
        <p>Cargando política de privacidad...</p>
      </div>
    );
  }

  if (!privacyData) {
    return <div className="privacy-error">Error al cargar la política de privacidad.</div>;
  }

  return (
    <div className="privacy-policy">
      {/* 返回首页链接 */}
      <Link href="/" className="legal-back-link">
        <span className="legal-back-link__arrow">←</span>
        {t('navigation.backToHome')}
      </Link>

      {/* Header */}
      <header className="privacy-policy__header">
        <h1 className="privacy-policy__title">{privacyData.header.title}</h1>
        <p className="privacy-policy__date">{privacyData.header.lastUpdated}</p>
      </header>

      {/* Introducción */}
      <div className="privacy-policy__intro">
        <p>{privacyData.intro.text}</p>
      </div>

      {/* Secciones */}
      <div className="privacy-policy__content">
        {privacyData.sections.map((section, index) => (
          <section key={index} className="privacy-policy__section">
            <h2 className="privacy-policy__section-title">{section.title}</h2>
            <div className="privacy-policy__section-content">
              {section.content.split('\n').map((paragraph, pIndex) => {
                // Detectar si es una lista (línea que empieza con •)
                if (paragraph.trim().startsWith('•')) {
                  return (
                    <li key={pIndex} className="privacy-policy__list-item">
                      {paragraph.trim().substring(1).trim()}
                    </li>
                  );
                }
                // Si la línea anterior era una lista, cerrar ul
                if (paragraph.trim() && !paragraph.trim().startsWith('•')) {
                  return <p key={pIndex}>{paragraph}</p>;
                }
                return null;
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="privacy-policy__footer">
        <p>{privacyData.footer.text}</p>
      </footer>
    </div>
  );
};
