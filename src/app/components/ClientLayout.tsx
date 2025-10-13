'use client';

import { useEffect, type ReactNode } from 'react';
import { useLocale } from '@/lib/i18n';
import { Header, Footer } from '@/app/components/layout';
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher';
import { ServiceWorkerRegister } from '@/app/components/ServiceWorkerRegister';

interface ClientLayoutProps {
  children: ReactNode;
}

/**
 * 客户端布局组件
 * 负责同步 HTML lang 属性和当前语言
 */
export const ClientLayout = ({ children }: ClientLayoutProps) => {
  const { locale } = useLocale();

  // 同步 HTML lang 属性
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div className="app-layout">
      {/* Service Worker 注册 */}
      <ServiceWorkerRegister />
      
      {/* Skip to content链接 - 可访问性优化 */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header languageSwitcher={<LanguageSwitcher />} />
      <main id="main-content" className="app-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};
