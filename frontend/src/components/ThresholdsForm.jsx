import React from 'react';

export const ThresholdsForm = ({
  thresholds,
  loading,
  saving,
  onInputChange,
  onReset,
  onSubmit,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12 text-sm text-gray-500 font-medium">
        Loading threshold settings...
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center space-y-6 pt-4">
      {/* Field 1: Rolling Time Window */}
      <div className="w-full max-w-sm text-center">
        <label className="block text-xs font-semibold text-gray-500 mb-2">
          Rolling Time Window
        </label>
        <input
          type="number"
          min="1"
          max="72"
          required
          placeholder="1-72 hours"
          value={thresholds.windowHours}
          onChange={(e) => onInputChange('windowHours', e.target.value)}
          className="w-full px-4 py-2.5 text-center text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00b4d8] text-gray-700 font-medium placeholder-gray-400 bg-white shadow-sm"
        />
      </div>

      {/* Field 2: Medium Severity Threshold */}
      <div className="w-full max-w-sm text-center">
        <label className="block text-xs font-semibold text-gray-500 mb-2">
          Medium Severity Threshold
        </label>
        <input
          type="number"
          min="1"
          required
          placeholder="Must be less than critical severity threshold"
          value={thresholds.mediumThreshold}
          onChange={(e) => onInputChange('mediumThreshold', e.target.value)}
          className="w-full px-4 py-2.5 text-center text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#00b4d8] text-gray-700 font-medium placeholder-gray-400 bg-white shadow-sm"
        />
      </div>

      {/* Field 3: Critical Severity Threshold */}
      <div className="w-full max-w-sm text-center">
        <label className="block text-xs font-semibold text-gray-500 mb-2">
          Critical Severity Threshold
        </label>
        <input
          type="number"
          min="1"
          required
          placeholder="Must be more than medium severity threshold"
          value={thresholds.criticalThreshold}
          onChange={(e) => onInputChange('criticalThreshold', e.target.value)}
          className="w-full px-4 py-2.5 text-center text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#00b4d8] text-gray-700 font-medium placeholder-gray-400 bg-white shadow-sm"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end items-center gap-3 w-full max-w-sm pt-4">
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition shadow-sm"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-7 py-2 bg-[#c64d11] hover:bg-[#b0420d] text-white text-xs font-bold rounded-lg transition shadow-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};