'use client';
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';
import { dataUrl } from '@/lib/assets';
import { X, TrendingUp, Mountain, Calendar, AlertCircle } from 'lucide-react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface YearVal { year: number; value: number; iqr_low?: number; iqr_high?: number }
interface StationTS {
  id: string; name: string; elevation_m: number; band: 'B1' | 'B2' | 'B3';
  historical: { Tmean: YearVal[]; Precip: YearVal[] };
  projections: Record<'ssp126' | 'ssp370' | 'ssp585', { Tmean: YearVal[]; Precip: YearVal[] }>;
  baseline_1991_2020: { Tmean: number; Precip: number };
  trends: { Tmean_sen: number; Tmean_significant: boolean; Precip_sen: number; Precip_significant: boolean };
}

interface Props {
  stationId: string;
  onClose: () => void;
  allStations?: Record<string, StationTS>;
}

const SSP_COLORS = { ssp126: '#16a34a', ssp370: '#f59e0b', ssp585: '#dc2626' };
const BAND_COLORS = { B1: '#dc2626', B2: '#f59e0b', B3: '#16a34a' };

export default function StationProfile({ stationId, onClose, allStations }: Props) {
  const locale = useLocale() as 'es' | 'en';
  const t = useTranslations('viewer');
  const [data, setData] = useState<Record<string, StationTS> | null>(allStations || null);
  const [variable, setVariable] = useState<'Tmean' | 'Precip'>('Tmean');

  useEffect(() => {
    if (data) return;
    fetch(dataUrl('station_timeseries.json')).then(r => r.json()).then(setData);
  }, [data]);

  const station = data?.[stationId];

  // Posición en gradiente altitudinal — calculada SIEMPRE para no romper hooks
  const allList = useMemo(() => {
    if (!data) return [] as StationTS[];
    return Object.values(data).sort((a, b) => b.elevation_m - a.elevation_m);
  }, [data]);

  if (!station) return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-center min-h-[300px]">
      <p className="text-sm text-slate-500 animate-pulse">
        {locale === 'es' ? 'Cargando perfil de estación…' : 'Loading station profile…'}
      </p>
    </div>
  );

  const isTemp = variable === 'Tmean';
  const unit = isTemp ? '°C' : 'mm';
  const labelEs = isTemp ? 'Temperatura media anual' : 'Precipitación anual';
  const labelEn = isTemp ? 'Annual mean temperature' : 'Annual precipitation';
  const label = locale === 'es' ? labelEs : labelEn;

  // === Trazas Plotly ===
  const traces: any[] = [];

  // Histórica
  const hist = station.historical[variable];
  traces.push({
    x: hist.map(d => d.year),
    y: hist.map(d => d.value),
    type: 'scatter',
    mode: 'lines+markers',
    name: locale === 'es' ? 'Observado 1981–2025' : 'Observed 1981–2025',
    line: { color: '#0a2540', width: 2.5 },
    marker: { size: 4, color: '#0a2540' },
    hovertemplate: `<b>%{x}</b><br>${unit === '°C' ? '%{y:.2f}' : '%{y:.0f}'} ${unit}<extra></extra>`,
  });

  // Proyecciones por SSP (líneas + bandas IQR)
  (['ssp126', 'ssp370', 'ssp585'] as const).forEach(ssp => {
    const proj = station.projections[ssp][variable];
    const color = SSP_COLORS[ssp];
    const sspLabel = ssp.replace('ssp', 'SSP').replace(/SSP(\d)(\d+)/, 'SSP$1-$2');
    // Banda IQR como polígono
    if (proj[0]?.iqr_low !== undefined) {
      traces.push({
        x: [...proj.map(d => d.year), ...proj.map(d => d.year).reverse()],
        y: [...proj.map(d => d.iqr_high!), ...proj.map(d => d.iqr_low!).reverse()],
        type: 'scatter',
        fill: 'toself',
        fillcolor: color + '20',
        line: { color: 'transparent' },
        showlegend: false,
        hoverinfo: 'skip',
      });
    }
    // Línea proyección
    traces.push({
      x: proj.map(d => d.year),
      y: proj.map(d => d.value),
      type: 'scatter',
      mode: 'lines+markers',
      name: sspLabel,
      line: { color, width: 2, dash: ssp === 'ssp126' ? 'solid' : ssp === 'ssp370' ? 'dash' : 'dot' },
      marker: { size: 6, color, symbol: ssp === 'ssp126' ? 'circle' : ssp === 'ssp370' ? 'diamond' : 'square' },
      hovertemplate: `<b>${sspLabel} %{x}</b><br>${unit === '°C' ? '%{y:.2f}' : '%{y:.0f}'} ${unit}<extra></extra>`,
    });
  });

  // === Resumen quick-stats ===
  const histStart = hist[0]?.value;
  const histEnd = hist[hist.length - 1]?.value;
  const obsChange = histEnd - histStart;
  const proj585 = station.projections.ssp585[variable];
  const projEnd = proj585[proj585.length - 1]?.value;
  const projChange = projEnd - histEnd;

  const idx = allList.findIndex(s => s.id === station.id);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-andean-deep to-andean-water text-white p-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-andean-snow/80 font-bold">
            {locale === 'es' ? 'Perfil temporal de estación' : 'Station temporal profile'}
          </p>
          <h3 className="text-xl font-bold mt-0.5">{station.name}</h3>
          <p className="text-xs text-andean-snow/80 mt-0.5 flex items-center gap-3 flex-wrap">
            <span className="font-mono">{station.id}</span>
            <span className="flex items-center gap-1"><Mountain className="w-3 h-3" /> {station.elevation_m.toLocaleString('en')} m</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: BAND_COLORS[station.band] }}>
              {station.band}
            </span>
          </p>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10 transition shrink-0" aria-label="close">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Selector de variable */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setVariable('Tmean')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${variable === 'Tmean' ? 'bg-andean-deep text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {locale === 'es' ? 'Temperatura media' : 'Mean temperature'}
          </button>
          <button
            onClick={() => setVariable('Precip')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${variable === 'Precip' ? 'bg-andean-deep text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {locale === 'es' ? 'Precipitación' : 'Precipitation'}
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid sm:grid-cols-3 gap-2 mb-3">
          <Stat
            icon={<Calendar className="w-4 h-4" />}
            label={locale === 'es' ? 'Cambio observado 1981→2025' : 'Observed change 1981→2025'}
            value={
              isTemp && !station.trends.Tmean_significant
                ? (locale === 'es' ? 'Sin tendencia detectable' : 'No detectable trend')
                : `${obsChange >= 0 ? '+' : ''}${obsChange.toFixed(isTemp ? 2 : 0)} ${unit}`
            }
            sub={`${histStart?.toFixed(isTemp ? 1 : 0)} → ${histEnd?.toFixed(isTemp ? 1 : 0)} ${unit}`}
            tone={
              isTemp && !station.trends.Tmean_significant ? 'slate' :
              obsChange > 0 && isTemp ? 'red' :
              obsChange > 0 ? 'blue' : 'slate'
            }
          />
          <Stat
            icon={<TrendingUp className="w-4 h-4" />}
            label={locale === 'es' ? 'Pendiente Theil-Sen' : 'Theil-Sen slope'}
            value={`${(isTemp ? station.trends.Tmean_sen : station.trends.Precip_sen) >= 0 ? '+' : ''}${(isTemp ? station.trends.Tmean_sen : station.trends.Precip_sen).toExponential(2)} ${unit}/año`}
            sub={(isTemp ? station.trends.Tmean_significant : station.trends.Precip_significant) ? (locale === 'es' ? '✓ Significativa (p<0.05)' : '✓ Significant (p<0.05)') : (locale === 'es' ? '○ No significativa' : '○ Not significant')}
            tone="andean"
          />
          <Stat
            icon={<Mountain className="w-4 h-4" />}
            label={locale === 'es' ? 'Proyección 2070 (SSP5-8.5)' : 'Projection 2070 (SSP5-8.5)'}
            value={`${projEnd?.toFixed(isTemp ? 1 : 0)} ${unit}`}
            sub={`${projChange >= 0 ? '+' : ''}${projChange.toFixed(isTemp ? 2 : 0)} ${unit} ${locale === 'es' ? 'vs 2025' : 'vs 2025'}`}
            tone="red"
          />
        </div>

        {/* NOTA EXPLICATIVA — solo para temperatura */}
        {isTemp && (
          <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>{locale === 'es' ? 'Importante: ' : 'Important: '}</strong>
              {locale === 'es'
                ? 'Las temperaturas mostradas provienen de la celda del reanálisis ERA5-Land (~9 × 9 km) que contiene esta estación, no son temperaturas medidas directamente en el sitio. Sobre el valle interandino, este producto presenta diferencias respecto a los registros in-situ (puede mostrar valores menores en algunos píxeles). Lo que SÍ es confiable son las TENDENCIAS temporales, porque el desfase sistemático se cancela al calcular cambios año a año. Por eso este geoportal usa estos datos para detectar el calentamiento, no para reportar la temperatura puntual del sitio.'
                : 'Temperatures shown come from the ERA5-Land reanalysis grid cell (~9 × 9 km) containing this station; they are not directly measured in-situ. Over the inter-Andean valley this product shows differences with respect to in-situ records (some pixels may show lower values). What IS reliable are the temporal TRENDS, because the systematic offset cancels when computing year-to-year changes. That is why this geoportal uses this data to detect warming, not to report the site\'s exact local temperature.'}
            </p>
          </div>
        )}
      </div>

      {/* Plot */}
      <div className="p-4">
        <Plot
          data={traces}
          layout={{
            height: 360,
            margin: { l: 55, r: 20, t: 10, b: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: '#fafafa',
            xaxis: {
              title: { text: locale === 'es' ? 'Año' : 'Year' },
              gridcolor: '#e5e7eb',
              range: [1980, 2071],
            } as any,
            yaxis: {
              title: { text: `${label} (${unit})` },
              gridcolor: '#e5e7eb',
            } as any,
            shapes: [
              // Línea vertical 2025
              {
                type: 'line', x0: 2025, x1: 2025,
                yref: 'paper', y0: 0, y1: 1,
                line: { color: '#94a3b8', width: 1.5, dash: 'dot' },
              },
            ],
            annotations: [
              {
                x: 2025, y: 1.02, yref: 'paper',
                text: locale === 'es' ? '← Observado · Proyectado →' : '← Observed · Projected →',
                showarrow: false,
                font: { size: 10, color: '#64748b' },
              },
            ],
            legend: { orientation: 'h', y: -0.18, font: { size: 11 } },
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%' }}
        />

        {/* Gradiente altitudinal */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1">
            <Mountain className="w-3 h-3" />
            {locale === 'es' ? 'Posición en el gradiente altitudinal de Imbabura' : 'Position in Imbabura altitudinal gradient'}
          </p>
          <AltitudinalGradient stations={allList} currentId={station.id} idx={idx} locale={locale} />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, sub, tone = 'slate' }: {
  icon: React.ReactNode; label: string; value: string; sub?: string;
  tone?: 'red' | 'blue' | 'slate' | 'andean';
}) {
  const tones: Record<string, string> = {
    red: 'bg-red-50 border-red-200 text-red-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    slate: 'bg-slate-50 border-slate-200 text-slate-800',
    andean: 'bg-andean-snow border-slate-200 text-andean-deep',
  };
  return (
    <div className={`flex flex-col p-2.5 rounded-lg border ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wide opacity-80">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-lg font-extrabold mt-1 leading-tight">{value}</div>
      {sub && <div className="text-[10px] opacity-70 mt-0.5">{sub}</div>}
    </div>
  );
}

function AltitudinalGradient({ stations, currentId, idx, locale }:
  { stations: StationTS[]; currentId: string; idx: number; locale: 'es' | 'en' }) {
  if (!stations.length) return null;
  // Strip lineal con 21 puntos coloreados por banda
  return (
    <div className="space-y-1">
      <div className="relative h-10 bg-gradient-to-r from-band-B3 via-band-B2 to-band-B1 rounded-lg flex items-center">
        {stations.map((s, i) => {
          const left = (i / (stations.length - 1)) * 100;
          const isCurrent = s.id === currentId;
          return (
            <div
              key={s.id}
              className="absolute -translate-x-1/2"
              style={{ left: `${left}%` }}
              title={`${s.name} (${s.elevation_m} m)`}
            >
              <div className={`rounded-full border-2 ${isCurrent ? 'w-5 h-5 bg-white border-andean-deep shadow-lg' : 'w-2 h-2 bg-white/60 border-white/80'}`} />
              {isCurrent && (
                <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-andean-deep bg-white px-1.5 rounded shadow">
                  {s.elevation_m} m
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-slate-600 font-mono pt-1">
        <span>{stations[stations.length - 1]?.elevation_m} m · {locale === 'es' ? 'mín' : 'min'}</span>
        <span className="text-slate-400">
          {locale === 'es' ? `${idx + 1} de ${stations.length}` : `${idx + 1} of ${stations.length}`}
        </span>
        <span>{stations[0]?.elevation_m} m · {locale === 'es' ? 'máx' : 'max'}</span>
      </div>
    </div>
  );
}
