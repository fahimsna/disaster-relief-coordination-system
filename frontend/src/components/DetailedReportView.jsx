import React from 'react';
import { SeverityBadge } from './SeverityBadge.jsx';
import { getReportStatus, formatDistrictField, formatIncidentId } from '../utils/formatters.js';

export const DetailedReportView = ({
  report,
  actionLoading,
  onBack,
  onVerify,
  onReject,
  onSetSeverity,
}) => {
  const currentStatus = getReportStatus(report);
  const isResolved = currentStatus?.toLowerCase() === 'resolved';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto relative">
      <button
        onClick={onBack}
        className="mb-6 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
      >
        ← Back to Verification Queue
      </button>

      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">
            Incident ID: {formatIncidentId(report._id)}
          </h1>
          <SeverityBadge
            reportId={report._id}
            currentSeverity={report.severity}
            onSetSeverity={onSetSeverity}
            disabled={isResolved}
          />
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              currentStatus === 'Verified'
                ? 'bg-emerald-100 text-emerald-700'
                : currentStatus === 'Rejected'
                ? 'bg-rose-100 text-rose-700'
                : isResolved
                ? 'bg-blue-100 text-blue-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            ● {currentStatus}
          </span>

          {/* Action buttons section */}
          {isResolved ? (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full border border-gray-200">
              Incident Resolved 
            </span>
          ) : (
            <div className="flex gap-2">
              {currentStatus === 'Pending' && (
                <>
                  <button
                    onClick={() => onVerify(report._id)}
                    disabled={actionLoading}
                    className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow transition disabled:opacity-50"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => onReject(report._id)}
                    disabled={actionLoading}
                    className="px-5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow transition disabled:opacity-50"
                  >
                    Reject
                  </button>
                </>
              )}

              {currentStatus === 'Verified' && (
                <button
                  onClick={() => onReject(report._id)}
                  disabled={actionLoading}
                  className="px-5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow transition disabled:opacity-50"
                >
                  Reject
                </button>
              )}

              {currentStatus === 'Rejected' && (
                <button
                  onClick={() => onVerify(report._id)}
                  disabled={actionLoading}
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow transition disabled:opacity-50"
                >
                  Verify
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 text-xs text-gray-700">
        <div className="grid grid-cols-4 gap-4 items-center">
          <span className="font-bold text-gray-500">Timestamp</span>
          <span className="col-span-3 font-medium text-gray-800">
            {report.createdAt
              ? new Date(report.createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'N/A'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 items-center">
          <span className="font-bold text-gray-500">Crisis Type</span>
          <span className="col-span-3">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold rounded-full">
              {report.crisisType || 'Flood'}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 items-start">
          <span className="font-bold text-gray-500 pt-0.5">Location</span>
          <span className="col-span-3 text-gray-600 font-mono leading-tight">
            Long: {report.longitude || 'N/A'}<br />
            Lat: {report.latitude || 'N/A'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 items-start">
          <span className="font-bold text-gray-500 pt-0.5">Description</span>
          <span className="col-span-3 leading-relaxed text-gray-800 font-medium">
            {report.description || 'No description provided.'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 items-center">
          <span className="font-bold text-gray-500">Address</span>
          <span className="col-span-3 font-semibold text-gray-800">
            {report.manualAddress || 'No manual address provided.'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 items-center">
          <span className="font-bold text-gray-500">District</span>
          <span className="col-span-3 font-semibold text-gray-800">
            {formatDistrictField(report)}
          </span>
        </div>
      </div>
    </div>
  );
};