# Análisis de licencia para el Geoportal Hidroclimático
## Reuso de anuarios meteorológicos del INAMHI (1994–2013) y datasets globales (CHIRPS, ERA5-Land, TerraClimate, MOD16, BASD-CMIP6-PE)

**Autor del análisis:** asistente científico para el Dr. Víctor Pinto-Páez
**Fecha:** 28 de abril de 2026
**Ámbito:** Geoportal científico-académico, Ibarra, Ecuador
**Objetivo:** Identificar la licencia que (i) permita consulta científica y académica, (ii) prohíba el uso comercial, (iii) reconozca al INAMHI como fuente original, (iv) permita compartir con atribución y (v) **no** sea totalmente libre como CC-BY.

---

## 1. Términos de uso del INAMHI: lo que dice y lo que omite

### 1.1 Hallazgos directos en sitios oficiales

La revisión de los portales oficiales del INAMHI (`https://www.inamhi.gob.ec/`, `https://servicios.inamhi.gob.ec/anuarios-metereologicos/`, `https://www.gob.ec/inamhi`) revela una situación legalmente ambigua pero operativamente conservadora:

1. **No existe una licencia explícita tipo Creative Commons, ODbL u Open Government Licence en el sitio del INAMHI.** Los anuarios meteorológicos se descargan en PDF sin un archivo de "Términos de uso" o "Política de datos" anexo.
2. **Aviso de copyright explícito.** Al pie de las páginas del INAMHI consta: *"Copyright © 2026 INAMHI | Todos los Derechos Reservados"*. Esta es la declaración por defecto y, en estricto sentido, sometería la información a la Ley de Propiedad Intelectual del Ecuador (hoy Código Orgánico de la Economía Social de los Conocimientos – COESCCI, 2016).
3. **Mercantilización parcial.** El trámite **"Emisión de información estadística meteorológica e hidrológica para personas naturales y jurídicas"** y su gemelo para sector público/académico están regulados por el *Reglamento General de Gestión Financiera por Concepto de Venta de Información y Prestación de Servicios del INAMHI* (Registro Oficial No. 292, 15-jun-2006). Las tarifas oscilan entre USD 5,00 y 185,00. Es decir, los datos de detalle (series diarias por estación, parámetros específicos, certificaciones) son **vendidos**, no liberados.
4. **Datos en abierto.** Sólo los anuarios consolidados publicados en PDF y los datasets en `datosabiertos.gob.ec` se entienden como información liberada; los anuarios 1994–2013 que digitalizó el geoportal entran en esta categoría.

### 1.2 Conclusión legal sobre el INAMHI

La información publicada en los anuarios PDF se considera **información pública** bajo la LOTAIP (2023), pero el INAMHI **no ha renunciado expresamente a sus derechos patrimoniales** ni la ha colocado bajo CC-BY u otra licencia abierta. Por defecto se aplica el régimen del COESCCI:

- **Permitida:** la cita académica y científica con atribución (limitación legítima del derecho de autor, art. 211 COESCCI y derecho de cita reconocido internacionalmente).
- **Permitida con cuidado:** la reproducción de tablas y series para fines de investigación.
- **No autorizada explícitamente:** la redistribución comercial y la incorporación masiva en productos cerrados con ánimo de lucro.
- **Cobrada por arancel:** los datos crudos de detalle no incluidos en los anuarios.

Esto define un perímetro: **el geoportal puede republicar productos derivados (mapas, gráficos, índices, series interpoladas) pero debe mantener al INAMHI como fuente original y debe declarar que no comercializa la información**.

---

## 2. Marco legal ecuatoriano

### 2.1 LOTAIP 2023 (Ley Orgánica de Transparencia y Acceso a la Información Pública)

La LOTAIP, publicada en febrero de 2023 sobre la base de la Ley Modelo 2.0 de la OEA, define los **datos abiertos** como aquellos *"datos digitales, accesibles, liberados, publicados o expuestos sin naturaleza reservada o confidencial, puestos a disposición con las características técnicas y jurídicas necesarias para que puedan ser usados, reutilizados y redistribuidos libremente"*. La Ley exige que los sujetos obligados (incluido el INAMHI) difundan su información en formato de datos abiertos. Sin embargo, no fija una licencia única ni obliga al uso de Creative Commons.

### 2.2 Política Nacional de Datos Abiertos (MINTEL, 2022)

El Acuerdo MINTEL-MINTEL-2022-021 establece directrices para que las instituciones publiquen datos en formatos abiertos y bajo licencias de libre uso. La rectoría recae en el MINTEL a través de `datosabiertos.gob.ec`. La política recomienda licencias abiertas tipo CC, pero no impone CC-BY como obligatoria; deja un margen para licencias más restrictivas cuando el dato tenga valor estratégico o esté sujeto a recuperación de costos (caso INAMHI).

