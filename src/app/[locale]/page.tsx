import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import ConverterClient from '../ConverterClient';
import { HeroSection, Features, HowTo, Tips } from '../components/home';
import { WebApplicationSchema, OrganizationSchema, BreadcrumbSchema } from '../components/StructuredData';
import { SUPPORTED_LOCALES } from '@/lib/i18n/types';

const AlternativeMethods = dynamic(() => import('../components/home').then((mod) => ({ default: mod.AlternativeMethods })), {
  loading: () => <div className="loading-placeholder" />,
});

const UseCases = dynamic(() => import('../components/home').then((mod) => ({ default: mod.UseCases })), {
  loading: () => <div className="loading-placeholder" />,
});

const FAQ = dynamic(() => import('../components/home').then((mod) => ({ default: mod.FAQ })), {
  loading: () => <div className="loading-placeholder" />,
});

const LOCALE_MAP: Record<string, string> = {
  es: 'es',
  en: 'en',
  ja: 'ja',
  fr: 'fr',
  de: 'de',
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((item) => item.code !== 'es').map((item) => ({ locale: item.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messagesModule = await import(`@/messages/${locale}/common.json`).catch(() => import('@/messages/es/common.json'));
  const meta = messagesModule.default.meta;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: '/',
        en: '/en',
        ja: '/ja',
        fr: '/fr',
        de: '/de',
        'x-default': '/',
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://mkvamp4.com/${locale}`,
      siteName: 'MKV to MP4 Converter',
      locale: LOCALE_MAP[locale] || locale,
      type: 'website',
      images: [
        {
          url: 'https://mkvamp4.com/logo/android-chrome-512x512.png',
          width: 512,
          height: 512,
          alt: 'MKV to MP4 Converter Logo',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: meta.title,
      description: meta.description,
      images: ['https://mkvamp4.com/logo/android-chrome-512x512.png'],
    },
  };
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <OrganizationSchema />
      <WebApplicationSchema locale={locale} />
      <BreadcrumbSchema locale={locale} />

      <HeroSection />

      <div className="page-layout">
        <aside className="page-layout__ad page-layout__ad--left" aria-label="Left advertisement space" />

        <main className="page-layout__content">
          <div className="app-stage">
            <ConverterClient />
          </div>
          <HowTo />
          <Features />
          <Tips />
          <AlternativeMethods />
          <UseCases />
          <FAQ />
        </main>

        <aside className="page-layout__ad page-layout__ad--right" aria-label="Right advertisement space" />
      </div>
    </>
  );
}
