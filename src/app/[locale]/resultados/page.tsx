import { setRequestLocale, getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import PageHero from '@/components/PageHero';
import { figureUrl } from '@/lib/assets';
import type { Locale } from '@/i18n/config';

const ENSOHeatmapFull    = dynamic(() => import('@/components/charts/ScienceCharts').then(m => m.ENSOHeatmapFull),    { ssr: false });
const CMIPProjectionLines = dynamic(() => import('@/components/charts/ScienceCharts').then(m => m.CMIPProjectionLines), { ssr: false });
const MKSmallMultiples    = dynamic(() => import('@/components/charts/ScienceCharts').then(m => m.MKSmallMultiples),    { ssr: false });

export default async function ResultsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('results');

  const isEs = locale === 'es';

  return (
    <>
      <PageHero kicker="§4" title={t('title')} subtitle={t('subtitle')} variant="compact" />

      {/* Sección 4.1 + Small Multiples MK */}
      <section className="section">
        <article className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start mb-10">
          <div>
            <h2 className="heading-3 mb-3 text-andean-deep">{t('s41_title')}</h2>
            <p className="body-lg">{t('s41_p')}</p>
          </div>
          <MKSmallMultiples />
        </article>

        <article className="grid lg:grid-cols-2 gap-8 items-start mb-10">
          <figure>
            <img src={figureUrl('main', 'Figure_03.png')} alt="" className="w-full rounded-xl border border-slate-200 shadow-sm" loading="lazy" />
            <figcaption className="text-xs text-slate-500 mt-1 italic">{isEs ? 'Figura 3 · Lapse rate altitudinal in-situ' : 'Figure 3 · In-situ altitudinal lapse rate'}</figcaption>
          </figure>
          <div>
            <h2 className="heading-3 mb-3 text-andean-deep">{t('s42_title')}</h2>
            <p className="body-lg">{t('s42_p')}</p>
          </div>
        </article>

        <article className="mb-10">
          <h2 className="heading-3 mb-3 text-andean-deep">{t('s43_title')}</h2>
          <p className="body-lg mb-5 max-w-3xl">{t('s43_p')}</p>
          <ENSOHeatmapFull />
        </article>

        <article className="grid lg:grid-cols-2 gap-8 items-start mb-10">
          <div>
            <h2 className="heading-3 mb-3 text-andean-deep">{t('s44_title')}</h2>
            <p className="body-lg">{t('s44_p')}</p>
          </div>
          <figure>
            <img src={figureUrl('main', 'Figure_05.png')} alt="" className="w-full rounded-xl border border-slate-200 shadow-sm" loading="lazy" />
            <figcaption className="text-xs text-slate-500 mt-1 italic">{isEs ? 'Figura 5 · CMIP6 histórico vs observación' : 'Figure 5 · CMIP6 historical vs observation'}</figcaption>
          </figure>
        </article>

        <article className="mb-10">
          <h2 className="heading-3 mb-3 text-andean-deep">{t('s45_title')}</h2>
          <p className="body-lg mb-5 max-w-3xl">{t('s45_p')}</p>
          <CMIPProjectionLines />
        </article>
      </section>
    </>
  );
}
