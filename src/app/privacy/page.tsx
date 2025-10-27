import type { Metadata } from 'next';
import { headers, cookies } from 'next/headers';
import { DEFAULT_LOCALE, type Locale, SUPPORTED_LOCALES } from '@/lib/i18n/types';
import { LegalPage } from '@/app/components/legal/LegalPage';
import { loadPrivacyMessages, loadCommonMessages } from '@/app/components/legal/privacy-helpers';

// SEO metadata
export const metadata: Metadata = {
  title: 'Política de Privacidad - MKV a MP4 Conversor',
  description:
    'Política de privacidad del convertidor MKV a MP4. Información sobre cómo procesamos y protegemos tus datos.',
  robots: 'index, follow',
  alternates: {
    canonical: '/privacy',
  },
};

const LOCALE_SET = new Set<Locale>(SUPPORTED_LOCALES.map(({ code }) => code));

const detectLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('preferred-locale');
  const cookieLocale = cookie?.value;
  if (cookieLocale && LOCALE_SET.has(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const headerList = await headers();
  const acceptLanguage = headerList.get('accept-language');

  if (acceptLanguage) {
    const primary = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
    if (primary && LOCALE_SET.has(primary as Locale)) {
      return primary as Locale;
    }
  }

  return DEFAULT_LOCALE;
};

export default async function PrivacyPage() {
  const locale = await detectLocale();
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
          backHref="/"
          classPrefix="privacy-policy"
          listItemClassName="privacy-policy__list-item"
        />
      </div>
    </div>
  );
}
