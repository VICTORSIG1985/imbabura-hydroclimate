import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import { SITE } from '@/data/config';
import { Mail, ExternalLink, ShieldCheck, Database } from 'lucide-react';
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
              </div>
            </div>

            {/* Citas de fuentes primarias y datasets utilizados */}
            <div className="card">
              <h2 className="heading-3 text-andean-deep mb-3 flex items-center gap-2">
                <Database className="w-6 h-6 text-andean-water" />
                {isEs ? 'Fuentes de datos y atribución' : 'Data sources and attribution'}
              </h2>
              <p className="body-lg mb-4">
                {isEs
                  ? 'Este geoportal integra registros del INAMHI con seis productos satelitales y de modelación climática internacionales. Cada uno conserva su autoría original, su licencia y debe citarse de acuerdo con su política institucional. Las referencias en formato APA 7ª edición son:'
                  : 'This geoportal integrates INAMHI records with six international satellite and climate-modelling products. Each retains its original authorship, licence and should be cited according to its institutional policy. References in APA 7th edition format are:'}
              </p>
              <ul className="space-y-3 text-sm">
                {/* INAMHI */}
                <li className="border-l-2 border-andean-deep pl-3">
                  <p className="font-semibold text-andean-deep">{isEs ? 'INAMHI · Datos in-situ (fuente primaria)' : 'INAMHI · In-situ data (primary source)'}</p>
                  <p className="text-slate-700 mt-1" style={{ textIndent: '-1.5rem', paddingLeft: '1.5rem' }}>
                    Instituto Nacional de Meteorología e Hidrología del Ecuador. (1994–2013). <em>Anuarios Meteorológicos Nos. 34–53</em> [Conjunto de datos meteorológicos]. INAMHI. <a href="https://servicios.inamhi.gob.ec/anuarios-metereologicos/" target="_blank" rel="noopener noreferrer" className="link-cta">https://servicios.inamhi.gob.ec/anuarios-metereologicos/</a>
                  </p>
                </li>

                {/* CHIRPS */}
                <li className="border-l-2 border-andean-water pl-3">
                  <p className="font-semibold text-andean-deep">CHIRPS v2.0 · {isEs ? 'Precipitación satelital' : 'Satellite precipitation'}</p>
                  <p className="text-slate-700 mt-1" style={{ textIndent: '-1.5rem', paddingLeft: '1.5rem' }}>
                    Funk, C., Peterson, P., Landsfeld, M., Pedreros, D., Verdin, J., Shukla, S., Husak, G., Rowland, J., Harrison, L., Hoell, A., &amp; Michaelsen, J. (2015). The climate hazards infrared precipitation with stations—a new environmental record for monitoring extremes. <em>Scientific Data, 2</em>, 150066. <a href="https://doi.org/10.1038/sdata.2015.66" target="_blank" rel="noopener noreferrer" className="link-cta">https://doi.org/10.1038/sdata.2015.66</a>
                  </p>
                </li>

                {/* ERA5-Land */}
                <li className="border-l-2 border-andean-paramo pl-3">
                  <p className="font-semibold text-andean-deep">ERA5-Land · {isEs ? 'Reanálisis atmosférico' : 'Atmospheric reanalysis'}</p>
                  <p className="text-slate-700 mt-1" style={{ textIndent: '-1.5rem', paddingLeft: '1.5rem' }}>
                    Muñoz Sabater, J. (2019). <em>ERA5-Land hourly data from 1950 to present</em> [Conjunto de datos]. Copernicus Climate Change Service (C3S) Climate Data Store (CDS). <a href="https://doi.org/10.24381/cds.e2161bac" target="_blank" rel="noopener noreferrer" className="link-cta">https://doi.org/10.24381/cds.e2161bac</a>
                  </p>
                </li>

                {/* TerraClimate */}
                <li className="border-l-2 border-andean-earth pl-3">
                  <p className="font-semibold text-andean-deep">TerraClimate · {isEs ? 'Balance hídrico mensual' : 'Monthly water balance'}</p>
                  <p className="text-slate-700 mt-1" style={{ textIndent: '-1.5rem', paddingLeft: '1.5rem' }}>
                    Abatzoglou, J. T., Dobrowski, S. Z., Parks, S. A., &amp; Hegewisch, K. C. (2018). TerraClimate, a high-resolution global dataset of monthly climate and climatic water balance from 1958–2015. <em>Scientific Data, 5</em>, 170191. <a href="https://doi.org/10.1038/sdata.2017.191" target="_blank" rel="noopener noreferrer" className="link-cta">https://doi.org/10.1038/sdata.2017.191</a>
                  </p>
                </li>

                {/* MOD16A2GF */}
                <li className="border-l-2 border-band-B3 pl-3">
                  <p className="font-semibold text-andean-deep">MOD16A2GF · {isEs ? 'Evapotranspiración MODIS' : 'MODIS evapotranspiration'}</p>
                  <p className="text-slate-700 mt-1" style={{ textIndent: '-1.5rem', paddingLeft: '1.5rem' }}>
                    Running, S. W., Mu, Q., Zhao, M., &amp; Moreno, A. (2019). <em>MOD16A2GF MODIS/Terra Net Evapotranspiration Gap-Filled 8-Day L4 Global 500 m SIN Grid V061</em> [Conjunto de datos]. NASA EOSDIS Land Processes DAAC. <a href="https://doi.org/10.5067/MODIS/MOD16A2GF.061" target="_blank" rel="noopener noreferrer" className="link-cta">https://doi.org/10.5067/MODIS/MOD16A2GF.061</a>
                  </p>
                </li>

                {/* BASD-CMIP6-PE */}
                <li className="border-l-2 border-band-B2 pl-3">
                  <p className="font-semibold text-andean-deep">BASD-CMIP6-PE · {isEs ? 'Proyecciones CMIP6 con sesgo ajustado' : 'Bias-adjusted CMIP6 projections'}</p>
                  <p className="text-slate-700 mt-1" style={{ textIndent: '-1.5rem', paddingLeft: '1.5rem' }}>
                    Lange, S. (2019). Trend-preserving bias adjustment and statistical downscaling with ISIMIP3BASD (v1.0). <em>Geoscientific Model Development, 12</em>(7), 3055–3070. <a href="https://doi.org/10.5194/gmd-12-3055-2019" target="_blank" rel="noopener noreferrer" className="link-cta">https://doi.org/10.5194/gmd-12-3055-2019</a>
                  </p>
                </li>

                {/* ONI */}
                <li className="border-l-2 border-band-B1 pl-3">
                  <p className="font-semibold text-andean-deep">ONI · {isEs ? 'Índice oceánico de El Niño' : 'Oceanic Niño Index'}</p>
                  <p className="text-slate-700 mt-1" style={{ textIndent: '-1.5rem', paddingLeft: '1.5rem' }}>
                    National Oceanic and Atmospheric Administration. (n. d.). <em>Oceanic Niño Index (ONI)</em> [Conjunto de datos]. NOAA Climate Prediction Center. <a href="https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt" target="_blank" rel="noopener noreferrer" className="link-cta">https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt</a>
                  </p>
                </li>

                {/* SRTM */}
                <li className="border-l-2 border-andean-ash pl-3">
                  <p className="font-semibold text-andean-deep">SRTM · {isEs ? 'Modelo digital de elevación' : 'Digital elevation model'}</p>
                  <p className="text-slate-700 mt-1" style={{ textIndent: '-1.5rem', paddingLeft: '1.5rem' }}>
                    Farr, T. G., Rosen, P. A., Caro, E., Crippen, R., Duren, R., Hensley, S., Kobrick, M., Paller, M., Rodriguez, E., Roth, L., Seal, D., Shaffer, S., Shimada, J., Umland, J., Werner, M., Oskin, M., Burbank, D., &amp; Alsdorf, D. (2007). The Shuttle Radar Topography Mission. <em>Reviews of Geophysics, 45</em>(2), RG2004. <a href="https://doi.org/10.1029/2005RG000183" target="_blank" rel="noopener noreferrer" className="link-cta">https://doi.org/10.1029/2005RG000183</a>
                  </p>
                </li>

                {/* IGM Ecuador (geometría provincial) */}
                <li className="border-l-2 border-slate-400 pl-3">
                  <p className="font-semibold text-andean-deep">{isEs ? 'IGM-INEC Ecuador · Cartografía base' : 'IGM-INEC Ecuador · Base cartography'}</p>
                  <p className="text-slate-700 mt-1" style={{ textIndent: '-1.5rem', paddingLeft: '1.5rem' }}>
                    Instituto Geográfico Militar &amp; Instituto Nacional de Estadística y Censos. (2022). <em>División Político-Administrativa del Ecuador (DPA): nivel parroquial</em> [Conjunto de datos espaciales]. IGM-INEC. <a href="https://www.ecuadorencifras.gob.ec" target="_blank" rel="noopener noreferrer" className="link-cta">https://www.ecuadorencifras.gob.ec</a>
                  </p>
                </li>

                {/* Foto del Hero */}
                <li className="border-l-2 border-andean-water pl-3">
                  <p className="font-semibold text-andean-deep">{isEs ? 'Imagen de portada' : 'Cover image'}</p>
                  <p className="text-slate-700 mt-1" style={{ textIndent: '-1.5rem', paddingLeft: '1.5rem' }}>
                    David, C. S. (2015, 31 de diciembre). <em>Volcán Imbabura y Lago San Pablo</em> [Fotografía]. Wikimedia Commons. CC BY-SA 4.0. <a href="https://commons.wikimedia.org/wiki/File:Volc%C3%A1n_Imbabura_y_lago_San_Pablo.jpg" target="_blank" rel="noopener noreferrer" className="link-cta">https://commons.wikimedia.org/wiki/File:Volcán_Imbabura_y_lago_San_Pablo.jpg</a>
                  </p>
                </li>
              </ul>

              <p className="text-xs text-slate-500 italic mt-4">
                {isEs
                  ? 'Cada cita conserva la atribución según los términos institucionales de su fuente. La reutilización de cualquiera de estos productos requiere citarlos directamente desde su DOI o repositorio original.'
                  : 'Each citation preserves attribution under the institutional terms of its source. Reuse of any of these products requires citing them directly from their DOI or original repository.'}
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
