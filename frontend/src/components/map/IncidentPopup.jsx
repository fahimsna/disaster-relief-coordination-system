import React from 'react';

export default function IncidentPopup({
  incident,
  clusterReportIds = [],
  isCoordinator,
  onResolve,
  onBatchResolve,
}) {
  const reportIds = clusterReportIds.length > 0 ? clusterReportIds : [incident._id];
  const count = reportIds.length;
  const isCluster = count > 1;

  return (
    <div className="p-1 space-y-2 min-w-[200px]">
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
          {incident.severity || 'Medium'}
        </span>
      </div>

      <p className="text-xs text-gray-600 leading-snug">{incident.description}</p>

      <div className="text-[11px] text-gray-500 pt-1 border-t space-y-0.5">
        <p>📍 {incident.subdistrict}, {incident.district}</p>
        {incident.manualAddress && (
          <p className="italic text-gray-400">{incident.manualAddress}</p>
        )}
        {isCluster && (
          <p className="font-semibold text-sky-600 pt-0.5">
            📊 Location Cluster: {count} active reports
          </p>
        )}
      </div>

      {isCoordinator && (
        <div className="pt-1 space-y-1.5">
          {isCluster && onBatchResolve && (
            <button
              onClick={() => onBatchResolve(reportIds)}
              className="w-full py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded shadow-sm transition flex items-center justify-center gap-1"
            >
              ⚡ Batch Resolve All ({count})
            </button>
          )}

          {onResolve && incident._id && (
            <button
              onClick={() => onResolve(incident._id)}
              className={`w-full py-1.5 text-xs font-bold rounded shadow-sm transition ${
                isCluster
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              ✓ {isCluster ? 'Resolve Only This Report' : 'Mark as Resolved'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}