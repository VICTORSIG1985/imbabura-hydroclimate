'use client';
import { useEffect, useRef, useState } from 'react';
import type { Map as MlMap } from 'maplibre-gl';
import { dataUrl } from '@/lib/assets';
import type { ViewerMode } from '@/types';

interface Props {
  mode: ViewerMode;
  onSelectStation?: (stationId: string) => void;
  selectedId?: string | null;
}

const BASE_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

export default function ViewerMap({ mode, onSelectStation, selectedId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const onSelectRef = useRef(onSelectStation);
  const [loaded, setLoaded] = useState(false);

  // Mantener el callback siempre actualizado para evitar que los listeners
  // del mapa queden capturando una versión vieja (causa del bug "hay que dar 2 clics")
  useEffect(() => { onSelectRef.current = onSelectStation; }, [onSelectStation]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let map: MlMap;
    import('maplibre-gl').then(({ default: maplibregl }) => {
      map = new maplibregl.Map({
        container: containerRef.current!,
        style: BASE_STYLE,
        center: [-78.5428, 0.4983],
        zoom: 9.3,
      });
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), 'top-right');
      map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
      mapRef.current = map;

      map.on('load', async () => {
        const [stations, boundary, parroquias, cantones, ranking] = await Promise.all([
          fetch(dataUrl('stations.geojson')).then(r => r.json()),
          fetch(dataUrl('imbabura_boundary.geojson')).then(r => r.json()),
          fetch(dataUrl('imbabura_parroquias.geojson')).then(r => r.json()),
          fetch(dataUrl('imbabura_cantones.geojson')).then(r => r.json()),
          fetch(dataUrl('station_ranking.json')).then(r => r.json()),
        ]);

        // === CAPAS BASE ===
        map.addSource('boundary', { type: 'geojson', data: boundary });
        map.addLayer({
          id: 'boundary-fill', type: 'fill', source: 'boundary',
          paint: { 'fill-color': '#1d4ed8', 'fill-opacity': 0.04 },
        });

        map.addSource('parroquias', { type: 'geojson', data: parroquias });
        map.addLayer({
          id: 'parroquias-line', type: 'line', source: 'parroquias',
          paint: { 'line-color': '#94a3b8', 'line-width': 0.6, 'line-opacity': 0.6 },
        });

        map.addSource('cantones', { type: 'geojson', data: cantones });
        map.addLayer({
          id: 'cantones-line', type: 'line', source: 'cantones',
          paint: { 'line-color': '#475569', 'line-width': 1.2 },
        });
        map.addLayer({
          id: 'cantones-labels', type: 'symbol', source: 'cantones',
          layout: { 'text-field': ['get', 'canton'], 'text-size': 11, 'text-allow-overlap': false },
          paint: { 'text-color': '#475569', 'text-halo-color': '#ffffff', 'text-halo-width': 2 },
        });

        map.addLayer({
          id: 'boundary-outline', type: 'line', source: 'boundary',
          paint: { 'line-color': '#0a2540', 'line-width': 2.5 },
        });

        // === ESTACIONES + atributos ===
        const attr: Record<string, any> = {};
        for (const r of ranking) attr[r.station_id] = r;
        const enrichedStations = {
          ...stations,
          features: stations.features.map((f: any) => ({
            ...f,
            properties: {
              ...f.properties,
              warming_rate: attr[f.properties.id]?.warming_rate_c_per_yr ?? null,
              precip_rate: attr[f.properties.id]?.precip_rate_mm_per_yr ?? null,
              enso_max_rho: attr[f.properties.id]?.enso_max_abs_rho ?? null,
              selected: false,
            },
          })),
        };
        map.addSource('stations', { type: 'geojson', data: enrichedStations });

        // Mode A — banda altitudinal
        map.addLayer({
          id: 'mode-A-stations',
          type: 'circle',
          source: 'stations',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 7, 5, 11, 11],
            'circle-color': [
              'match', ['get', 'band'],
              'B1', '#dc2626', 'B2', '#f59e0b', 'B3', '#16a34a', '#94a3b8',
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });

        // Mode B — Tendencia Tmean
        map.addLayer({
          id: 'mode-B-trends',
          type: 'circle',
          source: 'stations',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': [
              'interpolate', ['linear'],
              ['abs', ['coalesce', ['get', 'warming_rate'], 0]],
              0, 4, 0.02, 14,
            ],
            'circle-color': '#dc2626',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });

        // Mode C — Validación
        map.addLayer({
          id: 'mode-C-validation',
          type: 'circle',
          source: 'stations',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': 8,
            'circle-color': [
              'match', ['get', 'id'],
              'M1240', '#16a34a',
              'M0105', '#f59e0b',
              '#cbd5e1',
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });

        // Mode D — ENSO
        map.addLayer({
          id: 'mode-D-enso',
          type: 'circle',
          source: 'stations',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': [
              'interpolate', ['linear'],
              ['abs', ['coalesce', ['get', 'enso_max_rho'], 0]],
              0, 5, 0.5, 14,
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

        // Mode E — CMIP6 (parroquias coloreadas por banda + estaciones encima)
        map.addLayer({
          id: 'mode-E-parroquias-fill',
          type: 'fill',
          source: 'parroquias',
          layout: { visibility: 'none' },
          paint: { 'fill-color': '#dbeafe', 'fill-opacity': 0.4 },
        });
        map.addLayer({
          id: 'mode-E-stations',
          type: 'circle',
          source: 'stations',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': 7,
            'circle-color': [
              'match', ['get', 'band'],
              'B1', '#dc2626', 'B2', '#f59e0b', 'B3', '#16a34a', '#94a3b8',
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });

        // Halo de estación seleccionada (todas las modas)
        map.addLayer({
          id: 'station-selected-halo',
          type: 'circle',
          source: 'stations',
          paint: {
            'circle-radius': 18,
            'circle-color': 'transparent',
            'circle-stroke-width': 3,
            'circle-stroke-color': '#0a2540',
            'circle-opacity': ['case', ['==', ['get', 'id'], selectedId ?? '__none__'], 1, 0],
          },
        });

        // Labels
        map.addLayer({
          id: 'mode-labels',
          type: 'symbol',
          source: 'stations',
          minzoom: 9,
          layout: {
            'text-field': ['get', 'name'],
            'text-size': 11,
            'text-offset': [0, 1.5],
            'text-anchor': 'top',
            'text-allow-overlap': false,
          },
          paint: {
            'text-color': '#0a2540',
            'text-halo-color': '#ffffff',
            'text-halo-width': 2,
          },
        });

        const clickLayers = ['mode-A-stations', 'mode-B-trends', 'mode-C-validation', 'mode-D-enso', 'mode-E-stations'];
        clickLayers.forEach(l => {
          map.on('click', l, e => {
            const f = e.features?.[0];
            if (!f) return;
            // Usa el ref siempre actualizado, no la prop capturada
            onSelectRef.current?.((f.properties as any).id);
          });
          map.on('mouseenter', l, () => { map.getCanvas().style.cursor = 'pointer'; });
          map.on('mouseleave', l, () => { map.getCanvas().style.cursor = ''; });
        });

        setLoaded(true);
      });
    });

    return () => { map?.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle visibility por modo
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    const layerByMode: Record<ViewerMode, string[]> = {
      A: ['mode-A-stations'],
      B: ['mode-B-trends'],
      C: ['mode-C-validation'],
      D: ['mode-D-enso'],
      E: ['mode-E-parroquias-fill', 'mode-E-stations'],
      F: [],
    };
    const all = ['mode-A-stations', 'mode-B-trends', 'mode-C-validation', 'mode-D-enso', 'mode-E-parroquias-fill', 'mode-E-stations'];
    all.forEach(l => {
      if (map.getLayer(l)) {
        map.setLayoutProperty(l, 'visibility', layerByMode[mode].includes(l) ? 'visible' : 'none');
      }
    });
    if (map.getLayer('mode-labels')) {
      map.setLayoutProperty('mode-labels', 'visibility', mode === 'F' ? 'none' : 'visible');
    }
  }, [mode, loaded]);

  // Update selected halo
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded || !map.getLayer('station-selected-halo')) return;
    map.setPaintProperty('station-selected-halo', 'circle-opacity',
      ['case', ['==', ['get', 'id'], selectedId ?? '__none__'], 1, 0] as any
    );
  }, [selectedId, loaded]);

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
