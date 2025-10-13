'use client';

import { useLocale } from '@/lib/i18n';

export const HowTo = () => {
  const { messages } = useLocale();

  if (!messages?.howTo) return null;

  const { title, steps } = messages.howTo as {
    title: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };

  // HowTo 结构化数据
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": "Step-by-step guide to convert MKV to MP4 online",
    "totalTime": "PT2M",
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.title,
      "text": step.description,
      "url": `https://mkvamp4.com#step-${index + 1}`,
    })),
    "tool": {
      "@type": "HowToTool",
      "name": "Web Browser"
    }
  };

  return (
    <section className="howto-section">
      {/* HowTo结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      
      <div className="howto-section__container">
        <h2 className="howto-section__title">{title}</h2>

        <div className="howto-steps">
          {steps.map((step, index) => (
            <div key={index} className="howto-step">
              <div className="howto-step__number">{index + 1}</div>
              <div className="howto-step__content">
                <h3 className="howto-step__title">{step.title}</h3>
                <p className="howto-step__description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
