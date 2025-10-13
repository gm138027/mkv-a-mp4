'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/lib/i18n';

interface HeaderProps {
  languageSwitcher?: React.ReactNode; // 语言切换器插槽
}

export const Header = ({ languageSwitcher }: HeaderProps) => {
  const { locale } = useLocale();
  const homeHref = locale === 'es' ? '/' : `/${locale}`;
  
  return (
    <header className="app-header">
      <div className="app-header__container">
        {/* Logo 和标题 */}
        <Link href={homeHref} className="app-header__logo">
          <Image
            src="/logo/android-chrome-192x192.png"
            alt="MKV to MP4 Converter Logo"
            width={40}
            height={40}
            className="header__logo-image"
            priority
          />
          <span className="app-header__logo-text">MKV a MP4</span>
        </Link>

        {/* 右侧：语言切换器 */}
        <div className="app-header__actions">
          {languageSwitcher}
        </div>
      </div>
    </header>
  );
};
