import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/types';
import { LegalPage } from '@/app/components/legal/LegalPage';
import { loadPrivacyMessages, loadCommonMessages } from '@/app/components/legal/privacy-helpers';
import { BreadcrumbSchema, PrivacyPolicySchema } from '@/app/components/StructuredData';
import { buildAlternates, buildCanonical } from '@/lib/seo/alternates';

const PRIVACY_LAST_UPDATED_ISO = '2025-10-13';

const buildPrivacyUrl = (locale: string) =>
  locale === 'es' ? 'https://mkvamp4.com/privacy' : `https://mkvamp4.com/${locale}/privacy`;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await loadPrivacyMessages(locale);
  const meta = messages.meta;

  return {
    title: meta.title,
    description: meta.description,
    robots: 'index, follow',
    alternates: {
      canonical: buildCanonical(locale as Locale, 'privacy'),
      languages: buildAlternates('privacy'),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://mkvamp4.com/${locale === 'es' ? '' : `${locale}/`}privacy`,
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

export default async function LocalePrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [privacy, common] = await Promise.all([loadPrivacyMessages(locale), loadCommonMessages(locale)]);
  const absoluteUrl = buildPrivacyUrl(locale);

  return (
    <>
      <PrivacyPolicySchema
        locale={locale}
        title={privacy.meta.title}
        description={privacy.meta.description}
        url={absoluteUrl}
        lastReviewed={PRIVACY_LAST_UPDATED_ISO}
      />
      <BreadcrumbSchema
        locale={locale}
        items={[
          {
            name: privacy.header.title,
            url: absoluteUrl,
          },
        ]}
      />
      <div className="privacy-page">
        <div className="privacy-page__container">
          <LegalPage
            data={privacy}
            backLabel={common.navigation.backToHome}
            backHref={locale === 'es' ? '/' : `/${locale}`}
            classPrefix="privacy-policy"
            listItemClassName="privacy-policy__list-item"
          />
        </div>
      </div>
    </>
  );
}
