import { setRequestLocale, getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import PageHero from '@/components/PageHero';
import ValidationCertificate from '@/components/ValidationCertificate';
import type { Locale } from '@/i18n/config';

const BootstrapENSOMedian = dynamic(() => import('@/components/charts/ValidationCharts').then(m => m.BootstrapENSOMedian), { ssr: false });
const PValueDistribution  = dynamic(() => import('@/components/charts/ValidationCharts').then(m => m.PValueDistribution),  { ssr: false });
const InterModelCoherence = dynamic(() => import('@/components/charts/ValidationCharts').then(m => m.InterModelCoherence), { ssr: false });
const RegionalMannKendall = dynamic(() => import('@/components/charts/ValidationCharts').then(m => m.RegionalMannKendall), { ssr: false });

export default async function ValidationPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('validation');

  return (
    <>
      <PageHero kicker="Score 90/100" title={t('title')} subtitle={t('subtitle')} variant="compact" />
      <section className="section">
        <ValidationCertificate />

        <div className="mt-12">
          <h3 className="heading-3 text-andean-deep mb-1">{t('additional_validations_title')}</h3>
          <p className="text-sm text-slate-600 mb-5 max-w-3xl">{t('additional_validations_subtitle')}</p>
          <div className="grid lg:grid-cols-2 gap-4">
            <BootstrapENSOMedian />
            <PValueDistribution />
            <RegionalMannKendall />
            <InterModelCoherence />
          </div>
        </div>
      </section>
    </>
  );
}
