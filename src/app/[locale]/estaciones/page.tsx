import { setRequestLocale, getTranslations } from 'next-intl/server';
import { promises as fs } from 'fs';
import path from 'path';
import PageHero from '@/components/PageHero';
import type { Locale } from '@/i18n/config';

interface StationFeature {
  properties: {
    id: string;
    name: string;
    type: string;
    elevation_m: number;
    province: string;
    canton: string;
    band: 'B1' | 'B2' | 'B3';
    band_label: string;
    era5_pixel_id: string;
    shared_with: string[];
    in_situ_months: number;
    note: string | null;
  };
}

async function loadStations(): Promise<StationFeature[]> {
  const file = path.join(process.cwd(), 'public', 'data', 'stations.geojson');
  const content = await fs.readFile(file, 'utf-8');
  const fc = JSON.parse(content);
  return (fc.features as StationFeature[]).sort((a, b) => b.properties.elevation_m - a.properties.elevation_m);
}

export default async function StationsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('stations');
  const stations = await loadStations();

  return (
    <>
      <PageHero kicker="§3.1 · Table 1" title={t('title')} subtitle={t('subtitle')} variant="compact" />
      <section className="section">
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-andean-snow border-b border-slate-200">
              <tr>
                <th className="text-left p-3 font-bold text-andean-deep">{t('table_id')}</th>
                <th className="text-left p-3 font-bold text-andean-deep">{t('table_name')}</th>
                <th className="text-left p-3 font-bold text-andean-deep">{t('table_type')}</th>
                <th className="text-right p-3 font-bold text-andean-deep">{t('table_elev')}</th>
                <th className="text-left p-3 font-bold text-andean-deep">{t('table_band')}</th>
                <th className="text-left p-3 font-bold text-andean-deep">{t('table_canton')}</th>
                <th className="text-left p-3 font-bold text-andean-deep">{t('table_province')}</th>
                <th className="text-left p-3 font-bold text-andean-deep">{t('table_pixel')}</th>
                <th className="text-right p-3 font-bold text-andean-deep">{t('table_months')}</th>
              </tr>
            </thead>
            <tbody>
              {stations.map(({ properties: p }) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-andean-snow/40">
                  <td className="p-3 font-mono text-xs">{p.id}</td>
                  <td className="p-3 font-semibold text-andean-deep">{p.name}</td>
                  <td className="p-3">
                    <span className="text-xs bg-slate-100 rounded px-1.5 py-0.5">
                      {p.type === 'CO' ? t('type_co') : t('type_pv')}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono">{p.elevation_m.toLocaleString('en')} m</td>
                  <td className="p-3">
                    <span className={`pill-band-${p.band}`}>{p.band} · {p.band_label}</span>
                  </td>
                  <td className="p-3">{p.canton}</td>
                  <td className="p-3 text-slate-600">{p.province}</td>
                  <td className="p-3 font-mono text-xs">
                    {p.era5_pixel_id}
                    {p.shared_with.length > 0 && (
                      <span className="ml-1 text-amber-700" title={`${t('shared_with')} ${p.shared_with.join(', ')}`}>⇄</span>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono">{p.in_situ_months}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
