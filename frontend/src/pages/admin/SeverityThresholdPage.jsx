// src/pages/admin/SeverityThresholdPage.jsx
import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import { ThresholdsForm } from '../../components/ThresholdsForm.jsx';
import { useSeverityThresholds } from '../../hooks/useSeverityThresholds.js';

const SeverityThresholdPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    thresholds,
    loading,
    saving,
    feedback,
    setFeedback,
    handleInputChange,
    handleReset,
    handleSubmit,
  } = useSeverityThresholds();

  return (
    <div className="min-h-screen flex bg-slate-100 text-gray-800 font-sans">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 p-10 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 min-h-[500px]">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Global Severity Thresholds
          </h1>

          {feedback.message && (
            <div
              className={`p-3.5 mb-6 max-w-sm mx-auto rounded-lg text-xs font-medium flex justify-between items-center ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <span>{feedback.message}</span>
              <button onClick={() => setFeedback({ type: '', message: '' })}>✕</button>
            </div>
          )}

          <ThresholdsForm
            thresholds={thresholds}
            loading={loading}
            saving={saving}
            onInputChange={handleInputChange}
            onReset={handleReset}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
};

export default SeverityThresholdPage;