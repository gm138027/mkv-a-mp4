'use client';

import { useLocale } from '@/lib/i18n';

export const Features = () => {
  const { messages } = useLocale();

  if (!messages?.features) return null;

  const { title, items } = messages.features as {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };

  return (
    <section className="features-section">
      <div className="features-section__container">
        <h2 className="features-section__title">{title}</h2>

        <div className="features-grid">
          {items.map((feature, index) => (
            <div key={index} className="feature-card">
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
