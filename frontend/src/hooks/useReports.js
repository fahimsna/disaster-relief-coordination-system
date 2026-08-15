import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getReportStatus, formatDistrictField } from '../utils/formatters';

const API_BASE = 'http://localhost:8000/api/reports';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('priority');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      const rawData = res.data?.data || res.data;
      setReports(Array.isArray(rawData) ? rawData : []);
    } catch (err) {
      setReports([]);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to fetch verification queue.'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReportLocal = (id, fields) => {
    setReports((prev) => prev.map((r) => (r._id === id ? { ...r, ...fields } : r)));
  };

  const verifyReport = async (id) => {
    setActionLoading(true);
    try {
      await axios.put(`${API_BASE}/${id}/verify`);
      updateReportLocal(id, { status: 'Verified' });
      setFeedback({ type: 'success', message: 'Report verified successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to verify report.' });
    } finally {
      setActionLoading(false);
    }
  };

  const rejectReport = async (id) => {
    setActionLoading(true);
    try {
      await axios.put(`${API_BASE}/${id}/reject`);
      updateReportLocal(id, { status: 'Rejected' });
      setFeedback({ type: 'success', message: 'Report rejected.' });
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to reject report.' });
    } finally {
      setActionLoading(false);
    }
  };

  const setSeverity = async (id, severity) => {
    try {
      await axios.put(`${API_BASE}/${id}/severity`, { severity });
      updateReportLocal(id, { severity });
      setFeedback({ type: 'success', message: `Severity updated to ${severity}` });
    } catch (err) {
      updateReportLocal(id, { severity });
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedReports = useMemo(() => {
    let result = [...reports];

    // Search filter matching raw ID, status, location, severity, crisis, and descriptions
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) =>
        [
          r._id,
          getReportStatus(r),
          formatDistrictField(r),
          r.severity,
          r.crisisType,
          r.description,
          r.manualAddress,
        ]
          .filter(Boolean)
          .some((val) => val.toString().toLowerCase().includes(q))
      );
    }

    // Type-safe sorting logic
    result.sort((a, b) => {
      const aStatus = getReportStatus(a);
      const bStatus = getReportStatus(b);

      if (sortField === 'priority') {
        if (aStatus === 'Pending' && bStatus !== 'Pending') return -1;
        if (aStatus !== 'Pending' && bStatus === 'Pending') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'status') {
        valA = aStatus;
        valB = bStatus;
      } else if (sortField === 'district') {
        valA = formatDistrictField(a);
        valB = formatDistrictField(b);
      } else if (sortField === 'severity') {
        valA = a.severity || 'Low';
        valB = b.severity || 'Low';
      } else if (sortField === 'latitude' || sortField === 'longitude') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (sortField === 'createdAt') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [reports, searchQuery, sortField, sortOrder]);

  return {
    reports: filteredAndSortedReports,
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
    refetch: fetchReports,
  };
};