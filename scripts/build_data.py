"""
Build Layer-A/B/C JSON & GeoJSON files for the geoportal from the extracted Wiley package.

Reads:
  - scripts/_tables_json/*.json  (Tables T1-T7 + S7-S10)
  - scripts/_si_extract/supporting_info.txt (T1-S6 raw text, Appendix A1)
  - D:/CLOUDE_CODE/POSGRADOS/Tendencias climáticas/OUTPUTS/* (ENSO long format CSVs)

Writes to public/data/:
  Layer A (base territorial):
    - stations.geojson           (21 INAMHI stations with full attributes + band)
    - imbabura_boundary.geojson  (placeholder bbox; replace with real shapefile via MCP)
    - bands.geojson              (3 altitudinal band stripes B1/B2/B3)
  Layer B (long-format attributes for filtering):
    - trends_per_station.json    (Table 2 normalised)
    - enso_per_station.json      (ENSO_VARIABLES_COMPLETAS rebuilt from project CSV)
    - cmip6_projections.json     (Table 7 normalised)
  Layer C (executive summaries):
    - trends_summary.json        (Table 3 with MK + MMK)
    - enso_summary.json          (Table 4 + S7 FDR)
    - validation.json            (Table 5)
    - climatology.json           (Table 6)
    - pixel_mapping.json         (Table S8: 21 stations -> 16 pixels)
    - gev_return_levels.json     (Table S9)
    - traceability.json          (Table S10)
    - station_ranking.json       (computed: ENSO sensitivity + warming rank)
"""
import json
import csv
import re
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).parent.parent
TJSON = ROOT / "scripts" / "_tables_json"
OUT = ROOT / "public" / "data"
OUT.mkdir(parents=True, exist_ok=True)

POSGRADO = Path("D:/CLOUDE_CODE/POSGRADOS/Tendencias climáticas/OUTPUTS")


def load_table(name):
    return json.loads((TJSON / f"{name}.json").read_text(encoding="utf-8"))


def assign_band(elev):
    if elev < 2000:
        return "B1"
    if elev < 2800:
        return "B2"
    return "B3"


# ── 1. STATIONS GeoJSON (Layer A) ─────────────────────────────────────────────
print("Building stations.geojson…")
t1 = load_table("Table_1")
t8 = load_table("Table_S8")  # pixel mapping

# Build pixel → stations index
pixel_to_stations = defaultdict(list)
station_to_pixel = {}
for row in t8["rows"]:
    pid = row.get("Pixel_ID", "")
    sid = row.get("Station_code", "")
    if pid and sid:
        pixel_to_stations[pid].append(sid)
        station_to_pixel[sid] = pid

# Read in-situ months from manuscript-level CSV if exists, else from Table 1 last col
features = []
for row in t1["rows"]:
    sid = row.get("ID", "")
    if not sid:
        continue
    elev = float(row.get("Elevation_m", 0))
    band = assign_band(elev)
    lat = float(row.get("Latitude", 0))
    lon = float(row.get("Longitude", 0))
    # Latitudes están como valores absolutos (positivos) en Tablas; el área es 0.12-0.88 N (positivo)
    # Longitudes están como negativas (oeste)
    pixel_id = station_to_pixel.get(sid, "")
    shared = [s for s in pixel_to_stations.get(pixel_id, []) if s != sid]
    months = row.get("In_situ_months_1994_2013", 0)
    try:
        months = int(months) if months not in ("", None) else 0
    except (ValueError, TypeError):
        months = 0
    note = row.get("Note", "") or ""

    features.append({
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [lon, lat]},
        "properties": {
            "id": sid,
            "name": row.get("Name", ""),
            "type": row.get("Type", ""),
            "elevation_m": elev,
            "lat": lat,
            "lon": lon,
            "province": row.get("Province", ""),
            "canton": row.get("Canton", ""),
            "band": band,
            "band_label": {"B1": "<2000 m", "B2": "2000–2800 m", "B3": ">2800 m"}[band],
            "era5_pixel_id": pixel_id,
            "shared_with": shared,
            "shared_pixel": len(shared) > 0,
            "in_situ_months": months,
            "data_periods": {
                "chirps": row.get("CHIRPS_data", ""),
                "era5": row.get("ERA5_data", ""),
                "terraclimate": row.get("TerraClimate_data", ""),
            },
            "note": note,
        }
    })

(OUT / "stations.geojson").write_text(
    json.dumps({"type": "FeatureCollection", "features": features},
               ensure_ascii=False, indent=2), encoding="utf-8")
print(f"  {len(features)} stations written")


# ── 2. IMBABURA BOUNDARY (Layer A — placeholder bbox) ─────────────────────────
# 0.12–0.88 N, 77.81–79.28 W (manuscript §2)
boundary = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-79.28, 0.12], [-77.81, 0.12],
                [-77.81, 0.88], [-79.28, 0.88], [-79.28, 0.12]
            ]]
        },
        "properties": {
            "name": "Imbabura Province (bbox approximation)",
            "area_km2": 4599,
            "elevation_min_m": 675,
            "elevation_max_m": 4939,
            "note": "Replace with real shapefile via ArcGIS Pro MCP"
        }
    }]
}
(OUT / "imbabura_boundary.geojson").write_text(
    json.dumps(boundary, ensure_ascii=False, indent=2), encoding="utf-8")


