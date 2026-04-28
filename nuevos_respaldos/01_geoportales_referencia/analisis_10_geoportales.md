# Análisis comparativo de 10 geoportales / visores climáticos de referencia

**Propósito.** Guiar el rediseño del **Geoportal Hidroclimático de Imbabura (Ecuador) v2**, un visor científico construido sobre Next.js + MapLibre + Plotly que comunicará: (i) tendencias Mann-Kendall + Theil-Sen 1981–2025 en 21 estaciones INAMHI, (ii) teleconexión ENSO con 588 tests Spearman corregidos por FDR–Benjamini-Hochberg, (iii) proyecciones CMIP6 BASD-PE de 10 GCMs bajo SSP1-2.6 / SSP3-7.0 / SSP5-8.5 al horizonte 2041–2070, (iv) bandas altitudinales (B1 < 2000 m, B2 2000–2800 m, B3 > 2800 m) y (v) validación cruzada de productos satelitales.

**Fecha de análisis:** 2026-04-28. Fuentes primarias: WebFetch directo + WebSearch sobre documentación técnica de cada plataforma.

**Aclaración sobre accesibilidad.** Cinco de los diez sitios (IPCC, Copernicus, Climate Impact Lab, IDEAM, SENAMHI) protegen la SPA detrás de carga JS o verificación anti-bot, por lo que el WebFetch directo regresó vacío. Esos casos se complementaron con búsqueda sobre documentación técnica oficial (artículos PLOS Climate, Newsletter ECMWF, Confluence Copernicus, Rhodium Group). El sitio del IDEAM Colombia retornó error de certificado TLS, pero su geovisor existe y se describe a partir de la página principal y guías oficiales.

---

## 1. Fichas individuales por geoportal

### 1.1 IPCC WGI Interactive Atlas — `interactive-atlas.ipcc.ch`

- **Qué muestra.** Atlas oficial del AR6. Cubre **más de 20 Climatic Impact-Drivers (CIDs)** integrando CMIP5, CMIP6 y CORDEX (regional). Productos: mapas globales y series por **regiones de referencia AR6** (subcontinentales) tanto para el pasado observado como para futuros.
- **Dinámica e interactividad.** Dos modos: **Regional Information** (agrega por región AR6) y **Datasets**. Filtros: variable, escenario (RCP2.6/4.5/8.5; SSP1-2.6/2-4.5/3-7.0/5-8.5), estación del año, período de referencia, nivel de calentamiento global (1.5/2/3/4 °C), conjunto (CMIP6, CMIP5, CORDEX-CORE/EUR).
- **Gráficos.** Series temporales de ensemble con mediana + sombreado del rango, **climate stripes** anuales/estacionales, scatter plots, tablas regionales, gráficos de cambio mensual y estacional.
- **Incertidumbre.** Mapa de la **media del ensemble + hatching** según el método AR6 (acuerdo robusto vs. señal no significativa). Series con percentiles. Comparación entre líneas de evidencia (CMIP5 vs CMIP6 vs CORDEX) como prueba de robustez.
- **Cartografía.** Choropleth por región AR6, capas grilladas, animaciones temporales.
- **Trazabilidad.** Datasets DOI-citables vía IPCC-DDC; integrados en el CDS de Copernicus. **DataLab** (PLOS Climate, Iturbide et al. 2024) para reusabilidad y reproducibilidad notebook-ready.
- **Diseño.** Layout en tres columnas (controles izquierda, mapa centro, panel de gráfico derecha). Inglés único. Paleta divergente RdBu para anomalías, secuencial Yl-Or-Br para variables absolutas.

### 1.2 Copernicus Interactive Climate Atlas (C3S) — `atlas.climate.copernicus.eu`

