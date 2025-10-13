import { TermsOfService } from '@/app/components/legal/TermsOfService';
import type { Metadata } from 'next';

// 动态生成每个语言的 metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await import(`@/messages/${locale}/terms.json`);
  const meta = messages.default.meta;

  return {
    title: meta.title,
    description: meta.description,
    robots: 'index, follow',
    alternates: {
      canonical: `/${locale === 'es' ? '' : locale + '/'}terms`,
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
      url: `https://mkvamp4.com/${locale === 'es' ? '' : locale + '/'}terms`,
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

export default function TermsPage() {
  return (
    <div className="terms-page">
      <div className="terms-page__container">
        <TermsOfService />
      </div>
    </div>
  );
}
