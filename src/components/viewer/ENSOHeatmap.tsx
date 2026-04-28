'use client';
import { useEffect, useState } from 'react';
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

export default function ENSOHeatmap() {
  const [data, setData] = useState<ENSORecord[]>([]);
  useEffect(() => {
    fetch(dataUrl('enso_per_station.json'))
      .then(r => r.json())
      .then(setData);
  }, []);

  if (!data.length) return <div className="text-xs text-slate-500 p-3">Cargando heatmap…</div>;

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
    <div className="bg-white border border-slate-200 rounded-xl p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-andean-deep mb-2">ENSO heatmap · ρ mediano</p>
      <table className="w-full text-[10px]">
        <thead>
          <tr>
            <th className="text-left font-semibold text-slate-500 pr-2">Variable</th>
            {[0, 1, 2, 3].map(l => (
              <th key={l} className="text-center font-semibold text-slate-500 pb-1">Lag-{l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VAR_ORDER.map(v => (
            <tr key={v}>
              <td className="py-1 pr-2 text-slate-700">{VAR_LABELS_ES[v] ?? v}</td>
              {[0, 1, 2, 3].map(l => {
                const rhos = byVarLag[v]?.[l] ?? [];
                if (!rhos.length) return <td key={l} />;
                const m = median(rhos);
                return (
                  <td
                    key={l}
                    className="py-1 px-1 text-center font-mono text-[9px]"
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
      <p className="text-[10px] text-slate-500 mt-2 italic">ρ Spearman mediano de 21 estaciones · azul = negativo · rojo = positivo</p>
    </div>
  );
}
