import type { Metadata } from 'next';
import { headers, cookies } from 'next/headers';
import type { Locale } from '@/lib/i18n/types';
import { resolveLocale, loadCommonMessages } from '@/lib/i18n/server';
import { LegalPage } from '@/app/components/legal/LegalPage';
import { loadPrivacyMessages } from '@/app/components/legal/privacy-helpers';
import { SiteShell } from '@/app/components/SiteShell';

export const metadata: Metadata = {
  title: 'Politica de Privacidad - MKV a MP4 Conversor',
  description:
    'Politica de privacidad del conversor MKV a MP4. Informacion sobre como procesamos y protegemos tus datos.',
  robots: 'index, follow',
  alternates: {
    canonical: '/privacy',
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

export default async function PrivacyPage() {
  const requestedLocale = await detectLocale();
  const [{ locale, messages }, privacy] = await Promise.all([
    loadCommonMessages(requestedLocale),
    loadPrivacyMessages(requestedLocale),
  ]);

  const backHref = locale === 'es' ? '/' : `/${locale}`;

  return (
    <SiteShell locale={locale} messages={messages}>
      <div className="privacy-page">
        <div className="privacy-page__container">
          <LegalPage
            data={privacy}
            backLabel={messages.navigation.backToHome}
            backHref={backHref}
            classPrefix="privacy-policy"
            listItemClassName="privacy-policy__list-item"
          />
        </div>
      </div>
    </SiteShell>
  );
}
