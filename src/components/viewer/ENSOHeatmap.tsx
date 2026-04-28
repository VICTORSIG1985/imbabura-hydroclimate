'use client';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { dataUrl } from '@/lib/assets';

interface ENSORecord {
  station_id: string;
  variable: string;
  lag_months: number;
  rho: number;
  significant_raw: boolean;
}

const VAR_ORDER = ['PRECIP_CHIRPS_mm', 'TMED_ERA5_C', 'TMAX_ERA5_C', 'TMIN_ERA5_C', 'HR_ERA5_pct', 'ETP_TERRA_mm', 'PDSI_TERRA'];
const VAR_LABELS_ES: Record<string, string> = {
  'PRECIP_CHIRPS_mm': 'Precipitación',
  'TMED_ERA5_C': 'T media',
  'TMAX_ERA5_C': 'T máx',
  'TMIN_ERA5_C': 'T mín',
  'HR_ERA5_pct': 'Humedad rel.',
  'ETP_TERRA_mm': 'ETP',
  'PDSI_TERRA': 'PDSI',
};
const VAR_LABELS_EN: Record<string, string> = {
  'PRECIP_CHIRPS_mm': 'Precipitation',
  'TMED_ERA5_C': 'Mean T',
  'TMAX_ERA5_C': 'Max T',
  'TMIN_ERA5_C': 'Min T',
  'HR_ERA5_pct': 'Relative humid.',
  'ETP_TERRA_mm': 'PET',
  'PDSI_TERRA': 'PDSI',
};

export default function ENSOHeatmap() {
  const locale = useLocale() as 'es' | 'en';
  const [data, setData] = useState<ENSORecord[]>([]);
  useEffect(() => {
    fetch(dataUrl('enso_per_station.json')).then(r => r.json()).then(setData);
  }, []);

  if (!data.length) return <div className="text-xs text-slate-500 p-3">Cargando heatmap…</div>;

  const labels = locale === 'es' ? VAR_LABELS_ES : VAR_LABELS_EN;

  // Compute median rho per variable × lag
  const byVarLag: Record<string, Record<number, number[]>> = {};
  for (const r of data) {
    if (!byVarLag[r.variable]) byVarLag[r.variable] = {};
    if (!byVarLag[r.variable][r.lag_months]) byVarLag[r.variable][r.lag_months] = [];
    byVarLag[r.variable][r.lag_months].push(r.rho);
  }
  const median = (xs: number[]) => {
    const s = [...xs].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
  };

  const colorFor = (rho: number) => {
    if (rho >= 0) {
      const t = Math.min(1, rho / 0.5);
      const r = Math.round(255 * t + 226 * (1 - t));
      const g = Math.round(38 * t + 232 * (1 - t));
      const b = Math.round(38 * t + 240 * (1 - t));
      return `rgb(${r},${g},${b})`;
    } else {
      const t = Math.min(1, -rho / 0.5);
      const r = Math.round(29 * t + 226 * (1 - t));
      const g = Math.round(78 * t + 232 * (1 - t));
      const b = Math.round(216 * t + 240 * (1 - t));
      return `rgb(${r},${g},${b})`;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <p className="text-sm font-bold text-andean-deep mb-1">
        {locale === 'es' ? 'Heatmap ENSO · ρ mediano' : 'ENSO heatmap · median ρ'}
      </p>
      <p className="text-xs text-slate-500 mb-3">
        {locale === 'es'
          ? 'Cada celda = correlación mediana de las 21 estaciones entre la variable y el índice ONI con un retraso (lag) específico.'
          : 'Each cell = median correlation of 21 stations between the variable and the ONI index at a specific lag.'}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate" style={{ borderSpacing: 2 }}>
          <thead>
            <tr>
              <th className="text-left font-semibold text-slate-600 pr-3 pb-1.5 text-[11px]">
                {locale === 'es' ? 'Variable' : 'Variable'}
              </th>
              {[0, 1, 2, 3].map(l => (
                <th key={l} className="text-center font-semibold text-slate-600 pb-1.5 text-[11px]">
                  Lag-{l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VAR_ORDER.map(v => (
              <tr key={v}>
                <td className="py-1.5 pr-3 text-slate-700 text-[12px] font-medium">
                  {labels[v] ?? v}
                </td>
                {[0, 1, 2, 3].map(l => {
                  const rhos = byVarLag[v]?.[l] ?? [];
                  if (!rhos.length) return <td key={l} />;
                  const m = median(rhos);
                  return (
                    <td
                      key={l}
                      className="py-2 px-2 text-center font-mono text-[11px] font-bold rounded"
                      style={{ background: colorFor(m), color: Math.abs(m) > 0.25 ? '#fff' : '#0f172a' }}
                      title={`${rhos.length} estaciones · mediana ${m.toFixed(3)}`}
                    >
                      {m >= 0 ? '+' : ''}{m.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-slate-500 mt-2 italic">
        {locale === 'es'
          ? 'Azul = El Niño hace que la variable disminuya · Rojo = la aumenta'
          : 'Blue = El Niño reduces the variable · Red = increases it'}
      </p>
    </div>
  );
}
