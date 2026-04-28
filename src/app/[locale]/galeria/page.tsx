import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import { figureUrl } from '@/lib/assets';
import { FIGURES } from '@/data/config';
import type { Locale } from '@/i18n/config';

const MAIN_CAPTIONS_ES: Record<number, string> = {
  1: 'Mapa de las 21 estaciones INAMHI con bandas altitudinales y límite provincial.',
  2: 'Tendencias Mann-Kendall: precipitación CHIRPS (izq.) y Tmean ERA5-Land (der.) 1981–2025.',
  3: 'Lapse rate altitudinal in-situ: −8.24 °C/km (R²=0.97, n=7).',
  4: 'Correlación Spearman ONI vs CHIRPS por estación; lag-3 dominante.',
  5: 'CMIP6 histórico vs observaciones: tendencias por banda con 100 % acuerdo de signo.',
  6: 'Bias absoluto CMIP6 vs ERA5-Land 1991–2010 por banda altitudinal.',
  7: 'Contraste ENSO CMIP6 vs observaciones; GCMs subestiman la teleconexión.',
  8: 'Proyecciones CMIP6 2041–2070 por SSP (cambios mediano + IQR).',
  9: 'EDW signature: amplificación altitudinal del calentamiento por SSP.',
  10: 'Sen slope CMIP6 por banda altitudinal: confirmación EDW.',
};

const SI_CAPTIONS_ES: Record<number, string> = {
  1: 'Heatmap de cobertura temporal de los registros mensuales INAMHI 1994–2013.',
  2: 'Climatología WMO 1991–2020 mensual de CHIRPS por banda altitudinal.',
  3: 'Tendencias MK + Theil-Sen para Tmax y Tmin (ERA5-Land 1981–2025).',
  4: 'Tendencias MK + Theil-Sen para humedad relativa y PET.',
  5: 'Tendencia MK + Theil-Sen del PDSI (TerraClimate 1981–2024).',
  6: 'Distribución de PDSI por fase ENSO (Niño, Neutral, Niña) y banda altitudinal.',
  7: 'Diagrama de Taylor del ensemble BASD-CMIP6-PE vs ERA5-Land/CHIRPS, 1991–2010.',
  8: 'Niveles de retorno GEV para Rx1day y Rx5day (CHIRPS diario).',
  9: 'Tendencias MOD16A2GF de PET y ET por banda altitudinal, 2001–2024.',
  10: 'Índices ETCCDI (Rx1day, Rx5day, R95p, CDD, PRCPTOT) sobre CHIRPS diario.',
  11: 'Coherencia wavelet entre ONI y CHIRPS PRCPTOT regional.',
  12: 'Señal EDW por escenario SSP en proyecciones CMIP6 2041–2070.',
};

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('gallery');
  const isEs = locale === 'es';

  return (
    <>
      <PageHero kicker="22 figures" title={t('title')} subtitle={t('subtitle')} variant="compact" />
      <section className="section">
        <h2 className="heading-3 text-andean-deep mb-4">{t('main_title')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {FIGURES.main.map(f => (
            <figure key={f.id} className="card overflow-hidden p-0 group">
              <a href={figureUrl('main', f.filename)} target="_blank" rel="noopener noreferrer">
                <img src={figureUrl('main', f.filename)} alt={`Figure ${f.number}`} className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" />
              </a>
              <figcaption className="p-3">
                <p className="text-xs font-mono text-slate-500">Figure {f.number}</p>
                <p className="text-sm text-slate-700 mt-1 leading-snug">{isEs ? MAIN_CAPTIONS_ES[f.number] : `See main manuscript Figure ${f.number}.`}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 className="heading-3 text-andean-deep mb-4">{t('si_title')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FIGURES.si.map(f => (
            <figure key={f.id} className="card overflow-hidden p-0 group">
              <a href={figureUrl('si', f.filename)} target="_blank" rel="noopener noreferrer">
                <img src={figureUrl('si', f.filename)} alt={`Figure S${f.number}`} className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" />
              </a>
              <figcaption className="p-3">
                <p className="text-xs font-mono text-slate-500">Figure S{f.number}</p>
                <p className="text-sm text-slate-700 mt-1 leading-snug">{isEs ? SI_CAPTIONS_ES[f.number] : `Supporting Information Figure S${f.number}.`}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
