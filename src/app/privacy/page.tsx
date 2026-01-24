import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/i18n/types';
import { loadCommonMessages } from '@/lib/i18n/server';
import { LegalPage } from '@/app/components/legal/LegalPage';
import { loadPrivacyMessages } from '@/app/components/legal/privacy-helpers';
import { SiteShell } from '@/app/components/SiteShell';
import { BreadcrumbSchema, PrivacyPolicySchema } from '@/app/components/StructuredData';
import { buildAlternates, buildCanonical } from '@/lib/seo/alternates';

const PRIVACY_LAST_UPDATED_ISO = '2025-10-13';
const buildPrivacyUrl = (locale: Locale) =>
  locale === 'es' ? 'https://mkvamp4.com/privacy' : `https://mkvamp4.com/${locale}/privacy`;

const detectLocale = async (): Promise<Locale> => DEFAULT_LOCALE;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocale();
  const privacy = await loadPrivacyMessages(locale);

  return {
    title: privacy.meta.title,
    description: privacy.meta.description,
    robots: 'index, follow',
    alternates: {
      canonical: buildCanonical(locale, 'privacy'),
      languages: buildAlternates('privacy'),
    },
  };
}

export default async function PrivacyPage() {
  const requestedLocale = await detectLocale();
  const [{ locale, messages }, privacy] = await Promise.all([
    loadCommonMessages(requestedLocale),
    loadPrivacyMessages(requestedLocale),
  ]);

  const backHref = locale === 'es' ? '/' : `/${locale}`;
  const absoluteUrl = buildPrivacyUrl(locale);
  const languageLinks = SUPPORTED_LOCALES.map((config) => {
    const code = config.code as Locale;
    return {
      href: code === 'es' ? '/privacy' : `/${code}/privacy`,
      label: config.nativeName,
      code,
    };
  });

  return (
    <SiteShell locale={locale} messages={messages}>
      <PrivacyPolicySchema
        locale={locale}
        title={privacy.meta.title}
        description={privacy.meta.description}
        url={absoluteUrl}
        lastReviewed={PRIVACY_LAST_UPDATED_ISO}
      />
      <BreadcrumbSchema
        locale={locale}
        items={[
          {
            name: privacy.header.title,
            url: absoluteUrl,
          },
        ]}
      />
      <nav className="legal-language-nav" aria-label="Privacy policy languages">
        {languageLinks.map((link, index) => (
          <span key={link.code}>
            <Link href={link.href} className="app-footer__link">
              {link.label}
            </Link>
            {index < languageLinks.length - 1 && <span className="app-footer__separator">|</span>}
          </span>
        ))}
      </nav>
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
