const axios = require("axios");
const WeatherLog = require("../models/WeatherLog");

// TODO(M1 integration): replace with a real fetch once M1's endpoint exists, e.g.
// const { data } = await axios.get(`${M1_BASE_URL}/reports/active`);
// keep the response shape (id/title/district/lat/lng) the same so the frontend doesn't change.
const MOCK_INCIDENTS = [
  {
    id: "inc1",
    title: "Sylhet Flood",
    district: "Sylhet",
    lat: 24.9,
    lng: 91.8,
  },
  {
    id: "inc2",
    title: "Cox's Bazar Cyclone",
    district: "Cox's Bazar",
    lat: 21.4,
    lng: 92.0,
  },
];

// most severe check first so the boundaries (30, 50, 1, 5) fall on the right side
function getRecommendation(wind, precip) {
  if (wind > 50 || precip > 5) return "Do Not Deploy";
  if (wind >= 30 || precip >= 1) return "Exercise Caution";
  return "Safe to Deploy";
}

// just a friendly one-liner for the UI, nothing scientific
function describeCondition(wind, precip) {
  if (precip > 5) return "Heavy rain";
  if (precip > 1) return "Light rain";
  if (wind > 50) return "Strong winds";
  if (wind > 30) return "Windy";
  return "Clear";
}

exports.getIncidents = async (req, res) => {
  // mock until M1 is ready - swap the source line above, controller stays the same
  res.json(MOCK_INCIDENTS);
};

exports.queryWeather = async (req, res) => {
  try {
    const { lat, lng, incidentId } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ error: "lat and lng are required" });
    }

    const { data } = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lng,
        current: "temperature_2m,precipitation,wind_speed_10m",
      },
    });

    const temperature = data.current.temperature_2m;
    const windSpeed = data.current.wind_speed_10m;
    const precipitation = data.current.precipitation;
    const recommendation = getRecommendation(windSpeed, precipitation);

    const log = await WeatherLog.create({
      incident: incidentId,
      latitude: lat,
      longitude: lng,
      weatherSummary: {
        temperature,
        windSpeed,
        precipitation,
        condition: describeCondition(windSpeed, precipitation),
      },
      recommendation,
      queriedBy: req.user?._id, // req.user comes from protect middleware
    });

    res.status(201).json(log);
  } catch (err) {
    // split "Open-Meteo is having a bad day" from "we messed up" so the frontend can tell them apart
    if (err.response) {
      return res
        .status(502)
        .json({ error: "Open-Meteo request failed", detail: err.message });
    }
    res.status(400).json({ error: err.message });
  }
};
