// src/utils/osmGeocode.js
import axios from 'axios';

export const fetchCoordinatesOnSubmit = async (formData) => {
  // If user already used GPS auto-detect, preserve those exact coordinates
  if (formData.latitude && formData.longitude && !formData.division) {
    return { latitude: formData.latitude, longitude: formData.longitude };
  }

  // Construct query: Upazila -> District -> Division -> Bangladesh
  const queryParts = [
    formData.subdistrict || formData.upazila,
    formData.district,
    formData.division,
    'Bangladesh',
  ].filter(Boolean);

  if (queryParts.length === 1 && queryParts[0] === 'Bangladesh') {
    return { latitude: null, longitude: null };
  }

  const searchQuery = queryParts.join(', ');

  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: searchQuery,
        format: 'json',
        limit: 1,
      },
    });

    if (res.data && res.data.length > 0) {
      return {
        latitude: parseFloat(res.data[0].lat),
        longitude: parseFloat(res.data[0].lon),
      };
    }
  } catch (err) {
    console.error('OSM Geocoding on submit failed:', err);
  }

  return { latitude: null, longitude: null };
};