import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import { Download, ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import { dataUrl, docUrl, tableUrl } from '@/lib/assets';
import { SITE } from '@/data/config';
import type { Locale } from '@/i18n/config';

export default async function DataPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('data');
  const isEs = locale === 'es';

  const dataFiles = [
    { file: 'stations.geojson',         label: isEs ? '21 estaciones INAMHI' : '21 INAMHI stations',                        size: '~17 KB' },
    { file: 'imbabura_boundary.geojson',label: isEs ? 'Límite provincial' : 'Provincial boundary',                          size: '~1 KB' },
    { file: 'trends_per_station.json',  label: isEs ? 'Tendencias 21×7 vars (T2)' : 'Trends 21×7 vars (T2)',                size: '~40 KB' },
    { file: 'trends_summary.json',      label: isEs ? 'Resumen MK + MMK (T3)' : 'MK + MMK summary (T3)',                    size: '~4 KB' },
    { file: 'enso_per_station.json',    label: isEs ? 'ENSO 588 tests (Spearman)' : 'ENSO 588 tests (Spearman)',            size: '~95 KB' },
    { file: 'enso_summary.json',        label: isEs ? 'ENSO + FDR-BH (T4 + S7)' : 'ENSO + FDR-BH (T4 + S7)',                size: '~11 KB' },
    { file: 'validation.json',          label: isEs ? 'Validación cruzada (T5)' : 'Cross-validation (T5)',                  size: '~3 KB' },
    { file: 'climatology.json',         label: isEs ? 'Climatología WMO (T6)' : 'WMO climatology (T6)',                     size: '~7 KB' },
    { file: 'cmip6_projections.json',   label: isEs ? 'CMIP6 SSP × banda (T7)' : 'CMIP6 SSP × band (T7)',                   size: '~16 KB' },
    { file: 'pixel_mapping.json',       label: isEs ? 'Mapping ERA5 (S8)' : 'ERA5 mapping (S8)',                            size: '~8 KB' },
    { file: 'gev_return_levels.json',   label: isEs ? 'GEV bootstrap (S9)' : 'GEV bootstrap (S9)',                          size: '~7 KB' },
    { file: 'station_ranking.json',     label: isEs ? 'Ranking sensibilidad' : 'Sensitivity ranking',                       size: '~5 KB' },
    { file: 'validation_certificate.json', label: isEs ? 'Certificado de validación (auditoría DS)' : 'Validation certificate (DS audit)', size: '~10 KB' },
  ];

  return (
    <>
      <PageHero kicker="DAS" title={t('title')} subtitle={t('subtitle')} variant="compact" />
      <section className="section">
        {/* Zenodo card */}
        <div className="card-dark mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <FileText className="w-12 h-12 text-andean-snow shrink-0" />
            <div className="flex-1">
              <h2 className="heading-3 text-white">{isEs ? 'Manuscrito de referencia (Zenodo)' : 'Reference manuscript (Zenodo)'}</h2>
              <p className="body-lg text-andean-snow/90 mt-1">
                {isEs
                  ? 'Versión enviada al International Journal of Climatology, archivada con DOI persistente.'
                  : 'Version submitted to the International Journal of Climatology, archived with persistent DOI.'}
              </p>
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
        <h2 className="heading-3 text-andean-deep mb-3">{isEs ? 'Paquete de envío IJC' : 'IJC submission package'}</h2>
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <a href={tableUrl('Tables.xlsx')} download className="card hover:border-andean-water transition">
            <p className="text-xs uppercase font-bold text-slate-500">.xlsx</p>
            <p className="font-bold text-andean-deep mt-1">{t('tables_xlsx_title')}</p>
            <p className="text-xs text-slate-600 mt-1">{t('tables_xlsx_desc')}</p>
            <span className="inline-flex items-center gap-1 text-xs text-andean-water mt-2"><Download className="w-3 h-3"/> {isEs ? 'Descargar' : 'Download'}</span>
          </a>
          <a href={docUrl('Manuscript.docx')} download className="card hover:border-andean-water transition">
            <p className="text-xs uppercase font-bold text-slate-500">.docx</p>
            <p className="font-bold text-andean-deep mt-1">{t('manuscript_title')}</p>
            <p className="text-xs text-slate-600 mt-1">{t('manuscript_desc')}</p>
            <span className="inline-flex items-center gap-1 text-xs text-andean-water mt-2"><Download className="w-3 h-3"/> {isEs ? 'Descargar' : 'Download'}</span>
          </a>
          <a href={docUrl('Supporting_Information.docx')} download className="card hover:border-andean-water transition">
            <p className="text-xs uppercase font-bold text-slate-500">.docx</p>
            <p className="font-bold text-andean-deep mt-1">{t('supp_title')}</p>
            <p className="text-xs text-slate-600 mt-1">{t('supp_desc')}</p>
            <span className="inline-flex items-center gap-1 text-xs text-andean-water mt-2"><Download className="w-3 h-3"/> {isEs ? 'Descargar' : 'Download'}</span>
          </a>
        </div>

        {/* Geoportal layers */}
        <h2 className="heading-3 text-andean-deep mb-3">{t('geoportal_files_title')}</h2>
        <div className="grid gap-2 mb-6">
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
              <Download className="w-4 h-4 text-andean-water" />
            </a>
          ))}
        </div>

        {/* Términos de uso */}
        <div className="card border-andean-water bg-blue-50/40">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-andean-water shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-andean-deep mb-1">{isEs ? 'Términos de uso' : 'Terms of use'}</h3>
              <p className="text-sm text-slate-700">
                {isEs
                  ? 'Los archivos publicados en este geoportal se distribuyen bajo licencia '
                  : 'Files published in this geoportal are distributed under licence '}
                <a href={SITE.licenseUrl} target="_blank" rel="noopener noreferrer" className="link-cta font-semibold">{SITE.license}</a>
                {isEs
                  ? ' (consulta científica y académica · prohibido uso comercial · obligación de compartir bajo la misma licencia). Los datos primarios pertenecen al INAMHI; este geoportal no redistribuye registros crudos diarios u horarios.'
                  : ' (scientific and academic consultation · commercial use prohibited · share-alike obligation). Primary data belong to INAMHI; this geoportal does not redistribute raw daily or hourly records.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
