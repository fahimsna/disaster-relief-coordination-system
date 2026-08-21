import React from 'react';

export default function ShelterKpiCards({ metrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Shelters</span>
        <p className="text-3xl font-black text-slate-800 mt-2">{metrics.totalShelters}</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Occupancy Load</span>
          {metrics.overcapacityCount > 0 && (
            <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              {metrics.overcapacityCount} Overcapacity
            </span>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-black text-slate-800">{metrics.totalOccupants}</span>
          <span className="text-sm font-semibold text-slate-400">/ {metrics.totalCapacity} capacity</span>
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Critical Shortages</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
        </div>
        <p className="text-3xl font-black text-red-600 mt-2">
          {metrics.criticalCount} <span className="text-sm font-normal text-red-500">shelters</span>
        </p>
      </div>

      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Low Supply Warnings</span>
        <p className="text-3xl font-black text-amber-700 mt-2">
          {metrics.lowCount} <span className="text-sm font-normal text-amber-600">shelters</span>
        </p>
      </div>
    </div>
  );
}