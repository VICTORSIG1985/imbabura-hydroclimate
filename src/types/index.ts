// Tipos del dominio del manuscrito IJC (Pinto-Páez 2026)

export type Locale = 'es' | 'en';

export type Band = 'B1' | 'B2' | 'B3';
export type SSP = 'ssp126' | 'ssp370' | 'ssp585';
export type StationType = 'CO' | 'PV';
export type Source = 'CHIRPS v2.0' | 'ERA5-Land' | 'TerraClimate' | 'MOD16A2GF' | 'INAMHI';
export type Period = '1981–2025' | '1981–2024' | '1991–2020' | '1994–2013' | '2014–2025' | '2001–2024';

export type Variable =
  | 'PRECIP_ANUAL' | 'TMED_ANUAL' | 'TMAX_ERA5_C' | 'TMIN_ERA5_C'
  | 'HR_ERA5_pct' | 'ETP_TERRA_mm' | 'PDSI_TERRA';

export type Significance = 'sig' | 'sig_fdr' | 'not_sig' | 'limited';

export interface Station {
  id: string;            // M0001…
  name: string;
  type: StationType;
  elevation_m: number;
  lat: number;           // ° N (positivo norte)
  lon: number;           // ° W (negativo)
  province: 'Imbabura' | 'Carchi';
  canton: string;
  band: Band;
  era5_pixel_id: string;
  shared_with: string[]; // IDs de estaciones que comparten pixel
  in_situ_months: number; // 1994–2013 post-QC
  data_periods: {
    chirps: Period;
    era5: Period;
    terraclimate: Period;
  };
  note: string | null;
}

export interface TrendPerStation {
  station_id: string;
  variable: Variable;
  source: Source;
  period: Period;
  sen_slope: number;
  significant: boolean;          // raw p<0.05
  trend_direction: '↑' | '↓' | '—';
}

export interface TrendSummary {
  variable: Variable;
  source: Source;
  period: Period;
  n_stations: number;
  n_significant: number;
  pct_significant: string;
  n_increase: number;
  n_decrease: number;
  sen_median: number;
  sen_p10: number;
  sen_p90: number;
  sen_unit: string;
  sen_over_44yr: number;
  n_significant_mmk: number;
}

export interface ENSOSummary {
  variable: Variable;
  source: Source;
  n_tests_total: number;
  n_significant: number;
  pct_significant: string;
  dominant_lag_months: number;
  median_rho_dominant_lag: number;
  enso_direction: 'positive' | 'negative' | 'mixed';
}

export interface ENSOPerStationLag {
  station_id: string;
  variable: Variable;
  lag_months: 0 | 1 | 2 | 3;
  rho: number;
  p_value: number;
  significant_raw: boolean;
  significant_fdr: boolean;
}

export interface Validation {
  station_id: string;
  source: Source;
  variable: 'precipitation' | 'temperature_mean';
  period: string;
  n_months: number;
  pearson_r: number;
  rmse: number;
  mae: number;
  bias_mean: number;
  bias_pct: number;
  status: 'ACCEPTABLE' | 'LIMITED' | 'REJECTED_FOR_ABSOLUTE';
}

export interface Climatology {
  station_id: string;
  elevation_m: number;
  annual_precipitation_mm: number;
  tmean_c: number;
  tmax_c: number;
  tmin_c: number;
  pet_mm: number;
  rh_pct: number;
  pdsi: number;
}

export interface CMIP6Projection {
  band: Band;
  band_label: string;
  variable: 'Tmean' | 'Tmax' | 'Tmin' | 'Precip' | 'ET0_HS';
  ssp: SSP;
  median: number;
  iqr_half: number;
  unit: '°C' | '%';
  n_gcms: 10;
  baseline: '1991–2010';
  target: '2041–2070';
}

export interface PixelMapping {
  pixel_id: string;
  stations: string[];
  n_stations: number;
  representative_lat: number;
  representative_lon: number;
}

export interface GEVReturnLevel {
  band: Band | 'ALL';
  index: 'Rx1day' | 'Rx5day';
  return_period_yr: 10 | 50 | 100;
  median_mm: number;
  ci_low_mm: number;
  ci_high_mm: number;
}

export interface TraceabilityRow {
  manuscript_location: string;
  numerical_claim: string;
  raw_input: string;
  intermediate: string;
  script: string;
  final_output: string;
}

export interface FigureRef {
  id: string;            // F1, F2, F10, S01, S12
  group: 'main' | 'si';
  number: number;
  filename: string;      // Figure_01.png, Figure_S01.png
  caption_es: string;
  caption_en: string;
  related_section: string;
}

export interface TableRef {
  id: string;            // T1, T2, T7, S7, S10
  group: 'main' | 'si';
  number: string;
  caption_es: string;
  caption_en: string;
  json_file: string;
}

// Modos del visor
export type ViewerMode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface ViewerModeMeta {
  id: ViewerMode;
  key: 'diagnostic' | 'trends' | 'validation' | 'enso' | 'cmip6' | 'traceability';
  icon: string;
}
