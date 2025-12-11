import dynamic from 'next/dynamic';
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

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((item) => item.code !== 'es').map((item) => ({ locale: item.code }));
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
