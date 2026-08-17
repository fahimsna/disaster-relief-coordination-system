const DisasterReport = require("../models/disasterReport");
const Threshold = require("../models/thresholdConfig"); // Import your threshold config model

// @desc    Create a new disaster report & auto-calculate severity in rolling window
// @route   POST /api/reports
exports.createReport = async (req, res) => {
  try {
    const {
      crisisType,
      description,
      district,
      subdistrict,
      manualAddress,
      latitude,
      longitude,
    } = req.body;

    if (!crisisType) {
      return res.status(400).json({ message: "Crisis type is required." });
    }

    if (!district || !subdistrict) {
      return res
        .status(400)
        .json({ message: "District and Sub-district are required." });
    }

    // 1. Create the new report
    const report = await DisasterReport.create({
      crisisType,
      description,
      district,
      subdistrict,
      manualAddress,
      latitude,
      longitude,
    });

    // 2. Load Global Threshold settings (Fallback to default values if not configured)
    const config = (await Threshold.findOne()) || {
      windowHours: 1,
      mediumThreshold: 5,
      criticalThreshold: 10,
    };

    // 3. Define the rolling time window start date (NOW - hours)
    const windowStart = new Date(
      Date.now() - config.windowHours * 60 * 60 * 1000,
    );

    // 4. Match query for reports in the same subdistrict & district within time window
    const windowQuery = {
      createdAt: { $gte: windowStart },
      district: report.district,
      subdistrict: report.subdistrict,
    };

    // 5. Count total reports in this rolling window
    const totalReportsInWindow =
      await DisasterReport.countDocuments(windowQuery);

    // 6. Determine severity based on configured thresholds
    let calculatedSeverity = "Low";
    if (totalReportsInWindow >= config.criticalThreshold) {
      calculatedSeverity = "Critical";
    } else if (totalReportsInWindow >= config.mediumThreshold) {
      calculatedSeverity = "Medium";
    }

    // 7. BACK-PROPAGATE: Bulk update severity for ALL reports in this rolling window
    await DisasterReport.updateMany(windowQuery, {
      $set: { severity: calculatedSeverity },
    });

    // 8. Return updated report object
    report.severity = calculatedSeverity;

    res.status(201).json({
      success: true,
      data: report,
      windowStats: {
        totalReportsInWindow,
        calculatedSeverity,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all disaster reports
// @route   GET /api/reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await DisasterReport.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reports", error: error.message });
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
exports.getReportById = async (req, res) => {
  try {
    const report = await DisasterReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({ success: true, data: report });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching report", error: error.message });
  }
};

// @desc    Verify a disaster report
// @route   PUT /api/reports/:id/verify
exports.verifyReport = async (req, res) => {
  try {
    const report = await DisasterReport.findByIdAndUpdate(
      req.params.id,
      { status: "Verified" },
      { returnDocument: "after" },
    );
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({
      success: true,
      message: "Report verified successfully",
      data: report,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to verify report", error: error.message });
  }
};

// @desc    Reject a disaster report
// @route   PUT /api/reports/:id/reject
exports.rejectReport = async (req, res) => {
  try {
    const report = await DisasterReport.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { returnDocument: "after" },
    );
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({ success: true, message: "Report rejected", data: report });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to reject report", error: error.message });
  }
};

// @desc    Manual override custom severity of a single report
// @route   PUT /api/reports/:id/severity
exports.updateSeverity = async (req, res) => {
  try {
    const { severity } = req.body; // 'Low', 'Medium', or 'Critical'
    const report = await DisasterReport.findByIdAndUpdate(
      req.params.id,
      { severity },
      { returnDocument: "after" },
    );
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({ success: true, message: "Severity updated", data: report });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update severity", error: error.message });
  }
};

// @desc    Resolve a disaster report
// @route   PUT /api/reports/:id/resolve
exports.resolveReport = async (req, res) => {
  try {
    const report = await DisasterReport.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { returnDocument: "after" },
    );
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({
      success: true,
      message: "Report resolved successfully",
      data: report,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to resolve report", error: error.message });
  }
};
