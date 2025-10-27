import type { Metadata } from 'next';
import { headers, cookies } from 'next/headers';
import type { Locale } from '@/lib/i18n/types';
import { resolveLocale, loadCommonMessages } from '@/lib/i18n/server';
import { LegalPage } from '@/app/components/legal/LegalPage';
import { loadTermsMessages } from '@/app/components/legal/terms-helpers';
import { SiteShell } from '@/app/components/SiteShell';

export const metadata: Metadata = {
  title: 'Terminos de Servicio - MKV a MP4 Conversor',
  description:
    'Terminos y condiciones de uso del conversor MKV a MP4. Informacion sobre tus derechos y responsabilidades.',
  robots: 'index, follow',
  alternates: {
    canonical: '/terms',
  },
};

const detectLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('preferred-locale')?.value;
  if (cookieLocale) {
    return resolveLocale(cookieLocale);
  }

  const headerList = await headers();
  const acceptLanguage = headerList.get('accept-language');
  const primary = acceptLanguage?.split(',')[0]?.split('-')[0]?.toLowerCase();
  return resolveLocale(primary ?? undefined);
};

export default async function TermsPage() {
  const requestedLocale = await detectLocale();
  const [{ locale, messages }, terms] = await Promise.all([
    loadCommonMessages(requestedLocale),
    loadTermsMessages(requestedLocale),
  ]);

  const backHref = locale === 'es' ? '/' : `/${locale}`;

  return (
    <SiteShell locale={locale} messages={messages}>
      <div className="terms-page">
        <div className="terms-page__container">
          <LegalPage
            data={terms}
            backLabel={messages.navigation.backToHome}
            backHref={backHref}
            classPrefix="terms-of-service"
            listItemClassName="terms-of-service__list-item"
          />
        </div>
      </div>
    </SiteShell>
  );
}
