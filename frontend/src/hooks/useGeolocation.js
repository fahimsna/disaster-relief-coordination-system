import { useState } from 'react';
import axios from 'axios';

export const useGeolocation = () => {
  const [detectingLocation, setDetectingLocation] = useState(false);

  const getCurrentLocation = (onSuccess, onError) => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const address = res.data.address || {};
          const detectedDistrict = address.state_district || address.district || address.county || '';
          const detectedSubdistrict =
            address.suburb || address.town || address.village || address.city_district || '';

          onSuccess({
            latitude,
            longitude,
            manualAddress: res.data.display_name || `${latitude}, ${longitude}`,
            detectedDistrict,
            detectedSubdistrict,
          });
        } catch (err) {
          onError('Could not auto-fill address from GPS coordinates.');
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
        onError('Location access was denied or unavailable.');
      }
    );
  };

  return { getCurrentLocation, detectingLocation };
};