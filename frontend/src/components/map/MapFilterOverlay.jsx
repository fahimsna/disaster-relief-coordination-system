import React from 'react';

export default function MapFilterOverlay({
  severityFilter,
  setSeverityFilter,
  crisisFilter,
  setCrisisFilter,
  recentIncidents = []
}) {
  const toggleSeverity = (level) => {
    setSeverityFilter((prev) => ({ ...prev, [level]: !prev[level] }));
  };

  const toggleCrisis = (type) => {
    setCrisisFilter((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] w-64 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-100 text-gray-800 max-h-[90%] overflow-y-auto text-xs space-y-4">
      {/* Title */}
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-bold text-sm text-gray-900">Filter and Legend</h3>
      </div>

      {/* Severity Toggles */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-600">Severity</h4>
        {['Low', 'Medium', 'Critical'].map((level) => (
          <div key={level} className="flex justify-between items-center py-0.5">
            <span>{level}</span>
            <input
              type="checkbox"
              checked={severityFilter[level]}
              onChange={() => toggleSeverity(level)}
              className="w-4 h-4 accent-slate-800 rounded cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Crisis Type Checkboxes */}
      <div className="space-y-2 border-t pt-3">
        <h4 className="font-semibold text-gray-600">Crisis Type</h4>
        {['Flood', 'Earthquake', 'Cyclone', 'Other'].map((type) => (
          <div key={type} className="flex items-center justify-between py-0.5">
            <span>{type === 'Cyclone' ? 'Typhoon / Cyclone' : type}</span>
            <input
              type="checkbox"
              checked={crisisFilter[type]}
              onChange={() => toggleCrisis(type)}
              className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Recently Verified Locations */}
      <div className="border-t pt-3 space-y-2">
        <h4 className="font-semibold text-gray-600">Recently Verified Location</h4>
        <div className="space-y-2 max-h-36 overflow-y-auto">
          {recentIncidents.slice(0, 3).map((item) => (
            <div key={item._id} className="flex items-center gap-2 text-[11px] p-1.5 bg-gray-50 rounded-lg">
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  item.severity === 'Critical'
                    ? 'bg-red-500'
                    : item.severity === 'Medium'
                    ? 'bg-orange-500'
                    : 'bg-green-500'
                }`}
              />
              <div className="truncate">
                <p className="font-semibold text-gray-900 truncate">
                  {item.severity} {item.crisisType}
                </p>
                <p className="text-[10px] text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}