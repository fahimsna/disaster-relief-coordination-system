// src/pages/admin/AdminVerificationPage.jsx
import React, { useState } from 'react';
import { useReports } from '../../hooks/useReports.js';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import { DetailedReportView } from '../../components/DetailedReportView.jsx';
import { VerificationTable } from '../../components/VerificationTable.jsx';

const AdminVerificationPage = () => {
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    reports,
    loading,
    actionLoading,
    feedback,
    setFeedback,
    searchQuery,
    setSearchQuery,
    sortField,
    sortOrder,
    handleSort,
    verifyReport,
    rejectReport,
    setSeverity,
  } = useReports();

  const selectedReport = reports.find((r) => r._id === selectedReportId);

  // Wrappers to automatically return to the table after action completes
  const handleVerify = async (id) => {
    await verifyReport(id);
    setSelectedReportId(null);
  };

  const handleReject = async (id) => {
    await rejectReport(id);
    setSelectedReportId(null);
  };

  return (
    <div className="min-h-screen flex bg-slate-100 text-gray-800 font-sans">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 p-4 sm:p-10 max-w-7xl mx-auto w-full">
        {/* Mobile Header Bar with Sidebar Toggle */}
        <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 font-bold text-xl p-1"
            aria-label="Open Sidebar"
          >
            ☰
          </button>
          <span className="font-extrabold text-sm text-slate-800">Admin Verification</span>
        </div>

        {/* Feedback Alert Banner */}
        {feedback.message && (
          <div
            className={`p-3.5 mb-6 rounded-lg text-sm font-medium flex justify-between items-center ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold">✕</button>
          </div>
        )}

        {/* View Toggle */}
        {selectedReport ? (
          <DetailedReportView
            report={selectedReport}
            actionLoading={actionLoading}
            onBack={() => setSelectedReportId(null)}
            onVerify={handleVerify}
            onReject={handleReject}
            onSetSeverity={setSeverity}
          />
        ) : (
          <VerificationTable
            reports={reports}
            loading={loading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onSelectReport={(r) => setSelectedReportId(r._id)}
            onVerify={handleVerify}
            onReject={handleReject}
            onSetSeverity={setSeverity}
          />
        )}
      </main>
    </div>
  );
};

export default AdminVerificationPage;