# ── 3. PER-STATION TRENDS (Layer B) ──────────────────────────────────────────
print("Building trends_per_station.json…")
t2 = load_table("Table_2")
trends = []
var_map = {
    "Precip": ("PRECIP_ANUAL", "CHIRPS v2.0", "1981–2025", "mm yr⁻¹"),
    "Tmean": ("TMED_ANUAL", "ERA5-Land", "1981–2025", "°C yr⁻¹"),
    "Tmax": ("TMAX_ERA5_C", "ERA5-Land", "1981–2025", "°C yr⁻¹"),
    "Tmin": ("TMIN_ERA5_C", "ERA5-Land", "1981–2025", "°C yr⁻¹"),
    "RH": ("HR_ERA5_pct", "ERA5-Land", "1981–2025", "% yr⁻¹"),
    "PET": ("ETP_TERRA_mm", "TerraClimate", "1981–2024", "mm yr⁻¹"),
    "PDSI": ("PDSI_TERRA", "TerraClimate", "1981–2024", "PDSI yr⁻¹"),
}
for row in t2["rows"]:
    sid = row.get("ID", "")
    if not sid:
        continue
    for short, (var_code, source, period, unit) in var_map.items():
        sen_key = f"{short}_Sen"
        sig_key = f"{short}_Sig"
        trend_key = f"{short}_Trend"
        sen_val = row.get(sen_key, "")
        if sen_val in ("", None):
            continue
        try:
            sen_num = float(sen_val)
        except (ValueError, TypeError):
            continue
        sig_str = str(row.get(sig_key, "")).strip()
        trends.append({
            "station_id": sid,
            "variable": var_code,
            "variable_short": short,
            "source": source,
            "period": period,
            "sen_slope": sen_num,
            "sen_unit": unit,
            "significant": sig_str.lower() in ("yes", "sí", "si", "true"),
            "trend_direction": str(row.get(trend_key, "—")).strip(),
        })
