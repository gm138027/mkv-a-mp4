import Link from 'next/link';

interface LegalSection {
  title: string;
  content: string;
}

interface LegalContent {
  header: {
    title: string;
    lastUpdated: string;
  };
  intro: {
    text: string;
  };
  sections: LegalSection[];
  footer: {
    text: string;
  };
}

interface LegalPageProps {
  data: LegalContent;
  backLabel: string;
  backHref?: string;
  classPrefix?: string;
  listItemClassName?: string;
}

const renderSectionContent = (content: string, listItemClassName: string) => {
  return content.split('\n').map((paragraph, index) => {
    const trimmed = paragraph.trim();
    if (!trimmed) {
      return null;
    }

    if (trimmed.startsWith('•')) {
      return (
        <li key={`list-${index}`} className={listItemClassName}>
          {trimmed.substring(1).trim()}
        </li>
      );
    }

    return (
      <p key={`p-${index}`}>
        {trimmed}
      </p>
    );
  });
};

export const LegalPage = ({
  data,
  backLabel,
  backHref = '/',
  classPrefix = 'legal-page',
  listItemClassName = 'legal-list-item',
}: LegalPageProps) => {
  return (
    <div className={classPrefix}>
      <Link href={backHref} className="legal-back-link">
        <span className="legal-back-link__arrow">←</span>
        {backLabel}
      </Link>

      <header className={`${classPrefix}__header`}>
        <h1 className={`${classPrefix}__title`}>{data.header.title}</h1>
        <p className={`${classPrefix}__date`}>{data.header.lastUpdated}</p>
      </header>

      <div className={`${classPrefix}__intro`}>
        <p>{data.intro.text}</p>
      </div>

      <div className={`${classPrefix}__content`}>
        {data.sections.map((section, index) => (
          <section key={index} className={`${classPrefix}__section`}>
            <h2 className={`${classPrefix}__section-title`}>{section.title}</h2>
            <div className={`${classPrefix}__section-content`}>
              {renderSectionContent(section.content, listItemClassName)}
            </div>
          </section>
        ))}
      </div>

      <footer className={`${classPrefix}__footer`}>
        <p>{data.footer.text}</p>
      </footer>
    </div>
  );
};
