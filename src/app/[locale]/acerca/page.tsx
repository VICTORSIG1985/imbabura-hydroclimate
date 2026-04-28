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

  // APA 7ª edición · Section 10.10 (Data Sets):
  // Author, A. A. (Year). *Title of data set* (Version) [Data set]. URL
  const apa7_es_year = '2026';
  const apa7_es_title = 'Geoportal Hidroclimático de Imbabura: Tendencias hidroclimáticas 1981–2025, El Niño–Oscilación del Sur y proyecciones CMIP6';
  const apa7_en_title = 'Imbabura Hydroclimatic Geoportal: Hydroclimatic trends 1981–2025, El Niño–Southern Oscillation and CMIP6 projections';

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
                {isEs ? 'Formato APA 7ª edición · Conjunto de datos en línea' : 'APA 7th edition format · Online data set'}
              </p>
              <p className="text-sm bg-slate-50 border border-slate-200 rounded p-4 leading-relaxed text-slate-800" style={{ textIndent: '-2rem', paddingLeft: '2.25rem' }}>
                Pinto-Páez, V. H. ({apa7_es_year}). <em className="italic">{isEs ? apa7_es_title : apa7_en_title}</em>{' '}
                ({isEs ? 'Versión 1.0' : 'Version 1.0'}) [{isEs ? 'Conjunto de datos científicos' : 'Data set'}].{' '}
                <a href={SITE.publicUrl} className="link-cta">{SITE.publicUrl}</a>
              </p>
              <p className="text-[10px] text-slate-500 mt-3 italic leading-snug">
                {isEs
                  ? 'Formato según APA 7.0 · Manual de Publicaciones de la American Psychological Association · Section 10.10 (Data Sets, Software, and Tests). El título se presenta en cursiva, el descriptor entre corchetes, y la URL al final.'
                  : 'Format per APA 7.0 · American Psychological Association Publication Manual · Section 10.10 (Data Sets, Software, and Tests). Title in italics, descriptor in brackets, URL at the end.'}
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
                <span className="pill bg-red-50 border-red-300 text-red-800">{isEs ? '🚫 Prohibido entrenamiento de IA' : '🚫 AI training prohibited'}</span>
              </div>
            </div>

            {/* Aviso anti-IA / anti-scraping explícito */}
            <div className="card border-l-4 border-l-red-500 bg-red-50/40">
              <h2 className="heading-3 text-red-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-red-600" />
                {isEs ? 'Política de uso por sistemas de IA' : 'AI Usage Policy'}
              </h2>
              <p className="body-lg mb-3">
                {isEs
                  ? 'Conforme a la licencia CC BY-NC-SA 4.0 y a la titularidad de los datos primarios por parte del INAMHI, el contenido de este geoportal NO ESTÁ AUTORIZADO para los siguientes usos:'
                  : 'Pursuant to the CC BY-NC-SA 4.0 licence and INAMHI\'s ownership of primary data, the content of this geoportal is NOT AUTHORISED for the following uses:'}
              </p>
              <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside mb-3">
                <li>{isEs ? 'Entrenamiento de modelos de inteligencia artificial generativa.' : 'Training of generative artificial intelligence models.'}</li>
                <li>{isEs ? 'Inferencia, recuperación aumentada (RAG) o generación de embeddings vectoriales.' : 'Inference, retrieval-augmented generation (RAG) or vector embedding.'}</li>
                <li>{isEs ? 'Scraping automatizado o extracción masiva de contenido por crawlers no autorizados.' : 'Automated scraping or mass content extraction by unauthorised crawlers.'}</li>
                <li>{isEs ? 'Reproducción comercial, reventa o distribución bajo otra licencia.' : 'Commercial reproduction, resale or redistribution under another licence.'}</li>
                <li>{isEs ? 'Modificación de la estructura o falsificación del contenido derivado.' : 'Modification of the structure or falsification of derived content.'}</li>
                <li>{isEs ? 'Resumen, traducción o transformación automatizada por sistemas de IA sin autorización expresa.' : 'Automated summarisation, translation or transformation by AI systems without express authorisation.'}</li>
              </ul>
              <p className="text-xs text-slate-600 italic">
                {isEs
                  ? 'Las políticas técnicas de exclusión están declaradas en /robots.txt, /ai.txt y /.well-known/ai-policy.txt. La consulta humana directa con fines académicos y científicos está autorizada bajo CC BY-NC-SA 4.0 con atribución completa.'
                  : 'Technical exclusion policies are declared at /robots.txt, /ai.txt and /.well-known/ai-policy.txt. Direct human consultation for academic and scientific purposes is authorised under CC BY-NC-SA 4.0 with full attribution.'}
              </p>
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
          </aside>
        </div>
      </section>
    </>
  );
}
