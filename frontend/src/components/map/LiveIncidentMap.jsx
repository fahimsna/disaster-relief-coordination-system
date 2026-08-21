import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { SEVERITY_ICONS, SHELTER_ICON } from './MapIcons.js';
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

  // State to hold active shelters and filter toggle
  const [shelters, setShelters] = useState([]);
  const [showShelters, setShowShelters] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/shelters`);
        setShelters(res.data.data || []);
      } catch (err) {
        console.error('Failed to load shelters on map:', err);
      }
    };
    fetchShelters();
  }, []);

  const defaultCenter = [23.6850, 90.3563];

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden relative border shadow-md bg-white">
      {loading && (
        <div className="absolute inset-0 bg-white/80 z-[1001] flex items-center justify-center font-medium text-gray-600">
          Loading Incident Map...
        </div>
      )}

      <MapFilterOverlay
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        crisisFilter={crisisFilter}
        setCrisisFilter={setCrisisFilter}
        showShelters={showShelters}
        setShowShelters={setShowShelters}
        recentIncidents={rawIncidents}
      />

      <MapContainer center={defaultCenter} zoom={7} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {incidents.length > 0 && <MapBoundsAdjuster markers={incidents} />}

        {/* ================= INCIDENT MARKERS ================= */}
        {incidents
          .filter((incident) => {
            const lat = Number(incident.latitude);
            const lng = Number(incident.longitude);
            return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
          })
          .map((incident, index) => {
            let lat = Number(incident.latitude);
            let lng = Number(incident.longitude);
            if (lat > 85 || lat < -85) [lat, lng] = [lng, lat];

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

        {/* ================= SHELTER MARKERS ================= */}
        {showShelters &&
          shelters
            .filter((s) => s.latitude && s.longitude)
            .map((shelter) => (
              <Marker
                key={shelter._id}
                position={[Number(shelter.latitude), Number(shelter.longitude)]}
                icon={SHELTER_ICON || SEVERITY_ICONS.Low}
              >
                <Popup>
                  <div className="p-2 space-y-1">
                    <h3 className="font-bold text-sm text-slate-800">🏠 {shelter.name}</h3>
                    <p className="text-xs text-slate-600">{shelter.address}, {shelter.district}</p>
                    <div className="text-xs font-semibold text-sky-600 mt-1">
                      Occupancy: {shelter.occupantCount} / {shelter.capacity}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
      </MapContainer>
    </div>
  );
}

export default LiveIncidentMap;