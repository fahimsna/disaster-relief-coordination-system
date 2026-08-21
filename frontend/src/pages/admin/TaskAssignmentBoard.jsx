import { useState } from "react";

import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import VolunteerBoardCard from "../../components/VolunteerBoardCard";

import useVolunteerBoard from "../../hooks/useVolunteerBoard";

// severity colors match the Live Incident Map markers (red/orange/green)
const severityStyles = {
  Critical: "bg-red-50 text-red-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-green-50 text-green-600",
};

const incidentLabel = (incident) =>
  incident
    ? `${incident.crisisType} — ${incident.subdistrict}, ${incident.district}`
    : "";

export default function TaskAssignmentBoard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState("");
  const [actionError, setActionError] = useState("");

  const { board, incidents, loading, error, assign, deploy, release } =
    useVolunteerBoard();

  const selectedIncident = incidents.find((i) => i._id === selectedIncidentId);

  const handleAssign = async (volunteerId) => {
    setActionError("");
    if (!selectedIncidentId) {
      setActionError("Select an active disaster above before assigning.");
      return;
    }
    try {
      await assign(volunteerId, selectedIncidentId);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to assign volunteer.",
      );
    }
  };

  const handleDeploy = async (volunteerId) => {
    setActionError("");
    try {
      await deploy(volunteerId);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to mark as deployed.",
      );
    }
  };

  const handleRelease = async (volunteerId) => {
    setActionError("");
    try {
      await release(volunteerId);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to release volunteer.",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FA]">
        <Navbar setSidebarOpen={setSidebarOpen} />
        <div className="flex min-h-screen">
          <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <main className="flex flex-1 items-center justify-center p-6">
            <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#00ADB5]/20 border-t-[#00ADB5]" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <Navbar setSidebarOpen={setSidebarOpen} />
      <div className="flex min-h-screen">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <main className="flex-1 min-w-0 p-6 lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#00ADB5]">
              Dispatch
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#222831]">
              Volunteer Task Assignment Board
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Pick an active disaster below, then assign volunteers from the
              Available column.
            </p>
          </div>

          {(error || actionError) && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error || actionError}
            </div>
          )}

          {/* Active disasters selector */}
          <section className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#30475E]">
              Active Disasters ({incidents.length})
            </h2>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {incidents.map((incident) => (
                <button
                  key={incident._id}
                  type="button"
                  onClick={() => setSelectedIncidentId(incident._id)}
                  className={`min-w-[220px] shrink-0 rounded-2xl border p-4 text-left transition ${
                    selectedIncidentId === incident._id
                      ? "border-[#00ADB5] bg-[#00ADB5]/5"
                      : "border-gray-100 hover:border-[#00ADB5]/30"
                  }`}
                >
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      severityStyles[incident.severity] || severityStyles.Low
                    }`}
                  >
                    {incident.severity}
                  </span>
                  <p className="mt-2 font-semibold text-[#222831]">
                    {incident.crisisType}
                  </p>
                  <p className="text-xs text-gray-400">
                    {incident.subdistrict}, {incident.district}
                  </p>
                </button>
              ))}

              {incidents.length === 0 && (
                <p className="py-4 text-sm text-gray-400">
                  No verified disasters yet.
                </p>
              )}
            </div>

            {selectedIncident && (
              <p className="mt-3 text-xs font-medium text-[#00ADB5]">
                Assigning to: {incidentLabel(selectedIncident)}
              </p>
            )}
          </section>

          {/* Board */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="flex items-center justify-between text-sm font-bold uppercase tracking-wide text-[#30475E]">
                Available
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                  {board.available.length}
                </span>
              </h2>
              <div className="mt-4 space-y-3">
                {board.available.map((v) => (
                  <VolunteerBoardCard
                    key={v._id}
                    volunteer={v}
                    actions={[
                      {
                        label: "Assign",
                        onClick: () => handleAssign(v._id),
                        disabled: !selectedIncidentId,
                      },
                    ]}
                  />
                ))}
                {board.available.length === 0 && (
                  <p className="py-6 text-center text-sm text-gray-400">
                    No volunteers available.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="flex items-center justify-between text-sm font-bold uppercase tracking-wide text-[#30475E]">
                Assigned
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                  {board.assigned.length}
                </span>
              </h2>
              <div className="mt-4 space-y-3">
                {board.assigned.map((v) => (
                  <VolunteerBoardCard
                    key={v._id}
                    volunteer={v}
                    incidentLabel={incidentLabel(v.assignedIncident)}
                    actions={[
                      {
                        label: "Mark Deployed",
                        onClick: () => handleDeploy(v._id),
                      },
                      {
                        label: "Release",
                        onClick: () => handleRelease(v._id),
                        variant: "secondary",
                      },
                    ]}
                  />
                ))}
                {board.assigned.length === 0 && (
                  <p className="py-6 text-center text-sm text-gray-400">
                    No volunteers assigned yet.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="flex items-center justify-between text-sm font-bold uppercase tracking-wide text-[#30475E]">
                Deployed
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                  {board.deployed.length}
                </span>
              </h2>
              <div className="mt-4 space-y-3">
                {board.deployed.map((v) => (
                  <VolunteerBoardCard
                    key={v._id}
                    volunteer={v}
                    incidentLabel={incidentLabel(v.assignedIncident)}
                    actions={[
                      {
                        label: "Release",
                        onClick: () => handleRelease(v._id),
                        variant: "secondary",
                      },
                    ]}
                  />
                ))}
                {board.deployed.length === 0 && (
                  <p className="py-6 text-center text-sm text-gray-400">
                    No volunteers deployed yet.
                  </p>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