- **Qué muestra.** Reanálisis (ERA5), observaciones gridded y proyecciones CMIP5/CMIP6/CORDEX-CORE/CORDEX-EUR-11 sobre el período 1950–2100.
- **Dinámica.** Filtros para variable, dataset, escenario, período base y horizonte. Posibilidad de seleccionar polígonos custom.
- **Gráficos.** Series temporales con **mediana del ensemble + percentiles** (sombras más oscuras = banda 50%, más claras = banda 80%). **Climate stripes** verticales 1950–2100, divididas en celdas (cada celda = un modelo del ensemble), con la mediana en la fila superior. Plots estacionales.
- **Incertidumbre.** Doble criterio: (a) percentiles del ensemble en series, (b) "**model agreement**" en mapas vía hatching denso. C3S declara explícitamente la incertidumbre como información esencial para interpretación correcta.
- **Cartografía.** Choropleth gridded interpolado, agregaciones por país/región, isolíneas opcionales.
- **Trazabilidad.** Dataset CDS `multi-origin-c3s-atlas` con DOI; descarga NetCDF, citación obligatoria.
- **Diseño.** UI moderna basada en componentes web; bilingüe parcial (EN, traducciones puntuales). Tutoriales C3S Training en notebooks Jupyter.

### 1.3 Climate Impact Lab Map — `impactlab.org/map/`

- **Qué muestra.** Impactos socioeconómicos: **mortalidad por temperatura, energía, agricultura, costas, productividad laboral**. División del mundo en **24,378 regiones** (~300,000 hab. cada una, equivalente a un condado de EE.UU.).
- **Dinámica.** Selector de variable de impacto, escenario (SSP3-RCP8.5 por defecto), horizonte (2020–2039, 2040–2059, 2080–2099). Click en región → panel detalle.
- **Gráficos.** Choropleth global, time-series, distribuciones probabilísticas con bandas de percentiles 17–83 (likely range IPCC).
- **Incertidumbre.** Probabilística: la herramienta presenta **cuantiles del ensemble** combinando GCM × modelo de daño. VSL escalado por ingreso (US$10.95 M, EPA 2019).
- **Cartografía.** Choropleth de alta resolución (24k regiones), zoom continuo.
- **Trazabilidad.** Cada métrica enlaza a paper revisado por pares (Carleton et al. 2022 sobre mortalidad). Datos en GitHub público de Rhodium-Group.
- **Diseño.** Storytelling fuerte: la página combina narrativa científica + mapa interactivo + comparador entre escenarios. Inglés único.

### 1.4 World Bank Climate Change Knowledge Portal — `climateknowledgeportal.worldbank.org/country/ecuador`

- **Qué muestra.** Para Ecuador: **climatología histórica CRU 1991–2020**, proyecciones **CMIP6 2015–2100**, indicadores de riesgo, clasificación Köppen-Geiger, ciclos estacionales mensuales y desastres geocodificados desde 1960.
- **Dinámica.** Selector país → admin1 → cuenca. Filtros: variable, escenario (los cinco SSP completos: 1-1.9, 1-2.6, 2-4.5, 3-7.0, 5-8.5), período de referencia, percentil del ensemble.
- **Gráficos.** **Warming stripes**, series anuales con tooltip dinámico, ciclo estacional, mapas espaciales, gráficos de extremos (TX90p, R95p, etc.), comparación 1995–2014 vs futuros.
- **Incertidumbre.** **Mediana del ensemble CMIP6 + percentiles 10 y 90** explícitamente etiquetados en cada gráfico.
- **Cartografía.** Choropleth admin1, capas contextuales (densidad, topografía, infraestructura).
- **Trazabilidad.** Botón "Download Data" en cada panel; API CCKP documentada; metadata por dataset.
- **Diseño.** Limpio, navegación clara, **multilingüe parcial** (perfiles país en EN, ES en algunas regiones). Sección "How to use" pedagógica.

### 1.5 NOAA Climate Explorer (CRT/NEMAC) — `crt-climate-explorer.nemac.org`

- **Qué muestra.** Observado 1950–presente + **proyecciones LOCA estadísticamente downscaled** a escala condado para EE.UU.
- **Dinámica.** Búsqueda por código postal/condado. Variables: T media, máx, mín, días > 90 °F, noches > 70 °F, días helada, precipitación, días > 1 in, etc.
- **Gráficos.** Línea con valor central (media del ensemble) y **bandas min–max del rango de proyecciones**. Despliegue de **promedios decadales** (no anuales) para evitar sobreinterpretación de variabilidad. Tooltip dinámico bajo cursor.
- **Incertidumbre.** Banda min–max del ensemble LOCA + dos escenarios (RCP4.5 "Lower emissions" / RCP8.5 "Higher emissions") superpuestos como criterio narrativo de incertidumbre de escenario.
- **Cartografía.** Mapas choropleth por condado, descargables.
- **Trazabilidad.** Descarga CSV por gráfico, PNG por mapa. Backed por NOAA/NEMAC, USBR, USGS.
- **Diseño.** Interfaz limpia, federalmente branded (NOAA, NASA, USGS, EPA, USBR). Sólo inglés.

