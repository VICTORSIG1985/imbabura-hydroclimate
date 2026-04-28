import { setRequestLocale, getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import PageHero from '@/components/PageHero';
import { figureUrl } from '@/lib/assets';
import type { Locale } from '@/i18n/config';
import { Lightbulb } from 'lucide-react';

const ENSOHeatmapFull    = dynamic(() => import('@/components/charts/ScienceCharts').then(m => m.ENSOHeatmapFull),    { ssr: false });
const CMIPProjectionLines = dynamic(() => import('@/components/charts/ScienceCharts').then(m => m.CMIPProjectionLines), { ssr: false });
const MKSmallMultiples    = dynamic(() => import('@/components/charts/ScienceCharts').then(m => m.MKSmallMultiples),    { ssr: false });

function PlainBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <Lightbulb className="w-4 h-4 text-andean-water shrink-0 mt-0.5" />
      <p className="text-sm text-slate-800 leading-relaxed">{children}</p>
    </div>
  );
}

export default async function ResultsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('results');
  const isEs = locale === 'es';

  return (
    <>
      <PageHero kicker="§4" title={t('title')} subtitle={t('subtitle')} variant="compact" />

      <section className="section">
        {/* 4.1 + Small Multiples MK */}
        <article className="mb-12">
          <h2 className="heading-3 mb-3 text-andean-deep">{t('s41_title')}</h2>
          <p className="body-lg max-w-3xl">{t('s41_p')}</p>
          <PlainBlock>
            {isEs
              ? 'En la gráfica de abajo, cada punto es una estación. La separación por filas (B3, B2, B1) corresponde al piso altitudinal. Lo importante: en la columna "Tmean" (temperatura media) casi todos los puntos están a la derecha del cero — eso significa calentamiento positivo en casi toda la provincia. Los puntos de color saturado son estadísticamente significativos; los puntos en gris claro no lograron demostrar significancia con el test estadístico.'
              : 'In the chart below, each point is a station. Rows (B3, B2, B1) correspond to elevation bands. The key: in the "Tmean" column nearly all points sit to the right of zero — that means positive warming across almost the whole province. Saturated-colour points are statistically significant; pale grey points did not achieve significance under the statistical test.'}
          </PlainBlock>
          <div className="mt-4">
            <MKSmallMultiples />
          </div>
        </article>

        {/* 4.2 */}
        <article className="grid lg:grid-cols-2 gap-8 items-start mb-12">
          <figure>
            <img src={figureUrl('main', 'Figure_03.png')} alt="" className="w-full rounded-xl border border-slate-200 shadow-sm" loading="lazy" />
            <figcaption className="text-xs text-slate-500 mt-1 italic">{isEs ? 'Figura 3 · Lapse rate altitudinal in-situ' : 'Figure 3 · In-situ altitudinal lapse rate'}</figcaption>
          </figure>
          <div>
            <h2 className="heading-3 mb-3 text-andean-deep">{t('s42_title')}</h2>
            <p className="body-lg">{t('s42_p')}</p>
            <PlainBlock>
              {isEs
                ? 'Aunque la cantidad total de lluvia anual no haya cambiado de forma significativa, sí se observan más eventos de lluvia intensa concentrados en pocos días. La línea recta en la gráfica de la izquierda es el "lapse rate": cómo cae la temperatura cada kilómetro que se sube en altitud — una pendiente fundamental para entender el clima andino.'
                : 'Although the total annual rainfall has not changed significantly, we do observe more intense rainfall events concentrated in few days. The straight line on the left chart is the "lapse rate": how temperature drops per kilometre of elevation — a fundamental gradient to understand Andean climate.'}
            </PlainBlock>
          </div>
        </article>

        {/* 4.3 ENSO */}
        <article className="mb-12">
          <h2 className="heading-3 mb-3 text-andean-deep">{t('s43_title')}</h2>
          <p className="body-lg max-w-3xl">{t('s43_p')}</p>
          <PlainBlock>
            {isEs
              ? 'El siguiente mapa de calor muestra cómo cada variable climática responde a El Niño con distintos retrasos. Cada celda es una correlación: azul oscuro = cuando llega El Niño la variable disminuye; rojo oscuro = aumenta. La franja azul de la fila "Precipitación" en las 21 estaciones es el hallazgo central: El Niño consistentemente seca a Imbabura unos 3 meses después de su llegada al Pacífico tropical.'
              : 'The heatmap below shows how each climate variable responds to El Niño with different lags. Each cell is a correlation: dark blue = when El Niño arrives the variable decreases; dark red = increases. The blue band on the "Precipitation" row across all 21 stations is the central finding: El Niño consistently dries Imbabura some 3 months after its arrival in the tropical Pacific.'}
          </PlainBlock>
          <div className="mt-4">
            <ENSOHeatmapFull />
          </div>
        </article>

        {/* 4.4 */}
        <article className="grid lg:grid-cols-2 gap-8 items-start mb-12">
          <div>
            <h2 className="heading-3 mb-3 text-andean-deep">{t('s44_title')}</h2>
            <p className="body-lg">{t('s44_p')}</p>
            <PlainBlock>
              {isEs
                ? 'Antes de usar modelos climáticos para proyectar el futuro, hay que verificar que reproducen el pasado. La gráfica de la derecha muestra que los 10 modelos coinciden en la dirección del calentamiento observado, aunque con magnitudes algo distintas — un comportamiento normal y esperable.'
                : 'Before using climate models to project the future, we need to verify they reproduce the past. The chart on the right shows that the 10 models agree on the direction of observed warming, though with somewhat different magnitudes — normal and expected behaviour.'}
            </PlainBlock>
          </div>
          <figure>
            <img src={figureUrl('main', 'Figure_05.png')} alt="" className="w-full rounded-xl border border-slate-200 shadow-sm" loading="lazy" />
            <figcaption className="text-xs text-slate-500 mt-1 italic">{isEs ? 'Figura 5 · CMIP6 histórico vs observación' : 'Figure 5 · CMIP6 historical vs observation'}</figcaption>
          </figure>
        </article>

        {/* 4.5 Proyecciones */}
        <article className="mb-12">
          <h2 className="heading-3 mb-3 text-andean-deep">{t('s45_title')}</h2>
          <p className="body-lg max-w-3xl">{t('s45_p')}</p>
          <PlainBlock>
            {isEs
              ? 'Selecciona la variable climática que quieres ver. La línea muestra el cambio mediano del conjunto de 10 modelos hacia el horizonte 2041–2070, separado por banda altitudinal y por escenario de emisiones SSP (verde = optimista, ámbar = intermedio, rojo = pesimista). La banda sombreada alrededor de cada línea representa la incertidumbre entre los 10 modelos: cuanto más estrecha, más concuerdan.'
              : 'Select the climate variable you want to view. The line shows the median change across the 10-model ensemble towards the 2041–2070 horizon, split by altitudinal band and SSP emissions scenario (green = optimistic, amber = intermediate, red = pessimistic). The shaded band around each line represents the uncertainty across the 10 models: the narrower, the higher the agreement.'}
          </PlainBlock>
          <div className="mt-4">
            <CMIPProjectionLines />
          </div>
        </article>
      </section>
    </>
  );
}
