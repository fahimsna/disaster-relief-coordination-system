// backend/utils/severityCalculator.js
const ThresholdConfig = require('../models/ThresholdConfig');
const Report = require('../models/Report');

const evaluateAreaSeverity = async (district, upazila) => {
  // 1. Fetch current dynamic rules from DB (fallback to schema defaults if empty)
  const config = (await ThresholdConfig.findOne({ key: "severity_rules" })) || {
    windowHours: 1,
    mediumThreshold: 5,
    criticalThreshold: 10
  };

  // 2. Count reports in the specified location within the windowHours timeframe
  const timeWindow = new Date(Date.now() - config.windowHours * 60 * 60 * 1000);
  
  const reportCount = await Report.countDocuments({
    district,
    upazila,
    createdAt: { $gte: timeWindow }
  });

  // 3. Assign severity based on DB thresholds
  if (reportCount >= config.criticalThreshold) {
    return 'CRITICAL';
  } else if (reportCount >= config.mediumThreshold) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
};

module.exports = { evaluateAreaSeverity };