(OUT / "trends_per_station.json").write_text(
    json.dumps(trends, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"  {len(trends)} per-station trend records")


# ── 4. TRENDS SUMMARY (Layer C — Table 3) ─────────────────────────────────────
print("Building trends_summary.json…")
t3 = load_table("Table_3")
(OUT / "trends_summary.json").write_text(
    json.dumps({"caption_en": t3["caption"], "rows": t3["rows"]},
               ensure_ascii=False, indent=2), encoding="utf-8")

# ── 5. ENSO SUMMARY + FDR (Layer C — Table 4 + S7) ────────────────────────────
print("Building enso_summary.json…")
t4 = load_table("Table_4")
ts7 = load_table("Table_S7")
(OUT / "enso_summary.json").write_text(
    json.dumps({
        "caption_en": t4["caption"],
        "by_variable": t4["rows"],
        "fdr_global_caption_en": ts7["caption"],
        "fdr_breakdown": ts7["rows"],
    }, ensure_ascii=False, indent=2), encoding="utf-8")


# ── 6. ENSO PER STATION × LAG (Layer B — from project CSV) ────────────────────
print("Building enso_per_station.json…")
enso_csv = POSGRADO / "09_ANALISIS_COMPLETO" / "ENSO_VARIABLES_COMPLETAS.csv"
enso_records = []
if enso_csv.exists():
    with open(enso_csv, encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            try:
                enso_records.append({
                    "station_id": r["ESTACION"],
                    "variable": r["VARIABLE"],
                    "lag_months": int(r["LAG_MESES"]),
                    "rho": float(r["SPEARMAN_RHO"]),
                    "p_value": float(r["P_VALOR"]),
                    "significant_raw": r["SIGNIFICATIVO"].strip().upper() == "SI",
                })
            except (KeyError, ValueError):
                continue
print(f"  {len(enso_records)} ENSO records")
(OUT / "enso_per_station.json").write_text(
    json.dumps(enso_records, ensure_ascii=False, indent=2), encoding="utf-8")


# ── 7. VALIDATION (Layer C — Table 5) ─────────────────────────────────────────
print("Building validation.json…")
t5 = load_table("Table_5")
(OUT / "validation.json").write_text(
    json.dumps({"caption_en": t5["caption"], "rows": t5["rows"]},
               ensure_ascii=False, indent=2), encoding="utf-8")


# ── 8. CLIMATOLOGY (Layer C — Table 6) ────────────────────────────────────────
print("Building climatology.json…")
t6 = load_table("Table_6")
(OUT / "climatology.json").write_text(
    json.dumps({"caption_en": t6["caption"], "rows": t6["rows"]},
               ensure_ascii=False, indent=2), encoding="utf-8")


# ── 9. CMIP6 PROJECTIONS (Layer B — Table 7) ──────────────────────────────────
print("Building cmip6_projections.json…")
t7 = load_table("Table_7")
# Normalise: strip "+" "°C" "%" and parse numbers
def parse_value(s):
    if isinstance(s, (int, float)):
        return float(s)
    s = str(s).strip().replace("±", "").replace("°C", "").replace("%", "")
    s = s.replace("+", "").strip()
    try:
        return float(s)
    except ValueError:
        return None

cmip = []
for row in t7["rows"]:
    var_label = row.get("Variable", "")
    band_label = row.get("Altitudinal band", "")
    band = "B1" if band_label.startswith("B1") else ("B2" if band_label.startswith("B2") else "B3")
    var_code = (
        "Tmean" if "Tmean" in var_label else
        "Tmax" if "Tmax" in var_label else
        "Tmin" if "Tmin" in var_label else
        "Precip" if "Precip" in var_label else
        "ET0_HS"
    )
    unit = "°C" if var_code in ("Tmean", "Tmax", "Tmin") else "%"
    for ssp_code, ssp_label in (("ssp126", "SSP1-2.6"), ("ssp370", "SSP3-7.0"), ("ssp585", "SSP5-8.5")):
        median = parse_value(row.get(f"{ssp_label} median", ""))
        iqr = parse_value(row.get(f"{ssp_label} IQR", ""))
        if median is None:
            continue
        cmip.append({
            "band": band,
            "band_label": band_label,
            "variable": var_code,
            "variable_label": var_label,
            "ssp": ssp_code,
            "ssp_label": ssp_label,
            "median": median,
            "iqr_half": iqr,
            "unit": unit,
            "n_gcms": 10,
            "baseline": "1991–2010",
            "target": "2041–2070",
        })
(OUT / "cmip6_projections.json").write_text(
    json.dumps({"caption_en": t7["caption"], "rows": cmip},
               ensure_ascii=False, indent=2), encoding="utf-8")
print(f"  {len(cmip)} CMIP6 projection cells")


# ── 10. PIXEL MAPPING (Layer C — Table S8) ────────────────────────────────────
print("Building pixel_mapping.json…")
ts8 = load_table("Table_S8")
(OUT / "pixel_mapping.json").write_text(
    json.dumps({"caption_en": ts8["caption"], "rows": ts8["rows"]},
               ensure_ascii=False, indent=2), encoding="utf-8")


# ── 11. GEV RETURN LEVELS (Layer C — Table S9) ────────────────────────────────
print("Building gev_return_levels.json…")
ts9 = load_table("Table_S9")
(OUT / "gev_return_levels.json").write_text(
    json.dumps({"caption_en": ts9["caption"], "rows": ts9["rows"]},
               ensure_ascii=False, indent=2), encoding="utf-8")


# ── 12. TRACEABILITY (Layer C — Table S10) ────────────────────────────────────
print("Building traceability.json…")
ts10 = load_table("Table_S10")
(OUT / "traceability.json").write_text(
    json.dumps({"caption_en": ts10["caption"], "rows": ts10["rows"]},
               ensure_ascii=False, indent=2), encoding="utf-8")


# ── 13. STATION RANKING (computed) ────────────────────────────────────────────
print("Building station_ranking.json…")
warming = {t["station_id"]: t["sen_slope"] for t in trends if t["variable"] == "TMED_ANUAL"}
precip = {t["station_id"]: t["sen_slope"] for t in trends if t["variable"] == "PRECIP_ANUAL"}
# ENSO sensitivity = max |rho| across precip lags 0-3
enso_max = defaultdict(lambda: 0.0)
for r in enso_records:
    if r["variable"] == "PRECIP_CHIRPS_mm":
        if abs(r["rho"]) > abs(enso_max[r["station_id"]]):
            enso_max[r["station_id"]] = r["rho"]

ranking_rows = []
for f in features:
    sid = f["properties"]["id"]
    ranking_rows.append({
        "station_id": sid,
        "name": f["properties"]["name"],
        "elevation_m": f["properties"]["elevation_m"],
        "band": f["properties"]["band"],
        "warming_rate_c_per_yr": warming.get(sid),
        "precip_rate_mm_per_yr": precip.get(sid),
        "enso_max_abs_rho": enso_max.get(sid),
    })
ranking_rows.sort(key=lambda r: -(r["warming_rate_c_per_yr"] or 0))
(OUT / "station_ranking.json").write_text(
    json.dumps(ranking_rows, ensure_ascii=False, indent=2), encoding="utf-8")


# ── INDEX ─────────────────────────────────────────────────────────────────────
index = sorted([f.name for f in OUT.glob("*.json")] + [f.name for f in OUT.glob("*.geojson")])
(OUT / "_index.json").write_text(json.dumps(index, indent=2), encoding="utf-8")
print(f"\nTotal data files in public/data/: {len(index)}")
for f in index:
    size_kb = (OUT / f).stat().st_size / 1024
    print(f"  {f:34s} {size_kb:7.1f} KB")