### 2.3 COESCCI (Código Orgánico de la Economía Social de los Conocimientos, 2016)

El COESCCI regula la propiedad intelectual del Estado y el conocimiento científico. Permite expresamente la **reutilización de información pública para fines de investigación** y reconoce los **datos científicos generados con fondos públicos como bienes con vocación de apertura**, pero condicionados a la atribución y al respeto de los derechos morales del autor institucional.

### 2.4 ¿Reciprocidad?

Ecuador no aplica una doctrina formal de "reciprocidad de licencias" como sí ocurre en algunos marcos europeos (PSI Directive). En la práctica, **si una entidad pública no liberó sus datos bajo licencia explícita, el reusuario debe asumir el régimen más restrictivo y limitar su producto derivado al ámbito no comercial con atribución**.

---

## 3. Compatibilidad con datasets externos

| Producto | Licencia | Uso comercial | Atribución obligatoria | Compatible con CC-BY-NC |
|---|---|---|---|---|
| **CHIRPS v2 / v3** (UCSB-CHC) | CC0 / Public Domain (CHIRPS3 declarado CC-BY 4.0) | Sí | Recomendada | Sí (CC0 es compatible aguas abajo con cualquier licencia, incluida NC) |
| **ERA5-Land** (Copernicus/ECMWF) | Licencia Copernicus → migra a **CC-BY 4.0** desde 02-jul-2025 | Sí | Sí (texto: *"Generated using Copernicus Climate Change Service information"*) | Sí (CC-BY se puede combinar bajo NC en obras derivadas) |
| **TerraClimate** (Abatzoglou, U. of Idaho) | **CC0** (dominio público) | Sí | Recomendada | Sí |
| **MOD16 / MODIS** (NASA LP DAAC) | NASA Open Data Policy: sin restricciones de reuso, venta ni redistribución | Sí | Recomendada (citar producto y DOI) | Sí |
| **BASD-CMIP6-PE** (Fernandez-Palomino et al., GFZ Potsdam, DOI 10.5880/pik.2023.001) | **CC-BY 4.0** | Sí | Sí (atribución completa) | Sí |
| **Anuarios INAMHI 1994–2013** | Sin licencia explícita; "Todos los derechos reservados" + LOTAIP/COESCCI | Restringido | Sí (obligación legal/ética) | **Es el dataset que define el techo restrictivo** |

**Lectura clave de compatibilidad:** todas las licencias de los productos globales permiten que la obra agregada (el geoportal) se publique bajo una licencia más restrictiva. CC-BY 4.0 permite esto siempre que se mantenga la atribución original; CC0 lo permite sin condiciones. Por lo tanto, **el factor que fija el "techo de apertura" del geoportal es el INAMHI**, no los productos globales.

---

## 4. Recomendación final

### 4.1 Licencia recomendada: **CC BY-NC 4.0 (Atribución – No Comercial 4.0 Internacional)**

Rechazo CC-BY (incumple el requisito 2 y 5), CC-BY-ND (impediría el reuso académico legítimo y la elaboración de derivados, violando el requisito 1) y CC0 (renunciaría a derechos no propios).

Entre las opciones restrictivas pertinentes:

- **CC BY-NC 4.0** — Requisitos 1, 2, 3, 4 y 5 cumplidos. Permite reuso académico, prohíbe explotación comercial, exige atribución, permite compartir.
- **CC BY-NC-SA 4.0** — Idéntico, pero exige que las obras derivadas se distribuyan bajo la misma licencia. Es preferible si se quiere blindar el ecosistema (efecto "copyleft").
- **CC BY-NC-ND 4.0** — Demasiado restrictiva: impide derivados, lo que choca con el espíritu científico de un geoportal donde los usuarios deben poder remezclar mapas y series.

**Recomendación principal: CC BY-NC-SA 4.0** para el contenido propio del geoportal (interfaz, código de visualización, productos derivados como índices y figuras), porque:

1. Cumple los cinco requisitos del usuario, incluido "no es 100 % libre como CC-BY".
2. La cláusula *ShareAlike* protege al INAMHI como fuente original al impedir que terceros extraigan los productos derivados y los re-licencien bajo términos cerrados o comerciales.
3. Es compatible aguas arriba con CC0, CC-BY 4.0 y la NASA Open Data Policy de los datasets globales.
4. Es la licencia más adoptada por geoportales científicos académicos latinoamericanos cuando hay datos institucionales con derechos reservados de fondo.

**Recomendación complementaria:** declarar en el footer una **doble capa de licencia**:

- **Contenido original del geoportal y productos derivados:** CC BY-NC-SA 4.0.
- **Datos primarios del INAMHI:** "© INAMHI. Todos los derechos reservados. Reuso bajo el régimen de la LOTAIP y el COESCCI con fines no comerciales y atribución obligatoria. Los datos crudos no son redistribuidos por este geoportal; sólo se publican productos derivados (índices, agregados, series suavizadas, figuras y mapas)."
- **Datasets globales:** mantener atribución individual por producto (CHIRPS, ERA5-Land, TerraClimate, MOD16, BASD-CMIP6-PE) según sus licencias originales.

### 4.2 Restricción específica derivada del INAMHI

**Declarar expresamente que el geoportal NO redistribuye los datos crudos diarios/horarios del INAMHI.** Sólo publica:

- Resúmenes mensuales y anuales tomados de los anuarios PDF (información ya publicada y en abierto por el INAMHI).
- Productos derivados: anomalías, tendencias, índices climáticos (SPI, SPEI), interpolaciones, mapas temáticos.
- Hashes SHA-256 de los anuarios originales para trazabilidad reproducible (no son los datos en sí, son huellas digitales).

Esta declaración protege al usuario frente a la cláusula del *Reglamento General de Gestión Financiera del INAMHI*, que reserva al instituto la venta directa de datos detallados de estación.

---

## 5. Texto sugerido del aviso legal

### 5.1 Versión en español (footer)

> © 2026 Geoportal Hidroclimático de Imbabura. Contenido original y productos derivados publicados bajo licencia **Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)**.
> Los datos primarios provienen del **Instituto Nacional de Meteorología e Hidrología del Ecuador (INAMHI)** — © INAMHI, todos los derechos reservados. Este geoportal sólo redistribuye productos derivados conforme a la LOTAIP (2023) y el COESCCI (2016), con fines científicos y académicos sin uso comercial. Datasets globales: CHIRPS (UCSB-CHC, CC0/CC-BY 4.0), ERA5-Land (Copernicus/ECMWF, CC-BY 4.0), TerraClimate (U. of Idaho, CC0), MOD16 (NASA LP DAAC, Open Data Policy), BASD-CMIP6-PE (Fernandez-Palomino et al., 2023, GFZ, CC-BY 4.0). Cita sugerida: Pinto-Páez, V. (2026). *Geoportal Hidroclimático de Imbabura*. ORCID 0009-0001-5573-8294.

### 5.2 Versión en español (página "Acerca de")

> **Términos legales y licencia**
>
> Este geoportal es un producto científico-académico que digitaliza, integra y visualiza información hidroclimática del cantón Imbabura (Ecuador) para los periodos 1994–2013 (anuarios INAMHI) y 1981–2070 (productos satelitales y proyecciones CMIP6).
>
> 1. **Licencia del contenido original** (interfaz, código, gráficos, mapas derivados, índices climáticos, documentación): Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0). Permite consulta, reuso académico, remezcla y compartición siempre que se atribuya al autor, no se utilice con fines comerciales y las obras derivadas se distribuyan bajo la misma licencia.
> 2. **Datos primarios del INAMHI**: los 20 anuarios meteorológicos (1994–2013) son información pública liberada por el Instituto Nacional de Meteorología e Hidrología del Ecuador. Los archivos originales han sido registrados con huella SHA-256 para trazabilidad, pero **este geoportal no redistribuye datos crudos detallados (series diarias por estación, parámetros específicos)**, los cuales están sujetos al *Reglamento General de Gestión Financiera por Concepto de Venta de Información y Prestación de Servicios del INAMHI* (Registro Oficial No. 292, 2006). Para obtenerlos, el usuario debe acudir directamente al INAMHI: `servicio@inamhi.gob.ec`.
> 3. **Datasets de terceros**: cada producto satelital o de modelización conserva su licencia original. Se proporciona atribución individual en cada visualización.
> 4. **Uso académico y científico**: permitido y alentado, citando la fuente. Para uso institucional, comercial o redistribución masiva, contactar al autor.

### 5.3 Versión en inglés (footer)

> © 2026 Imbabura Hydroclimatic Geoportal. Original content and derived products published under **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.
> Primary data from the **National Institute of Meteorology and Hydrology of Ecuador (INAMHI)** — © INAMHI, all rights reserved. This geoportal redistributes only derived products in compliance with Ecuador's LOTAIP (2023) and COESCCI (2016), for scientific and academic non-commercial use. Global datasets: CHIRPS (UCSB-CHC, CC0/CC-BY 4.0), ERA5-Land (Copernicus/ECMWF, CC-BY 4.0), TerraClimate (U. of Idaho, CC0), MOD16 (NASA LP DAAC, Open Data Policy), BASD-CMIP6-PE (Fernandez-Palomino et al., 2023, GFZ, CC-BY 4.0). Suggested citation: Pinto-Páez, V. (2026). *Imbabura Hydroclimatic Geoportal*. ORCID 0009-0001-5573-8294.

### 5.4 Versión en inglés (página "About")