### 1.6 NASA Earth Observatory — Global Maps — `science.nasa.gov/earth/earth-observatory/global-maps`

- **Qué muestra.** Variables globales mensuales: NDVI/greenness, T superficie tierra y mar, anomalías térmicas, precipitación TRMM/IMERG, aerosoles (AOD, tamaño partícula), nieve, fracción nubes, vapor de agua, balance radiativo TOA.
- **Dinámica.** **Slider temporal** mensual desde 2000 (MODIS) o desde el inicio de cada producto. Comparación de dos variables lado a lado (e.g. nubes vs vapor).
- **Gráficos.** Solo raster heatmaps; sin time-series en el visor (las series están en EO Explorer separado).
- **Incertidumbre.** No la comunica explícitamente en el visor; los productos vienen con docs científicas externas.
- **Cartografía.** Raster global proyección equirectangular, animaciones GIF generadas, comparativos lado-a-lado.
- **Trazabilidad.** PNG, KMZ (Google Earth), feed RSS. Descarga del archivo NASA Earthdata.
- **Diseño.** Estilo periodístico-científico: cada mapa tiene un párrafo narrativo. Sólo inglés. Paletas perceptualmente uniformes.

### 1.7 INAMHI Ecuador — Visor Hidrometeorológico — `inamhi.gob.ec/info/visor/`

- **Qué muestra.** Lanzado en julio 2023 (proyecto AdaptaClima/PNUD). **Tiempo real** de la red nacional: precipitación, T ambiente, HR, presión, viento, nivel de ríos. Adicionalmente capas de mapa de tipos climáticos, isotermas, isohietas, red UV y calidad de agua.
- **Dinámica.** Mapa con puntos por estación; click → popup con valor instantáneo. Filtros temporales limitados a las últimas horas/días.
- **Gráficos.** Pequeñas series del último día por variable; sin análisis de tendencias ni proyecciones.
- **Incertidumbre.** No se comunica.
- **Cartografía.** Puntos de estaciones (automáticas vs convencionales) sobre base WMS de IGM/INEC.
- **Trazabilidad.** Datos abiertos parciales en `datosabiertos.gob.ec`. Sin DOI.
- **Diseño.** Interfaz Leaflet/ESRI estándar. Solo español. Mobile no optimizado. **Limitación clave:** no comunica clima ni proyecciones, sólo monitoreo en tiempo real.

### 1.8 SENAMHI Perú — Mapa Climático y Visores — `senamhi.gob.pe/mapas/mapa-climatico-v2/`

- **Qué muestra.** Más de 900 estaciones meteorológicas/hidrológicas. **Mapa Climático del Perú** con clasificación Thornthwaite (38 tipos de clima). Monitoreo de precipitación, T mín/máx, sequía, alertas agroclimáticas, nieve, incendios. Página adicional con proyecciones de disponibilidad hídrica futura.
- **Dinámica.** Selector regional, capas temáticas, popups por estación con climatología. App móvil oficial "App SENAMHI Perú".
- **Gráficos.** Climatología mensual, anomalías, normales 1991–2020. Sin gráficos avanzados de incertidumbre.
- **Cartografía.** Choropleth por clasificación climática, puntos graduados de estaciones, raster de anomalías.
- **Trazabilidad.** PDFs técnicos, descarga limitada de datos vía portal de transparencia.
- **Diseño.** Paleta institucional MINAM (azul/verde). Solo español. Versión móvil vía app nativa (mejor que web).

### 1.9 IDEAM Colombia — Geovisor — `ideam.gov.co`

