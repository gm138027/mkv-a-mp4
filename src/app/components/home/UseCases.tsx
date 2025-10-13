'use client';

import { useLocale } from '@/lib/i18n';
import { MobileIcon, TVIcon, SocialIcon, EditIcon, CloudIcon, PrivacyIcon, SettingsIcon } from './icons';

const USECASE_ICONS = [MobileIcon, TVIcon, SocialIcon, EditIcon, CloudIcon, PrivacyIcon, SettingsIcon];

export const UseCases = () => {
  const { messages } = useLocale();

  if (!messages?.useCases) return null;

  const { title, items } = messages.useCases as {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };

  return (
    <section className="usecases-section">
      <div className="usecases-section__container">
        <h2 className="usecases-section__title">{title}</h2>

        <div className="usecases-grid">
          {items.map((useCase, index) => (
            <div key={index} className="usecase-card">
              <div className="usecase-card__number">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="usecase-card__content">
                <h3 className="usecase-card__title">{useCase.title}</h3>
                <p className="usecase-card__description">{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
