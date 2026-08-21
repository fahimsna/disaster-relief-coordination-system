import React from 'react';
import LocationSelector from '../LocationSelector';
import LocationPickerMap from '../LocationPickerMap';

export default function CreateShelterModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  onLocationChange,
  onSupplyChange
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#30475E]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Register New Shelter</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="createShelterForm" onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shelter Name *</label>
              <input 
                required 
                type="text" 
                className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00ADB5]" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800">Shelter Manager & Contacts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Manager Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Md. Rahman" 
                    className="w-full border border-slate-200 p-2 rounded-lg text-sm focus:outline-none focus:border-[#00ADB5]" 
                    value={formData.managerName} 
                    onChange={e => setFormData({...formData, managerName: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Primary Phone</label>
                  <input 
                    type="tel" 
                    placeholder="+88017..." 
                    className="w-full border border-slate-200 p-2 rounded-lg text-sm focus:outline-none focus:border-[#00ADB5]" 
                    value={formData.contactPhone} 
                    onChange={e => setFormData({...formData, contactPhone: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Alt Emergency Phone</label>
                  <input 
                    type="tel" 
                    placeholder="+88018..." 
                    className="w-full border border-slate-200 p-2 rounded-lg text-sm focus:outline-none focus:border-[#00ADB5]" 
                    value={formData.emergencyAltPhone} 
                    onChange={e => setFormData({...formData, emergencyAltPhone: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Location Details</h3>
              
              <LocationSelector 
                division={formData.division}
                district={formData.district}
                showUpazila={false}
                onLocationChange={onLocationChange}
              />

              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / Landmark *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. 123 Main St, Near Central Mosque" 
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00ADB5]" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                />
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">Pinpoint Location *</label>
                <LocationPickerMap 
                  lat={formData.latitude}
                  lng={formData.longitude}
                  onChangeLocation={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Occupants</label>
                <input 
                  type="number" 
                  min="0" 
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00ADB5]" 
                  value={formData.occupantCount} 
                  onChange={e => setFormData({...formData, occupantCount: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Max Capacity *</label>
                <input 
                  required 
                  type="number" 
                  min="1" 
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00ADB5]" 
                  value={formData.capacity} 
                  onChange={e => setFormData({...formData, capacity: e.target.value})} 
                />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3 text-sm">Initial Supply Status</h3>
              <div className="space-y-2">
                {formData.criticalSupplies.map((sup, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:items-center bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                    <span className="flex-1 text-sm font-semibold text-slate-700">{sup.category}</span>
                    <div className="flex gap-2">
                      <select 
                        className="border border-slate-200 p-2 text-sm rounded-lg bg-white w-32 focus:outline-none focus:border-[#00ADB5]" 
                        value={sup.status} 
                        onChange={e => onSupplyChange(idx, 'status', e.target.value)}
                      >
                        <option value="CRITICAL">🔴 Critical</option>
                        <option value="LOW">🟠 Low</option>
                        <option value="ADEQUATE">🟢 Adequate</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Qty needed" 
                        className="border border-slate-200 p-2 text-sm rounded-lg w-full sm:w-36 focus:outline-none focus:border-[#00ADB5]" 
                        value={sup.quantityNeeded} 
                        onChange={e => onSupplyChange(idx, 'quantityNeeded', e.target.value)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition">Cancel</button>
          <button form="createShelterForm" type="submit" className="px-5 py-2.5 bg-[#00ADB5] hover:bg-[#0097A0] text-white rounded-xl text-sm font-bold shadow-md transition">Save Shelter</button>
        </div>
      </div>
    </div>
  );
}