'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import ModeSelector from './ModeSelector';
import Legend from './Legend';
import StationProfile from './StationProfile';
import ENSOHeatmap from './ENSOHeatmap';
import type { ViewerMode } from '@/types';
import { AlertCircle, MousePointer2 } from 'lucide-react';

const ViewerMap = dynamic(() => import('./ViewerMap'), { ssr: false });

export default function ClimateViewer() {
  const tModes = useTranslations('viewer.modes');
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
            {mode === 'E' && (
              <div className="mt-3 flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900">{tModes('E.warning')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mapa */}
      {mode !== 'F' && (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white" style={{ minHeight: 520 }}>
            <ViewerMap mode={mode} onSelectStation={handleSelect} selectedId={selectedId} />
            <Legend mode={mode} />
          </div>
          <div className="flex flex-col gap-4">
            {!selectedId ? (
              <div className="bg-andean-snow border border-dashed border-andean-water rounded-xl p-6 text-center">
                <MousePointer2 className="w-10 h-10 text-andean-water mx-auto mb-2" />
                <p className="font-bold text-andean-deep text-sm">
                  {locale === 'es' ? 'Haz clic en una estación' : 'Click on a station'}
                </p>
                <p className="text-xs text-slate-600 mt-1">
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

      {/* Modo F: trazabilidad oculta del usuario · contenido eliminado */}
      {mode === 'F' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-andean-deep mb-2">{tModes('F.long')}</h3>
          <p className="text-sm text-slate-700">
            {locale === 'es'
              ? 'Cada cifra del estudio se ancla a un dato fuente verificable. Esa cadena de procedencia se documenta como parte de la auditoría científica del geoportal — consulta la página de Validación científica para los detalles del proceso.'
              : 'Every figure of the study is anchored to a verifiable source data point. That provenance chain is documented as part of the geoportal\'s scientific audit — see the Scientific Validation page for process details.'}
          </p>
        </div>
      )}
    </div>
  );
}