- **Qué muestra.** Geovisor con imágenes de **satélite infrarrojo** en tiempo real (clasificación de nubes/tormentas con paleta púrpura-gris). Sistemas separados: **FEWS-IDEAM** (hidrología), **boletines ENSO**, atlas climatológico nacional, monitoreo de bosque y carbono.
- **Dinámica.** Capas conmutables, animación temporal del satélite.
- **Gráficos.** En boletines PDF (no embebidos en visor). Probabilidad de El Niño 2026 destacada.
- **Incertidumbre.** En boletines ENSO probabilísticos; no en la interfaz cartográfica.
- **Trazabilidad.** SharePoint para descargas, catálogos de información ambiental 2022–2026.
- **Diseño.** Estándar gubernamental colombiano. Solo español. **Nota:** la URL devolvió error de certificado en el fetch; el geovisor está operativo según la guía oficial pero requiere acceso fuera de WebFetch directo.

### 1.10 AdaptWest ClimateNA — `adaptwest.databasin.org`

- **Qué muestra.** Datos **downscaled a 1 km** para Norteamérica. **33 variables bioclimáticas** (medias estacionales/anuales, extremos, GDD/CDD, precipitación nival, PET, índices de sequía) + 48 mensuales (T, P).
- **Dinámica.** Plataforma Data Basin: capas seleccionables, filtros por escenario y horizonte.
- **Gráficos.** Mapas estáticos descargables; análisis interactivo limitado a Data Basin (zoom, identify, swipe).
- **Incertidumbre.** Tres ensembles disponibles: **8-modelos (recomendado, Mahony et al. 2022), 13-modelos sin restricciones, 9 modelos individuales** (ACCESS-ESM1-5, CNRM-ESM2-1, EC-Earth3, GFDL-ESM4, GISS-E2-1-G, MIROC6, MPI-ESM1-2-HR, MRI-ESM2-0, UKESM1-0-LL). Permite al usuario calcular su propio spread.
- **Escenarios.** SSP1-2.6, SSP2-4.5, SSP3-7.0, SSP5-8.5; horizontes 2011–2040, 2041–2070, 2071–2100 (30y) y 2001–2020…2081–2100 (20y).
- **Cartografía.** GeoTIFF Lambert Azimuthal Equal-Area, ~30 MB por capa, ~1 GB por bundle ZIP.
- **Trazabilidad.** Citación obligatoria (AdaptWest Project 2022; Wang et al. 2016; Mahony et al. 2022). Software complementario **ClimateNA v7.3** para extracción puntual reproducible.
- **Diseño.** Data Basin estándar (mapa + leyenda + metadata panel). Solo inglés. Orientado a usuarios técnicos SIG.

---

## 2. Matriz comparativa (10 geoportales × 8 atributos)

