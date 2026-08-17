import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default image loading bug in React bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Helper: Custom SVG pin generator
const createColorIcon = (color) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="40">
      <path fill="${color}" stroke="#FFFFFF" stroke-width="1.5" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12zm0 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>`;
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -36],
  });
};

export const SEVERITY_ICONS = {
  Critical: createColorIcon('#ef4444'), // Red
  Medium: createColorIcon('#f97316'),   // Orange
  Low: createColorIcon('#22c55e'),      // Green
};