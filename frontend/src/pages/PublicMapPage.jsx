// src/pages/HomePage.jsx
import React from 'react';
import LiveIncidentMap from "../components/map/LiveIncidentMap.jsx";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disaster Response Network</h1>
          <p className="text-sm text-gray-500">Live verified emergency reports</p>
        </div>
      </header>

      {/* Public View: No resolve button visible */}
      <LiveIncidentMap isCoordinator={false} />
    </div>
  );
}