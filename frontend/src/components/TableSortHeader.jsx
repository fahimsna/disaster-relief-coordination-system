import React from 'react';

export const TableSortHeader = ({ label, field, sortField, sortOrder, onSort, className = '' }) => {
  const isCurrentSort = sortField === field;

  return (
    <th
      onClick={() => onSort(field)}
      className={`p-3 cursor-pointer hover:bg-gray-300 transition select-none ${className}`}
    >
      <div className="flex items-center justify-between gap-1">
        <span>{label}</span>
        <span className="text-[10px] text-gray-500">
          {isCurrentSort ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </div>
    </th>
  );
};