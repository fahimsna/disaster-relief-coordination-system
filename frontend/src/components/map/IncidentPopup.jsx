import React from 'react';

export default function IncidentPopup({ incident, isCoordinator, onResolve }) {
  return (
    <div className="p-1 space-y-2 min-w-[180px]">
      <div className="flex items-center justify-between gap-2 border-b pb-1">
        <span className="font-bold text-sm text-gray-900">{incident.crisisType}</span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            incident.severity === 'Critical'
              ? 'bg-red-100 text-red-700'
              : incident.severity === 'Medium'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {incident.severity}
        </span>
      </div>

      <p className="text-xs text-gray-600 leading-snug">{incident.description}</p>

      <div className="text-[11px] text-gray-500 pt-1 border-t">
        <p>📍 {incident.subdistrict}, {incident.district}</p>
        {incident.manualAddress && (
          <p className="italic text-gray-400">{incident.manualAddress}</p>
        )}
      </div>

      {isCoordinator && (
        <button
          onClick={() => onResolve(incident._id)}
          className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-sm transition"
        >
          ✓ Mark as Resolved
        </button>
      )}
    </div>
  );
}