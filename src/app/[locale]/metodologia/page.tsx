import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import { SOURCES } from '@/data/config';
import type { Locale } from '@/i18n/config';

export default async function MethodologyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('methodology');

  return (
    <>
      <PageHero kicker="§3" title={t('title')} subtitle={t('subtitle')} variant="compact" />
      <section className="section">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {([
              { id: 's31', title: t('s31') },
              { id: 's32', title: t('s32') },
              { id: 's33', title: t('s33') },
              { id: 's34', title: t('s34') },
              { id: 's35', title: t('s35') },
              { id: 's36', title: t('s36') },
              { id: 'appA1', title: t('appA1') },
            ] as const).map(s => (
              <article key={s.id} id={s.id} className="card">
                <h2 className="heading-3 mb-2 text-andean-deep">{s.title}</h2>
                {s.id === 's31' && (
                  <p className="body-lg">21 estaciones INAMHI: 1994–2013 (anuarios 34–53; 4 120 registros precip + 1 111 temp post-QC) y 2014–2025 (M0105, M1240 horarias). QC1 (rangos físicos), QC2 (consistencia interna), QC3 (persistencia espuria). Homogeneidad SNHT (Alexandersson 1986).</p>
                )}
                {s.id === 's32' && (
                  <p className="body-lg">CHIRPS v2.0 (0.05°), ERA5-Land (0.1° ~9 km), TerraClimate (1/24°), MOD16A2GF (500 m vía GEE). Validación cruzada con M0105 y M1240 (Pearson r, RMSE, MAE, bias).</p>
                )}
                {s.id === 's33' && (
                  <p className="body-lg">Mann-Kendall + Theil-Sen para 7 variables, anual y trimestral (DJF/MAM/JJA/SON). MMK Hamed-Rao como sensibilidad global. Corrección Benjamini-Hochberg FDR a q=0.05. ETCCDI: Rx1day, Rx5day, R95p, CDD; ajuste GEV ML 1981–2002 vs 2003–2024.</p>
                )}
                {s.id === 's34' && (
                  <p className="body-lg">Spearman ρ entre series mensuales locales y ONI con rezagos 0–3 meses (Vuille et al. 2000; Espinoza et al. 2014). Coherencia wavelet (biwavelet R; Torrence & Compo 1998) entre ONI y CHIRPS PRCPTOT regional.</p>
                )}
                {s.id === 's35' && (
                  <p className="body-lg">BASD-CMIP6-PE (Lange 2019). 10 GCMs: CanESM5, CNRM-CM6-1, CNRM-ESM2-1, EC-Earth3, GFDL-ESM4, IPSL-CM6A-LR, MIROC6, MPI-ESM1-2-HR, MRI-ESM2-0, UKESM1-0-LL. Histórico 1981–2014 + SSP1-2.6/3-7.0/5-8.5 2015–2070. ET₀-HS Hargreaves-Samani.</p>
                )}
                {s.id === 's36' && (
                  <p className="body-lg">Python 3.11 (pandas 2.0, numpy 1.24, scipy 1.10, pymannkendall 1.4.3, matplotlib 3.7) + Google Earth Engine. Trazabilidad end-to-end (Tabla S10) con scripts y semillas documentadas. Depósito Zenodo concept DOI 10.5281/zenodo.19821757.</p>
                )}
                {s.id === 'appA1' && (
                  <div className="space-y-2">
                    <p className="body-lg">Bootstrap no paramétrico de 1 000 réplicas (semilla=42) con muestreo con reemplazo sobre 7 estaciones climatológicas con registro completo:</p>
                    <ul className="text-sm list-disc list-inside text-slate-700 space-y-0.5">
                      <li>M0001 Inguincho (3 140 m, T=10.23 °C)</li>
                      <li>M0103 San Gabriel (2 860 m, T=11.53 °C)</li>
                      <li>M0105 Otavalo (2 550 m, T=13.16 °C)</li>
                      <li>M0107 Cahuasquí-FAO (2 335 m, T=16.45 °C)</li>
                      <li>M0104 Mira-FAO (2 275 m, T=16.32 °C)</li>
                      <li>M1240 Ibarra-INAMHI (2 247 m, T=16.84 °C)</li>
                      <li>M0086 San Vicente de Pusir (1 891 m, T=20.32 °C)</li>
                    </ul>
                    <p className="body-lg"><strong>Resultado:</strong> pendiente OLS = −8.24 °C/km, R² = 0.966, p = 7.5×10⁻⁵, IC 95 % bootstrap = [−10.87, −6.99] °C/km.</p>
                  </div>
                )}
              </article>
            ))}
          </div>
          <aside className="space-y-4">
            <div className="card">
              <h3 className="font-bold text-andean-deep mb-3">Fuentes de datos</h3>
              <ul className="space-y-2 text-sm">
                {Object.entries(SOURCES).map(([k, v]) => (
                  <li key={k} className="flex flex-col">
                    <span className="font-semibold text-slate-700">{v.full}</span>
                    <span className="text-xs text-slate-500">{v.resolution} · {v.period}</span>
                    <span className="text-xs italic text-slate-500">{v.ref}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-dark">
              <h3 className="font-bold mb-3">{t('limitations_title')}</h3>
              <ol className="space-y-2 text-sm text-andean-snow/90 list-decimal list-inside">
                <li>{t('lim_1')}</li>
                <li>{t('lim_2')}</li>
                <li>{t('lim_3')}</li>
                <li>{t('lim_4')}</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
