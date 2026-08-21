import { useState, useEffect, useCallback } from "react";
import { getMyMission, submitStageUpdate } from "../api/stageApi";

// Mirrors useVolunteerBoard's fetch/mutate shape -- keeps the tracker page thin.
export default function useMissionStage() {
  const [volunteer, setVolunteer] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const { data } = await getMyMission();
      setVolunteer(data.data.volunteer);
      setUpdates(data.data.updates);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your mission.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Submit the next stage update – PDF will download automatically if mission completes
  const advanceStage = async (note, photoUrl) => {
    const response = await submitStageUpdate(note, photoUrl);
    await refresh();
    return response; // return the response so the caller can handle the PDF if present
  };

  return { volunteer, updates, loading, error, advanceStage, refresh };
}
