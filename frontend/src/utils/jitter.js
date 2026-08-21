export function applyJitter(lat, lng, index) {
  if (!lat || !lng) return [23.8103, 90.4125]; // Default fallback center (Dhaka)

  // Spiral offset calculation
  const angle = index * 0.5;
  const radius = 0.0002 * (1 + index * 0.1); 

  const jitteredLat = lat + radius * Math.cos(angle);
  const jitteredLng = lng + radius * Math.sin(angle);

  return [jitteredLat, jitteredLng];
}