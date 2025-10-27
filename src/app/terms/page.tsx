import type { Metadata } from 'next';
import { headers, cookies } from 'next/headers';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/types';
import { LegalPage } from '@/app/components/legal/LegalPage';
import { loadTermsMessages, loadCommonMessages } from '@/app/components/legal/terms-helpers';

export const metadata: Metadata = {
  title: 'Términos de Servicio - MKV a MP4 Conversor',
  description:
    'Términos y condiciones de uso del convertidor MKV a MP4. Información sobre tus derechos y responsabilidades.',
  robots: 'index, follow',
  alternates: {
    canonical: '/terms',
  },
};

const LOCALE_SET = new Set<Locale>(SUPPORTED_LOCALES.map(({ code }) => code));

const detectLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('preferred-locale')?.value;
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

export default async function TermsPage() {
  const locale = await detectLocale();
  const [terms, common] = await Promise.all([
    loadTermsMessages(locale),
    loadCommonMessages(locale),
  ]);

  return (
    <div className="terms-page">
      <div className="terms-page__container">
        <LegalPage
          data={terms}
          backLabel={common.navigation.backToHome}
          backHref="/"
          classPrefix="terms-of-service"
          listItemClassName="terms-of-service__list-item"
        />
      </div>
    </div>
  );
}
