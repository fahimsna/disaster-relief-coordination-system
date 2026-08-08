import React, { useState } from 'react';
import { getSeverityBadgeStyle } from '../utils/formatters';

export const SeverityBadge = ({ reportId, currentSeverity, onSetSeverity }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Clickable Badge Trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents opening the row detail view when clicking the badge
          setOpen(!open);
        }}
        className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1 transition ${getSeverityBadgeStyle(currentSeverity)}`}
      >
        ● {currentSeverity || 'Low'}
      </button>

      {/* Popover Selection Box */}
      {open && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="absolute top-8 left-0 w-52 bg-white border border-gray-200 rounded-xl shadow-xl p-5 z-30 space-y-4 animate-in fade-in"
        >
          <div className="text-xs font-bold text-gray-700">Set Custom Severity</div>
          {['Low', 'Medium', 'Critical'].map((level) => {
            const isSelected = (currentSeverity || 'Low').toLowerCase() === level.toLowerCase();
            return (
              <div
                key={level}
                onClick={() => {
                  onSetSeverity(reportId, level);
                  setOpen(false);
                }}
                className="flex items-center justify-between cursor-pointer text-xs font-semibold text-gray-600 hover:text-black py-1"
              >
                <span>{level}</span>
                <span className={`w-3.5 h-3.5 rounded-full ${isSelected ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};