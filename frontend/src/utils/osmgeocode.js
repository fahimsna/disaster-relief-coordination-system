// src/utils/osmGeocode.js
import axios from 'axios';

export const fetchCoordinatesOnSubmit = async (formData) => {
  const { latitude, longitude, subdistrict, upazila, district, division, manualAddress } = formData || {};

  // 1. If valid numeric GPS coordinates are already set, use them immediately
  if (
    latitude !== null &&
    longitude !== null &&
    !isNaN(Number(latitude)) &&
    !isNaN(Number(longitude))
  ) {
    return { latitude: Number(latitude), longitude: Number(longitude) };
  }

  // Fallback defaults (Dhaka central) if geocoding completely fails
  const FALLBACK_COORDS = { latitude: 23.8103, longitude: 90.4125 };

  const targetSubdistrict = subdistrict || upazila || '';
  
  // 2. Progressive fallback search queries (from specific address to district level)
  const queryCandidates = [
    manualAddress && district ? `${manualAddress.trim()}, ${district.trim()}, Bangladesh` : null,
    targetSubdistrict && district ? `${targetSubdistrict.trim()}, ${district.trim()}, Bangladesh` : null,
    district ? `${district.trim()}, Bangladesh` : null,
    division ? `${division.trim()}, Bangladesh` : null,
  ].filter(Boolean);

  if (queryCandidates.length === 0) {
    return FALLBACK_COORDS;
  }

  // 3. Loop through queries until Nominatim returns valid coordinates
  for (const searchQuery of queryCandidates) {
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: searchQuery,
          format: 'json',
          limit: 1,
          email: 'contact@disasterreport.local', // Identifies app via query param to comply with Nominatim policy
        },
        // Removed custom headers: Browsers block setting "User-Agent" on client-side requests
      });

      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const parsedLat = parseFloat(res.data[0].lat);
        const parsedLng = parseFloat(res.data[0].lon);

        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
          return { latitude: parsedLat, longitude: parsedLng };
        }
      }
    } catch (err) {
      console.warn(`OSM Geocoding query failed for "${searchQuery}":`, err.message);
    }
  }

  // Return fallback coordinates instead of null to prevent 400 Bad Request
  return FALLBACK_COORDS;
};