'use client';

import { useTranslation } from '@/lib/i18n';

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <div className="hero-section__container">
        <h1 className="hero-section__title">
          {t('hero.title')}
          <span className="hero-section__subtitle-highlight">{t('hero.subtitle')}</span>
        </h1>
        
        <p className="hero-section__description">
          {t('hero.description')}
        </p>
      </div>
    </section>
  );
};
