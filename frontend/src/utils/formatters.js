/**
 * Resolves report status based on 'status' string.
 */
export const getReportStatus = (r) => {
  if (!r) return 'Pending';

  // Normalize to handle mixed casing (e.g. 'resolved', 'RESOLVED', 'Resolved')
  const statusStr = (r.status || '').toLowerCase();

  if (statusStr === 'resolved') return 'Resolved';
  if (statusStr === 'verified') return 'Verified';
  if (statusStr === 'rejected') return 'Rejected';

  return 'Pending';
};

/**
 * Returns Tailwind CSS badge styles based on severity level.
 */
export const getSeverityBadgeStyle = (severity) => {
  const level = (severity || 'Low').toLowerCase();
  if (level === 'critical') return 'bg-rose-100 text-rose-700 border-rose-200';
  if (level === 'medium') return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-emerald-100 text-emerald-800 border-emerald-200';
};

/**
 * Formats district field as "subdistrict, district, division".
 */
export const formatDistrictField = (r) => {
  const parts = [r.subdistrict, r.district, r.division].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'N/A';
};

/**
 * Returns the raw MongoDB _id string directly.
 */
export const formatIncidentId = (id) => id || 'N/A';