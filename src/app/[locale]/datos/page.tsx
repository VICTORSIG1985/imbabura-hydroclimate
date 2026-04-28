import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import { Download, ExternalLink } from 'lucide-react';
import { dataUrl, docUrl, tableUrl } from '@/lib/assets';
import { SITE } from '@/data/config';
import type { Locale } from '@/i18n/config';

export default async function DataPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('data');

  const dataFiles = [
    { file: 'stations.geojson',         label: '21 estaciones INAMHI', size: '~17 KB' },
    { file: 'imbabura_boundary.geojson',label: 'Límite provincial',    size: '~1 KB' },
    { file: 'trends_per_station.json',  label: 'Tendencias 21×7 vars (T2)', size: '~40 KB' },
    { file: 'trends_summary.json',      label: 'Resumen MK + MMK (T3)',     size: '~4 KB' },
    { file: 'enso_per_station.json',    label: 'ENSO 588 tests (Spearman)', size: '~95 KB' },
    { file: 'enso_summary.json',        label: 'ENSO + FDR-BH (T4 + S7)',   size: '~11 KB' },
    { file: 'validation.json',          label: 'Cross-validation (T5)',     size: '~3 KB' },
    { file: 'climatology.json',         label: 'Climatología WMO (T6)',     size: '~7 KB' },
    { file: 'cmip6_projections.json',   label: 'CMIP6 SSP × banda (T7)',    size: '~16 KB' },
    { file: 'pixel_mapping.json',       label: 'Mapping ERA5 (S8)',         size: '~8 KB' },
    { file: 'gev_return_levels.json',   label: 'GEV bootstrap (S9)',        size: '~7 KB' },
    { file: 'traceability.json',        label: 'Trazabilidad (S10)',        size: '~8 KB' },
    { file: 'station_ranking.json',     label: 'Ranking sensibilidad',      size: '~5 KB' },
  ];

  return (
    <>
      <PageHero kicker="DAS · §3.6" title={t('title')} subtitle={t('subtitle')} variant="compact" />
      <section className="section">
        {/* Zenodo card */}
        <div className="card-dark mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="text-5xl">🏛️</div>
            <div className="flex-1">
              <h2 className="heading-3 text-white">{t('zenodo_card_title')}</h2>
              <p className="body-lg text-andean-snow/90 mt-1">{t('zenodo_card_desc')}</p>
              <a
                href={SITE.zenodoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 bg-white text-andean-deep hover:bg-andean-snow font-bold px-5 py-2.5 rounded-lg"
              >
                <ExternalLink className="w-4 h-4" /> DOI {SITE.doi}
              </a>
            </div>
          </div>
        </div>

        {/* Wiley submission package */}
        <h2 className="heading-3 text-andean-deep mb-3">Paquete de envío IJC</h2>
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <a href={tableUrl('Tables.xlsx')} download className="card hover:border-andean-water transition">
            <p className="text-xs uppercase font-bold text-slate-500">.xlsx</p>
            <p className="font-bold text-andean-deep mt-1">{t('tables_xlsx_title')}</p>
            <p className="text-xs text-slate-600 mt-1">{t('tables_xlsx_desc')}</p>
            <span className="inline-flex items-center gap-1 text-xs text-andean-water mt-2"><Download className="w-3 h-3"/> Descargar</span>
          </a>
          <a href={docUrl('Manuscript.docx')} download className="card hover:border-andean-water transition">
            <p className="text-xs uppercase font-bold text-slate-500">.docx</p>
            <p className="font-bold text-andean-deep mt-1">{t('manuscript_title')}</p>
            <p className="text-xs text-slate-600 mt-1">{t('manuscript_desc')}</p>
            <span className="inline-flex items-center gap-1 text-xs text-andean-water mt-2"><Download className="w-3 h-3"/> Descargar</span>
          </a>
          <a href={docUrl('Supporting_Information.docx')} download className="card hover:border-andean-water transition">
            <p className="text-xs uppercase font-bold text-slate-500">.docx</p>
            <p className="font-bold text-andean-deep mt-1">{t('supp_title')}</p>
            <p className="text-xs text-slate-600 mt-1">{t('supp_desc')}</p>
            <span className="inline-flex items-center gap-1 text-xs text-andean-water mt-2"><Download className="w-3 h-3"/> Descargar</span>
          </a>
        </div>

        {/* Geoportal layers */}
        <h2 className="heading-3 text-andean-deep mb-3">{t('geoportal_files_title')}</h2>
        <div className="grid gap-2">
          {dataFiles.map(({ file, label, size }) => (
            <a
              key={file}
              href={dataUrl(file)}
              download
              className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-andean-water transition"
            >
              <span className="text-xs bg-andean-snow text-andean-deep font-mono px-2 py-1 rounded">{file.split('.').pop()?.toUpperCase()}</span>
              <span className="flex-1 text-sm font-semibold text-slate-800">{label}</span>
              <span className="text-xs text-slate-500">{size}</span>
              <span className="font-mono text-xs text-slate-500 hidden sm:inline">{file}</span>
              <Download className="w-4 h-4 text-andean-water" />
            </a>
          ))}
        </div>

        {/* Cite */}
        <div className="card mt-6">
          <h3 className="font-bold text-andean-deep mb-2">{t('cite')}</h3>
          <p className="text-xs font-mono bg-slate-50 border border-slate-200 rounded p-3 leading-relaxed">
            Pinto-Páez, V. H. (2026). Hydroclimatic trends, ENSO teleconnection, and CMIP6 projections in
            Imbabura Province, Ecuador: a traceable regional hydroclimatic baseline with projected
            elevation-dependent warming, 1981–2070. <em>International Journal of Climatology</em>
            [under review]. Zenodo. {SITE.zenodoUrl}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="pill">CC-BY-4.0</span>
            <span className="pill">ORCID 0009-0001-5573-8294</span>
            <span className="pill">Wiley · Royal Meteorological Society</span>
          </div>
        </div>
      </section>
    </>
  );
}
