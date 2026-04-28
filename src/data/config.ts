/**
 * Configuración central del Geoportal Hidroclimático de Imbabura.
 * Esta es la Capa B parametrizable de la guía: solo este archivo cambia
 * cuando se replica el geoportal a otro proyecto.
 */

export const SITE = {
  title_es: 'Geoportal Hidroclimático de Imbabura',
  title_en: 'Imbabura Hydroclimatic Geoportal',
  tagline_es: 'Tendencias 1981–2025 · ENSO · Proyecciones CMIP6 · 1981–2070',
  tagline_en: 'Trends 1981–2025 · ENSO · CMIP6 projections · 1981–2070',
  province: 'Imbabura, Ecuador',
  area_km2: 4_599,
  elevation_min_m: 675,
  elevation_max_m: 4_939,
  altitudinal_range_m: 2_465,
  population_2022: 478_257,
  author: 'Víctor Hugo Pinto-Páez',
  affiliation: 'Independent researcher · Ibarra, Imbabura, Ecuador',
  email: 'vpintopaez@gmail.com',
  orcid: '0009-0001-5573-8294',
  githubUser: 'VICTORSIG1985',
  githubRepo: 'imbabura-hydroclimate',
  publicUrl: 'https://victorsig1985.github.io/imbabura-hydroclimate/',
  doi: '10.5281/zenodo.19821757',
  zenodoUrl: 'https://doi.org/10.5281/zenodo.19821757',
  manuscriptUrl: 'https://doi.org/10.5281/zenodo.19821757',
  journal: 'International Journal of Climatology',
  publisher: 'Wiley · Royal Meteorological Society',
  year: '2026',
  license: 'CC BY-NC-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es',
  basePath: '/imbabura-hydroclimate',
} as const;

export const STUDY_PERIODS = {
  observed: '1981–2025',
  in_situ: '1994–2013',
  in_situ_recent: '2014–2025',
  baseline: '1991–2020',
  cmip6_baseline: '1991–2010',
  cmip6_target: '2041–2070',
  full_period: '1981–2070',
} as const;

export const SOURCES = {
  CHIRPS: { full: 'CHIRPS v2.0', resolution: '0.05°', period: '1981–2025', ref: 'Funk et al. 2015' },
  ERA5:   { full: 'ERA5-Land',   resolution: '0.1° (~9 km)', period: '1981–2025', ref: 'Hersbach et al. 2020' },
  TerraClimate: { full: 'TerraClimate', resolution: '1/24° (~4 km)', period: '1981–2024', ref: 'Abatzoglou et al. 2018' },
  MOD16: { full: 'MOD16A2GF', resolution: '500 m', period: '2001–2024', ref: 'Running et al. 2019' },
  ONI:   { full: 'NOAA Oceanic Niño Index', resolution: 'monthly', period: '1950–2026', ref: 'NOAA CPC' },
  CMIP6: { full: 'BASD-CMIP6-PE (10 GCMs)', resolution: '0.1°', period: '1981–2070', ref: 'Lange 2019' },
  INAMHI: { full: 'INAMHI Yearbooks 34–53 + 2 automatic stations', resolution: 'station', period: '1994–2025', ref: 'INAMHI Ecuador' },
} as const;