| Geoportal | Datos | Escenarios | Gráficos clave | Incertidumbre | Cartografía | Filtros | Descargas/DOI | Diseño |
|---|---|---|---|---|---|---|---|---|
| **IPCC AR6 Atlas** | Hist + CMIP5/6/CORDEX | RCP + 4 SSP + GWL 1.5/2/3/4°C | Mediana + stripes + scatter regional | Hatching AR6 + percentiles + multi-líneas evidencia | Choropleth regiones AR6 + grid | Variable, esc, GWL, estación, baseline | NetCDF + DOI + DataLab notebooks | EN, 3 col, RdBu/YlOrBr |
| **Copernicus C3S Atlas** | ERA5 + CMIP5/6/CORDEX | 4 SSP + RCP | Mediana + stripes verticales por modelo + IQR sombreado | Percentiles 50/80 + model agreement hatching | Grid + agregación país | Variable, esc, baseline, polígono custom | NetCDF CDS + DOI obligatorio | EN, moderno, training Jupyter |
| **Climate Impact Lab** | Impacto socioecon. (mortalidad/agro/energía) | SSP3-8.5 default | Choropleth 24k regiones + bandas P17–P83 | Cuantiles ensemble × modelo daño | Choropleth alta-res | Variable impacto, esc, horizonte | GitHub Rhodium + papers peer-reviewed | EN, storytelling fuerte |
| **WB CCKP Ecuador** | CRU + CMIP6 + Köppen + desastres | 5 SSP completos | Warming stripes + ciclo estacional + extremos | Mediana + P10/P90 explícitos | Choropleth admin1 + capas contexto | País→admin1, var, esc, baseline | CSV + API documentada | EN+ES parcial, "How to use" |
| **NOAA Climate Explorer** | Obs 1950+ + LOCA | RCP4.5 / RCP8.5 | Línea + banda min-max + decadal averages | Banda min-max ensemble + 2 escenarios | Choropleth condado | ZIP / condado, variable | CSV + PNG por gráfico | EN, federal branded |
| **NASA EO Global Maps** | Satelital mensual (NDVI, T, P, AOD…) | Sólo observado | Raster heatmap + comparador lado-a-lado | No explícita en visor | Raster global equirectangular | Variable, mes, año | PNG, KMZ, RSS, Earthdata | EN, narrativa periodística |
| **INAMHI Ecuador** | Tiempo real estaciones | Ninguno | Series últimas horas + isohietas/isotermas estáticas | No comunicada | Puntos estaciones + WMS IGM | Estación, variable, ventana corta | Limitada datosabiertos.gob.ec | ES, Leaflet básico, no-mobile |
| **SENAMHI Perú** | Estaciones + clasificación climática + monitoreo sequía | Disponibilidad hídrica futura (parcial) | Climatología mensual + anomalías | Limitada | Choropleth Thornthwaite + puntos | Región, variable, temporal | PDF + transparencia | ES, app móvil nativa |
| **IDEAM Colombia** | Satélite IR tiempo real + atlas + ENSO | Boletines ENSO probabilísticos | Animación satelital + PDFs | En boletines, no en visor | Capas IR + FEWS hidrológico | Capas, animación temporal | SharePoint | ES, gov estándar |
| **AdaptWest ClimateNA** | 33 bioclim + 48 mensuales 1 km | 4 SSP × 3-4 horizontes | Mapas estáticos + identify/swipe | 3 ensembles (8/13/individual) | Raster 1 km LAEA | Variable, ensemble, esc, horiz | GeoTIFF + ClimateNA v7.3 + cita obligatoria | EN, técnico SIG |

---

## 3. Seis funcionalidades clave a absorber para el visor de Imbabura

1. **Climate stripes verticales con celdas por modelo (ensemble desagregado).** Copernicus C3S las implementa magistralmente: cada barra anual se divide en celdas, una por GCM, con la mediana en la fila superior. **Aplicación nuestra:** una franja por estación INAMHI, dividida en 10 celdas (uno por GCM CMIP6 BASD-PE), mostrando 1981–2070 bajo SSP3-7.0. Permite leer al mismo tiempo señal central y dispersión inter-modelo.

2. **Hatching de "model agreement" sobre mapas.** IPCC AR6 y C3S Atlas son referentes: el rayado indica zonas donde el cambio no es robusto o los modelos discrepan. **Aplicación nuestra:** para mapas CMIP6 al 2041–2070, rayar las celdas donde < 80% de los 10 GCMs coinciden en el signo del cambio. Es cómo el IPCC lo recomienda y eleva nuestra credibilidad científica.

3. **Bandas IQR + mediana + min/max simultáneas en series.** Combinar lo mejor de Copernicus (P25–P75 oscuro, P10–P90 claro) con NOAA Climate Explorer (banda min-max + decadal averages). **Aplicación nuestra:** plot de proyección por estación con cuatro capas: línea mediana de los 10 GCMs, sombra IQR (P25–P75), sombra exterior P10–P90, y banda débil min–max. Sobre esto, suavizado decadal opcional para evitar sobreinterpretar variabilidad anual.

4. **Drill-down jerárquico con tooltip dinámico bajo cursor.** El World Bank CCKP y NOAA Climate Explorer hacen esto bien: el usuario navega país → admin1 → cuenca y los gráficos muestran valores exactos bajo el cursor. **Aplicación nuestra:** Imbabura → banda altitudinal (B1/B2/B3) → estación. Tooltip Plotly con `hovermode='x unified'` mostrando los 10 modelos al pasar el cursor.

