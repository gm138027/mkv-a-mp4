'use client';

import { useLocale } from '@/lib/i18n';

export const AlternativeMethods = () => {
  const { messages } = useLocale();

  if (!messages?.alternativeMethods) return null;

  const { title, items } = messages.alternativeMethods;

  return (
    <section className="alternative-methods-section">
      <div className="alternative-methods-section__container">
        <h2 className="alternative-methods-section__title">{title}</h2>

        <div className="alternative-methods-list">
          <ul className="alternative-methods-grid">
            {items.map((method, index) => (
              <li key={index} className="alternative-method-card">
                <h3 className="alternative-method-card__title">{method.title}</h3>
                <p className="alternative-method-card__description">{method.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
