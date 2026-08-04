const mongoose = require("mongoose");

const weatherLogSchema = new mongoose.Schema(
  {
    incidentId: { type: String }, // optional reference to a disaster incident
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    temperature: Number,
    windSpeed: Number,
    precipitation: Number,
    recommendation: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("WeatherLog", weatherLogSchema);
