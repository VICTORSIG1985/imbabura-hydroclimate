"""Convierte el GPKG real de Imbabura a GeoJSON simplificado para el geoportal.

Genera dos capas:
  - imbabura_provincia.geojson  (1 polígono disuelto de toda la provincia)
  - imbabura_parroquias.geojson (todas las parroquias)
  - imbabura_cantones.geojson   (cantones disueltos por canton)
"""
import json
from pathlib import Path
import geopandas as gpd
from shapely.ops import unary_union

GPKG = Path("D:/CLOUDE_CODE/POSGRADOS/Tendencias climáticas/Imbabura_Parroquia.gpkg")
OUT = Path("D:/CLOUDE_CODE/geoportal-hidroclima/public/data")
OUT.mkdir(parents=True, exist_ok=True)

# Leer todas las capas
print(f"Capas en {GPKG.name}:")
import fiona
layers = fiona.listlayers(str(GPKG))
print(f"  {layers}")

# Leer la primera capa (parroquias)
gdf = gpd.read_file(GPKG, layer=layers[0])
print(f"\nLeídas {len(gdf)} entidades")
print(f"CRS original: {gdf.crs}")
print(f"Columnas: {list(gdf.columns)}")

# Reproyectar a WGS84 si no lo está
if gdf.crs and gdf.crs.to_epsg() != 4326:
    gdf = gdf.to_crs(epsg=4326)
    print(f"Reproyectado a EPSG:4326")

# Simplificar geometría (tolerancia ~50 m)
gdf['geometry'] = gdf.geometry.simplify(tolerance=0.0005, preserve_topology=True)

# Identificar columnas
print(f"\nMuestra primeras 3 filas:")
print(gdf.head(3))

# Heurística: identificar columna de cantón y parroquia
canton_col = None
parroq_col = None
for c in gdf.columns:
    cl = c.lower()
    if 'canton' in cl or 'cant' in cl:
        canton_col = c
    if 'parr' in cl or 'parroq' in cl:
        parroq_col = c

print(f"\nColumna cantón: {canton_col}")
print(f"Columna parroquia: {parroq_col}")

# === 1. PARROQUIAS (todas) ===
parr_gdf = gdf[['DPA_PARROQ', 'DPA_DESPAR', 'DPA_CANTON', 'DPA_DESCAN', 'geometry']].copy()
parr_gdf = parr_gdf.rename(columns={
    'DPA_PARROQ': 'cod_parroq',
    'DPA_DESPAR': 'parroquia',
    'DPA_CANTON': 'cod_canton',
    'DPA_DESCAN': 'canton',
})
import os
if os.path.exists(OUT / "imbabura_parroquias.geojson"):
    os.remove(OUT / "imbabura_parroquias.geojson")
parr_gdf.to_file(OUT / "imbabura_parroquias.geojson", driver='GeoJSON')
print(f"\n  imbabura_parroquias.geojson: {len(parr_gdf)} parroquias")

# === 2. CANTONES (disueltos) ===
cant_gdf = gdf.dissolve(by='DPA_DESCAN').reset_index()[['DPA_DESCAN', 'geometry']]
cant_gdf = cant_gdf.rename(columns={'DPA_DESCAN': 'canton'})
cant_gdf['geometry'] = cant_gdf.geometry.simplify(tolerance=0.001, preserve_topology=True)
if os.path.exists(OUT / "imbabura_cantones.geojson"):
    os.remove(OUT / "imbabura_cantones.geojson")
cant_gdf.to_file(OUT / "imbabura_cantones.geojson", driver='GeoJSON')
print(f"  imbabura_cantones.geojson: {len(cant_gdf)} cantones")

# === 3. PROVINCIA (disuelta) ===
prov_geom = unary_union(gdf.geometry.tolist())
prov_geom = prov_geom.simplify(tolerance=0.002, preserve_topology=True)

prov_fc = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
            "name": "Imbabura",
            "area_km2": 4599,
            "elevation_min_m": 675,
            "elevation_max_m": 4939,
            "source": "INEC/IGM Ecuador via Imbabura_Parroquia.gpkg",
        },
        "geometry": json.loads(gpd.GeoSeries([prov_geom]).to_json())["features"][0]["geometry"],
    }]
}
(OUT / "imbabura_boundary.geojson").write_text(
    json.dumps(prov_fc, ensure_ascii=False), encoding="utf-8"
)

# Sobrescribir con tamaño
size_kb = (OUT / "imbabura_boundary.geojson").stat().st_size / 1024
print(f"  imbabura_boundary.geojson: 1 polígono provincia · {size_kb:.1f} KB")

# Bounds
b = prov_geom.bounds
print(f"\nBounding box real: lon [{b[0]:.4f}, {b[2]:.4f}], lat [{b[1]:.4f}, {b[3]:.4f}]")
print(f"Centro: ({(b[0]+b[2])/2:.4f}, {(b[1]+b[3])/2:.4f})")
