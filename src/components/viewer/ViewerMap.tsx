'use client';
import { useEffect, useRef, useState } from 'react';
import type { Map as MlMap } from 'maplibre-gl';
import { dataUrl } from '@/lib/assets';
import type { ViewerMode } from '@/types';

interface Props {
  mode: ViewerMode;
  onSelectStation?: (stationId: string, props: Record<string, unknown>) => void;
  filters?: {
    variable?: string;
    significance?: 'all' | 'sig_only' | 'non_sig';
    lag?: number;
    ssp?: 'ssp126' | 'ssp370' | 'ssp585';
  };
}

const BASE_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

export default function ViewerMap({ mode, onSelectStation, filters }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let map: MlMap;
    import('maplibre-gl').then(({ default: maplibregl }) => {
      map = new maplibregl.Map({
        container: containerRef.current!,
        style: BASE_STYLE,
        center: [-78.4, 0.4],   // Imbabura
        zoom: 9,
      });
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), 'top-right');
      map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
      mapRef.current = map;

      map.on('load', async () => {
        // Load all data sources
        const [stations, boundary, trends, enso, cmip6, ranking] = await Promise.all([
          fetch(dataUrl('stations.geojson')).then(r => r.json()),
          fetch(dataUrl('imbabura_boundary.geojson')).then(r => r.json()),
          fetch(dataUrl('trends_per_station.json')).then(r => r.json()),
          fetch(dataUrl('enso_per_station.json')).then(r => r.json()),
          fetch(dataUrl('cmip6_projections.json')).then(r => r.json()),
          fetch(dataUrl('station_ranking.json')).then(r => r.json()),
        ]);

        // Boundary
        map.addSource('boundary', { type: 'geojson', data: boundary });
        map.addLayer({
          id: 'boundary-fill',
          type: 'fill',
          source: 'boundary',
          paint: { 'fill-color': '#0a2540', 'fill-opacity': 0.04 },
        });
        map.addLayer({
          id: 'boundary-outline',
          type: 'line',
          source: 'boundary',
          paint: { 'line-color': '#0a2540', 'line-width': 2, 'line-dasharray': [3, 2] },
        });

        // Stations source — single source, multiple layers
        map.addSource('stations', { type: 'geojson', data: stations });

        // Build attribute store: stationId -> {warming, precip, ensoMaxRho, ...}
        const attr: Record<string, any> = {};
        for (const r of ranking as Array<{ station_id: string; [k: string]: any }>) {
          attr[r.station_id] = r;
        }

        // Inject ranking attrs onto features for paint expressions
        const enrichedStations = {
          ...stations,
          features: stations.features.map((f: any) => ({
            ...f,
            properties: {
              ...f.properties,
              warming_rate: attr[f.properties.id]?.warming_rate_c_per_yr ?? null,
              precip_rate: attr[f.properties.id]?.precip_rate_mm_per_yr ?? null,
              enso_max_rho: attr[f.properties.id]?.enso_max_abs_rho ?? null,
            },
          })),
        };
        (map.getSource('stations') as any).setData(enrichedStations);

        // Layer A — diagnostic: station dots colored by altitudinal band
        map.addLayer({
          id: 'mode-A-stations',
          type: 'circle',
          source: 'stations',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              7, 5,
              11, 10,
            ],
            'circle-color': [
              'match', ['get', 'band'],
              'B1', '#dc2626',
              'B2', '#f59e0b',
              'B3', '#16a34a',
              '#94a3b8',
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });

        // Labels (always visible above stations)
        map.addLayer({
          id: 'mode-labels',
          type: 'symbol',
          source: 'stations',
          minzoom: 9,
          layout: {
            'text-field': ['get', 'name'],
            'text-size': 11,
            'text-offset': [0, 1.4],
            'text-anchor': 'top',
            'text-allow-overlap': false,
          },
          paint: {
            'text-color': '#0a2540',
            'text-halo-color': '#fff',
            'text-halo-width': 1.5,
          },
        });

        // Mode B — Trends (Tmean Sen slope, all positive in dataset)
        map.addLayer({
          id: 'mode-B-trends',
          type: 'circle',
          source: 'stations',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': [
              'interpolate', ['linear'],
              ['abs', ['coalesce', ['get', 'warming_rate'], 0]],
              0, 4,
              0.02, 14,
            ],
            'circle-color': '#dc2626',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });

        // Mode C — Validation: only M0105 + M1240, others greyed
        map.addLayer({
          id: 'mode-C-validation',
          type: 'circle',
          source: 'stations',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': 8,
            'circle-color': [
              'match', ['get', 'id'],
              'M1240', '#16a34a',  // ACCEPTABLE for CHIRPS
              'M0105', '#f59e0b',  // LIMITED for CHIRPS
              '#cbd5e1',            // others not validated
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });

        // Mode D — ENSO: blue (negative) to red (positive)
        map.addLayer({
          id: 'mode-D-enso',
          type: 'circle',
          source: 'stations',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': [
              'interpolate', ['linear'],
              ['abs', ['coalesce', ['get', 'enso_max_rho'], 0]],
              0, 5,
              0.5, 14,
            ],
            'circle-color': [
              'interpolate', ['linear'],
              ['coalesce', ['get', 'enso_max_rho'], 0],
              -0.5, '#1d4ed8',
              0, '#cbd5e1',
              0.5, '#dc2626',
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });

        // Mode E — CMIP6: bands colored
        // Render altitudinal bands as overlay (built from bbox; not real polygons)
        const bandPolygon = (latMin: number, latMax: number) => ({
          type: 'Polygon' as const,
          coordinates: [[[ -79.28, latMin ], [ -77.81, latMin ], [ -77.81, latMax ], [ -79.28, latMax ], [ -79.28, latMin ]]],
        });
        const bandsFC = {
          type: 'FeatureCollection' as const,
          features: [
            { type: 'Feature' as const, geometry: bandPolygon(0.12, 0.4), properties: { band: 'B1', label: '<2000 m' } },
            { type: 'Feature' as const, geometry: bandPolygon(0.4, 0.65), properties: { band: 'B2', label: '2000–2800 m' } },
            { type: 'Feature' as const, geometry: bandPolygon(0.65, 0.88), properties: { band: 'B3', label: '>2800 m' } },
          ],
        };
        map.addSource('bands', { type: 'geojson', data: bandsFC });
        map.addLayer({
          id: 'mode-E-bands',
          type: 'fill',
          source: 'bands',
          layout: { visibility: 'none' },
          paint: {
            'fill-color': [
              'match', ['get', 'band'],
              'B1', '#dc2626',
              'B2', '#f59e0b',
              'B3', '#16a34a',
              '#94a3b8',
            ],
            'fill-opacity': 0.18,
          },
        });
        // Show stations on top of bands too
        map.addLayer({
          id: 'mode-E-stations',
          type: 'circle',
          source: 'stations',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': 6,
            'circle-color': [
              'match', ['get', 'band'],
              'B1', '#dc2626',
              'B2', '#f59e0b',
              'B3', '#16a34a',
              '#94a3b8',
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });

        // Click handlers
        const layers = ['mode-A-stations', 'mode-B-trends', 'mode-C-validation', 'mode-D-enso', 'mode-E-stations'];
        layers.forEach(l => {
          map.on('click', l, e => {
            const f = e.features?.[0];
            if (!f) return;
            onSelectStation?.((f.properties as any).id, f.properties as Record<string, unknown>);
          });
          map.on('mouseenter', l, () => { map.getCanvas().style.cursor = 'pointer'; });
          map.on('mouseleave', l, () => { map.getCanvas().style.cursor = ''; });
        });

        setLoaded(true);
      });
    });

    return () => { map?.remove(); mapRef.current = null; };
  }, [onSelectStation]);

  // Toggle layer visibility based on mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    const layerByMode: Record<ViewerMode, string[]> = {
      A: ['mode-A-stations'],
      B: ['mode-B-trends'],
      C: ['mode-C-validation'],
      D: ['mode-D-enso'],
      E: ['mode-E-bands', 'mode-E-stations'],
      F: [],   // F = traceability table, no map layer
    };
    const all = ['mode-A-stations', 'mode-B-trends', 'mode-C-validation', 'mode-D-enso', 'mode-E-bands', 'mode-E-stations'];
    all.forEach(l => {
      if (map.getLayer(l)) {
        map.setLayoutProperty(l, 'visibility', layerByMode[mode].includes(l) ? 'visible' : 'none');
      }
    });
    // Labels show in all modes except F
    if (map.getLayer('mode-labels')) {
      map.setLayoutProperty('mode-labels', 'visibility', mode === 'F' ? 'none' : 'visible');
    }
  }, [mode, loaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-andean-snow/60 backdrop-blur-sm">
          <div className="text-andean-deep text-sm font-medium animate-pulse">Cargando mapa…</div>
        </div>
      )}
    </div>
  );
}
