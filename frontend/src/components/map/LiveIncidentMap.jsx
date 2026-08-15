import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { SEVERITY_ICONS } from './MapIcons.js';
import MapBoundsAdjuster from './MapBoundsAdjuster.jsx';
import IncidentPopup from './IncidentPopup.jsx';
import MapFilterOverlay from './MapFilterOverlay.jsx';
import { useIncidents } from './useIncidents.js';

function LiveIncidentMap({ isCoordinator = true }) {
  const {
    incidents,
    rawIncidents,
    loading,
    resolveIncident,
    severityFilter,
    setSeverityFilter,
    crisisFilter,
    setCrisisFilter,
  } = useIncidents();

  const defaultCenter = [23.6850, 90.3563];

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden relative border shadow-md bg-white">
      {loading && (
        <div className="absolute inset-0 bg-white/80 z-[1001] flex items-center justify-center font-medium text-gray-600">
          Loading Incident Map...
        </div>
      )}

      {/* Floating Filter Sidebar Overlay */}
      <MapFilterOverlay
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        crisisFilter={crisisFilter}
        setCrisisFilter={setCrisisFilter}
        recentIncidents={rawIncidents}
      />

      <MapContainer center={defaultCenter} zoom={7} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {incidents.length > 0 && <MapBoundsAdjuster markers={incidents} />}

        {incidents
          // 1. Filter out items with missing or invalid coordinates
          .filter((incident) => {
            const lat = Number(incident.latitude);
            const lng = Number(incident.longitude);
            return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
          })
          // 2. Safely render markers
          .map((incident, index) => {
            let lat = Number(incident.latitude);
            let lng = Number(incident.longitude);

            // Swap coordinates if latitude and longitude were accidentally inverted (e.g., GeoJSON format)
            if (lat > 85 || lat < -85) {
              [lat, lng] = [lng, lat];
            }

            return (
              <Marker
                key={incident._id || `incident-${index}`}
                position={[lat, lng]}
                icon={SEVERITY_ICONS[incident.severity] || SEVERITY_ICONS.Medium}
              >
                <Popup>
                  <IncidentPopup
                    incident={incident}
                    isCoordinator={isCoordinator}
                    onResolve={resolveIncident}
                  />
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}

export default LiveIncidentMap;