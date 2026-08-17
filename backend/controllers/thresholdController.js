const ThresholdConfig = require("../models/thresholdConfig");

const CONFIG_KEY = "severity_rules";

// @desc    Get current severity threshold configurations
// @route   GET /api/thresholds
exports.getThresholds = async (req, res) => {
  try {
    let config = await ThresholdConfig.findOne({ key: CONFIG_KEY });

    // Auto-create default settings if missing
    if (!config) {
      config = await ThresholdConfig.create({ key: CONFIG_KEY });
    }

    res.json(config);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching threshold configurations",
        error: error.message,
      });
  }
};

// @desc    Update severity threshold configurations
// @route   PUT /api/thresholds
exports.updateThresholds = async (req, res) => {
  const { windowHours, mediumThreshold, criticalThreshold } = req.body;

  // Validation
  if (windowHours <= 0 || mediumThreshold <= 0 || criticalThreshold <= 0) {
    return res
      .status(400)
      .json({ message: "All threshold values must be positive numbers" });
  }

  if (mediumThreshold >= criticalThreshold) {
    return res
      .status(400)
      .json({
        message: "mediumThreshold must be lower than criticalThreshold",
      });
  }

  try {
    const updatedConfig = await ThresholdConfig.findOneAndUpdate(
      { key: CONFIG_KEY },
      { windowHours, mediumThreshold, criticalThreshold },
      { returnDocument: "after", upsert: true, runValidators: true },
    );

    res.json({
      message: "Threshold configurations updated successfully",
      config: updatedConfig,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating threshold configurations",
        error: error.message,
      });
  }
};
