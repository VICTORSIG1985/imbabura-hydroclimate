'use client';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { figureUrl } from '@/lib/assets';
import { X, ChevronLeft, ChevronRight, Info, Lightbulb } from 'lucide-react';

interface FigureMeta {
  id: string;
  number: number;
  filename: string;
  group: 'main' | 'si';
  caption_es: string;
  caption_en: string;
  details_es: string;
  details_en: string;
  meaning_es: string;
  meaning_en: string;
  related_es: string;
  related_en: string;
}

const FIGURES_DATA: FigureMeta[] = [
  {
    id: 'F1', number: 1, filename: 'Figure_01.png', group: 'main',
    caption_es: 'Mapa de las 21 estaciones INAMHI con bandas altitudinales',
    caption_en: 'Map of the 21 INAMHI stations with altitudinal bands',
    details_es: 'Distribución espacial de las 21 estaciones meteorológicas analizadas (18 en Imbabura, 3 en Carchi). Los símbolos están coloreados por banda altitudinal: B1 <2 000 m (rojo), B2 2 000–2 800 m (ámbar), B3 >2 800 m (verde). Triángulos = estaciones automáticas (M0105 Otavalo, M1240 Ibarra-INAMHI). El polígono delimita la provincia de Imbabura sobre el modelo digital de elevación SRTM.',
    details_en: 'Spatial distribution of the 21 meteorological stations analysed (18 in Imbabura, 3 in Carchi). Symbols are colour-coded by altitudinal band: B1 <2,000 m (red), B2 2,000–2,800 m (amber), B3 >2,800 m (green). Triangles = automatic stations (M0105 Otavalo, M1240 Ibarra-INAMHI). The polygon delimits Imbabura Province over the SRTM digital elevation model.',
    meaning_es: 'Imbabura tiene un relieve tan accidentado que en menos de 100 km de distancia hay 4 000 m de diferencia de altitud. Eso significa que en la misma provincia conviven climas tropicales calientes en el valle del Chota con páramos fríos sobre los 3 000 m. Las 21 estaciones meteorológicas se distribuyen para cubrir esa heterogeneidad.',
    meaning_en: 'Imbabura has terrain so rugged that within less than 100 km there are 4,000 m of elevation difference. This means warm tropical climates in the Chota valley coexist with cold páramos above 3,000 m, all in the same province. The 21 weather stations are distributed to cover that heterogeneity.',
    related_es: 'Sección 3.1 · Tabla 1', related_en: 'Section 3.1 · Table 1',
  },
  {
    id: 'F2', number: 2, filename: 'Figure_02.png', group: 'main',
    caption_es: 'Tendencias Mann-Kendall · precipitación CHIRPS (izq.) y Tmean ERA5-Land (der.)',
    caption_en: 'Mann-Kendall trends · CHIRPS precipitation (left) and ERA5-Land Tmean (right)',
    details_es: 'Pendientes Theil-Sen anuales 1981–2025. Izquierda: CHIRPS precipitación (mm/año), 7 estaciones significativas concentradas en la vertiente occidental. Derecha: ERA5-Land temperatura media (°C/año), 19 de 21 estaciones con calentamiento significativo (mediana +0.0118 °C/año = +0.52 °C en 44 años).',
    details_en: 'Annual Theil-Sen slopes 1981–2025. Left: CHIRPS precipitation (mm/year), 7 significant stations concentrated on the western slope. Right: ERA5-Land mean temperature (°C/year), 19 of 21 stations with significant warming (median +0.0118 °C/year = +0.52 °C over 44 years).',
    meaning_es: 'Imbabura se ha calentado en los últimos 44 años: 19 de cada 21 puntos analizados muestran subida real de temperatura (mediana medio grado en 44 años). En cuanto a la lluvia, el cambio no es uniforme: solo en el lado occidental (vertiente del Mira) se observa un aumento estadístico claro; en el resto la lluvia anual no ha cambiado de forma demostrable.',
    meaning_en: 'Imbabura has warmed during the last 44 years: 19 of every 21 points analysed show real temperature rise (median half a degree in 44 years). For rainfall, the change is not uniform: only on the western side (Mira slope) is a clear statistical increase observed; elsewhere annual rainfall has not changed demonstrably.',
    related_es: 'Sección 4.1 · Tabla 2', related_en: 'Section 4.1 · Table 2',
  },
  {
    id: 'F3', number: 3, filename: 'Figure_03.png', group: 'main',
    caption_es: 'Lapse rate altitudinal in-situ · 7 estaciones climatológicas',
    caption_en: 'In-situ altitudinal lapse rate · 7 climatological stations',
    details_es: 'Regresión OLS entre temperatura media in-situ INAMHI 1994–2013 (post-QC) y elevación de las 7 estaciones climatológicas con calidad A. Pendiente: −8.24 °C/km (R² = 0.97, p = 7.5×10⁻⁵). IC 95 % bootstrap (1 000 réplicas): [−10.87, −6.99] °C/km.',
    details_en: 'OLS regression between in-situ INAMHI 1994–2013 (post-QC) mean temperature and elevation of the 7 climatological stations with quality A. Slope: −8.24 °C/km (R² = 0.97, p = 7.5×10⁻⁵). Bootstrap 95 % CI (1,000 replicates): [−10.87, −6.99] °C/km.',
    meaning_es: 'Por cada 1 000 m que se sube en altitud en Imbabura, la temperatura cae aproximadamente 8.2 °C. Es la tasa típica de los Andes tropicales. Esa relación lineal tan fuerte (R² = 0.97) confirma que la altitud es el factor dominante que controla la temperatura en la provincia.',
    meaning_en: 'For every 1,000 m climbed in Imbabura, temperature drops about 8.2 °C. This is the typical rate for the tropical Andes. The strong linear relationship (R² = 0.97) confirms that elevation is the dominant factor controlling temperature in the province.',
    related_es: 'Sección 4.1 · Apéndice A1', related_en: 'Section 4.1 · Appendix A1',
  },
  {
    id: 'F4', number: 4, filename: 'Figure_04.png', group: 'main',
    caption_es: 'Correlación ENSO–precipitación por estación (Spearman ρ)',
    caption_en: 'ENSO–precipitation correlation per station (Spearman ρ)',
    details_es: 'Correlación de Spearman entre precipitación CHIRPS mensual y el índice ONI (1981–2025) con rezagos 0 a 3 meses. Las 21 estaciones presentan correlación negativa significativa (mediana ρ = −0.23). El rezago dominante es de 3 meses en 17 estaciones.',
    details_en: 'Spearman correlation between monthly CHIRPS precipitation and the ONI index (1981–2025) with 0 to 3 month lags. All 21 stations show significant negative correlation (median ρ = −0.23). Dominant lag is 3 months at 17 stations.',
    meaning_es: 'Cuando el océano Pacífico se calienta (fenómeno El Niño), Imbabura llueve menos — pero no de inmediato. La señal demora unos 3 meses en llegar al valle interandino. Esto se ve en las 21 estaciones de la provincia, lo que hace que sea una respuesta climática robusta y útil para anticiparse a temporadas más secas durante eventos El Niño fuertes.',
    meaning_en: 'When the Pacific Ocean warms (El Niño phenomenon), Imbabura receives less rain — but not immediately. The signal takes about 3 months to reach the inter-Andean valley. This appears at all 21 stations of the province, making it a robust climate response useful for anticipating drier seasons during strong El Niño events.',
    related_es: 'Sección 4.3 · Tabla 4', related_en: 'Section 4.3 · Table 4',
  },
  {
    id: 'F5', number: 5, filename: 'Figure_05.png', group: 'main',
    caption_es: 'CMIP6 histórico vs observación · 100 % acuerdo de signo',
    caption_en: 'Historical CMIP6 vs observation · 100 % sign agreement',
    details_es: 'Comparación de pendientes Theil-Sen 1981–2014 entre el ensemble BASD-CMIP6-PE (10 GCMs) por banda altitudinal y el valor observacional regional. La pendiente CMIP6 mediana (+0.021 a +0.024 °C/año) es aproximadamente el doble de la observacional ERA5-Land (+0.0118 °C/año), consistente con lo reportado para otras regiones montañosas (Pepin et al. 2022).',
    details_en: 'Comparison of 1981–2014 Theil-Sen slopes between the BASD-CMIP6-PE ensemble (10 GCMs) per altitudinal band and the regional observational value. The median CMIP6 slope (+0.021 to +0.024 °C/year) is roughly twice the observational ERA5-Land (+0.0118 °C/year), consistent with reports for other mountain regions (Pepin et al. 2022).',
    meaning_es: 'Antes de creer en lo que dicen los modelos para el futuro, hay que verificar que reproducen el pasado. Esta gráfica muestra que los 10 modelos climáticos internacionales coinciden con la dirección del calentamiento observado en Imbabura (todos suben), aunque con magnitudes algo distintas — lo cual es normal y se documenta como contexto de incertidumbre.',
    meaning_en: 'Before trusting model projections for the future, we must verify they reproduce the past. This chart shows that the 10 international climate models agree with the direction of observed warming in Imbabura (all show warming), though with somewhat different magnitudes — which is normal and documented as uncertainty context.',
    related_es: 'Sección 4.4', related_en: 'Section 4.4',
  },
  {
    id: 'F6', number: 6, filename: 'Figure_06.png', group: 'main',
    caption_es: 'Bias absoluto CMIP6 vs ERA5-Land 1991–2010 por banda',
    caption_en: 'CMIP6 vs ERA5-Land 1991–2010 absolute bias per band',
    details_es: 'Diagnóstico de incompatibilidad de representación entre el grid CMIP6 (~100 km) y el reanálisis ERA5-Land (~9 km). El bias absoluto disminuye con la elevación (suavizado orográfico en la mayor resolución). NO se interpreta como skill del GCM, sino como contraste de escalas.',
    details_en: 'Diagnostic of representation incompatibility between the CMIP6 grid (~100 km) and the ERA5-Land reanalysis (~9 km). Absolute bias decreases with elevation (orographic smoothing at higher resolution). NOT interpreted as GCM skill, but as a scale contrast.',
    meaning_es: 'Los modelos climáticos globales miran el planeta con una "lupa" más gruesa (cada celda mide ~100 km). Cuando esa lupa pasa sobre Imbabura, no logra ver con detalle los valles y montañas que sí captan productos satelitales más finos. Esta gráfica muestra ese desajuste de escala — no es un error del modelo, es una limitación inherente que hay que tener en cuenta al interpretar resultados puntuales.',
    meaning_en: 'Global climate models view the planet with a coarser "lens" (each cell ~100 km). When that lens passes over Imbabura, it cannot resolve the valleys and mountains that finer satellite products do capture. This chart shows that scale mismatch — it is not a model error, but an inherent limitation to keep in mind when interpreting point-level results.',
    related_es: 'Sección 4.4', related_en: 'Section 4.4',
  },
  {
    id: 'F7', number: 7, filename: 'Figure_07.png', group: 'main',
    caption_es: 'ENSO CMIP6 vs observaciones · GCMs subestiman teleconexión',
    caption_en: 'CMIP6 ENSO vs observations · GCMs underestimate teleconnection',
    details_es: 'Los GCMs tienden a subestimar la fuerza de la teleconexión negativa observada, con valores ρ medianos cercanos a cero en varias bandas y escenarios. Solo 10–40 % de los GCMs alcanzan significancia estadística — limitación conocida de modelos de circulación general en variabilidad de alta frecuencia del Pacífico tropical en zonas montañosas.',
    details_en: 'GCMs tend to underestimate the strength of the observed negative teleconnection, with median ρ values close to zero in several bands and scenarios. Only 10–40 % of GCMs reach statistical significance — a known limitation of general circulation models in high-frequency tropical Pacific variability over mountainous areas.',
    meaning_es: 'Aunque los modelos climáticos son buenos para proyectar tendencias de largo plazo, no logran capturar bien la conexión específica entre El Niño y la lluvia en Imbabura. La realidad observada muestra una conexión más fuerte que la simulada. Esto significa que para predecir efectos puntuales de El Niño es mejor usar las observaciones locales y no los modelos globales.',
    meaning_en: 'Although climate models are good at projecting long-term trends, they struggle to capture the specific connection between El Niño and rainfall in Imbabura. Observed reality shows a stronger connection than the simulated one. So to predict specific El Niño effects, local observations are preferable to global models.',
    related_es: 'Sección 4.4', related_en: 'Section 4.4',
  },
  {
    id: 'F8', number: 8, filename: 'Figure_08.png', group: 'main',
    caption_es: 'Proyecciones CMIP6 2041–2070 por SSP · cambio mediano + IQR',
    caption_en: 'CMIP6 projections 2041–2070 per SSP · median change + IQR',
    details_es: 'Cambios proyectados respecto a 1991–2010 para Tmean, Tmax, Tmin, precipitación y ET₀-HS bajo SSP1-2.6, SSP3-7.0 y SSP5-8.5. Calentamiento mediano +1.09 °C (SSP1-2.6) a +2.11 °C (SSP5-8.5). Precipitación +5 a +8 %. ET₀-HS +3 a +7 %. 100 % acuerdo de signo en temperatura entre los 10 GCMs.',
    details_en: 'Projected changes relative to 1991–2010 for Tmean, Tmax, Tmin, precipitation and ET₀-HS under SSP1-2.6, SSP3-7.0 and SSP5-8.5. Median warming +1.09 °C (SSP1-2.6) to +2.11 °C (SSP5-8.5). Precipitation +5 to +8 %. ET₀-HS +3 to +7 %. 100 % sign agreement in temperature among the 10 GCMs.',
    meaning_es: 'Hacia mediados de siglo Imbabura va a estar más cálida — la pregunta es cuánto. En el escenario optimista (si el mundo reduce mucho sus emisiones), aumenta cerca de 1 °C. En el pesimista (si las emisiones siguen creciendo), aumenta hasta 2 °C. La lluvia podría aumentar moderadamente (5–8 %) y la evapotranspiración crecerá, lo que significa más estrés hídrico estacional pese a tener algo más de lluvia anual.',
    meaning_en: 'By mid-century Imbabura will be warmer — the question is by how much. In the optimistic scenario (if the world strongly reduces emissions), it warms about 1 °C. In the pessimistic one (if emissions keep rising), it warms up to 2 °C. Rainfall could increase moderately (5–8 %) and evapotranspiration will grow — meaning more seasonal water stress despite somewhat higher annual rainfall.',
    related_es: 'Sección 4.5 · Tabla 7', related_en: 'Section 4.5 · Table 7',
  },
  {
    id: 'F9', number: 9, filename: 'Figure_09.png', group: 'main',
    caption_es: 'Firma EDW · amplificación altitudinal del calentamiento',
    caption_en: 'EDW signature · altitudinal amplification of warming',
    details_es: 'Patrón Elevation-Dependent Warming: el calentamiento proyectado crece monotónicamente con la altitud. Bajo SSP5-8.5, +1.96 °C en B1 vs +2.11 °C en B3 (diferencia +0.15 °C entre bandas extremas). Más pronunciado en Tmin, consistente con reducción de enfriamiento radiativo nocturno en altura.',
    details_en: 'Elevation-Dependent Warming pattern: projected warming grows monotonically with elevation. Under SSP5-8.5, +1.96 °C in B1 vs +2.11 °C in B3 (difference +0.15 °C between extreme bands). More pronounced in Tmin, consistent with reduced nocturnal radiative cooling at elevation.',
    meaning_es: 'Las zonas altas de Imbabura — los páramos sobre 2 800 m — se calentarán algo más rápido que los valles bajos. La diferencia es modesta (≈ 0.15 °C extra hacia 2070), pero acumulada en décadas tiene implicaciones reales para los páramos, el límite altitudinal del bosque andino y las fuentes de agua de montaña.',
    meaning_en: 'High-elevation areas of Imbabura — páramos above 2,800 m — will warm slightly faster than the low valleys. The difference is modest (≈ 0.15 °C extra by 2070), but accumulated over decades it has real implications for páramos, the Andean forest altitudinal limit, and mountain water sources.',
    related_es: 'Sección 4.5 · §5.4', related_en: 'Section 4.5 · §5.4',
  },
  {
    id: 'F10', number: 10, filename: 'Figure_10.png', group: 'main',
    caption_es: 'Pendiente Sen CMIP6 por banda · confirmación EDW',
    caption_en: 'CMIP6 Sen slope per band · EDW confirmation',
    details_es: 'Pendientes Theil-Sen por banda altitudinal × variable × SSP. Patrón B3 > B2 > B1 sostenido para Tmean y Tmin bajo los tres SSPs. La amplificación EDW absoluta bajo SSP5-8.5 es ≈ +0.005 °C/año entre la banda más alta y la más baja, equivalente a ≈ 0.25 °C adicionales sobre los 50 años de proyección.',
    details_en: 'Theil-Sen slopes per altitudinal band × variable × SSP. B3 > B2 > B1 pattern sustained for Tmean and Tmin under all three SSPs. EDW absolute amplification under SSP5-8.5 is ≈ +0.005 °C/year between the highest and lowest bands, equivalent to ≈ 0.25 °C additional over the 50 projection years.',
    meaning_es: 'Esta es la confirmación cuantitativa del patrón anterior: las bandas altas se calientan a una tasa anual ligeramente mayor que las bajas en los tres escenarios futuros. Es una señal pequeña pero consistente, registrada también en otras cordilleras tropicales del mundo.',
    meaning_en: 'This is the quantitative confirmation of the previous pattern: high bands warm at a slightly higher annual rate than low bands across all three future scenarios. A small but consistent signal, also recorded in other tropical mountain ranges worldwide.',
    related_es: 'Sección 4.5 · §5.4', related_en: 'Section 4.5 · §5.4',
  },
  // Suplementarias
  {
    id: 'S1', number: 1, filename: 'Figure_S01.png', group: 'si',
    caption_es: 'Cobertura temporal de los registros mensuales INAMHI 1994–2013',
    caption_en: 'Temporal coverage of INAMHI monthly records 1994–2013',
    details_es: 'Heatmap de disponibilidad: para cada estación (filas) y cada mes (columnas), color verde = registro válido tras QC, gris = ausente. Identifica períodos críticos de baja cobertura.',
    details_en: 'Availability heatmap: for each station (rows) and month (columns), green = valid post-QC record, grey = missing. Identifies critical periods of low coverage.',
    meaning_es: 'No siempre hay datos disponibles para todos los meses y estaciones. Este gráfico permite ver qué tan completa está la información y qué períodos requieren más cuidado al interpretar.',
    meaning_en: 'Data is not always available for every month and station. This chart shows how complete the information is and which periods require greater care when interpreted.',
    related_es: 'Apéndice metodológico', related_en: 'Methodological appendix',
  },
  {
    id: 'S2', number: 2, filename: 'Figure_S02.png', group: 'si',
    caption_es: 'Climatología CHIRPS 1991–2020 por banda altitudinal',
    caption_en: 'CHIRPS climatology 1991–2020 per altitudinal band',
    details_es: 'Climatología WMO 1991–2020 mensual de precipitación CHIRPS agregada por banda altitudinal. Muestra el régimen bimodal característico (picos MAM y SON) y el contraste de magnitud entre la vertiente occidental y la cuenca interandina.',
    details_en: 'WMO 1991–2020 monthly CHIRPS precipitation climatology aggregated by altitudinal band. Shows the characteristic bimodal regime (MAM and SON peaks) and the magnitude contrast between the western slope and the inter-Andean basin.',
    meaning_es: 'Imbabura tiene dos temporadas de lluvia al año (marzo–mayo y septiembre–noviembre). Las zonas altas reciben más lluvia que los valles bajos secos. Este es el "patrón normal" contra el que se compara cualquier cambio climático observado.',
    meaning_en: 'Imbabura has two rainy seasons per year (March–May and September–November). High-elevation areas receive more rain than dry low valleys. This is the "normal pattern" against which any observed climate change is compared.',
    related_es: 'Sección 3.1', related_en: 'Section 3.1',
  },
  {
    id: 'S3', number: 3, filename: 'Figure_S03.png', group: 'si',
    caption_es: 'Tendencias MK + Theil-Sen para Tmax y Tmin (ERA5-Land 1981–2025)',
    caption_en: 'MK + Theil-Sen trends for Tmax and Tmin (ERA5-Land 1981–2025)',
    details_es: 'Pendientes anuales para temperatura máxima y mínima diaria. Tmin muestra calentamiento más pronunciado consistente con reducción del enfriamiento nocturno (Pepin et al. 2022). Significancia indicada por contorno grueso.',
    details_en: 'Annual slopes for daily maximum and minimum temperature. Tmin shows more pronounced warming consistent with reduced nocturnal cooling (Pepin et al. 2022). Significance indicated by thick contour.',
    meaning_es: 'Las noches están subiendo de temperatura más rápido que los días. Esto es típico del calentamiento global y reduce el contraste térmico entre día y noche, con consecuencias sobre la agricultura y los ecosistemas que dependen del frío nocturno.',
    meaning_en: 'Nights are warming faster than days. This is typical of global warming and reduces the day-night temperature contrast, with consequences for agriculture and ecosystems that depend on nocturnal cooling.',
    related_es: 'Sección 4.1', related_en: 'Section 4.1',
  },
  {
    id: 'S4', number: 4, filename: 'Figure_S04.png', group: 'si',
    caption_es: 'Tendencias MK + Theil-Sen para humedad relativa y PET',
    caption_en: 'MK + Theil-Sen trends for relative humidity and PET',
    details_es: 'Tendencia de humedad relativa ERA5 (52 % estaciones sig.) y evapotranspiración potencial TerraClimate. La PET pierde significancia bajo MMK Hamed-Rao (AC1=0.47), reportado en Tabla 3.',
    details_en: 'ERA5 relative humidity trend (52 % significant stations) and TerraClimate potential evapotranspiration. PET loses significance under MMK Hamed-Rao (AC1=0.47), reported in Table 3.',
    meaning_es: 'La humedad y la demanda evaporativa están cambiando, pero la señal es menos clara que la de la temperatura. Por eso este resultado se reporta con cautela, indicando explícitamente cuáles tendencias son robustas y cuáles son sensibles a los métodos estadísticos usados.',
    meaning_en: 'Humidity and evaporative demand are changing, but the signal is less clear than for temperature. So this result is reported cautiously, explicitly stating which trends are robust and which are sensitive to the statistical methods used.',
    related_es: 'Sección 4.1 · §5.5', related_en: 'Section 4.1 · §5.5',
  },
  {
    id: 'S5', number: 5, filename: 'Figure_S05.png', group: 'si',
    caption_es: 'Tendencia MK + Theil-Sen del PDSI (TerraClimate 1981–2024)',
    caption_en: 'PDSI MK + Theil-Sen trend (TerraClimate 1981–2024)',
    details_es: 'Palmer Drought Severity Index 1981–2024. 14 de 21 estaciones presentan tendencia positiva significativa, indicando aumento de humedad del suelo en el período observacional.',
    details_en: 'Palmer Drought Severity Index 1981–2024. 14 of 21 stations show significant positive trend, indicating increased soil moisture during the observational period.',
    meaning_es: 'En las últimas décadas la humedad del suelo en Imbabura ha aumentado en general — un dato útil para agricultura. Pero esto no garantiza que siga así en el futuro: las proyecciones muestran mayor demanda evaporativa.',
    meaning_en: 'Over recent decades, soil moisture in Imbabura has generally increased — useful information for agriculture. But this is no guarantee for the future: projections show greater evaporative demand.',
    related_es: 'Sección 4.1 · Tabla 3', related_en: 'Section 4.1 · Table 3',
  },
  {
    id: 'S6', number: 6, filename: 'Figure_S06.png', group: 'si',
    caption_es: 'Distribución de PDSI por fase ENSO y banda altitudinal',
    caption_en: 'PDSI distribution by ENSO phase and altitudinal band',
    details_es: 'Box-plots de PDSI durante fases El Niño / Neutral / La Niña, estratificados por banda altitudinal. Visualiza la modulación oceánica de la sequía en escala andina.',
    details_en: 'PDSI box-plots during El Niño / Neutral / La Niña phases, stratified by altitudinal band. Visualises oceanic modulation of drought at Andean scale.',
    meaning_es: 'Durante años de El Niño la sequía es más probable, mientras que durante La Niña hay más humedad. El gráfico ordena estos años por intensidad y muestra cuánto influye el océano en las condiciones secas o húmedas a distintas altitudes.',
    meaning_en: 'During El Niño years drought is more likely, while La Niña years bring more moisture. The chart orders these years by intensity and shows how much the ocean influences dry or wet conditions at different elevations.',
    related_es: 'Sección 4.3', related_en: 'Section 4.3',
  },
  {
    id: 'S7', number: 7, filename: 'Figure_S07.png', group: 'si',
    caption_es: 'Diagrama de Taylor · ensemble BASD-CMIP6-PE vs ERA5-Land/CHIRPS',
    caption_en: 'Taylor diagram · BASD-CMIP6-PE ensemble vs ERA5-Land/CHIRPS',
    details_es: 'Diagrama de Taylor del ciclo anual climatológico 1991–2010. Posición de cada GCM en el plano correlación-desviación normalizada permite identificar modelos con mejor concordancia con la observación regional.',
    details_en: 'Taylor diagram of the 1991–2010 climatological annual cycle. Each GCM\'s position in the correlation-normalised standard deviation plane identifies models with best regional observation agreement.',
    meaning_es: 'No todos los modelos climáticos representan igual de bien el clima de Imbabura. Este diagrama permite ver cuáles se acercan más a las observaciones — útil cuando se tiene que confiar más en unos modelos que en otros para análisis específicos.',
    meaning_en: 'Not all climate models reproduce Imbabura\'s climate equally well. This diagram identifies which ones come closer to observations — useful when trusting some models more than others for specific analyses.',
    related_es: 'Sección 3.5', related_en: 'Section 3.5',
  },
  {
    id: 'S8', number: 8, filename: 'Figure_S08.png', group: 'si',
    caption_es: 'Niveles de retorno GEV · Rx1day y Rx5day (CHIRPS diario)',
    caption_en: 'GEV return levels · Rx1day and Rx5day (CHIRPS daily)',
    details_es: 'Niveles de retorno a 10, 50 y 100 años para máximos diarios (Rx1day) y máximos consecutivos de 5 días (Rx5day) por banda altitudinal. Bandas de incertidumbre obtenidas por bootstrap de 50 réplicas (semilla=42).',
    details_en: '10, 50 and 100-year return levels for daily maxima (Rx1day) and consecutive 5-day maxima (Rx5day) per altitudinal band. Uncertainty bands obtained from 50 bootstrap replicates (seed=42).',
    meaning_es: 'Cada cuánto puede esperarse una lluvia extrema en Imbabura. Por ejemplo, un evento de Rx1day "de 100 años" es la lluvia diaria que estadísticamente ocurre una vez cada 100 años. Información útil para diseño de obras hidráulicas y planificación urbana.',
    meaning_en: 'How often extreme rainfall is expected in Imbabura. For example, a "100-year" Rx1day event is the daily rainfall that statistically occurs once every 100 years. Useful information for hydraulic infrastructure design and urban planning.',
    related_es: 'Sección 4.2 · Tabla S9', related_en: 'Section 4.2 · Table S9',
  },
  {
    id: 'S9', number: 9, filename: 'Figure_S09.png', group: 'si',
    caption_es: 'Tendencias MOD16A2GF de PET y ET por banda · 2001–2024',
    caption_en: 'MOD16A2GF PET and ET trends per band · 2001–2024',
    details_es: 'Producto satelital MODIS de evapotranspiración a 500 m. Período corto (24 años) limita la potencia estadística; tendencias no superan FDR-BH y se reportan solo como consistencia direccional.',
    details_en: 'MODIS satellite evapotranspiration product at 500 m. Short period (24 years) limits statistical power; trends do not pass FDR-BH and are reported only as directional consistency.',
    meaning_es: 'Producto satelital con buena resolución espacial pero corto período de cobertura. Sirve como verificación cualitativa de las tendencias observadas en otros productos, pero no es suficiente para conclusiones estadísticas firmes por sí solo.',
    meaning_en: 'A satellite product with good spatial resolution but a short coverage period. It serves as qualitative verification of trends seen in other products, but is not enough on its own for firm statistical conclusions.',
    related_es: 'Sección 4.1 · §5.5', related_en: 'Section 4.1 · §5.5',
  },
  {
    id: 'S10', number: 10, filename: 'Figure_S10.png', group: 'si',
    caption_es: 'Índices ETCCDI · Rx1day, Rx5day, R95p, CDD, PRCPTOT',
    caption_en: 'ETCCDI indices · Rx1day, Rx5day, R95p, CDD, PRCPTOT',
    details_es: 'Cinco índices del comité ETCCDI sobre CHIRPS diario. Rx1day +0.49 mm/año, R95p +4.17 mm/año confirman intensificación de extremos sin cambio volumétrico (consistente con Clausius-Clapeyron).',
    details_en: 'Five ETCCDI committee indices over daily CHIRPS. Rx1day +0.49 mm/year, R95p +4.17 mm/year confirm extreme intensification without volumetric change (consistent with Clausius-Clapeyron).',
    meaning_es: 'Aunque la cantidad total de lluvia anual no haya cambiado, sí están aumentando los días de lluvia intensa. En otras palabras: cuando llueve, llueve más fuerte. Esta tendencia es un patrón documentado a nivel global y tiene implicaciones para inundaciones y deslizamientos.',
    meaning_en: 'Although total annual rainfall has not changed, the days of intense rain are increasing. In other words: when it rains, it rains harder. This trend is a globally documented pattern with implications for floods and landslides.',
    related_es: 'Sección 4.2', related_en: 'Section 4.2',
  },
  {
    id: 'S11', number: 11, filename: 'Figure_S11.png', group: 'si',
    caption_es: 'Coherencia wavelet entre ONI y CHIRPS PRCPTOT regional',
    caption_en: 'Wavelet coherence between ONI and regional CHIRPS PRCPTOT',
    details_es: 'Co-variación espectral en 23 años (coherencia 0.78), interpretada exploratoriamente cerca del cono de influencia. Los modos clásicos ENSO (2–7 años) aparecen con coherencia <0.55 pero consistente con la correlación Spearman significativa de la sección 4.3.',
    details_en: 'Spectral co-variation at 23 years (coherence 0.78), exploratorily interpreted near the cone of influence. Classical ENSO modes (2–7 years) appear with <0.55 coherence but consistent with significant Spearman correlation in section 4.3.',
    meaning_es: 'Análisis exploratorio de cómo cambia con el tiempo la relación entre el océano Pacífico y la lluvia regional. Sugiere que además de los ciclos cortos de El Niño (2–7 años), podría existir un ciclo decadal aún más largo, aunque con menos certeza estadística.',
    meaning_en: 'Exploratory analysis of how the relationship between the Pacific Ocean and regional rainfall changes over time. It suggests that besides short El Niño cycles (2–7 years), a longer decadal cycle may exist, though with less statistical certainty.',
    related_es: 'Sección 4.3', related_en: 'Section 4.3',
  },
  {
    id: 'S12', number: 12, filename: 'Figure_S12.png', group: 'si',
    caption_es: 'Señal EDW por escenario SSP en proyecciones CMIP6 2041–2070',
    caption_en: 'EDW signal per SSP scenario in CMIP6 projections 2041–2070',
    details_es: 'Confirma la firma EDW para los tres SSPs. La amplificación es modesta pero consistente en signo. Implicaciones para páramos, límite altitudinal de bosque andino y dinámica de la línea de nieve.',
    details_en: 'Confirms the EDW signature for all three SSPs. Amplification is modest but consistent in sign. Implications for páramos, Andean forest altitudinal limit and snow-line dynamics.',
    meaning_es: 'Independientemente del escenario futuro de emisiones, las zonas altas se calentarán algo más. Esto refuerza la importancia de proteger ecosistemas altoandinos como páramos y bosques de altura, particularmente vulnerables al cambio climático.',
    meaning_en: 'Regardless of the future emissions scenario, high-elevation areas will warm slightly more. This reinforces the importance of protecting high-Andean ecosystems like páramos and montane forests, particularly vulnerable to climate change.',
    related_es: 'Sección 5.4', related_en: 'Section 5.4',
  },
];

