import React from 'react';

const getRelativeTimeString = (dateString) => {
  if (!dateString) return 'Recently';
  const now = new Date();
  const past = new Date(dateString);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export default function ShelterCard({ shelter, onOpenUpdate, onDelete }) {
  const criticalItems = shelter.criticalSupplies?.filter(s => s.status === 'CRITICAL') || [];
  const lowItems = shelter.criticalSupplies?.filter(s => s.status === 'LOW') || [];
  const adequateItems = shelter.criticalSupplies?.filter(s => s.status === 'ADEQUATE') || [];

  const hasCritical = criticalItems.length > 0;
  const hasLow = lowItems.length > 0;
  const isOvercapacity = (shelter.occupantCount || 0) > (shelter.capacity || 0);

  return (
    <div 
      className={`bg-white rounded-2xl border shadow-sm transition flex flex-col overflow-hidden ${
        hasCritical 
          ? 'border-red-300 ring-1 ring-red-200' 
          : hasLow 
            ? 'border-amber-300' 
            : 'border-slate-200'
      }`}
    >
      {hasCritical && (
        <div className="bg-red-600 text-white px-4 py-1.5 text-xs font-bold flex justify-between items-center tracking-wide">
          <span>URGENT: CRITICAL SUPPLIES NEEDED</span>
          <span>{criticalItems.length} Categories Short</span>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-slate-900">{shelter.name}</h3>
              {isOvercapacity && (
                <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded border border-red-200">
                  OVERCAPACITY
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">📍 {shelter.address}, {shelter.district}</p>
          </div>
          
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md block">
              {shelter.shelterCode}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Updated {getRelativeTimeString(shelter.updatedAt)}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Shelter Manager</span>
            <span className="font-bold text-slate-800">{shelter.managerName || 'Unassigned'}</span>
          </div>
          {shelter.contactPhone ? (
            <a 
              href={`tel:${shelter.contactPhone}`}
              className="bg-[#00ADB5]/10 text-[#00ADB5] hover:bg-[#00ADB5] hover:text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1"
            >
              📞 Call {shelter.contactPhone}
            </a>
          ) : (
            <span className="text-slate-400 italic">No phone logged</span>
          )}
        </div>

        <div className="mb-4 flex gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex-1">
            <span className="text-slate-500 block font-medium">Occupants</span>
            <strong className="text-base text-slate-800">{shelter.occupantCount}</strong>
          </div>
          <div className="flex-1 border-l border-slate-200 pl-4">
            <span className="text-slate-500 block font-medium">Capacity</span>
            <strong className="text-base text-slate-800">{shelter.capacity}</strong>
          </div>
          <div className="flex-1 border-l border-slate-200 pl-4">
            <span className="text-slate-500 block font-medium">Occupancy Load</span>
            <strong className={`text-base ${
              isOvercapacity 
                ? 'text-red-600 font-black' 
                : (shelter.occupantCount / shelter.capacity) >= 0.9 
                  ? 'text-amber-600' 
                  : 'text-slate-800'
            }`}>
              {Math.round((shelter.occupantCount / shelter.capacity) * 100)}%
            </strong>
          </div>
        </div>

        <div className="mb-4 flex-1">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Supply Needs
          </h4>

          <div className="space-y-1.5">
            {criticalItems.map((sup, idx) => (
              <div key={`crit-${idx}`} className="flex justify-between items-center text-xs bg-red-50 text-red-800 p-2 rounded-lg border border-red-200 font-semibold">
                <span className="flex items-center gap-1.5">
                  🔴 <strong>{sup.category}</strong>
                </span>
                <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded font-bold">
                  {sup.quantityNeeded ? `Needs: ${sup.quantityNeeded}` : 'CRITICAL'}
                </span>
              </div>
            ))}

            {lowItems.map((sup, idx) => (
              <div key={`low-${idx}`} className="flex justify-between items-center text-xs bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-200 font-medium">
                <span className="flex items-center gap-1.5">
                  🟠 <strong>{sup.category}</strong>
                </span>
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                  {sup.quantityNeeded ? `Needs: ${sup.quantityNeeded}` : 'LOW'}
                </span>
              </div>
            ))}

            {adequateItems.length > 0 && (
              <div className="flex items-center justify-between text-xs bg-slate-50 text-slate-600 p-2 rounded-lg border border-slate-200">
                <span className="flex items-center gap-1.5">
                  🟢 Stocked Categories
                </span>
                <span className="text-slate-500 font-medium">{adequateItems.length} categories adequate</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto flex gap-2 pt-4 border-t border-slate-100">
          <button 
            onClick={() => onOpenUpdate(shelter)} 
            className="flex-1 bg-[#30475E] hover:bg-[#2b4055] text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
          >
            Update Supplies & Manager
          </button>
          <button 
            onClick={() => onDelete(shelter._id)} 
            className="px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 py-2.5 rounded-xl text-xs font-bold transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}