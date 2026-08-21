import { useState, useEffect, useCallback } from "react";
import {
  getVolunteerBoard,
  assignVolunteerToIncident,
  markVolunteerDeployed,
  unassignVolunteer,
} from "../api/volunteerApi";
import { getActiveIncidents } from "../api/reportApi";

// Keeps board fetch/mutate logic out of the page component, matching the
// existing hooks/useReports.js-style pattern. Plain state -- no context,
// nothing here needs to be shared outside this one page.
export default function useVolunteerBoard() {
  const [board, setBoard] = useState({
    available: [],
    assigned: [],
    deployed: [],
  });
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [boardRes, incidentsRes] = await Promise.all([
        getVolunteerBoard(),
        getActiveIncidents(),
      ]);
      setBoard(boardRes.data.data);
      setIncidents(incidentsRes.data.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load task board.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // each action re-syncs the whole board after -- simplest way to keep the
  // three columns + the incident list consistent without hand-rolled patches
  const assign = async (volunteerId, incidentId) => {
    await assignVolunteerToIncident(volunteerId, incidentId);
    await refresh();
  };

  const deploy = async (volunteerId) => {
    await markVolunteerDeployed(volunteerId);
    await refresh();
  };

  const release = async (volunteerId) => {
    await unassignVolunteer(volunteerId);
    await refresh();
  };

  return { board, incidents, loading, error, assign, deploy, release, refresh };
}
