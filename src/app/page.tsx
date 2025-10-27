import dynamic from 'next/dynamic';
import ConverterClient from './ConverterClient';
import { HeroSection, Features, HowTo, Tips } from './components/home';
import { WebApplicationSchema, OrganizationSchema } from './components/StructuredData';
import { SiteShell } from './components/SiteShell';
import { loadCommonMessages } from '@/lib/i18n/server';

const AlternativeMethods = dynamic(() => import('./components/home').then((mod) => ({ default: mod.AlternativeMethods })), {
  loading: () => <div className="loading-placeholder" />,
});

const UseCases = dynamic(() => import('./components/home').then((mod) => ({ default: mod.UseCases })), {
  loading: () => <div className="loading-placeholder" />,
});

const FAQ = dynamic(() => import('./components/home').then((mod) => ({ default: mod.FAQ })), {
  loading: () => <div className="loading-placeholder" />,
});

export default async function Home() {
  const { locale, messages } = await loadCommonMessages('es');

  return (
    <SiteShell locale={locale} messages={messages}>
      <OrganizationSchema />
      <WebApplicationSchema locale="es" />
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
    </SiteShell>
  );
}
