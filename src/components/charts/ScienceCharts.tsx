'use client';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { dataUrl } from '@/lib/assets';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// =====================================================================
// 1. ENSO HEATMAP COMPLETO — 21 estaciones × (7 vars × 4 lags) = 21 × 28
// =====================================================================
interface ENSOFull {
  station_id: string;
  variable: string;
  lag_months: number;
  rho: number;
  significant_raw: boolean;
}

interface StationFeature {
  properties: { id: string; name: string; elevation_m: number; band: string };
}

const VAR_ORDER = ['PRECIP_CHIRPS_mm', 'TMED_ERA5_C', 'TMAX_ERA5_C', 'TMIN_ERA5_C', 'HR_ERA5_pct', 'ETP_TERRA_mm', 'PDSI_TERRA'];
const VAR_SHORT_ES: Record<string, string> = {
  PRECIP_CHIRPS_mm: 'Precip', TMED_ERA5_C: 'Tmed', TMAX_ERA5_C: 'Tmax',
  TMIN_ERA5_C: 'Tmin', HR_ERA5_pct: 'HR', ETP_TERRA_mm: 'PET', PDSI_TERRA: 'PDSI',
};

export function ENSOHeatmapFull() {
  const t = useTranslations('viewer.modes');
  const locale = useLocale() as 'es' | 'en';
  const [enso, setEnso] = useState<ENSOFull[]>([]);
  const [stations, setStations] = useState<StationFeature[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(dataUrl('enso_per_station.json')).then(r => r.json()),
      fetch(dataUrl('stations.geojson')).then(r => r.json()),
    ]).then(([e, s]) => { setEnso(e); setStations(s.features); });
  }, []);

  if (!enso.length || !stations.length) return <SkeletonChart h={500} />;

  // Estaciones por altitud descendente
  const sortedStations = [...stations].sort((a, b) => b.properties.elevation_m - a.properties.elevation_m);
  const stationLabels = sortedStations.map(s => `${s.properties.id} ${s.properties.name.slice(0, 12)}`);

  // x = (var, lag)  -> 28 columnas
  const xLabels: string[] = [];
  VAR_ORDER.forEach(v => [0, 1, 2, 3].forEach(l => xLabels.push(`${VAR_SHORT_ES[v]}·L${l}`)));

  // z[y][x]
  const z: (number | null)[][] = [];
  const text: string[][] = [];
  sortedStations.forEach(s => {
    const row: (number | null)[] = [];
    const tRow: string[] = [];
    VAR_ORDER.forEach(v => {
      [0, 1, 2, 3].forEach(l => {
        const r = enso.find(x => x.station_id === s.properties.id && x.variable === v && x.lag_months === l);
        if (r) {
          row.push(r.rho);
          tRow.push(`${s.properties.name}<br>${VAR_SHORT_ES[v]} · lag-${l}<br>ρ=${r.rho.toFixed(3)}${r.significant_raw ? ' ★' : ''}`);
        } else { row.push(null); tRow.push('—'); }
      });
    });
    z.push(row); text.push(tRow);
  });

  return (
    <div className="card">
      <h4 className="font-bold text-andean-deep">
        {locale === 'es' ? 'Heatmap ENSO completo · 21 estaciones × 7 variables × 4 rezagos' : 'Full ENSO heatmap · 21 stations × 7 variables × 4 lags'}
      </h4>
      <p className="text-xs text-slate-500 mb-3">
        {locale === 'es'
          ? '588 correlaciones Spearman ρ entre el índice ONI y series locales. Estaciones ordenadas por altitud (alta→baja). ★ = p<0.05.'
          : '588 Spearman ρ correlations between ONI and local series. Stations sorted by elevation (high→low). ★ = p<0.05.'}
      </p>
      <Plot
        data={[
          {
            z, x: xLabels, y: stationLabels,
            text: text as any, hovertemplate: '%{text}<extra></extra>',
            type: 'heatmap',
            colorscale: [
              [0, '#1d4ed8'], [0.4, '#dbeafe'], [0.5, '#ffffff'],
              [0.6, '#fee2e2'], [1, '#dc2626'],
            ],
            zmin: -0.5, zmax: 0.5,
            colorbar: { title: { text: 'ρ', side: 'right' } },
          } as any,
        ]}
        layout={{
          height: 540,
          margin: { l: 130, r: 60, t: 30, b: 80 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: '#f8fafc',
          xaxis: { side: 'top', tickangle: -90, tickfont: { size: 9 } },
          yaxis: { tickfont: { size: 10 } },
          shapes: VAR_ORDER.slice(0, -1).map((_, i) => ({
            type: 'line', x0: i * 4 + 3.5, x1: i * 4 + 3.5, y0: -0.5, y1: stationLabels.length - 0.5,
            line: { color: '#0a2540', width: 1 },
          })),
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%' }}
      />
      <p className="text-xs text-slate-500 italic mt-2">
        {locale === 'es'
          ? 'Azul: El Niño → ↓ variable. Rojo: El Niño → ↑ variable. La banda izquierda (Precip) muestra la teleconexión negativa dominante.'
          : 'Blue: El Niño → ↓ variable. Red: El Niño → ↑ variable. The left band (Precip) shows the dominant negative teleconnection.'}
      </p>
    </div>
  );
}


// =====================================================================
// 2. CMIP6 PROJECTION TIMELINES with IQR bands
// =====================================================================
interface CMIPRow { band: string; band_label: string; variable: string; ssp: string; ssp_label: string; median: number; iqr_half: number; unit: string }

const SSP_COLORS: Record<string, string> = { ssp126: '#16a34a', ssp370: '#f59e0b', ssp585: '#dc2626' };
const VAR_OPTIONS = [
  { id: 'Tmean',   labelEs: 'Temperatura media',  labelEn: 'Mean temperature',  unit: '°C' },
  { id: 'Tmax',    labelEs: 'Temperatura máx.',   labelEn: 'Max temperature',   unit: '°C' },
  { id: 'Tmin',    labelEs: 'Temperatura mín.',   labelEn: 'Min temperature',   unit: '°C' },
  { id: 'Precip',  labelEs: 'Precipitación',       labelEn: 'Precipitation',      unit: '%' },
  { id: 'ET0_HS',  labelEs: 'Evapotranspiración',  labelEn: 'Evapotranspiration', unit: '%' },
];

export function CMIPProjectionLines() {
  const locale = useLocale() as 'es' | 'en';
  const [data, setData] = useState<CMIPRow[]>([]);
  const [variable, setVariable] = useState('Tmean');

  useEffect(() => {
    fetch(dataUrl('cmip6_projections.json')).then(r => r.json()).then((d: any) => setData(d.rows ?? d));
  }, []);

  if (!data.length) return <SkeletonChart h={400} />;

  const varMeta = VAR_OPTIONS.find(v => v.id === variable)!;
  const subset = data.filter(d => d.variable === variable);

  // x: 1991, 2010 (baseline), 2055 (proyección midpoint)
  // y: cambio acumulado (median ± iqr_half)
  const baselineYear = 2000.5; // mid 1991-2010
  const targetYear = 2055.5;   // mid 2041-2070

  const traces: any[] = [];
  ['B1', 'B2', 'B3'].forEach(band => {
    ['ssp126', 'ssp370', 'ssp585'].forEach(ssp => {
      const r = subset.find(x => x.band === band && x.ssp === ssp);
      if (!r) return;
      const color = SSP_COLORS[ssp];
      const lineDash = band === 'B1' ? 'solid' : band === 'B2' ? 'dash' : 'dot';
      // Banda IQR (poligono)
      traces.push({
        x: [baselineYear, targetYear, targetYear, baselineYear],
        y: [0, r.median + r.iqr_half, r.median - r.iqr_half, 0],
        fill: 'toself',
        fillcolor: color + '15',
        line: { color: 'transparent' },
        showlegend: false,
        hoverinfo: 'skip',
      });
      traces.push({
        x: [baselineYear, targetYear],
        y: [0, r.median],
        type: 'scatter', mode: 'lines+markers',
        line: { color, width: 2.5, dash: lineDash },
        marker: { size: 8, color },
        name: `${band} · ${r.ssp_label}`,
        legendgroup: ssp,
        hovertemplate: `${band} ${r.ssp_label}<br>Δ${variable} = %{y:.2f} ${varMeta.unit}<br>IQR ±${r.iqr_half.toFixed(2)} ${varMeta.unit}<extra></extra>`,
      });
    });
  });

  return (
    <div className="card">
      <div className="flex flex-wrap items-start gap-3 mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-andean-deep">
            {locale === 'es' ? 'Proyecciones CMIP6 con bandas de incertidumbre' : 'CMIP6 projections with uncertainty bands'}
          </h4>
          <p className="text-xs text-slate-500">
            {locale === 'es'
              ? 'Cambio mediano del ensemble 10 GCMs · banda sombreada = IQR inter-modelo · línea sólida B1, guion B2, punteado B3.'
              : '10-GCM ensemble median change · shaded band = inter-model IQR · solid B1, dashed B2, dotted B3.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {VAR_OPTIONS.map(v => (
            <button
              key={v.id}
              onClick={() => setVariable(v.id)}
              className={`text-xs px-3 py-1.5 rounded-lg ${variable === v.id ? 'bg-andean-deep text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {locale === 'es' ? v.labelEs : v.labelEn}
            </button>
          ))}
        </div>
      </div>
      <Plot
        data={traces}
        layout={{
          height: 380,
          margin: { l: 60, r: 30, t: 20, b: 50 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: '#fafafa',
          xaxis: { title: { text: locale === 'es' ? 'Año' : 'Year' }, range: [1990, 2070], gridcolor: '#e5e7eb' } as any,
          yaxis: { title: { text: `Δ ${varMeta.id} (${varMeta.unit})` }, gridcolor: '#e5e7eb', zerolinecolor: '#94a3b8', zerolinewidth: 1 } as any,
          shapes: [
            { type: 'rect', x0: 1991, x1: 2010, y0: 0, y1: 0, line: { width: 0 }, fillcolor: '#f1f5f9' },
          ],
          annotations: [
            { x: 2000.5, y: 0, yanchor: 'top', yshift: -10, text: locale === 'es' ? 'Baseline 1991–2010' : 'Baseline 1991–2010', showarrow: false, font: { size: 10, color: '#64748b' } },
            { x: 2055.5, y: 0, yanchor: 'top', yshift: -10, text: '2041–2070', showarrow: false, font: { size: 10, color: '#64748b' } },
          ],
          legend: { orientation: 'h', y: -0.2, font: { size: 10 } },
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%' }}
      />
    </div>
  );
}


// =====================================================================
// 3. MK SMALL MULTIPLES — Sen slopes per band × variable
// =====================================================================
interface TrendRow { station_id: string; variable_short: string; sen_slope: number; significant: boolean; sen_unit: string }

export function MKSmallMultiples() {
  const locale = useLocale() as 'es' | 'en';
  const [trends, setTrends] = useState<TrendRow[]>([]);
  const [stations, setStations] = useState<StationFeature[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(dataUrl('trends_per_station.json')).then(r => r.json()),
      fetch(dataUrl('stations.geojson')).then(r => r.json()),
    ]).then(([t, s]) => { setTrends(t); setStations(s.features); });
  }, []);

  if (!trends.length || !stations.length) return <SkeletonChart h={400} />;

  const stationBand: Record<string, string> = {};
  stations.forEach(s => { stationBand[s.properties.id] = s.properties.band; });

  const variables = ['Tmean', 'Tmax', 'Tmin', 'Precip', 'RH', 'PET', 'PDSI'];
  const bands = ['B3', 'B2', 'B1'];
  const bandColors: Record<string, string> = { B1: '#dc2626', B2: '#f59e0b', B3: '#16a34a' };

  // Genera trazas: para cada banda, scatter de slopes vs variable
  const traces: any[] = [];
  bands.forEach(band => {
    const xs: string[] = [];
    const ys: number[] = [];
    const colors: string[] = [];
    const text: string[] = [];
    trends.forEach(t => {
      if (stationBand[t.station_id] !== band) return;
      if (!variables.includes(t.variable_short)) return;
      xs.push(t.variable_short);
      ys.push(t.sen_slope);
      colors.push(t.significant ? bandColors[band] : '#cbd5e1');
      text.push(`${t.station_id}<br>${t.variable_short}<br>Sen=${t.sen_slope.toExponential(2)} ${t.sen_unit}<br>${t.significant ? '✓ sig' : '○ ns'}`);
    });
    traces.push({
      x: xs, y: ys,
      mode: 'markers',
      type: 'scatter',
      marker: { color: colors, size: 8, line: { color: bandColors[band], width: 1 } },
      text, hovertemplate: '%{text}<extra></extra>',
      name: band + ' ' + (band === 'B1' ? '<2000m' : band === 'B2' ? '2000–2800m' : '>2800m'),
    });
  });

  return (
    <div className="card">
      <h4 className="font-bold text-andean-deep">
        {locale === 'es'
          ? 'Pendientes Theil-Sen por estación · 7 variables × 3 bandas altitudinales'
          : 'Theil-Sen slopes per station · 7 variables × 3 altitudinal bands'}
      </h4>
      <p className="text-xs text-slate-500 mb-3">
        {locale === 'es'
          ? 'Cada punto es una estación. Color saturado = significativo (p<0.05); gris = no significativo. Las temperaturas muestran la señal coherente más fuerte.'
          : 'Each point is a station. Saturated colour = significant (p<0.05); grey = non-significant. Temperatures show the strongest coherent signal.'}
      </p>
      <Plot
        data={traces}
        layout={{
          height: 360,
          margin: { l: 60, r: 30, t: 20, b: 50 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: '#fafafa',
          xaxis: { title: { text: locale === 'es' ? 'Variable' : 'Variable' }, gridcolor: '#e5e7eb' } as any,
          yaxis: { title: { text: locale === 'es' ? 'Pendiente Sen' : 'Sen slope' }, gridcolor: '#e5e7eb', zerolinecolor: '#94a3b8' } as any,
          legend: { orientation: 'h', y: -0.2, font: { size: 11 } },
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%' }}
      />
    </div>
  );
}


function SkeletonChart({ h }: { h: number }) {
  return <div style={{ height: h }} className="bg-slate-100 animate-pulse rounded-xl" />;
}