5. **Trazabilidad "data + cita + DOI" por cada panel.** AdaptWest e IPCC son los más rigurosos: cada producto incluye metadata, papers asociados y citación obligatoria. **Aplicación nuestra:** botón "Reproducir" en cada figura → modal con DOI/Zenodo del dataset, comando Python con `xarray`/`pandas` que regenera el gráfico, y BibTeX listo para copiar.

6. **Storytelling pedagógico tipo NASA EO + sección "How to use" del WB CCKP.** Cada panel acompañado de un párrafo de 2–3 frases explicando qué se ve, cómo leerlo y cuáles son las limitaciones. **Aplicación nuestra:** crítico para el público mixto (academia + técnicos GAD provincial + comunidad). Cada gráfico de Mann-Kendall, ENSO o CMIP6 con su mini-narrativa científica accesible.

---

## 4. Diferenciador del Geoportal de Imbabura

Ninguno de los 10 ofrece la combinación que sí podemos entregar:

- **ENSO interactivo a escala de estación.** Climate Impact Lab e IPCC trabajan a escala regional o subcontinental. WB CCKP entrega ENSO solo como contexto narrativo. **Nuestro visor mostraría los 588 tests Spearman corregidos por FDR-BH como un heatmap interactivo de 21 estaciones × 28 combinaciones (variable × lag × índice ENSO), con celdas significativas sólidas y no significativas atenuadas.** Esto no existe en ningún portal mundial revisado.
- **Trazabilidad por estación con datos in-situ INAMHI digitalizados.** Los geoportales globales operan sobre productos gridded (ERA5, CRU, CHIRPS). **Nuestro punto fuerte es el acceso a la serie cruda de cada estación INAMHI 1981–2025**, validada y digitalizada, con el cuaderno Jupyter de Mann-Kendall + Theil-Sen reproducible.
- **Bilingüe ES/EN nativo.** Sólo WB CCKP tiene traducción parcial; INAMHI, SENAMHI e IDEAM son monolingües ES; el resto monolingües EN. **Un visor ES/EN nativo con toggle inmediato es ventaja competitiva clara para visibilidad internacional + apropiación local.**
- **Bandas altitudinales como dimensión nativa de filtro.** Ningún visor mundial filtra por banda altitudinal andina (B1 < 2000, B2 2000–2800, B3 > 2800 m). Esto es esencial en la cordillera ecuatorial donde la altitud explica más varianza climática que la latitud.
- **Validación cruzada satelital embebida.** Mostrar simultáneamente la estación y los productos satelitales co-localizados (CHIRPS, ERA5-Land, IMERG) con su métrica de error (RMSE, sesgo, KGE) por celda y mes. AdaptWest hace algo análogo para Norteamérica, pero no a escala estación-celda con métrica embebida.

La cuña competitiva del geoportal de Imbabura es por tanto: **escala fina (estación + banda altitudinal) + metodología publicable (MK + TS + FDR + BASD-PE) + bilingüe + reproducible**.

---

## 5. Top 3 gráficos a implementar (por prioridad)

### Prioridad #1 — Heatmap ENSO interactivo (`enso_per_station.json`, 588 records)

- **Tipo Plotly:** `go.Heatmap` con colorscale divergente (RdBu) sobre matriz 21 estaciones × 28 combinaciones (4 índices ENSO: ONI, MEI, SOI, Niño3.4 × 7 lags 0–6 meses). Valor = ρ de Spearman.
- **Interactividad:** opacidad 0.3 para celdas con `q_fdr > 0.05` (no significativas tras FDR-BH), opacidad 1.0 para significativas. Click en celda → modal con scatter del par estación×índice y línea de regresión.
- **Por qué primero:** es el diferenciador único del visor. Nadie en el mundo muestra esto a escala de estación con corrección de comparaciones múltiples explícita.

### Prioridad #2 — Time-series de proyección con bandas IQR + mediana + min/max (`cmip6_projections.json`, 45 records + `climatology.json` para baseline 1981–2010)

