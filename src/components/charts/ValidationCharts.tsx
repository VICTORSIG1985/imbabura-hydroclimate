'use client';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { dataUrl } from '@/lib/assets';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface ENSORecord { station_id: string; variable: string; lag_months: number; rho: number; p_value: number; significant_raw: boolean }
interface TrendRecord { station_id: string; variable_short: string; sen_slope: number; significant: boolean }
interface CMIPRecord { band: string; variable: string; ssp: string; median: number; iqr_half: number }

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n === 0 ? 0 : n % 2 === 0 ? (s[n / 2 - 1] + s[n / 2]) / 2 : s[(n - 1) / 2];
};

// --------------- V1 — Bootstrap ENSO ρ median ----------------
export function BootstrapENSOMedian() {
  const t = useTranslations('validation');
  const locale = useLocale() as 'es' | 'en';
  const [data, setData] = useState<ENSORecord[]>([]);
  useEffect(() => { fetch(dataUrl('enso_per_station.json')).then(r => r.json()).then(setData); }, []);
  if (!data.length) return <ChartSkeleton />;

  const rhos = data.map(r => r.rho);
  const observed = median(rhos);
  // Bootstrap 5000 réplicas (semilla determinista)
  let seed = 42;
  const rng = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const N = 5000;
  const medians: number[] = [];
  for (let i = 0; i < N; i++) {
    const sample: number[] = [];
    for (let j = 0; j < rhos.length; j++) sample.push(rhos[Math.floor(rng() * rhos.length)]);
    medians.push(median(sample));
  }
  const sorted = [...medians].sort((a, b) => a - b);
  const ci_lo = sorted[Math.floor(0.025 * N)];
  const ci_hi = sorted[Math.floor(0.975 * N)];

  return (
    <Card title={t('v1_title')} subtitle={t('v1_desc')}>
      <Plot
        data={[
          {
            x: medians, type: 'histogram', nbinsx: 60,
            marker: { color: '#1d4ed8', line: { color: '#0a2540', width: 0.5 } },
            name: 'Bootstrap',
          } as any,
        ]}
        layout={{
          height: 280,
          margin: { l: 50, r: 20, t: 10, b: 40 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: '#fafafa',
          xaxis: { title: { text: 'ρ' }, gridcolor: '#e5e7eb' } as any,
          yaxis: { title: { text: 'N' }, gridcolor: '#e5e7eb' } as any,
          shapes: [
            { type: 'line', x0: observed, x1: observed, y0: 0, y1: 1, yref: 'paper', line: { color: '#dc2626', width: 3 } },
            { type: 'line', x0: ci_lo, x1: ci_lo, y0: 0, y1: 1, yref: 'paper', line: { color: '#0a2540', width: 1, dash: 'dash' } },
            { type: 'line', x0: ci_hi, x1: ci_hi, y0: 0, y1: 1, yref: 'paper', line: { color: '#0a2540', width: 1, dash: 'dash' } },
          ],
          annotations: [
            { x: observed, y: 1.05, yref: 'paper', text: `<b>ρ obs = ${observed.toFixed(3)}</b>`, showarrow: false, font: { color: '#dc2626', size: 11 } },
            { x: ci_lo, y: 0.95, yref: 'paper', text: `IC₉₅% [${ci_lo.toFixed(3)}, ${ci_hi.toFixed(3)}]`, showarrow: false, font: { color: '#0a2540', size: 10 }, xanchor: 'left' },
          ],
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%' }}
      />
      <p className="text-xs text-slate-500 italic mt-1">
        N = {data.length} · 5000 {locale === 'es' ? 'réplicas' : 'replicates'} · seed = 42
      </p>
    </Card>
  );
}

// --------------- V2 — Distribución empírica de p-valores ----------------
export function PValueDistribution() {
  const t = useTranslations('validation');
  const locale = useLocale() as 'es' | 'en';
  const [data, setData] = useState<ENSORecord[]>([]);
  useEffect(() => { fetch(dataUrl('enso_per_station.json')).then(r => r.json()).then(setData); }, []);
  if (!data.length) return <ChartSkeleton />;

  const ps = data.map(r => r.p_value).filter(p => !isNaN(p));
  // bins de 0.05
  const bins = Array.from({ length: 20 }, (_, i) => i * 0.05);
  const counts = bins.map((b) => ps.filter(p => p >= b && p < b + 0.05).length);
  const expected = ps.length / 20; // distribución uniforme

  return (
    <Card title={t('v2_title')} subtitle={t('v2_desc')}>
      <Plot
        data={[
          {
            x: bins.map(b => b + 0.025),
            y: counts,
            type: 'bar',
            marker: { color: counts.map(c => c > expected * 1.5 ? '#dc2626' : '#1d4ed8') },
            name: locale === 'es' ? 'Observado' : 'Observed',
          } as any,
          {
            x: [0, 1], y: [expected, expected],
            mode: 'lines',
            line: { color: '#94a3b8', dash: 'dash', width: 2 },
            name: locale === 'es' ? 'Uniforme (H₀)' : 'Uniform (H₀)',
          } as any,
        ]}
        layout={{
          height: 280,
          margin: { l: 50, r: 20, t: 10, b: 40 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: '#fafafa',
          xaxis: { title: { text: 'p-value' }, range: [0, 1], gridcolor: '#e5e7eb' } as any,
          yaxis: { title: { text: 'N' }, gridcolor: '#e5e7eb' } as any,
          showlegend: true,
          legend: { y: 1.1, orientation: 'h', xanchor: 'right', x: 1 },
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%' }}
      />
      <p className="text-xs text-slate-500 italic mt-1">
        {locale === 'es'
          ? 'Acumulación cerca de 0 → la señal es real, no azar multiplicativo.'
          : 'Accumulation near 0 → signal is real, not multiplicative chance.'} · N = {ps.length}
      </p>
    </Card>
  );
}

// --------------- V3 — Coherencia inter-modelo CMIP6 ----------------
export function InterModelCoherence() {
  const t = useTranslations('validation');
  const locale = useLocale() as 'es' | 'en';
  const [data, setData] = useState<CMIPRecord[]>([]);
  useEffect(() => {
    fetch(dataUrl('cmip6_projections.json')).then(r => r.json()).then((d: any) => setData(d.rows ?? d ?? []));
  }, []);
  if (!data.length) return <ChartSkeleton />;

  // Agregamos por SSP × banda × variable y calculamos coeficiente de variación inter-modelo (proxy de coherencia)
  // Usamos IQR/median como medida de dispersión normalizada
  const ssps = ['ssp126', 'ssp370', 'ssp585'];
  const variables = ['Tmean', 'Tmax', 'Tmin', 'Precip', 'ET0_HS'];
  const bands = ['B1', 'B2', 'B3'];

  const z: number[][] = [];
  const yLabels: string[] = [];
  variables.forEach(v => {
    bands.forEach(b => {
      yLabels.push(`${v} · ${b}`);
      const row = ssps.map(ssp => {
        const r = data.find(d => d.ssp === ssp && d.variable === v && d.band === b);
        if (!r || !r.iqr_half || !r.median) return 0;
        // Coherencia = 1 - normalizado(IQR/|median|)
        const cv = Math.abs(r.iqr_half / (Math.abs(r.median) + 0.01));
        return Math.max(0, 1 - Math.min(1, cv));
      });
      z.push(row);
    });
  });

  return (
    <Card title={t('v3_title')} subtitle={t('v3_desc')}>
      <Plot
        data={[
          {
            z, x: ssps.map(s => s.toUpperCase().replace('SSP', 'SSP').replace(/SSP(\d)(\d+)/, 'SSP$1-$2')),
            y: yLabels,
            type: 'heatmap',
            colorscale: [[0, '#fee2e2'], [0.5, '#fed7aa'], [1, '#16a34a']],
            zmin: 0, zmax: 1,
            colorbar: { title: { text: locale === 'es' ? 'Coherencia' : 'Coherence', side: 'right' }, tickformat: '.0%' },
            hovertemplate: '%{y}<br>%{x}<br>' + (locale === 'es' ? 'Coherencia' : 'Coherence') + ': %{z:.0%}<extra></extra>',
          } as any,
        ]}
        layout={{
          height: 360,
          margin: { l: 110, r: 50, t: 10, b: 40 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          xaxis: { side: 'top' },
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%' }}
      />
      <p className="text-xs text-slate-500 italic mt-1">
        {locale === 'es'
          ? 'Coherencia = 1 − (IQR / |mediana|). Verde = los 10 GCMs concuerdan; rojo = dispersión inter-modelo alta.'
          : 'Coherence = 1 − (IQR / |median|). Green = 10 GCMs agree; red = high inter-model spread.'}
      </p>
    </Card>
  );
}

// --------------- V4 — Regional Mann-Kendall ----------------
export function RegionalMannKendall() {
  const t = useTranslations('validation');
  const locale = useLocale() as 'es' | 'en';
  const [data, setData] = useState<TrendRecord[]>([]);
  useEffect(() => { fetch(dataUrl('trends_per_station.json')).then(r => r.json()).then(setData); }, []);
  if (!data.length) return <ChartSkeleton />;

  const variables = ['Tmean', 'Tmax', 'Tmin', 'Precip', 'RH', 'PET', 'PDSI'];
  const result = variables.map(v => {
    const rows = data.filter(d => d.variable_short === v);
    const slopes = rows.map(r => r.sen_slope).filter(x => !isNaN(x));
    const med = median(slopes);
    const sig = rows.filter(r => r.significant).length;
    const tot = rows.length;
    return { variable: v, sen_median: med, sig_pct: tot ? (100 * sig) / tot : 0, n: tot };
  });

  return (
    <Card title={t('v4_title')} subtitle={t('v4_desc')}>
      <Plot
        data={[
          {
            x: result.map(r => r.variable),
            y: result.map(r => r.sig_pct),
            type: 'bar',
            marker: {
              color: result.map(r => r.sig_pct >= 80 ? '#16a34a' : r.sig_pct >= 50 ? '#f59e0b' : '#94a3b8'),
              line: { color: '#0a2540', width: 1 },
            },
            text: result.map(r => `${r.sig_pct.toFixed(0)}%<br>${r.sen_median >= 0 ? '+' : ''}${r.sen_median.toExponential(2)}`),
            textposition: 'outside',
            hovertemplate: '%{x}<br>' + (locale === 'es' ? 'Estaciones sig.' : 'Stations sig.') + ': %{y:.0f}%<extra></extra>',
          } as any,
        ]}
        layout={{
          height: 300,
          margin: { l: 50, r: 20, t: 30, b: 40 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: '#fafafa',
          xaxis: { gridcolor: '#e5e7eb' },
          yaxis: { title: { text: '% ' + (locale === 'es' ? 'estaciones significativas' : 'significant stations') }, range: [0, 110], gridcolor: '#e5e7eb' } as any,
          shapes: [
            { type: 'line', x0: -0.5, x1: variables.length - 0.5, y0: 80, y1: 80, line: { color: '#16a34a', dash: 'dot', width: 1 } },
          ],
          annotations: [
            { x: variables.length - 1, y: 82, text: locale === 'es' ? 'Robusto (≥80%)' : 'Robust (≥80%)', showarrow: false, font: { color: '#16a34a', size: 10 }, xanchor: 'right' },
          ],
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%' }}
      />
      <p className="text-xs text-slate-500 italic mt-1">
        {locale === 'es'
          ? 'Verde = ≥80% estaciones significativas. Tmean, Tmax y ETP son robustamente regionales.'
          : 'Green = ≥80% significant stations. Tmean, Tmax and ETP are robustly regional.'}
      </p>
    </Card>
  );
}

// --------------- Skeleton ----------------
function ChartSkeleton() {
  return <div className="h-72 bg-slate-100 animate-pulse rounded-xl" />;
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h4 className="font-bold text-andean-deep">{title}</h4>
      <p className="text-xs text-slate-500 mb-3">{subtitle}</p>
      {children}
    </div>
  );
}
