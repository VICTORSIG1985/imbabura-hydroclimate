'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import ModeSelector from './ModeSelector';
import Legend from './Legend';
import SciencePanel, { type PanelEntry } from '../SciencePanel';
import ENSOHeatmap from './ENSOHeatmap';
import TraceabilityTable from '../TraceabilityTable';
import type { ViewerMode } from '@/types';
import { dataUrl } from '@/lib/assets';
import { AlertCircle } from 'lucide-react';

const ViewerMap = dynamic(() => import('./ViewerMap'), { ssr: false });

export default function ClimateViewer() {
  const t = useTranslations('viewer');
  const tModes = useTranslations('viewer.modes');
  const [mode, setMode] = useState<ViewerMode>('A');
  const [panel, setPanel] = useState<PanelEntry>({});

  const handleSelect = (id: string, props: Record<string, unknown>) => {
    const elev = props.elevation_m as number;
    const band = props.band as string;
    const warming = props.warming_rate as number | null;
    const ensoRho = props.enso_max_rho as number | null;
    const name = props.name as string;
    const canton = props.canton as string;

    const M = (sub: string) => tModes(`${mode}.${sub}`);
    const entries: Record<ViewerMode, PanelEntry> = {
      A: {
        keyFinding: tModes('A.interp'),
        variable: `${name} (${id})`,
        value: `${elev.toLocaleString('en')} m · banda ${band}`,
        source: 'INAMHI · CHIRPS · ERA5-Land',
        period: '1991–2020',
        interpretation: `Estación ${name} (${canton}). Banda altitudinal ${band} (${
          band === 'B1' ? '<2000 m' : band === 'B2' ? '2000–2800 m' : '>2800 m'
        }).`,
        limitation: (props.shared_pixel as boolean) ? `Comparte píxel ERA5-Land con: ${(props.shared_with as string[]).join(', ')}` : undefined,
        downloadUrl: dataUrl('stations.geojson'),
      },
      B: {
        keyFinding: tModes('B.interp'),
        variable: `Tmean · ${name}`,
        value: warming != null ? `Sen = ${warming.toFixed(4)} °C/yr (${(warming * 44).toFixed(2)} °C en 44 yr)` : '—',
        significance: 'Mann-Kendall + Theil-Sen + MMK',
        source: 'ERA5-Land',
        period: '1981–2025',
        interpretation: `Tendencia per-estación; en agregación de 16 píxeles independientes, 14 (88 %) son significativas.`,
        downloadUrl: dataUrl('trends_per_station.json'),
        traceabilityHref: `#T2-${id}`,
      },
      C: {
        keyFinding: tModes('C.interp'),
        variable: `${name} (${id})`,
        value: id === 'M1240' ? 'CHIRPS: Adecuado · ERA5: Limitado magnitud' : id === 'M0105' ? 'CHIRPS: Limitado · ERA5: No para magnitud abs.' : '— sin validación cruzada',
        source: 'INAMHI vs CHIRPS / ERA5',
        period: '2014–2025',
        interpretation: 'Solo M0105 y M1240 disponen de registro automático contemporáneo con productos gridded.',
        downloadUrl: dataUrl('validation.json'),
      },
      D: {
        keyFinding: tModes('D.interp'),
        variable: `Precip-ONI · ${name}`,
        value: ensoRho != null ? `|ρ| máx = ${Math.abs(ensoRho).toFixed(3)} (${ensoRho >= 0 ? '+' : '−'})` : '—',
        significance: 'Spearman + FDR-BH q<0.05',
        source: 'CHIRPS vs ONI',
        period: '1981–2025',
        interpretation: 'Correlación negativa precip-ONI en las 21 estaciones (mediana ρ=−0.23, lag-3 dominante).',
        downloadUrl: dataUrl('enso_per_station.json'),
      },
      E: {
        keyFinding: tModes('E.interp'),
        variable: `Banda ${band}`,
        value: '+1.09 a +2.11 °C al 2041–2070',
        significance: '100 % acuerdo de signo (10 GCMs)',
        source: 'BASD-CMIP6-PE · 10 GCMs',
        period: '2041–2070 vs 1991–2010',
        interpretation: tModes('E.interp'),
        limitation: tModes('E.warning'),
        downloadUrl: dataUrl('cmip6_projections.json'),
      },
      F: {
        keyFinding: tModes('F.interp'),
        downloadUrl: dataUrl('traceability.json'),
      },
    };
    setPanel(entries[mode]);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Modo + intro */}
      <div className="space-y-3">
        <ModeSelector active={mode} onChange={(m) => { setMode(m); setPanel({}); }} />
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

      {/* Mapa + Panel */}
      {mode !== 'F' ? (
        <div className="grid lg:grid-cols-[1fr_320px] gap-4 flex-1 min-h-[600px]">
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white">
            <ViewerMap mode={mode} onSelectStation={handleSelect} />
            <Legend mode={mode} />
          </div>
          <div className="flex flex-col gap-4">
            <SciencePanel entry={panel} />
            {mode === 'D' && <ENSOHeatmap />}
          </div>
        </div>
      ) : (
        <TraceabilityTable />
      )}
    </div>
  );
}
