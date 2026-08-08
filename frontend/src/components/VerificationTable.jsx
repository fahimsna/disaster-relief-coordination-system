import React from 'react';
import { TableSortHeader } from './TableSortHeader';
import { VerificationTableRow } from './VerificationTableRow';

export const VerificationTable = ({
  reports,
  loading,
  searchQuery,
  onSearchChange,
  sortField,
  sortOrder,
  onSort,
  onSelectReport,
  onVerify,
  onReject,
  onSetSeverity,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Verification Queue</h1>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Filter by ID, district, type..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 pl-8 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#00b4d8] bg-slate-50 text-gray-800"
          />
          <span className="absolute left-2.5 top-2.5 text-xs text-gray-400">🔍</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 font-bold border-b border-gray-300">
              <TableSortHeader label="Incident ID" field="_id" sortField={sortField} sortOrder={sortOrder} onSort={onSort} className="w-28 max-w-[110px]" />
              <TableSortHeader label="Timestamp" field="createdAt" sortField={sortField} sortOrder={sortOrder} onSort={onSort} />
              <TableSortHeader label="Crisis Type" field="crisisType" sortField={sortField} sortOrder={sortOrder} onSort={onSort} />
              <TableSortHeader label="Status" field="status" sortField={sortField} sortOrder={sortOrder} onSort={onSort} />
              <TableSortHeader label="Coordinates" field="latitude" sortField={sortField} sortOrder={sortOrder} onSort={onSort} />
              <TableSortHeader label="Description" field="description" sortField={sortField} sortOrder={sortOrder} onSort={onSort} className="w-48 max-w-[200px]" />
              <TableSortHeader label="District" field="district" sortField={sortField} sortOrder={sortOrder} onSort={onSort} />
              <TableSortHeader label="Severity" field="severity" sortField={sortField} sortOrder={sortOrder} onSort={onSort} />
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-500">
                  Loading queue...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-400">
                  No disaster reports match your search query.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <VerificationTableRow
                  key={report._id}
                  report={report}
                  onSelectReport={onSelectReport}
                  onVerify={onVerify}
                  onReject={onReject}
                  onSetSeverity={onSetSeverity}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};