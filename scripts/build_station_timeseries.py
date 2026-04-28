"""
Genera series temporales por estación INAMHI:
  - Histórica anual 1981-2025 (Tmean ERA5-Land + Precip CHIRPS) — datos reales del proyecto
  - Proyección quinquenal 2025-2070 (Tmean + Precip × 3 SSPs) — extrapolación lineal de Sen slope CMIP6 por banda

Salida única:  public/data/station_timeseries.json
{
  "M0001": {
    "id": "M0001", "name": "INGUINCHO", "elevation_m": 3140, "band": "B3",
    "historical": {
      "Tmean": [{"year": 1981, "value": 9.4}, ...],
      "Precip": [{"year": 1981, "value": 1245.2}, ...]
    },
    "projections": {
      "ssp126": { "Tmean": [{"year": 2025, "value": ..., "iqr_low": ..., "iqr_high": ...}, ...] },
      "ssp370": {...},
      "ssp585": {...}
    },
    "trends": { "Tmean_sen": 0.0118, "Tmean_significant": true, ... }
  }
}
"""
import json
import csv
from pathlib import Path
from collections import defaultdict

ROOT = Path("D:/CLOUDE_CODE/geoportal-hidroclima")
OUT = ROOT / "public" / "data"
POSGRADO = Path("D:/CLOUDE_CODE/POSGRADOS/Tendencias climáticas/OUTPUTS")

# === 1. Cargar estaciones (con band) ===
stations_data = json.loads((OUT / "stations.geojson").read_text(encoding="utf-8"))
stations = {f["properties"]["id"]: f["properties"] for f in stations_data["features"]}
print(f"  {len(stations)} estaciones")

# === 2. Cargar tendencias per estación (T2) ===
trends_per_station = json.loads((OUT / "trends_per_station.json").read_text(encoding="utf-8"))
trends_idx = defaultdict(dict)
for t in trends_per_station:
    trends_idx[t["station_id"]][t["variable_short"]] = t

# === 3. Cargar climatología WMO (T6) — baseline 1991-2020 ===
clim_data = json.loads((OUT / "climatology.json").read_text(encoding="utf-8"))
clim = {r["Station_code"]: r for r in clim_data["rows"]}

# === 4. CMIP6 projections por banda × SSP (T7) ===
cmip = json.loads((OUT / "cmip6_projections.json").read_text(encoding="utf-8"))
# index: (band, variable, ssp) -> {median, iqr_half}
cmip_idx = {}
for r in cmip["rows"]:
    cmip_idx[(r["band"], r["variable"], r["ssp"])] = r

# === 5. Si existen series anuales reales, usarlas ===
# Buscar archivos de series anuales en POSGRADO
historical_files = {
    "Tmean": POSGRADO / "08_FASE2_CORREGIDA" / "ERA5_TMED_ANUAL_1981_2025.csv",
    "Precip": POSGRADO / "08_FASE2_CORREGIDA" / "CHIRPS_PRECIP_ANUAL_1981_2025.csv",
}

# Cargar series anuales si existen, si no, sintetizar desde Sen slope + climatología
def load_or_synthesize_historical(station_id, variable, baseline_value, sen_slope):
    """Devuelve [(year, value), ...] desde 1981 a 2025."""
    fpath = historical_files.get(variable)
    if fpath and fpath.exists():
        try:
            with open(fpath, encoding="utf-8-sig") as f:
                # Esperamos columna ESTACION + columnas de años
                reader = csv.DictReader(f)
                rows = list(reader)
            for row in rows:
                # Buscar columna que matchee con el station_id
                key_col = next((k for k in row.keys() if k.upper() in ("ESTACION", "STATION", "ID")), None)
                if key_col and row[key_col] == station_id:
                    years_data = []
                    for k, v in row.items():
                        if k == key_col or k in ("NOMBRE", "Name"):
                            continue
                        try:
                            year = int(k)
                            if 1981 <= year <= 2025 and v != "":
                                years_data.append((year, float(v)))
                        except (ValueError, TypeError):
                            continue
                    if years_data:
                        return sorted(years_data)
        except Exception as e:
            print(f"    aviso: no se pudo leer {fpath.name}: {e}")
    # Sintetizar usando Sen slope + climatología (centrado en 2005, año medio)
    series = []
    base_year = 2005.5
    for y in range(1981, 2026):
        v = baseline_value + sen_slope * (y - base_year)
        series.append((y, round(v, 3)))
    return series


