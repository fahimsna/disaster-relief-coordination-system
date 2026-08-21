import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StageProgressBar from "../components/StageProgressBar";
import useMissionStage from "../hooks/useMissionStage";

const STAGES = ["Dispatched", "In Transit", "On Site", "Distributed"];

export default function MissionStageTracker() {
  const navigate = useNavigate();
  const { volunteer, updates, loading, error, advanceStage } =
    useMissionStage();

  const [note, setNote] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [missionComplete, setMissionComplete] = useState(false);

  // no upload middleware yet -- read the photo as a data URI and send it as-is
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const nextStage = volunteer?.deliveryStage
    ? STAGES[STAGES.indexOf(volunteer.deliveryStage) + 1]
    : STAGES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!note.trim()) {
      setFormError("Add a short status note before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await advanceStage(
        note.trim(),
        photoPreview || undefined,
      );

      // Check if this was the final stage (Distributed)
      // The response will be the PDF blob
      // Check if response is a PDF (final stage)
      const contentType = response.headers?.["content-type"] || "";
      if (contentType.includes("application/pdf")) {
        // response.data is already a Blob because of responseType: "blob"
        const blob = response.data;
        console.log(`📄 Frontend blob size: ${blob.size} bytes`);

        if (blob.size === 0) {
          console.error("❌ PDF blob is empty!");
          setFormError("Certificate file is empty. Please contact support.");
          return;
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `certificate-${Date.now().toString(36).toUpperCase()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setMissionComplete(true);
      }

      setNote("");
      setPhotoPreview("");
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't submit update.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <Navbar />
        <p className="mt-16 text-center text-sm text-gray-500">
          Loading your mission…
        </p>
      </div>
    );
  }

  // If mission is complete OR volunteer has no active incident
  if (
    missionComplete ||
    !volunteer?.assignedIncident ||
    volunteer.assignmentStage !== "deployed"
  ) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <Navbar />
        <div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            {missionComplete || volunteer?.deliveryStage === "Distributed"
              ? "Mission complete! Your certificate has been downloaded."
              : "You don't have an active deployed mission right now."}
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="mt-4 rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <div className="mx-auto mt-10 max-w-2xl px-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">
            Active Mission
          </p>
          <h2 className="mt-1 text-lg font-bold text-gray-800">
            {volunteer.assignedIncident?.crisisType || "Mission"} ·{" "}
            {volunteer.assignedIncident?.district || "Unknown"}
            {volunteer.assignedIncident?.subdistrict
              ? `, ${volunteer.assignedIncident.subdistrict}`
              : ""}
          </h2>

          <div className="mt-6">
            <StageProgressBar current={volunteer.deliveryStage} />
          </div>

          {nextStage ? (
            <form
              onSubmit={handleSubmit}
              className="mt-8 border-t border-gray-100 pt-6"
            >
              <h3 className="text-sm font-bold text-gray-800">
                Log stage: {nextStage}
              </h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Brief status update…"
                rows={3}
                className="mt-3 w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-brand-accent focus:outline-none"
              />
              <div className="mt-3">
                <label className="text-xs font-medium text-gray-500">
                  Photo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-1 block text-xs text-gray-500"
                />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="preview"
                    className="mt-2 h-24 w-24 rounded-lg object-cover"
                  />
                )}
              </div>
              {formError && (
                <p className="mt-3 text-xs text-red-500">{formError}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full rounded-lg bg-brand-accent py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {submitting ? "Submitting…" : `Mark as ${nextStage}`}
              </button>
            </form>
          ) : (
            <p className="mt-6 text-sm font-medium text-green-600">
              Mission distributed -- certificate generated. Check your profile.
            </p>
          )}
        </div>

        {updates.length > 0 && (
          <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800">Update History</h3>
            <ul className="mt-3 space-y-3">
              {updates.map((u) => (
                <li
                  key={u._id}
                  className="rounded-lg border border-gray-100 p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-brand-accent">
                      {u.stage}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-600">{u.note}</p>
                  {u.photoUrl && (
                    <img
                      src={u.photoUrl}
                      alt="update"
                      className="mt-2 h-20 w-20 rounded-lg object-cover"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
