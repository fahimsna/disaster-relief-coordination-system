import React from 'react';

export default function AnalyticsSummaryCards({ summary = {} }) {
  const {
    totalReports = 0,
    pendingCount = 0,
    activeCount = 0,
    resolvedCount = 0,
  } = summary;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-xs text-slate-500 font-semibold uppercase">Total Reports</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{totalReports}</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-xs text-amber-600 font-semibold uppercase">Pending Verification</p>
        <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-xs text-sky-600 font-semibold uppercase">Active Disasters</p>
        <p className="text-2xl font-bold text-sky-600 mt-1">{activeCount}</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-xs text-emerald-600 font-semibold uppercase">Resolved Incidents</p>
        <p className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</p>
      </div>
    </div>
  );
}