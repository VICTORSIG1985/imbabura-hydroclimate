import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import { SITE } from '@/data/config';
import { Mail, ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import type { Locale } from '@/i18n/config';

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const isEs = locale === 'es';

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} variant="compact" />
      <section className="section">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="heading-3 text-andean-deep mb-3">{t('author_title')}</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-andean-deep to-andean-water rounded-full grid place-items-center text-white text-2xl font-bold shrink-0">
                  VP
                </div>
                <div>
                  <p className="font-bold text-andean-deep text-lg">{SITE.author}</p>
                  <p className="text-sm text-slate-600">{t('author_role')}</p>
                  <p className="text-sm text-slate-600">{SITE.affiliation}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs">
                    <a href={`mailto:${SITE.email}`} className="link-cta inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5"/> {SITE.email}</a>
                    <a href={`https://orcid.org/${SITE.orcid}`} target="_blank" rel="noopener noreferrer" className="link-cta inline-flex items-center gap-1"><ExternalLink className="w-3.5 h-3.5"/> ORCID {SITE.orcid}</a>
                    <a href={SITE.manuscriptUrl} target="_blank" rel="noopener noreferrer" className="link-cta inline-flex items-center gap-1"><FileText className="w-3.5 h-3.5"/> {isEs ? 'Manuscrito IJC (Zenodo)' : 'IJC Manuscript (Zenodo)'}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="heading-3 text-andean-deep mb-3">{t('cite_title')}</h2>
              <p className="text-xs font-mono bg-slate-50 border border-slate-200 rounded p-3 leading-relaxed">{t('cite_apa')}</p>
            </div>

            <div className="card">
              <h2 className="heading-3 text-andean-deep mb-3 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-andean-water" />
                {isEs ? 'Aviso legal y términos de uso' : 'Legal notice and terms of use'}
              </h2>
              <p className="body-lg mb-3">
                {isEs
                  ? 'Este geoportal se publica bajo licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0). El contenido editorial, los gráficos derivados, los archivos JSON publicados y la auditoría metodológica pueden reutilizarse para fines académicos y de consulta científica con atribución, siempre que la obra derivada conserve la misma licencia y no se destine a uso comercial.'
                  : 'This geoportal is published under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International licence (CC BY-NC-SA 4.0). Editorial content, derived charts, published JSON files and the methodological audit may be reused for academic and scientific purposes with attribution, provided the derivative work retains the same licence and is not used commercially.'}
              </p>
              <p className="body-lg mb-3">
                {isEs
                  ? 'Los datos primarios provienen del Instituto Nacional de Meteorología e Hidrología del Ecuador (INAMHI), titular de los derechos sobre los Anuarios Meteorológicos. Este geoportal NO redistribuye los registros crudos del INAMHI; únicamente publica productos derivados del análisis de los anuarios públicos 1994–2013, con SHA-256 verificable en el depósito Zenodo. Para acceso a registros crudos diarios u horarios, dirigirse al INAMHI.'
                  : 'Primary data come from the National Institute of Meteorology and Hydrology of Ecuador (INAMHI), copyright holder of the Meteorological Yearbooks. This geoportal does NOT redistribute INAMHI raw records; it only publishes derived products from the public 1994–2013 yearbooks, with SHA-256 verifiable in the Zenodo deposit. For raw daily or hourly records, contact INAMHI.'}
              </p>
              <p className="body-lg">
                {isEs
                  ? 'Los datasets globales utilizados (CHIRPS, ERA5-Land, TerraClimate, MOD16A2GF, BASD-CMIP6-PE, ONI-NOAA) conservan sus licencias originales. La cita académica del manuscrito está disponible en la sección anterior.'
                  : 'Global datasets used (CHIRPS, ERA5-Land, TerraClimate, MOD16A2GF, BASD-CMIP6-PE, ONI-NOAA) retain their original licences. Academic citation of the manuscript is available in the previous section.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <a href={SITE.licenseUrl} target="_blank" rel="noopener noreferrer" className="pill hover:border-andean-water">{SITE.license} →</a>
                <span className="pill">© INAMHI · {isEs ? 'Datos primarios' : 'Primary data'}</span>
                <span className="pill">{isEs ? 'Uso no comercial' : 'Non-commercial use'}</span>
                <span className="pill">{isEs ? 'Atribución obligatoria' : 'Attribution required'}</span>
              </div>
            </div>

            <div className="card">
              <h2 className="heading-3 text-andean-deep mb-3">{t('ack_title')}</h2>
              <p className="body-lg">{t('ack_desc')}</p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card-dark">
              <h3 className="font-bold mb-2">{isEs ? 'Cómo se cita' : 'How to cite'}</h3>
              <p className="text-xs text-andean-snow/80">
                {isEs
                  ? 'Si el geoportal o sus datos derivados informan tu trabajo, agradecemos la cita al manuscrito original archivado en Zenodo.'
                  : 'If the geoportal or its derived data inform your work, please cite the original manuscript archived in Zenodo.'}
              </p>
              <a href={SITE.manuscriptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs mt-3 underline text-andean-snow">
                <ExternalLink className="w-3.5 h-3.5"/>
                DOI {SITE.doi}
              </a>
            </div>
            <div className="card">
              <h3 className="font-bold text-andean-deep mb-2">{isEs ? 'Manuscrito de referencia' : 'Reference manuscript'}</h3>
              <p className="text-xs text-slate-600 mb-1"><strong>{SITE.journal}</strong></p>
              <p className="text-xs text-slate-500">{SITE.publisher}</p>
              <p className="text-xs text-slate-500 mt-2">
                {isEs
                  ? 'Estado: en revisión. El depósito Zenodo conserva la versión enviada con DOI persistente.'
                  : 'Status: under review. The Zenodo deposit holds the submitted version with persistent DOI.'}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
