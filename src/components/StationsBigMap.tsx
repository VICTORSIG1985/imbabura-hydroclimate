'use client';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { Map as MlMap } from 'maplibre-gl';
import { dataUrl } from '@/lib/assets';
import StationProfile from './viewer/StationProfile';

const BASE_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

export default function StationsBigMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const locale = useLocale() as 'es' | 'en';
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let map: MlMap;
    import('maplibre-gl').then(({ default: maplibregl }) => {
      map = new maplibregl.Map({
        container: containerRef.current!,
        style: BASE_STYLE,
        center: [-78.5428, 0.4983],
        zoom: 9.2,
      });
      map.addControl(new maplibregl.NavigationControl({}), 'top-right');
      map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
      mapRef.current = map;

      map.on('load', async () => {
        const [stations, boundary, parroquias, cantones] = await Promise.all([
          fetch(dataUrl('stations.geojson')).then(r => r.json()),
          fetch(dataUrl('imbabura_boundary.geojson')).then(r => r.json()),
          fetch(dataUrl('imbabura_parroquias.geojson')).then(r => r.json()),
          fetch(dataUrl('imbabura_cantones.geojson')).then(r => r.json()),
        ]);

        map.addSource('boundary', { type: 'geojson', data: boundary });
        map.addLayer({ id: 'boundary-fill', type: 'fill', source: 'boundary', paint: { 'fill-color': '#1d4ed8', 'fill-opacity': 0.04 } });

        map.addSource('parroquias', { type: 'geojson', data: parroquias });
        map.addLayer({ id: 'parroquias-line', type: 'line', source: 'parroquias', paint: { 'line-color': '#cbd5e1', 'line-width': 0.5 } });

        map.addSource('cantones', { type: 'geojson', data: cantones });
        map.addLayer({ id: 'cantones-line', type: 'line', source: 'cantones', paint: { 'line-color': '#475569', 'line-width': 1.4 } });
        map.addLayer({
          id: 'cantones-labels', type: 'symbol', source: 'cantones',
          layout: { 'text-field': ['get', 'canton'], 'text-size': 12, 'text-allow-overlap': false, 'text-transform': 'uppercase' },
          paint: { 'text-color': '#475569', 'text-halo-color': '#ffffff', 'text-halo-width': 2 },
        });
        map.addLayer({ id: 'boundary-line', type: 'line', source: 'boundary', paint: { 'line-color': '#0a2540', 'line-width': 2.5 } });

        map.addSource('stations', { type: 'geojson', data: stations });
        map.addLayer({
          id: 'stations',
          type: 'circle',
          source: 'stations',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 6, 12, 14],
            'circle-color': ['match', ['get', 'band'], 'B1', '#dc2626', 'B2', '#f59e0b', 'B3', '#16a34a', '#94a3b8'],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });
        map.addLayer({
          id: 'stations-labels', type: 'symbol', source: 'stations',
          minzoom: 9,
          layout: {
            'text-field': ['get', 'name'],
            'text-size': 11, 'text-offset': [0, 1.6], 'text-anchor': 'top',
          },
          paint: { 'text-color': '#0a2540', 'text-halo-color': '#fff', 'text-halo-width': 2 },
        });

        // Tooltip on hover
        const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 10 });
        map.on('mouseenter', 'stations', e => {
          map.getCanvas().style.cursor = 'pointer';
          const f = e.features?.[0];
          if (!f) return;
          const p = f.properties as any;
          popup
            .setLngLat((f.geometry as any).coordinates)
            .setHTML(`<div class="p-2 text-xs"><strong class="text-andean-deep">${p.name}</strong><br>${p.id} · ${p.elevation_m} m · ${p.canton}</div>`)
            .addTo(map);
        });
        map.on('mouseleave', 'stations', () => { map.getCanvas().style.cursor = ''; popup.remove(); });

        map.on('click', 'stations', e => {
          const f = e.features?.[0];
          if (!f) return;
          setSelected((f.properties as any).id);
        });

        setLoaded(true);
      });
    });

    return () => { map?.remove(); mapRef.current = null; };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-andean-snow/60 backdrop-blur-sm">
          <div className="text-andean-deep text-sm font-medium animate-pulse">Cargando mapa…</div>
        </div>
      )}
      {/* Modal de perfil */}
      {selected && (
        <div className="absolute inset-0 z-10 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
          <div className="w-full max-w-3xl">
            <StationProfile stationId={selected} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
