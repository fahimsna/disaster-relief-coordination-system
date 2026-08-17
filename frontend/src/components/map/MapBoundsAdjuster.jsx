import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function MapBoundsAdjuster({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (!markers || markers.length === 0) return;

    const bounds = L.latLngBounds(
      markers.map((item) => [item.latitude, item.longitude])
    );

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [markers, map]);

  return null;
}