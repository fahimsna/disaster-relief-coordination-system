const axios = require("axios");
const WeatherLog = require("../models/WeatherLog");

function getRecommendation(wind, precip) {
  if (wind < 20 && precip < 1) return "Safe to Deploy";
  if (wind <= 40 && precip <= 10) return "Exercise Caution";
  return "Do Not Deploy";
}

exports.checkWeather = async (req, res) => {
  try {
    const { latitude, longitude, incidentId } = req.body;
    const { data } = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude,
        longitude,
        current: "temperature_2m,precipitation,wind_speed_10m",
      },
    });

    const temperature = data.current.temperature_2m;
    const windSpeed = data.current.wind_speed_10m;
    const precipitation = data.current.precipitation;
    const recommendation = getRecommendation(windSpeed, precipitation);

    const log = await WeatherLog.create({
      incidentId,
      latitude,
      longitude,
      temperature,
      windSpeed,
      precipitation,
      recommendation,
    });

    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await WeatherLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLogById = async (req, res) => {
  try {
    const log = await WeatherLog.findById(req.params.id);
    if (!log) return res.status(404).json({ error: "Not found" });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
