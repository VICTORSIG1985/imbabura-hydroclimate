'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import ModeSelector from './ModeSelector';
import Legend from './Legend';
import StationProfile from './StationProfile';
import ENSOHeatmap from './ENSOHeatmap';
import type { ViewerMode } from '@/types';
import { AlertCircle, MousePointer2, Lightbulb, Info, GitBranch, FileText, Database, Code2 } from 'lucide-react';

const ViewerMap = dynamic(() => import('./ViewerMap'), { ssr: false });

export default function ClimateViewer() {
  const tModes = useTranslations('viewer.modes');
  const t = useTranslations('viewer');
  const locale = useLocale() as 'es' | 'en';
  const [mode, setMode] = useState<ViewerMode>('A');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => setSelectedId(id);

  return (
    <div className="flex flex-col gap-4">
      {/* Selector + intro */}
      <div className="space-y-3">
        <ModeSelector active={mode} onChange={(m) => { setMode(m); }} />
        <div className="bg-andean-snow border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start">
          <div className="text-2xl shrink-0">
            {mode === 'A' && '🌎'}
            {mode === 'B' && '📈'}
            {mode === 'C' && '✓'}
            {mode === 'D' && '🌊'}
            {mode === 'E' && '🔭'}
            {mode === 'F' && '🔗'}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-andean-deep text-lg">{tModes(`${mode}.long`)}</h2>
            <p className="text-xs italic text-slate-600 mt-0.5">
              <strong>{tModes(`${mode}.question`)}</strong>
            </p>
            <p className="text-sm text-slate-700 mt-2">{tModes(`${mode}.intro`)}</p>

            {/* Bloque "para todos" */}
            <div className="mt-3 flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Lightbulb className="w-4 h-4 text-andean-water shrink-0 mt-0.5" />
              <p className="text-xs text-slate-800 leading-relaxed">{tModes(`${mode}.plain`)}</p>
            </div>

            {mode === 'E' && (
              <div className="mt-3 flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900">{tModes('E.warning')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Nota sobre estaciones de Carchi (visible en Modo A) */}
        {mode === 'A' && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 items-start">
            <Info className="w-5 h-5 text-andean-water shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-andean-deep text-sm mb-1">{t('carchi_note.title')}</p>
              <p className="text-xs text-slate-700 leading-relaxed">{t('carchi_note.body')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Mapa + Panel — full width */}
      {mode !== 'F' && (
        <div className="grid xl:grid-cols-[3fr_2fr] gap-4">
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white" style={{ minHeight: 640 }}>
            <ViewerMap mode={mode} onSelectStation={handleSelect} selectedId={selectedId} />
            <Legend mode={mode} />
          </div>
          <div className="flex flex-col gap-4 min-w-0">
            {!selectedId ? (
              <div className="bg-andean-snow border border-dashed border-andean-water rounded-xl p-8 text-center">
                <MousePointer2 className="w-12 h-12 text-andean-water mx-auto mb-3" />
                <p className="font-bold text-andean-deep text-base">
                  {locale === 'es' ? 'Haz clic en una estación' : 'Click on a station'}
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  {locale === 'es'
                    ? 'Se abrirá el perfil temporal con la serie histórica 1981–2025 y las proyecciones cada 5 años hasta 2070, en cada uno de los tres escenarios SSP.'
                    : 'A temporal profile will open with the 1981–2025 historical series and 5-year projections to 2070 under each of the three SSP scenarios.'}
                </p>
              </div>
            ) : (
              <StationProfile stationId={selectedId} onClose={() => setSelectedId(null)} />
            )}
            {mode === 'D' && <ENSOHeatmap />}
          </div>
        </div>
      )}

      {/* Modo F: Trazabilidad gráfica */}
      {mode === 'F' && <TraceabilityVisual locale={locale} />}
    </div>
  );
}

function TraceabilityVisual({ locale }: { locale: 'es' | 'en' }) {
  const isEs = locale === 'es';
  const steps = [
    {
      icon: <Database className="w-7 h-7" />,
      title_es: 'Dato fuente',
      title_en: 'Source data',
      desc_es: 'Anuario Meteorológico INAMHI 1994–2013, registros automáticos M0105 + M1240 2014–2025, productos satelitales CHIRPS, ERA5-Land y TerraClimate.',
      desc_en: 'INAMHI Meteorological Yearbook 1994–2013, M0105 + M1240 automatic records 2014–2025, CHIRPS, ERA5-Land and TerraClimate satellite products.',
      color: '#0a2540',
    },
    {
      icon: <Code2 className="w-7 h-7" />,
      title_es: 'Procedimiento',
      title_en: 'Procedure',
      desc_es: 'Control de calidad WMO (QC1, QC2, QC3), homogeneidad SNHT Alexandersson, Mann-Kendall + Theil-Sen + MMK Hamed-Rao, corrección FDR-BH, bootstrap con semilla = 42.',
      desc_en: 'WMO quality control (QC1, QC2, QC3), Alexandersson SNHT homogeneity, Mann-Kendall + Theil-Sen + MMK Hamed-Rao, FDR-BH correction, bootstrap with seed = 42.',
      color: '#1d4ed8',
    },
    {
      icon: <FileText className="w-7 h-7" />,
      title_es: 'Resultado intermedio',
      title_en: 'Intermediate output',
      desc_es: 'Series mensuales con calidad A, índices ETCCDI, correlaciones Spearman 588 tests ENSO, ensemble CMIP6 BASD-PE de 10 GCMs.',
      desc_en: 'Monthly series with quality A, ETCCDI indices, 588 Spearman ENSO tests, BASD-PE 10-GCM CMIP6 ensemble.',
      color: '#3a6e3a',
    },
    {
      icon: <GitBranch className="w-7 h-7" />,
      title_es: 'Resultado publicado',
      title_en: 'Published result',
      desc_es: 'Cifras y figuras del estudio, accesibles en el geoportal con código verificable y hash SHA-256 de los anuarios fuente.',
      desc_en: 'Study figures and tables, accessible in the geoportal with verifiable code and SHA-256 hash of source yearbooks.',
      color: '#92400e',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
      <h3 className="heading-3 text-andean-deep mb-2">
        {isEs ? 'Cadena de trazabilidad científica' : 'Scientific traceability chain'}
      </h3>
      <p className="text-sm text-slate-600 mb-8 max-w-3xl">
        {isEs
          ? 'Cada cifra del estudio puede recorrerse en sentido inverso: desde el resultado publicado hasta el dato bruto original. Esta cadena de cuatro eslabones es lo que permite que cualquier persona técnica reproduzca o cuestione cada hallazgo de forma independiente.'
          : 'Every figure in the study can be traced backwards: from the published result to the original raw data. This four-link chain enables any technical person to independently reproduce or question each finding.'}
      </p>

      <div className="grid md:grid-cols-4 gap-4 relative">
        {steps.map((s, i) => (
          <div key={i} className="relative">
            <div
              className="rounded-xl p-5 text-white shadow-lg h-full flex flex-col"
              style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-white/20 grid place-items-center shrink-0">{s.icon}</div>
                <div className="w-8 h-8 rounded-full bg-white text-andean-deep grid place-items-center font-extrabold text-lg shrink-0">{i + 1}</div>
              </div>
              <h4 className="font-bold text-lg mb-1">{isEs ? s.title_es : s.title_en}</h4>
              <p className="text-xs text-white/90 leading-relaxed">{isEs ? s.desc_es : s.desc_en}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-2 z-10 text-2xl text-slate-400 -translate-y-1/2 font-bold">→</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-3">
        <div className="card-dark text-center">
          <p className="text-2xl font-extrabold text-andean-snow">21</p>
          <p className="text-xs text-andean-snow/80">{isEs ? 'Estaciones rastreables' : 'Traceable stations'}</p>
        </div>
        <div className="card-dark text-center">
          <p className="text-2xl font-extrabold text-andean-snow">10</p>
          <p className="text-xs text-andean-snow/80">{isEs ? 'GCMs documentados' : 'Documented GCMs'}</p>
        </div>
        <div className="card-dark text-center">
          <p className="text-2xl font-extrabold text-andean-snow">SHA-256</p>
          <p className="text-xs text-andean-snow/80">{isEs ? 'Hashes verificables' : 'Verifiable hashes'}</p>
        </div>
      </div>
    </div>
  );
}
