import dynamic from 'next/dynamic';
import ConverterClient from '../ConverterClient';
import { HeroSection, Features, HowTo, Tips } from '../components/home';
import { WebApplicationSchema, OrganizationSchema, BreadcrumbSchema } from '../components/StructuredData';
import { SUPPORTED_LOCALES } from '@/lib/i18n/types';
import type { Metadata } from 'next';

// 懒加载非首屏组件
const AlternativeMethods = dynamic(() => import('../components/home').then(mod => ({ default: mod.AlternativeMethods })), {
  loading: () => <div className="loading-placeholder" />,
});

const UseCases = dynamic(() => import('../components/home').then(mod => ({ default: mod.UseCases })), {
  loading: () => <div className="loading-placeholder" />,
});

const FAQ = dynamic(() => import('../components/home').then(mod => ({ default: mod.FAQ })), {
  loading: () => <div className="loading-placeholder" />,
});

// 语言对应的 locale 标签
const localeToLangMap: Record<string, string> = {
  es: 'es',
  en: 'en',
  ja: 'ja',
  fr: 'fr',
  de: 'de',
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter(l => l.code !== 'es').map(l => ({ locale: l.code }));
}

// 动态生成每个语言的metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await import(`@/messages/${locale}/common.json`);
  const meta = messages.default.meta;

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
      locale: localeToLangMap[locale] || locale,
      type: 'website',
      images: [
        {
          url: 'https://mkvamp4.com/logo/android-chrome-512x512.png',
          width: 512,
          height: 512,
          alt: 'MKV to MP4 Converter Logo',
        }
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
  
  // 页面内容与根 / 完全一致，仅路径不同，语言由 Context + LocaleSync 同步
  return (
    <>
      {/* 结构化数据 - Organization Schema (Google搜索结果logo) */}
      <OrganizationSchema />
      
      {/* 结构化数据 - WebApplication Schema */}
      <WebApplicationSchema locale={locale} />

      {/* 结构化数据 - Breadcrumb */}
      <BreadcrumbSchema locale={locale} />
      
      {/* Hero Section - SEO H1 标题 */}
      <HeroSection />

      {/* 主内容区域（三栏布局：左侧广告 + 中间内容 + 右侧广告） */}
      <div className="page-layout">
        {/* 左侧广告位 - 预留位置，将来可添加广告代码 */}
        <aside className="page-layout__ad page-layout__ad--left" aria-label="Left advertisement space">
          {/* 广告代码将在此处插入 */}
        </aside>

        {/* 主内容区 */}
        <main className="page-layout__content">
          {/* 转换器工具 */}
          <div className="app-stage">
            <ConverterClient />
          </div>

          {/* How-To Guide */}
          <HowTo />

          {/* Features - 核心卖点 */}
          <Features />

          {/* Tips - 最佳体验建议 */}
          <Tips />

          {/* Alternative Methods - 其他转换方式 */}
          <AlternativeMethods />

          {/* Use Cases - 使用场景 */}
          <UseCases />

          {/* FAQ - 常见问题 */}
          <FAQ />
        </main>

        {/* 右侧广告位 - 预留位置，将来可添加广告代码 */}
        <aside className="page-layout__ad page-layout__ad--right" aria-label="Right advertisement space">
          {/* 广告代码将在此处插入 */}
        </aside>
      </div>
    </>
  );
}
