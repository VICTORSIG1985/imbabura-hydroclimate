import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import { SITE } from '@/data/config';
import { Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { asset } from '@/lib/assets';
import type { Locale } from '@/i18n/config';

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const isEs = locale === 'es';

  // Cita APA 7ª edición — sin la palabra "bilingüe"
  const apa7_es = `Pinto-Páez, V. H. (2026). Geoportal Hidroclimático de Imbabura: Tendencias 1981–2025, ENSO y proyecciones CMIP6 [Geoportal científico]. ${SITE.publicUrl}`;
  const apa7_en = `Pinto-Páez, V. H. (2026). Imbabura Hydroclimatic Geoportal: Trends 1981–2025, ENSO and CMIP6 projections [Scientific geoportal]. ${SITE.publicUrl}`;

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} variant="compact" />
      <section className="section">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Autor con foto real */}
            <div className="card">
              <h2 className="heading-3 text-andean-deep mb-4">{t('author_title')}</h2>
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <img
                  src={asset('/img/author.png')}
                  alt={SITE.author}
                  className="w-32 h-32 rounded-full object-cover shadow-lg ring-4 ring-andean-snow shrink-0"
                />
                <div className="flex-1">
                  <p className="font-bold text-andean-deep text-xl">{SITE.author}</p>
                  <p className="text-sm text-slate-700 mt-1">{t('author_role')}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{SITE.affiliation}</p>
                  <div className="flex flex-wrap gap-3 mt-4 text-xs">
                    <a href={`mailto:${SITE.email}`} className="link-cta inline-flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5"/> {SITE.email}
                    </a>
                    <a href={`https://orcid.org/${SITE.orcid}`} target="_blank" rel="noopener noreferrer" className="link-cta inline-flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5"/> ORCID {SITE.orcid}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Cita APA 7 */}
            <div className="card">
              <h2 className="heading-3 text-andean-deep mb-3">{t('cite_title')}</h2>
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">
                {isEs ? 'Formato APA 7ª edición' : 'APA 7th edition format'}
              </p>
              <p className="text-sm font-mono bg-slate-50 border border-slate-200 rounded p-4 leading-relaxed text-slate-800">
                {isEs ? apa7_es : apa7_en}
              </p>
            </div>

            {/* Aviso legal */}
            <div className="card">
              <h2 className="heading-3 text-andean-deep mb-3 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-andean-water" />
                {isEs ? 'Aviso legal y términos de uso' : 'Legal notice and terms of use'}
              </h2>
              <p className="body-lg mb-3">
                {isEs
                  ? 'Este geoportal se publica bajo licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0). El contenido editorial, los gráficos derivados, los archivos de la auditoría metodológica y los derivados publicados pueden reutilizarse para fines académicos y de consulta científica con atribución, siempre que la obra derivada conserve la misma licencia y no se destine a uso comercial.'
                  : 'This geoportal is published under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International licence (CC BY-NC-SA 4.0). Editorial content, derived charts, methodological audit files and published derivatives may be reused for academic and scientific purposes with attribution, provided the derivative work retains the same licence and is not used commercially.'}
              </p>
              <p className="body-lg mb-3">
                {isEs
                  ? 'Los datos primarios provienen del Instituto Nacional de Meteorología e Hidrología del Ecuador (INAMHI), titular de los derechos sobre los Anuarios Meteorológicos. Este geoportal NO redistribuye los registros crudos del INAMHI; únicamente publica productos derivados del análisis de los anuarios públicos 1994–2013, con SHA-256 verificable. Para acceso a registros crudos diarios u horarios, dirigirse al INAMHI.'
                  : 'Primary data come from the National Institute of Meteorology and Hydrology of Ecuador (INAMHI), copyright holder of the Meteorological Yearbooks. This geoportal does NOT redistribute INAMHI raw records; it only publishes derived products from the public 1994–2013 yearbooks, with verifiable SHA-256. For raw daily or hourly records, contact INAMHI.'}
              </p>
              <p className="body-lg">
                {isEs
                  ? 'Los datasets globales utilizados (CHIRPS, ERA5-Land, TerraClimate, MOD16A2GF, BASD-CMIP6-PE, ONI-NOAA) conservan sus licencias originales.'
                  : 'Global datasets used (CHIRPS, ERA5-Land, TerraClimate, MOD16A2GF, BASD-CMIP6-PE, ONI-NOAA) retain their original licences.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <a href={SITE.licenseUrl} target="_blank" rel="noopener noreferrer" className="pill hover:border-andean-water">{SITE.license} →</a>
                <span className="pill">© INAMHI · {isEs ? 'Datos primarios' : 'Primary data'}</span>
                <span className="pill">{isEs ? 'Uso no comercial' : 'Non-commercial use'}</span>
                <span className="pill">{isEs ? 'Atribución obligatoria' : 'Attribution required'}</span>
              </div>
            </div>

            {/* Agradecimientos */}
            <div className="card">
              <h2 className="heading-3 text-andean-deep mb-3">{t('ack_title')}</h2>
              <p className="body-lg">{t('ack_desc')}</p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card">
              <h3 className="font-bold text-andean-deep mb-2">{isEs ? 'Licencia' : 'Licence'}</h3>
              <p className="text-xs text-slate-600">
                {isEs
                  ? 'Geoportal y derivados: CC BY-NC-SA 4.0. Datos primarios: © INAMHI Ecuador.'
                  : 'Geoportal and derivatives: CC BY-NC-SA 4.0. Primary data: © INAMHI Ecuador.'}
              </p>
              <a href={SITE.licenseUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs mt-2 link-cta">
                <ExternalLink className="w-3 h-3"/> {SITE.license}
              </a>
            </div>
            <div className="card-dark">
              <h3 className="font-bold mb-2">
                {isEs ? 'Validación científica' : 'Scientific validation'}
              </h3>
              <p className="text-xs text-andean-snow/80 leading-relaxed">
                {isEs
                  ? 'Score 90/100 · auditoría metodológica con estándares IPCC AR6, WMO N° 1203 y Pepin et al. (2022).'
                  : 'Score 90/100 · methodological audit against IPCC AR6, WMO No. 1203 and Pepin et al. (2022) standards.'}
              </p>
              <a href={`/${locale}/validacion`} className="inline-flex items-center gap-1 text-xs mt-3 underline text-andean-snow">
                {isEs ? 'Ver auditoría' : 'View audit'} →
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
