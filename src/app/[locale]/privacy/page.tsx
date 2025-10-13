import { PrivacyPolicy } from '@/app/components/legal/PrivacyPolicy';
import type { Metadata } from 'next';

// 动态生成每个语言的 metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await import(`@/messages/${locale}/privacy.json`);
  const meta = messages.default.meta;

  return {
    title: meta.title,
    description: meta.description,
    robots: 'index, follow',
    alternates: {
      canonical: `/${locale === 'es' ? '' : locale + '/'}privacy`,
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
      url: `https://mkvamp4.com/${locale === 'es' ? '' : locale + '/'}privacy`,
      siteName: 'MKV to MP4 Converter',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: meta.title,
      description: meta.description,
    },
  };
}

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <div className="privacy-page__container">
        <PrivacyPolicy />
      </div>
    </div>
  );
}
