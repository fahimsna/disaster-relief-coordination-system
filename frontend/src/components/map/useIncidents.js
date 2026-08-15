import { useState, useEffect, useCallback } from 'react';

export function useIncidents(apiUrl = 'http://localhost:8000/api/reports') {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [severityFilter, setSeverityFilter] = useState({ Low: true, Medium: true, Critical: true });
  const [crisisFilter, setCrisisFilter] = useState({ Flood: true, Earthquake: true, Cyclone: true, Other: true });

  const fetchIncidents = useCallback(async () => {
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        const active = data.filter(
          (item) =>
            item.status === 'verified' &&
            typeof item.latitude === 'number' &&
            typeof item.longitude === 'number'
        );
        setIncidents(active);
      }
    } catch (err) {
      console.error('Failed to fetch live incident map data:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 15000);
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  const resolveIncident = async (incidentId) => {
    try {
      const response = await fetch(`${apiUrl}/${incidentId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' }),
      });

      if (response.ok) {
        setIncidents((prev) => prev.filter((item) => item._id !== incidentId));
      } else {
        alert('Failed to update incident status.');
      }
    } catch (err) {
      console.error('Error resolving incident:', err);
    }
  };

  // Filtered dataset calculated on the fly
  const filteredIncidents = incidents.filter((item) => {
    const matchesSeverity = severityFilter[item.severity] ?? true;
    const matchesCrisis = crisisFilter[item.crisisType] ?? true;
    return matchesSeverity && matchesCrisis;
  });

  return {
    incidents: filteredIncidents,
    rawIncidents: incidents,
    loading,
    resolveIncident,
    severityFilter,
    setSeverityFilter,
    crisisFilter,
    setCrisisFilter,
  };
}