import dynamic from 'next/dynamic';
import ConverterClient from './ConverterClient';
import { HeroSection, Features, HowTo, Tips } from './components/home';
import { WebApplicationSchema, OrganizationSchema } from './components/StructuredData';

// 懒加载非首屏组件，减少初始bundle
const AlternativeMethods = dynamic(() => import('./components/home').then(mod => ({ default: mod.AlternativeMethods })), {
  loading: () => <div className="loading-placeholder" />,
});

const UseCases = dynamic(() => import('./components/home').then(mod => ({ default: mod.UseCases })), {
  loading: () => <div className="loading-placeholder" />,
});

const FAQ = dynamic(() => import('./components/home').then(mod => ({ default: mod.FAQ })), {
  loading: () => <div className="loading-placeholder" />,
});

export default function Home() {
  return (
    <>
      {/* 结构化数据 - Organization Schema (Google搜索结果logo) */}
      <OrganizationSchema />
      
      {/* 结构化数据 - WebApplication Schema */}
      <WebApplicationSchema locale="es" />
      
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