export default function GalleryLightbox() {
  const locale = useLocale() as 'es' | 'en';
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') setSelectedIdx(i => (i! + 1) % FIGURES_DATA.length);
      if (e.key === 'ArrowLeft')  setSelectedIdx(i => (i! - 1 + FIGURES_DATA.length) % FIGURES_DATA.length);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selectedIdx]);

  const main = FIGURES_DATA.filter(f => f.group === 'main');
  const si = FIGURES_DATA.filter(f => f.group === 'si');
  const sel = selectedIdx !== null ? FIGURES_DATA[selectedIdx] : null;
  const isEs = locale === 'es';

  const renderGrid = (figs: FigureMeta[], titleEs: string, titleEn: string) => (
    <>
      <h2 className="heading-3 text-andean-deep mb-4">{isEs ? titleEs : titleEn}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {figs.map(f => {
          const idx = FIGURES_DATA.indexOf(f);
          return (
            <button
              key={f.id}
              onClick={() => setSelectedIdx(idx)}
              className="card overflow-hidden p-0 group text-left hover:ring-2 hover:ring-andean-water transition"
            >
              <img
                src={figureUrl(f.group, f.filename)}
                alt={isEs ? f.caption_es : f.caption_en}
                className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform"
                loading="lazy"
              />
              <div className="p-3">
                <p className="text-xs font-mono text-slate-500">
                  {f.group === 'main' ? `Figura ${f.number}` : `Figura S${f.number}`}
                </p>
                <p className="text-sm text-slate-700 mt-1 leading-snug font-medium">
                  {isEs ? f.caption_es : f.caption_en}
                </p>
                <p className="text-[10px] text-andean-water mt-2 inline-flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {isEs ? 'Click para ver descripción' : 'Click for description'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      {renderGrid(main, 'Figuras principales', 'Main figures')}
      {renderGrid(si, 'Figuras suplementarias', 'Supplementary figures')}

      {sel && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto" onClick={() => setSelectedIdx(null)}>
          <div className="relative max-w-5xl w-full bg-white rounded-xl shadow-2xl overflow-hidden grid lg:grid-cols-[3fr_2fr]" onClick={e => e.stopPropagation()}>
            <div className="bg-black flex items-center justify-center max-h-[80vh] overflow-hidden">
              <img
                src={figureUrl(sel.group, sel.filename)}
                alt={isEs ? sel.caption_es : sel.caption_en}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <p className="text-xs font-mono text-andean-water uppercase tracking-wider font-bold">
                {sel.group === 'main' ? `Figura ${sel.number} · principal` : `Figura S${sel.number} · suplementaria`}
              </p>
              <h3 className="font-bold text-andean-deep text-lg mt-1 mb-3 leading-snug">
                {isEs ? sel.caption_es : sel.caption_en}
              </h3>

              {/* Descripción técnica */}
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
                {isEs ? 'Descripción técnica' : 'Technical description'}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {isEs ? sel.details_es : sel.details_en}
              </p>

              {/* ¿Qué significa? — bloque para no técnicos */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                <Lightbulb className="w-4 h-4 text-andean-water shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-andean-water font-bold mb-1">
                    {isEs ? '¿Qué significa esto?' : 'What does this mean?'}
                  </p>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {isEs ? sel.meaning_es : sel.meaning_en}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4 italic">
                {isEs ? 'Referencia: ' : 'Reference: '}{isEs ? sel.related_es : sel.related_en}
              </p>
              <div className="mt-4 text-[10px] text-slate-500 border-t border-slate-100 pt-3">
                {isEs ? '← → para navegar · Esc para cerrar' : '← → to navigate · Esc to close'}
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setSelectedIdx((selectedIdx! - 1 + FIGURES_DATA.length) % FIGURES_DATA.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 lg:translate-y-0 lg:top-2 w-10 h-10 rounded-full bg-white/90 hover:bg-white grid place-items-center shadow-lg"
              aria-label="prev"
            >
              <ChevronLeft className="w-5 h-5 text-andean-deep" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedIdx((selectedIdx! + 1) % FIGURES_DATA.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 lg:translate-y-0 lg:top-2 w-10 h-10 rounded-full bg-white/90 hover:bg-white grid place-items-center shadow-lg"
              aria-label="next"
            >
              <ChevronRight className="w-5 h-5 text-andean-deep" />
            </button>
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-2 right-2 w-10 h-10 rounded-full bg-andean-deep text-white grid place-items-center shadow-lg hover:bg-andean-water transition"
              aria-label="close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