export const KEY_FINDINGS = {
  warming: {
    grid: { value: '+0.49 °C', desc_es: 'en 44 años (mediana 16 píxeles ERA5 indep.)', desc_en: 'over 44 years (median across 16 indep. ERA5 pixels)' },
    station: { value: '+0.52 °C', desc_es: 'en 44 años (mediana per-estación)', desc_en: 'over 44 years (per-station median)' },
    significant_pixels: { value: '14/16 (88%)', desc_es: 'píxeles con tendencia positiva sig.', desc_en: 'pixels with significant positive trend' },
    significant_stations: { value: '19/21 (90.5%)', desc_es: 'estaciones con calentamiento sig.', desc_en: 'stations with significant warming' },
  },
  precipitation: {
    significant_stations: { value: '7/21 (33.3%)', desc_es: 'estaciones precip CHIRPS sig.', desc_en: 'CHIRPS precipitation sig. stations' },
    rx1day: { value: '+0.49 mm/yr', desc_es: 'intensificación máximo diario', desc_en: 'daily-max intensification' },
    r95p:   { value: '+4.17 mm/yr', desc_es: 'precipitación >P95', desc_en: 'precipitation above 95th pctl' },
  },
  enso: {
    correlation_negative: { value: '21/21', desc_es: 'estaciones con ρ negativo', desc_en: 'stations with negative ρ' },
    median_rho: { value: 'ρ = −0.23', desc_es: 'mediana provincial', desc_en: 'provincial median' },
    dominant_lag: { value: 'Lag-3', desc_es: 'meses · 17 estaciones', desc_en: 'months · 17 stations' },
    fdr: { value: '463/588', desc_es: 'tests sig. tras FDR-BH', desc_en: 'tests sig. after FDR-BH' },
  },
  cmip6: {
    range: { value: '+1.1 a +2.1 °C', desc_es: 'al 2041–2070 (SSP1-2.6 → SSP5-8.5)', desc_en: 'by 2041–2070 (SSP1-2.6 → SSP5-8.5)' },
    edw: { value: '+0.25 °C', desc_es: 'amplificación B3 vs B1 (SSP5-8.5)', desc_en: 'amplification B3 vs B1 (SSP5-8.5)' },
    agreement: { value: '100%', desc_es: 'acuerdo de signo en T (10 GCMs)', desc_en: 'sign agreement in T (10 GCMs)' },
    precip: { value: '+5 a +8 %', desc_es: 'cambio precipitación', desc_en: 'precipitation change' },
  },
  lapse_rate: {
    value: '−8.24 °C/km',
    ci95: '[−10.87, −6.99]',
    desc_es: 'lapse rate in-situ INAMHI · 7 estaciones · R²=0.97',
    desc_en: 'INAMHI in-situ lapse rate · 7 stations · R²=0.97',
  },
} as const;

// Modos del visor científico (6 modos)
export const VIEWER_MODES = [
  { id: 'A', key: 'diagnostic',    icon: '🌎', color: '#3a6e3a' },
  { id: 'B', key: 'trends',        icon: '📈', color: '#dc2626' },
  { id: 'C', key: 'validation',    icon: '✓',  color: '#1d4ed8' },
  { id: 'D', key: 'enso',          icon: '🌊', color: '#0a2540' },
  { id: 'E', key: 'cmip6',         icon: '🔭', color: '#92400e' },
  { id: 'F', key: 'traceability',  icon: '🔗', color: '#4b5563' },
] as const;

// Menú principal (9 items + selector idioma)
export const MENU = [
  { slug: '',              key: 'home' },
  { slug: 'visor',         key: 'viewer' },
  { slug: 'resultados',    key: 'results' },
  { slug: 'estaciones',    key: 'stations' },
  { slug: 'metodologia',   key: 'methodology' },
  { slug: 'validacion',    key: 'validation' },
  { slug: 'datos',         key: 'data' },
  { slug: 'galeria',       key: 'gallery' },
  { slug: 'acerca',        key: 'about' },
] as const;

// 22 figuras del paquete Wiley
export const FIGURES = {
  main: Array.from({ length: 10 }, (_, i) => ({
    id: `F${i + 1}`,
    number: i + 1,
    filename: `Figure_${String(i + 1).padStart(2, '0')}.png`,
    group: 'main' as const,
  })),
  si: Array.from({ length: 12 }, (_, i) => ({
    id: `S${i + 1}`,
    number: i + 1,
    filename: `Figure_S${String(i + 1).padStart(2, '0')}.png`,
    group: 'si' as const,
  })),
};

// 11 tablas del paquete Wiley + DOI Zenodo
export const TABLES_REF = [
  { id: 'T1', file: 'Table_1.json', json_in_data: false },
  { id: 'T2', file: 'Table_2.json', json_in_data: false },
  { id: 'T3', file: 'trends_summary.json',     json_in_data: true },
  { id: 'T4', file: 'enso_summary.json',       json_in_data: true },
  { id: 'T5', file: 'validation.json',         json_in_data: true },
  { id: 'T6', file: 'climatology.json',        json_in_data: true },
  { id: 'T7', file: 'cmip6_projections.json',  json_in_data: true },
  { id: 'S7',  file: 'enso_summary.json',      json_in_data: true },
  { id: 'S8',  file: 'pixel_mapping.json',     json_in_data: true },
  { id: 'S9',  file: 'gev_return_levels.json', json_in_data: true },
  { id: 'S10', file: 'traceability.json',      json_in_data: true },
] as const;