- **Tipo Plotly:** combinación de `go.Scatter` con `fill='tonexty'`. Cuatro trazas: mediana ensemble (línea sólida), banda P25–P75 (`fillcolor` rgba alpha 0.5), banda P10–P90 (alpha 0.25), banda min–max (alpha 0.1). Se sobreimprime la observación INAMHI 1981–2025 como línea negra y el baseline 1981–2010 como banda gris.
- **Filtros:** estación, variable (Tmin/Tmax/Pp), escenario (SSP1-2.6/3-7.0/5-8.5).
- **Por qué segundo:** es la "moneda visual" de las proyecciones climáticas que IPCC, C3S y WB CCKP usan; familiar para revisores y usuarios técnicos.

### Prioridad #3 — Pequeños múltiplos (small multiples) de Mann-Kendall + Theil-Sen por banda altitudinal (`trends_per_station.json`, 147 records = 21 estaciones × 7 variables)

- **Tipo Plotly:** subplot grid `make_subplots(rows=3, cols=7)` con tres filas (B1/B2/B3) y siete columnas (variables). Cada celda es un `go.Scatter` con la serie observada + línea de tendencia Theil-Sen. Marcador del slope ± IC95% en la esquina, coloreado por significancia MK (verde p<0.01, amarillo p<0.05, gris ns).
- **Interactividad:** click sobre cualquier subplot abre vista expandida con el ajuste completo y los residuos.
- **Por qué tercero:** comunica de un vistazo el patrón altitudinal de tendencias 1981–2025, que es uno de los hallazgos centrales del manuscrito IJC. Las bandas altitudinales como fila lo hacen único frente a los visores globales que usan grilla regular.

---

## 6. Recomendaciones transversales de diseño

- **Paleta:** divergente científica (`RdBu_r` o `BrBG`) para anomalías y correlaciones; secuencial perceptualmente uniforme (`viridis`, `cividis`) para variables absolutas. Evitar `jet` y `rainbow` (criterio IPCC AR6 y C3S).
- **Tipografía:** sans serif legible (Inter o IBM Plex Sans) para UI; serif (Source Serif Pro) para narrativa científica si se quiere distinción tipo NASA EO.
- **Layout:** tres columnas tipo IPCC Atlas (controles izquierda 280 px, mapa central flexible, panel de gráficos derecha 420 px) en desktop; reflow vertical en tablet; bottom-sheet en móvil tipo C3S.
- **Bilingüe:** toggle ES/EN persistente en header, con i18n a nivel de etiquetas, tooltips y narrativa. Las leyendas técnicas (unidades, percentiles) idealmente bilingües simultáneas.
- **Trazabilidad:** botón "DOI/Reproducir" en cada panel con modal que expone Zenodo DOI + script Python + BibTeX. Ninguno de los visores observados lo hace tan integrado; sería diferenciador.
- **Performance:** GeoJSON simplificado con `topojson` o mosaicos vectoriales (PMTiles) para los 21 puntos estación + bandas altitudinales como polígonos pre-renderizados. Plotly con `config={'responsive': True}` y `staticPlot=False`.

---

## 7. Síntesis ejecutiva

De los 10 portales analizados, los referentes metodológicos son **IPCC AR6 Atlas** (estándar de comunicación de incertidumbre) y **Copernicus C3S Atlas** (mejor implementación de stripes desagregados por modelo). Los referentes pedagógicos son **WB CCKP** (claridad y multilingüe parcial) y **NASA EO** (narrativa periodística). El referente de fineza espacial es **AdaptWest ClimateNA** (1 km + ensembles configurables). Los visores nacionales sudamericanos (INAMHI, SENAMHI, IDEAM) cubren tiempo real pero **no comunican proyecciones ni incertidumbre de forma integrada**: ahí hay un vacío que el Geoportal Hidroclimático de Imbabura puede llenar siendo el primer visor andino que integra observado + tendencias estadísticas + ENSO + CMIP6 con incertidumbre y trazabilidad reproducibles, en español e inglés, con datos in-situ INAMHI digitalizados.

El roadmap mínimo viable propuesto es: (a) heatmap ENSO interactivo con FDR como pieza distintiva, (b) time-series de proyección IQR/min-max al estilo IPCC+C3S, (c) small multiples MK+Theil-Sen por banda altitudinal. Sobre esos tres pilares se construye un visor que dialoga de igual a igual con los referentes globales y aporta lo que ninguno tiene: granularidad estación-banda andina + reproducibilidad por panel.
