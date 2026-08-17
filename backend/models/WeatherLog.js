const mongoose = require("mongoose");

const weatherLogSchema = new mongoose.Schema(
  {
    // string for now since M1's incidents are mock ids (inc1/inc2, not ObjectIds)
    // -> need to flip to { type: mongoose.Schema.Types.ObjectId, ref: "Incident" } once M1's real API is live
    incident: { type: String },

    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    weatherSummary: {
      temperature: Number,
      windSpeed: Number,
      precipitation: Number,
      condition: String, // quick human-readable blurb, see describeCondition()
    },

    recommendation: {
      type: String,
      enum: ["Safe to Deploy", "Exercise Caution", "Do Not Deploy"],
    },

    queriedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who ran the check
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }, // still keep createdAt/updatedAt for free
);

module.exports = mongoose.model("WeatherLog", weatherLogSchema);