> **Legal terms and license**
>
> This geoportal is a scientific-academic product that digitises, integrates and visualises hydroclimatic information for Imbabura province (Ecuador) covering 1994–2013 (INAMHI yearbooks) and 1981–2070 (satellite products and CMIP6 projections).
>
> 1. **License of original content** (interface, code, graphics, derived maps, climate indices, documentation): Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0). Allows consultation, academic reuse, remixing and sharing provided that the author is credited, the work is not used commercially, and derivative works are distributed under the same license.
> 2. **INAMHI primary data**: the 20 meteorological yearbooks (1994–2013) are public information released by Ecuador's National Institute of Meteorology and Hydrology. Original files are SHA-256 fingerprinted for traceability, but **this geoportal does not redistribute raw station-level daily data**, which is subject to the *General Regulation on Financial Management for the Sale of Information and Services of INAMHI* (Official Registry No. 292, 2006). To obtain such data, users should contact INAMHI directly: `servicio@inamhi.gob.ec`.
> 3. **Third-party datasets**: each satellite or modelled product retains its original license. Individual attributions are provided per visualisation.
> 4. **Academic and scientific use**: permitted and encouraged, with proper citation. For institutional, commercial or large-scale redistribution use, please contact the author.

---

## 6. Conclusión ejecutiva

En contexto ecuatoriano, donde el INAMHI **no ha publicado una licencia explícita** sobre sus anuarios y reserva un régimen comercial para los datos crudos, la decisión legalmente más segura y científicamente más útil es:

- **Licencia del geoportal:** CC BY-NC-SA 4.0.
- **Datos primarios del INAMHI:** declarar derechos reservados con permiso de reuso académico bajo LOTAIP/COESCCI; no redistribuir datos crudos.
- **Datasets globales:** mantener atribuciones específicas según sus licencias originales (todas compatibles).
- **Aviso legal bilingüe** en footer y página "Acerca de" con la doble capa de licencia.

Esta combinación cumple los cinco requisitos solicitados, es compatible con todas las licencias aguas arriba, protege al INAMHI como fuente original y blindaje al geoportal frente a usos comerciales no deseados. Es la opción **conservadora, defendible y reproducible** — la apropiada para un proyecto científico de escala territorial.

---

## Fuentes consultadas

- INAMHI — sitio institucional: `https://www.inamhi.gob.ec/`
- INAMHI — Anuarios meteorológicos: `https://servicios.inamhi.gob.ec/anuarios-metereologicos/`
- Guía Oficial de Trámites — INAMHI (gob.ec): `https://www.gob.ec/inamhi`
- Trámite "Emisión de información estadística meteorológica e hidrológica": `https://www.gob.ec/inamhi/tramites/emision-informacion-estadistica-meteorologica-hidrologica-sector-publico-academico`
- Reglamento General de Gestión Financiera INAMHI (RO 292, 2006): `https://www.gob.ec/sites/default/files/regulations/2018-10/REGLAMENTO%20GENERAL%20DE%20GESTI%C3%93N%20FINANCIERA%20POR%20CONCEPTO%20DE%20VENTA%20DE%20INFORMACION%20Y%20PRESTACION%20DE%20SERVICIOS_INAMHI.pdf`
- LOTAIP 2023: `https://www.gob.ec/sites/default/files/regulations/2024-04/lotaip1%202023.pdf`
- Política Nacional de Datos Abiertos (MINTEL 2022-021): `https://www.telecomunicaciones.gob.ec/wp-content/uploads/2022/08/Acuerdo-Nro.-MINTEL-MINTEL-2022-021-Politica-de-Datos-Abiertos.pdf`
- COESCCI (2016): `https://www.gobiernoelectronico.gob.ec/wp-content/uploads/2018/10/Codigo-Organico-de-la-Economia-Social-de-los-Conocimientos-Creatividad-e-Innovacion.pdf`
- CHIRPS — Climate Hazards Center, UCSB: `https://www.chc.ucsb.edu/data/chirps`
- ERA5-Land — Copernicus Climate Data Store / ECMWF: `https://cds.climate.copernicus.eu/licences/licence-to-use-copernicus-products` y aviso de migración a CC-BY 4.0: `https://forum.ecmwf.int/t/cc-by-licence-to-replace-licence-to-use-copernicus-products-on-02-july-2025/13464`
- TerraClimate — Climatology Lab, U. of Idaho: `https://www.climatologylab.org/terraclimate.html`
- MOD16 — NASA LP DAAC: `https://lpdaac.usgs.gov/` y NASA Earthdata Data Use Guidance: `https://www.earthdata.nasa.gov/engage/open-data-services-software-policies/data-use-guidance`
- BASD-CMIP6-PE — Fernandez-Palomino et al. (2023), GFZ Data Services, DOI: `https://doi.org/10.5880/pik.2023.001` (licencia CC-BY 4.0 confirmada en metadatos GFZ).
