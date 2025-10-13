import { TermsOfService } from '@/app/components/legal/TermsOfService';
import type { Metadata } from 'next';

// SEO metadata
export const metadata: Metadata = {
  title: 'Términos de Servicio - MKV a MP4 Conversor',
  description: 'Términos y condiciones de uso del convertidor MKV a MP4. Información sobre tus derechos y responsabilidades.',
  robots: 'index, follow',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="terms-page">
      <div className="terms-page__container">
        <TermsOfService />
      </div>
    </div>
  );
}
