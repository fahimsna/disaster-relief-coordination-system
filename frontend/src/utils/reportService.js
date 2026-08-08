// frontend/src/utils/reportService.js
const API_BASE = 'http://localhost:8000/api';

/**
 * Helper: Obtain browser geolocation wrapped in a Promise
 * For "Use My Location" button on public intake form
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: Number(position.coords.latitude.toFixed(4)),
          longitude: Number(position.coords.longitude.toFixed(4)),
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};

/**
 * Public: Submit a new disaster report
 */
export const createReport = async (reportData) => {
  const payload = {
    ...reportData,
    status: 'unverified',
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Failed to submit disaster report');
  return response.json();
};

/**
 * Public Map: Fetch strictly VERIFIED reports for live map display
 */
export const fetchPublicReports = async () => {
  const response = await fetch(`${API_BASE}/reports?status=verified`);
  if (!response.ok) throw new Error('Failed to fetch public live map reports');
  return response.json();
};

/**
 * Admin Overview: Fetch ALL reports (verified, unverified, rejected)
 * Supports query parameters for sorting & filtering
 */
export const fetchAllReports = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_BASE}/reports?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch report overview list');
  return response.json();
};

/**
 * Admin Detail View: Fetch a single report by ID
 */
export const fetchReportById = async (reportId) => {
  const response = await fetch(`${API_BASE}/reports/${reportId}`);
  if (!response.ok) throw new Error('Failed to fetch report details');
  return response.json();
};

/**
 * Admin Action: Update report status ('verified' | 'rejected') or override severity
 */
export const updateReport = async (reportId, updateData) => {
  const response = await fetch(`${API_BASE}/reports/${reportId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) throw new Error('Failed to update report');
  return response.json();
};

/**
 * Admin Settings: Fetch current rolling time window & severity count thresholds
 */
export const fetchThresholdSettings = async () => {
  const response = await fetch(`${API_BASE}/settings/thresholds`);
  if (!response.ok) throw new Error('Failed to fetch threshold settings');
  return response.json();
};

/**
 * Admin Settings: Update default severity calculation thresholds
 */
export const updateThresholdSettings = async (settingsData) => {
  const response = await fetch(`${API_BASE}/settings/thresholds`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settingsData),
  });

  if (!response.ok) throw new Error('Failed to update threshold settings');
  return response.json();
};