import React from 'react';
import LocationSelector from './LocationSelector';

const CRISIS_TYPES = [
  { id: 'Flood', label: 'Flood', icon: '🌊' },
  { id: 'Cyclone', label: 'Cyclone', icon: '🌀' },
  { id: 'Earthquake', label: 'Earthquake', icon: '🏚️' },
  { id: 'Other', label: 'Other', icon: '➕' },
];

export default function DisasterFormSteps({
  formData,
  setFormData,
  detectingLocation,
  handleUseLocation,
  handleLocationChange,
  feedback,
  setFeedback,
}) {
  return (
    <div className="space-y-6">
      {/* Step 1: Crisis Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Step 1: Crisis Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CRISIS_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, crisisType: type.id }));
                if (feedback?.type === 'error') setFeedback({ type: '', message: '' });
              }}
              className={`flex flex-col items-center justify-center py-4 rounded-xl border transition-all cursor-pointer ${
                formData.crisisType === type.id
                  ? 'border-[#00b4d8] bg-sky-50 text-[#00b4d8] font-bold shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl mb-1">{type.icon}</span>
              <span className="text-xs">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          Step 2: Describe the Situation <span className="text-red-500">*</span>
        </label>
        <textarea
          rows="4"
          required
          placeholder="Please enter a detailed description of the event..."
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00b4d8]"
        />
      </div>

      {/* Step 3: Geographic Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Step 3: Geographic Location <span className="text-red-500">*</span>
        </label>

        <button
          type="button"
          onClick={handleUseLocation}
          disabled={detectingLocation}
          className="w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-[#00b4d8] border border-sky-200 font-semibold rounded-lg text-sm mb-4 transition disabled:opacity-50 cursor-pointer"
        >
          📍 {detectingLocation ? 'Detecting Location...' : 'Use My Location'}
        </button>

        <div className="mb-3">
          {LocationSelector ? (
            <LocationSelector
              division={formData.division}
              district={formData.district}
              upazila={formData.subdistrict}
              onLocationChange={handleLocationChange}
            />
          ) : null}
        </div>

        <input
          type="text"
          placeholder="Enter Address or Landmarks manually"
          value={formData.manualAddress}
          onChange={(e) => setFormData((prev) => ({ ...prev, manualAddress: e.target.value }))}
          className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#00b4d8]"
        />
      </div>
    </div>
  );
}