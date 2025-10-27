import type { Metadata } from 'next';
import { LegalPage } from '@/app/components/legal/LegalPage';
import { loadTermsMessages, loadCommonMessages } from '@/app/components/legal/terms-helpers';
import { BreadcrumbSchema, TermsOfServiceSchema } from '@/app/components/StructuredData';

const TERMS_LAST_UPDATED_ISO = '2025-10-13';

const buildTermsUrl = (locale: string) =>
  locale === 'es' ? 'https://mkvamp4.com/terms' : `https://mkvamp4.com/${locale}/terms`;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await loadTermsMessages(locale);
  const meta = messages.meta;

  return {
    title: meta.title,
    description: meta.description,
    robots: 'index, follow',
    alternates: {
      canonical: `/${locale === 'es' ? '' : `${locale}/`}terms`,
      languages: {
        es: '/terms',
        en: '/en/terms',
        ja: '/ja/terms',
        fr: '/fr/terms',
        de: '/de/terms',
        'x-default': '/terms',
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://mkvamp4.com/${locale === 'es' ? '' : `${locale}/`}terms`,
      siteName: 'MKV to MP4 Converter',
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function LocaleTermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [terms, common] = await Promise.all([loadTermsMessages(locale), loadCommonMessages(locale)]);
  const absoluteUrl = buildTermsUrl(locale);

  return (
    <>
      <TermsOfServiceSchema
        locale={locale}
        title={terms.meta.title}
        description={terms.meta.description}
        url={absoluteUrl}
        lastReviewed={TERMS_LAST_UPDATED_ISO}
      />
      <BreadcrumbSchema
        locale={locale}
        items={[
          {
            name: terms.header.title,
            url: absoluteUrl,
          },
        ]}
      />
      <div className="terms-page">
        <div className="terms-page__container">
          <LegalPage
            data={terms}
            backLabel={common.navigation.backToHome}
            backHref={locale === 'es' ? '/' : `/${locale}`}
            classPrefix="terms-of-service"
            listItemClassName="terms-of-service__list-item"
          />
        </div>
      </div>
    </>
  );
}
