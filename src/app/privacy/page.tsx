import { PrivacyPolicy } from '@/app/components/legal/PrivacyPolicy';
import type { Metadata } from 'next';

// SEO metadata
export const metadata: Metadata = {
  title: 'Política de Privacidad - MKV a MP4 Conversor',
  description: 'Política de privacidad del convertidor MKV a MP4. Información sobre cómo procesamos y protegemos tus datos.',
  robots: 'index, follow',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <div className="privacy-page__container">
        <PrivacyPolicy />
      </div>
    </div>
  );
}
