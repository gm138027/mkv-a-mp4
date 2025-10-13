'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n';

export const FAQ = () => {
  const { messages } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!messages?.faq) return null;

  const { title, items } = messages.faq as {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // FAQ Schema.org 结构化数据
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="faq-section">
      {/* 添加FAQ结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="faq-section__container">
        <h2 className="faq-section__title">{title}</h2>

        <div className="faq-list">
          {items.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'faq-item--open' : ''}`}
            >
              <button
                className="faq-item__question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="faq-item__question-text">{faq.question}</span>
                <span className="faq-item__icon">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>

              {openIndex === index && (
                <div className="faq-item__answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
