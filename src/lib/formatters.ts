/** Formatters numéricos centralizados — no dependen de locale para cifras científicas. */

export function fmtNumber(n: number | null | undefined, digits = 3): string {
  if (n == null || isNaN(n)) return '—';
  return n.toFixed(digits);
}

export function fmtSenSlope(n: number | null | undefined, unit: string): string {
  if (n == null || isNaN(n)) return '—';
  const sign = n > 0 ? '+' : '';
  const digits = Math.abs(n) < 1 ? 4 : 2;
  return `${sign}${n.toFixed(digits)} ${unit}`;
}

export function fmtRho(rho: number | null | undefined): string {
  if (rho == null || isNaN(rho)) return '—';
  const sign = rho > 0 ? '+' : '';
  return `${sign}${rho.toFixed(3)}`;
}

export function fmtPValue(p: number | null | undefined): string {
  if (p == null || isNaN(p)) return '—';
  if (p < 0.001) return 'p < 0.001';
  return `p = ${p.toFixed(3)}`;
}

export function fmtElevation(m: number): string {
  return `${m.toLocaleString('en')} m`;
}

export function fmtCoord(deg: number, axis: 'lat' | 'lon'): string {
  const abs = Math.abs(deg);
  const dir = axis === 'lat' ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  return `${abs.toFixed(3)}° ${dir}`;
}

export const ssps = ['ssp126', 'ssp370', 'ssp585'] as const;
export const sspLabels: Record<string, string> = {
  ssp126: 'SSP1-2.6',
  ssp370: 'SSP3-7.0',
  ssp585: 'SSP5-8.5',
};
export const sspColors: Record<string, string> = {
  ssp126: '#22c55e',
  ssp370: '#f59e0b',
  ssp585: '#dc2626',
};

export const bandLabels: Record<'B1' | 'B2' | 'B3', string> = {
  B1: '<2000 m',
  B2: '2000–2800 m',
  B3: '>2800 m',
};

export const bandColors: Record<'B1' | 'B2' | 'B3', string> = {
  B1: '#dc2626',
  B2: '#f59e0b',
  B3: '#16a34a',
};
