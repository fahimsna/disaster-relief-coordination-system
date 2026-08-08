// src/pages/admin/AdminVerificationPage.jsx
import React, { useState } from 'react';
import { useReports } from '../../hooks/useReports';
import AdminSidebar from '../../components/AdminSidebar';
import { DetailedReportView } from '../../components/DetailedReportView';
import { VerificationTable } from '../../components/VerificationTable';

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

  return (
    <div className="min-h-screen flex bg-slate-100 text-gray-800 font-sans">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        {feedback.message && (
          <div
            className={`p-3.5 mb-6 rounded-lg text-sm font-medium flex justify-between ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback({ type: '', message: '' })}>✕</button>
          </div>
        )}

        {selectedReport ? (
          <DetailedReportView
            report={selectedReport}
            actionLoading={actionLoading}
            onBack={() => setSelectedReportId(null)}
            onVerify={verifyReport}
            onReject={rejectReport}
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
            onVerify={verifyReport}
            onReject={rejectReport}
            onSetSeverity={setSeverity}
          />
        )}
      </main>
    </div>
  );
};

export default AdminVerificationPage;