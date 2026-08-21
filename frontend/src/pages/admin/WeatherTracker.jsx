import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";

export default function WeatherTracker() {
  const [incidents, setIncidents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loadingIncidents, setLoadingIncidents] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // pull the incident list once on mount
  useEffect(() => {
    api
      .get("/weather/incidents")
      .then(({ data }) => setIncidents(data))
      .catch(() => setError("Couldn't load incidents"))
      .finally(() => setLoadingIncidents(false));
  }, []);

  const handleSelect = async (e) => {
    const id = e.target.value;
    setSelectedId(id);
    setResult(null);
    setError("");

    const incident = incidents.find((i) => i.id === id);
    if (!incident) return; // "Select an incident" placeholder chosen

    setLoadingWeather(true);
    try {
      const { data } = await api.post("/weather/query", {
        lat: incident.lat,
        lng: incident.lng,
        incidentId: incident.id,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Weather check failed");
    } finally {
      setLoadingWeather(false);
    }
  };

  const selectedIncident = incidents.find((i) => i.id === selectedId);

  // red/amber/green carry safety meaning - deliberately NOT themed with brand-accent
  const badgeStyles = {
    "Safe to Deploy": "bg-green-100 text-green-800 border-green-400",
    "Exercise Caution": "bg-amber-100 text-amber-800 border-amber-400",
    "Do Not Deploy": "bg-red-100 text-red-800 border-red-400",
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-brand-navy mb-1">
              Weather Safety Tracker
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Check live conditions before deploying volunteers to an incident.
            </p>

            <label className="block text-sm font-medium text-brand-navy mb-1">
              Active Incident
            </label>
            <select
              value={selectedId}
              onChange={handleSelect}
              disabled={loadingIncidents}
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              <option value="">
                {loadingIncidents
                  ? "Loading incidents..."
                  : "Select an incident"}
              </option>
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.title} ({inc.district})
                </option>
              ))}
            </select>

            {selectedIncident && (
              <p className="text-xs text-gray-500 mb-4">
                Lat: {selectedIncident.lat}, Lng: {selectedIncident.lng}
              </p>
            )}

            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            {loadingWeather && (
              <p className="text-sm text-brand-navy animate-pulse">
                Fetching weather...
              </p>
            )}

            {result && !loadingWeather && (
              <div className="border border-gray-200 rounded-md p-4 space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Temp</p>
                    <p className="text-lg font-semibold text-brand-navy">
                      {result.weatherSummary.temperature}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Wind</p>
                    <p className="text-lg font-semibold text-brand-navy">
                      {result.weatherSummary.windSpeed} km/h
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Precip</p>
                    <p className="text-lg font-semibold text-brand-navy">
                      {result.weatherSummary.precipitation} mm
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 text-center">
                  {result.weatherSummary.condition}
                </p>

                <div
                  className={`text-center border rounded-md py-2 font-semibold ${
                    badgeStyles[result.recommendation]
                  }`}
                >
                  {result.recommendation}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
