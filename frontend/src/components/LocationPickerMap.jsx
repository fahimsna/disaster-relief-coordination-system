import React, { useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Moves map view and forces Leaflet tile recalculation inside modal wrappers
function MapCenterUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      // Invalidate size prevents broken/gray map tiles when opened inside modals
      map.invalidateSize();
      map.flyTo(position, 10, { duration: 1.2 });
    }
  }, [position, map]);

  return null;
}

function MapEventsHandler({ onChangeLocation }) {
  useMapEvents({
    click(e) {
      onChangeLocation(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    },
  });
  return null;
}

export default function LocationPickerMap({ lat, lng, onChangeLocation }) {
  const markerRef = useRef(null);

  // Safely parse numeric coordinates without ignoring zero values
  const position = useMemo(() => {
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    const validLat = !isNaN(parsedLat) && lat !== null && lat !== '' ? parsedLat : 23.6850;
    const validLng = !isNaN(parsedLng) && lng !== null && lng !== '' ? parsedLng : 90.3563;
    return [validLat, validLng];
  }, [lat, lng]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          onChangeLocation(Number(newPos.lat.toFixed(6)), Number(newPos.lng.toFixed(6)));
        }
      },
    }),
    [onChangeLocation]
  );

  return (
    <div className="w-full h-60 rounded-lg overflow-hidden border border-slate-300 relative mt-1 z-0">
      <MapContainer
        center={position}
        zoom={10}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsHandler onChangeLocation={onChangeLocation} />
        <MapCenterUpdater position={position} />
        <Marker
          draggable
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}
          icon={defaultIcon}
        />
      </MapContainer>
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-slate-700 z-[1000] border shadow-sm">
        📍 {position[0].toFixed(5)}, {position[1].toFixed(5)} (Drag pin or click to relocate)
      </div>
    </div>
  );
}