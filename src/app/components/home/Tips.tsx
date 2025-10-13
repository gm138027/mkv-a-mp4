'use client';

import { useLocale } from '@/lib/i18n';

export const Tips = () => {
  const { messages } = useLocale();

  if (!messages?.tips) return null;

  const { title, items } = messages.tips;

  return (
    <section className="tips-section">
      <div className="tips-section__container">
        <h2 className="tips-section__title">{title}</h2>

        <ul className="tips-list">
          {items.map((tip, index) => (
            <li key={index} className="tips-list__item">
              <div className="tips-list__header">
                <span className="tips-list__number">{index + 1}</span>
                <h3 className="tips-list__title">{tip.title}</h3>
              </div>
              <p className="tips-list__description">{tip.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
