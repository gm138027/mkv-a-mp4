import type { Metadata } from 'next';
import { LegalPage } from '@/app/components/legal/LegalPage';
import { loadPrivacyMessages, loadCommonMessages } from '@/app/components/legal/privacy-helpers';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await loadPrivacyMessages(locale);
  const meta = messages.meta;

  return {
    title: meta.title,
    description: meta.description,
    robots: 'index, follow',
    alternates: {
      canonical: `/${locale === 'es' ? '' : `${locale}/`}privacy`,
      languages: {
        es: '/privacy',
        en: '/en/privacy',
        ja: '/ja/privacy',
        fr: '/fr/privacy',
        de: '/de/privacy',
        'x-default': '/privacy',
      },
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
  const [privacy, common] = await Promise.all([
    loadPrivacyMessages(locale),
    loadCommonMessages(locale),
  ]);

  return (
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
  );
}
