import { cookies } from 'next/headers';
import type { Messages } from '@/lib/i18n/types';
import { SiteShell } from '@/app/components/SiteShell';
import { loadCommonMessages } from '@/lib/i18n/server';
import { OfflineContent } from './OfflineContent';

type OfflineStrings = {
  title: string;
  description: string;
  actions: {
    retry: string;
    goHome: string;
  };
  tipsTitle: string;
  tips: string[];
};

const extractOfflineStrings = (messages: Messages): OfflineStrings => {
  const { offline } = messages;

  return {
    title: offline.title,
    description: offline.description,
    actions: {
      retry: offline.actions.retry,
      goHome: offline.actions.goHome,
    },
    tipsTitle: offline.tipsTitle,
    tips: [offline.tips.tip1, offline.tips.tip2, offline.tips.tip3, offline.tips.tip4],
  };
};

export default async function OfflinePage() {
  const cookieStore = cookies();
  const preferredLocale = cookieStore.get('preferred-locale')?.value;

  const { locale, messages } = await loadCommonMessages(preferredLocale);
  const strings = extractOfflineStrings(messages);

  return (
    <SiteShell locale={locale} messages={messages}>
      <OfflineContent strings={strings} />
    </SiteShell>
  );
}
