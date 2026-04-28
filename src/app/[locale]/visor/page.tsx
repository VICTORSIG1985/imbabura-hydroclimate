import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import ClimateViewer from '@/components/viewer/ClimateViewer';
import type { Locale } from '@/i18n/config';

export default async function ViewerPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('viewer');
  return (
    <div className="container-page py-6">
      <h1 className="heading-2 text-andean-deep mb-1">{t('title')}</h1>
      <p className="text-sm text-slate-600 mb-5">{t('subtitle')}</p>
      <ClimateViewer />
    </div>
  );
}
