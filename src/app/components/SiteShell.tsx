'use client';

import type { ReactNode } from 'react';
import type { Locale, Messages } from '@/lib/i18n/types';
import { LocaleProvider } from '@/lib/i18n';
import { ClientLayout } from '@/app/components/ClientLayout';

interface SiteShellProps {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}

export const SiteShell = ({ locale, messages, children }: SiteShellProps) => {
  return (
    <LocaleProvider initialLocale={locale} initialMessages={messages}>
      <ClientLayout>{children}</ClientLayout>
    </LocaleProvider>
  );
};
