import type { Metadata } from 'next';
import Link from 'next/link';
import { headers, cookies } from 'next/headers';
import type { Locale } from '@/lib/i18n/types';
import { SUPPORTED_LOCALES } from '@/lib/i18n/types';
import { resolveLocale, loadCommonMessages } from '@/lib/i18n/server';
import { LegalPage } from '@/app/components/legal/LegalPage';
import { loadTermsMessages } from '@/app/components/legal/terms-helpers';
import { SiteShell } from '@/app/components/SiteShell';
import { BreadcrumbSchema, TermsOfServiceSchema } from '@/app/components/StructuredData';
import { buildAlternates, buildCanonical } from '@/lib/seo/alternates';

const TERMS_LAST_UPDATED_ISO = '2025-10-13';
const buildTermsUrl = (locale: Locale) =>
  locale === 'es' ? 'https://mkvamp4.com/terms' : `https://mkvamp4.com/${locale}/terms`;

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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocale();
  const terms = await loadTermsMessages(locale);

  return {
    title: terms.meta.title,
    description: terms.meta.description,
    robots: 'index, follow',
    alternates: {
      canonical: buildCanonical(locale, 'terms'),
      languages: buildAlternates('terms'),
    },
  };
}

export default async function TermsPage() {
  const requestedLocale = await detectLocale();
  const [{ locale, messages }, terms] = await Promise.all([
    loadCommonMessages(requestedLocale),
    loadTermsMessages(requestedLocale),
  ]);

  const backHref = locale === 'es' ? '/' : `/${locale}`;
  const absoluteUrl = buildTermsUrl(locale);
  const languageLinks = SUPPORTED_LOCALES.map((config) => {
    const code = config.code as Locale;
    return {
      href: code === 'es' ? '/terms' : `/${code}/terms`,
      label: config.nativeName,
      code,
    };
  });

  return (
    <SiteShell locale={locale} messages={messages}>
      <TermsOfServiceSchema
        locale={locale}
        title={terms.meta.title}
        description={terms.meta.description}
        url={absoluteUrl}
        lastReviewed={TERMS_LAST_UPDATED_ISO}
      />
      <BreadcrumbSchema
        locale={locale}
        items={[
          {
            name: terms.header.title,
            url: absoluteUrl,
          },
        ]}
      />
      <nav className="legal-language-nav" aria-label="Terms of service languages">
        {languageLinks.map((link, index) => (
          <span key={link.code}>
            <Link href={link.href} className="app-footer__link">
              {link.label}
            </Link>
            {index < languageLinks.length - 1 && <span className="app-footer__separator">|</span>}
          </span>
        ))}
      </nav>
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