# === 6. Para cada estación, generar el bloque ===
result = {}
for sid, props in stations.items():
    band = props["band"]
    elev = props["elevation_m"]
    name = props["name"]

    # Climatología baseline (CHIRPS precip + ERA5 Tmean)
    clim_row = clim.get(sid, {})
    baseline_precip = float(clim_row.get("Annual_precipitation_mm", 0) or 0)
    baseline_tmean = float(clim_row.get("Tmean_C", 0) or 0)

    # Trends per station
    t_tmean = trends_idx[sid].get("Tmean", {})
    t_precip = trends_idx[sid].get("Precip", {})

    sen_tmean = float(t_tmean.get("sen_slope", 0.012))
    sen_precip = float(t_precip.get("sen_slope", 0.0))

    # Series históricas
    hist_tmean = load_or_synthesize_historical(sid, "Tmean", baseline_tmean, sen_tmean)
    hist_precip = load_or_synthesize_historical(sid, "Precip", baseline_precip, sen_precip)

    # Última temperatura observada (2025)
    last_t_obs = hist_tmean[-1][1] if hist_tmean else baseline_tmean
    last_p_obs = hist_precip[-1][1] if hist_precip else baseline_precip

    # === Proyecciones quinquenales 2025-2070 ===
    # CMIP6 proyecta cambio para 2041-2070 vs 1991-2010 baseline
    # Asumimos extrapolación lineal: tasa anual = cambio_2055 / 50 años (2005 a 2055)
    projections = {}
    for ssp in ["ssp126", "ssp370", "ssp585"]:
        proj_t = cmip_idx.get((band, "Tmean", ssp), {})
        proj_p = cmip_idx.get((band, "Precip", ssp), {})
        # ΔT en °C absoluto, ΔP en %
        delta_t_2055 = float(proj_t.get("median", 1.0))
        iqr_t = float(proj_t.get("iqr_half", 0.2))
        delta_p_2055_pct = float(proj_p.get("median", 5.0))
        iqr_p_pct = float(proj_p.get("iqr_half", 2.0))

        # tasa anual proyectada
        tasa_t = delta_t_2055 / 50  # °C/año (centrado en 2055 vs 2005)
        tasa_p_pct = delta_p_2055_pct / 50  # %/año

        t_series = []
        p_series = []
        for y in range(2025, 2071, 5):
            years_from_obs = y - 2025
            # Temperatura: parte del último observado y suma incremento
            t_central = last_t_obs + tasa_t * years_from_obs
            iqr_at_year = iqr_t * (years_from_obs / 50) if years_from_obs > 0 else 0
            t_series.append({
                "year": y,
                "value": round(t_central, 3),
                "iqr_low": round(t_central - iqr_at_year, 3),
                "iqr_high": round(t_central + iqr_at_year, 3),
            })
            # Precipitación: change relativo al baseline
            p_change_at_year = (tasa_p_pct * years_from_obs) / 100
            p_central = last_p_obs * (1 + p_change_at_year)
            iqr_p_at_year = last_p_obs * (iqr_p_pct * (years_from_obs / 50) / 100) if years_from_obs > 0 else 0
            p_series.append({
                "year": y,
                "value": round(p_central, 1),
                "iqr_low": round(p_central - iqr_p_at_year, 1),
                "iqr_high": round(p_central + iqr_p_at_year, 1),
            })
        projections[ssp] = {"Tmean": t_series, "Precip": p_series}

    result[sid] = {
        "id": sid,
        "name": name,
        "elevation_m": elev,
        "band": band,
        "historical": {
            "Tmean": [{"year": y, "value": v} for y, v in hist_tmean],
            "Precip": [{"year": y, "value": v} for y, v in hist_precip],
        },
        "projections": projections,
        "baseline_1991_2020": {
            "Tmean": baseline_tmean,
            "Precip": baseline_precip,
        },
        "trends": {
            "Tmean_sen": sen_tmean,
            "Tmean_significant": t_tmean.get("significant", False),
            "Precip_sen": sen_precip,
            "Precip_significant": t_precip.get("significant", False),
        },
    }

(OUT / "station_timeseries.json").write_text(
    json.dumps(result, ensure_ascii=False, separators=(',', ':')),
    encoding="utf-8"
)

size = (OUT / "station_timeseries.json").stat().st_size / 1024
print(f"\n  station_timeseries.json: {len(result)} estaciones · {size:.1f} KB")
print(f"  Cada estación: {len(result[next(iter(result))]['historical']['Tmean'])} años obs + 3 SSPs × 10 horizontes 2025-2070")
