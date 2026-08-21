import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import LiveIncidentMap from "../../components/map/LiveIncidentMap.jsx";

export default function IncidentCommandMapPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Existing Admin Sidebar Component */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header Toggle */}
        <div className="mb-4 flex items-center justify-between md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg bg-[#30475E] p-2 text-white text-xl"
          >
            ☰
          </button>
          <h1 className="text-lg font-bold text-gray-800">Incident Map</h1>
        </div>

        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900">Incident Map</h1>
          <p className="text-sm text-gray-500">
            Monitor active disasters and resolve verified incidents in real-time.
          </p>
        </div>

        {/* Live Map Component */}
        <LiveIncidentMap isCoordinator={true} />
      </main>
    </div>
  );
}