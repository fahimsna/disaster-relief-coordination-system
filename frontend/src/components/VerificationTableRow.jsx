import React from 'react';
import { SeverityBadge } from './SeverityBadge.jsx';
import { getReportStatus, formatDistrictField, formatIncidentId } from '../utils/formatters.js';

export const VerificationTableRow = ({
  report,
  onSelectReport,
  onVerify,
  onReject,
  onSetSeverity,
}) => {
  const currentStatus = getReportStatus(report);
  const isResolved = currentStatus?.toLowerCase() === 'resolved';

  return (
    <tr
      onClick={() => onSelectReport(report)}
      className="hover:bg-slate-50 cursor-pointer transition"
    >
      {/* Incident ID */}
      <td
        className="p-3 font-mono font-semibold text-gray-800 text-[11px] w-28 max-w-[110px] truncate"
        title={report._id}
      >
        {formatIncidentId(report._id)}
      </td>

      {/* Timestamp */}
      <td className="p-3 text-gray-500 whitespace-nowrap leading-tight">
        {report.createdAt
          ? new Date(report.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : 'N/A'}
        <br />
        <span className="text-[10px] text-gray-400">
          {report.createdAt
            ? new Date(report.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : ''}
        </span>
      </td>

      {/* Crisis Type */}
      <td className="p-3 whitespace-nowrap">
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-indigo-100 text-indigo-700">
          {report.crisisType || 'Flood'}
        </span>
      </td>

      {/* Status */}
      <td className="p-3 whitespace-nowrap">
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
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
      </td>

      {/* Coordinates */}
      <td className="p-3 text-gray-600 whitespace-nowrap text-[11px]">
        Long: {report.longitude ? Number(report.longitude).toFixed(3) : 'N/A'}
        <br />
        Lat: {report.latitude ? Number(report.latitude).toFixed(3) : 'N/A'}
      </td>

      {/* Description */}
      <td
        className="p-3 text-gray-600 text-[11px] w-48 max-w-[200px] truncate"
        title={report.description}
      >
        {report.description || 'No description provided.'}
      </td>

      {/* District */}
      <td className="p-3 whitespace-nowrap text-[11px] font-semibold text-gray-700">
        {formatDistrictField(report)}
      </td>

      {/* Severity Badge */}
      <td className="p-3 whitespace-nowrap">
        <SeverityBadge
          reportId={report._id}
          currentSeverity={report.severity}
          onSetSeverity={onSetSeverity}
          disabled={isResolved}
        />
      </td>

      {/* Actions */}
      <td
        className="p-3 whitespace-nowrap text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center items-center gap-1.5">
          {isResolved ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-600">
              Resolved
            </span>
          ) : currentStatus === 'Pending' ? (
            <>
              <button
                onClick={() => onVerify(report._id)}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-full transition"
              >
                Verify
              </button>
              <button
                onClick={() => onReject(report._id)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-full transition"
              >
                Reject
              </button>
            </>
          ) : (
            <span className="text-[11px] font-semibold text-gray-400">
              {currentStatus}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};