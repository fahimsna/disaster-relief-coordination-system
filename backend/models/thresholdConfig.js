const mongoose = require('mongoose');

const ThresholdConfigSchema = new mongoose.Schema({
    key: { type: String, default: "severity_rules", unique: true },
    windowHours: { type: Number, default: 1 },
    mediumThreshold: { type: Number, default: 5 },
    criticalThreshold: { type: Number, default: 10 }
});

module.exports = mongoose.model('ThresholdConfig', ThresholdConfigSchema);