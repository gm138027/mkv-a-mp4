'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslation } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/types';
import Link from 'next/link';

interface TermsData {
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

export const TermsOfService = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [termsData, setTermsData] = useState<TermsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTermsData = async () => {
      try {
        // 动态加载服务条款翻译
        const data = await import(`@/messages/${locale}/terms.json`);
        setTermsData(data.default);
      } catch (error) {
        // 如果当前语言没有翻译，回退到西班牙语
        console.warn(`服务条款翻译不存在: ${locale}，使用西班牙语`);
        const fallbackData = await import('@/messages/es/terms.json');
        setTermsData(fallbackData.default);
      } finally {
        setLoading(false);
      }
    };

    void loadTermsData();
  }, [locale]);

  if (loading) {
    return (
      <div className="terms-loading">
        <div className="terms-loading__spinner"></div>
        <p>Cargando términos de servicio...</p>
      </div>
    );
  }

  if (!termsData) {
    return <div className="terms-error">Error al cargar los términos de servicio.</div>;
  }

  return (
    <div className="terms-of-service">
      {/* 返回首页链接 */}
      <Link href="/" className="legal-back-link">
        <span className="legal-back-link__arrow">←</span>
        {t('navigation.backToHome')}
      </Link>

      {/* Header */}
      <header className="terms-of-service__header">
        <h1 className="terms-of-service__title">{termsData.header.title}</h1>
        <p className="terms-of-service__date">{termsData.header.lastUpdated}</p>
      </header>

      {/* Introducción */}
      <div className="terms-of-service__intro">
        <p>{termsData.intro.text}</p>
      </div>

      {/* Secciones */}
      <div className="terms-of-service__content">
        {termsData.sections.map((section, index) => (
          <section key={index} className="terms-of-service__section">
            <h2 className="terms-of-service__section-title">{section.title}</h2>
            <div className="terms-of-service__section-content">
              {section.content.split('\n').map((paragraph, pIndex) => {
                // Detectar si es una lista (línea que empieza con •)
                if (paragraph.trim().startsWith('•')) {
                  return (
                    <li key={pIndex} className="terms-of-service__list-item">
                      {paragraph.trim().substring(1).trim()}
                    </li>
                  );
                }
                // Párrafo normal
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
      <footer className="terms-of-service__footer">
        <p>{termsData.footer.text}</p>
      </footer>
    </div>
  );
};
