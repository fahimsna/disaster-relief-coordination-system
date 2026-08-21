import React from 'react';
import LocationSelector from '../LocationSelector';

export default function ShelterFilterBar({
  search,
  setSearch,
  filterDivision,
  filterDistrict,
  setFilterDivision,
  setFilterDistrict,
  filterSupplyNeed,
  setFilterSupplyNeed
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-center">
      <input 
        type="text" 
        placeholder="Search shelter name or manager..." 
        className="border border-slate-200 p-2.5 rounded-lg text-sm w-full lg:w-1/3 focus:outline-none focus:border-[#00ADB5]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="w-full lg:w-1/3">
        <LocationSelector 
          division={filterDivision}
          district={filterDistrict}
          showUpazila={false} 
          onLocationChange={(loc) => {
            setFilterDivision(loc.division);
            setFilterDistrict(loc.district);
          }}
        />
      </div>

      <div className="w-full lg:w-1/3">
        <select 
          className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-white font-medium focus:outline-none focus:border-[#00ADB5]"
          value={filterSupplyNeed}
          onChange={(e) => setFilterSupplyNeed(e.target.value)}
        >
          <option value="ALL">Show All Shelters</option>
          <option value="CRITICAL_ONLY">🔴 Critical Shortages Only</option>
          <option value="SHORTAGE_ONLY">⚠️ Any Shortage (Critical + Low)</option>
          <option value="OVERCAPACITY">🚨 Overcapacity Shelters</option>
        </select>
      </div>
    </div>
  );
}