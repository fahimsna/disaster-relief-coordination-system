const DisasterReport = require('../models/disasterReport');
const ThresholdConfig = require('../models/thresholdconfig');

/**
 * 1. Submit a New Public Disaster Report (POST /api/reports)
 * Public-facing intake form handler with location validation & dynamic clustering severity
 */
exports.createReport = async (req, res) => {
    try {
        const { crisisType, description, latitude, longitude, manualAddress, subdistrict, district } = req.body;

        // Validation checks
        if (!subdistrict || !district) {
            return res.status(400).json({ error: "Both subdistrict and district are required to accurately cluster reports." });
        }
        if (!manualAddress && (!latitude || !longitude)) {
            return res.status(400).json({ error: "Please provide either GPS coordinates or a manual address." });
        }

        // 1. Retrieve dynamic configuration thresholds
        const config = await ThresholdConfig.findOne({ key: "severity_rules" }) || { windowHours: 1, mediumThreshold: 5, criticalThreshold: 10 };

        // 2. Calculate rolling time window
        const timeWindowLimit = new Date(Date.now() - config.windowHours * 60 * 60 * 1000);

        // 3. Count unverified reports in the same administrative area within the time window
        const activeReportsCount = await DisasterReport.countDocuments({
            subdistrict,
            district,
            status: "unverified",
            createdAt: { $gte: timeWindowLimit }
        });

        // 4. Calculate severity based on cluster count
        let calculatedSeverity = "Low";
        if (activeReportsCount >= config.criticalThreshold) {
            calculatedSeverity = "Critical";
        } else if (activeReportsCount >= config.mediumThreshold) {
            calculatedSeverity = "Medium";
        }

        // 5. Cascade severity update to recent matching unverified reports if threshold escalates
        if (calculatedSeverity !== "Low") {
            await DisasterReport.updateMany({
                subdistrict,
                district,
                status: "unverified",
                createdAt: { $gte: timeWindowLimit }
            }, {
                $set: { severity: calculatedSeverity }
            });
        }

        // 6. Save new report to database
        const newReport = new DisasterReport({
            crisisType,
            description,
            latitude,
            longitude,
            manualAddress,
            subdistrict,
            district,
            severity: calculatedSeverity
        });

        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * 2. Fetch All Reports for Admin Verification Queue (GET /api/reports)
 */
exports.getAllReports = async (req, res) => {
    try {
        const reports = await DisasterReport.find({}).sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * 3. Fetch Single Detailed Report by ID (GET /api/reports/:id)
 */
exports.getReportById = async (req, res) => {
    try {
        const report = await DisasterReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }
        res.status(200).json(report);
    } catch (err) {
        res.status(400).json({ error: "Invalid Report ID format" });
    }
};

/**
 * 4. Administrator Status Verification & Severity Override (PUT /api/reports/:id/verify)
 */
exports.verifyReport = async (req, res) => {
    try {
        const { status, severityOverride } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (severityOverride) updateData.severity = severityOverride;

        const updatedReport = await DisasterReport.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedReport) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.status(200).json(updatedReport);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};