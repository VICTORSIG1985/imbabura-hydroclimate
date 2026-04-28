import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import TraceabilityTable from '@/components/TraceabilityTable';
import type { Locale } from '@/i18n/config';

export default async function TraceabilityPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('traceability');
  return (
    <>
      <PageHero kicker="Table S10" title={t('title')} subtitle={t('subtitle')} variant="compact" />
      <section className="section">
        <TraceabilityTable />
      </section>
    </>
  );
}
