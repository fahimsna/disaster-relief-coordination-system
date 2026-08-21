const Notification = require("../models/Notification");

// =========================================================
// FEATURE 1: ALERT CONFIGURATION MATRIX - CRUD OPERATIONS
// =========================================================

// @desc Create a new alert configuration draft
// @route POST /api/notifications
// @access Protected (Admin)
const createNotification = async (req, res) => {
  try {
    const { messageBody, district, severity, targetGroups } = req.body;

    // Validation
    if (!messageBody || !district || !severity || !targetGroups) {
      return res.status(400).json({
        success: false,
        message: "Please provide message body, district, severity, and target group.",
      });
    }

    // Ensure targetGroups is an array
    const groups = Array.isArray(targetGroups) ? targetGroups : [targetGroups];

    const notification = await Notification.create({
      messageBody,
      district,
      severity,
      targetGroups: groups,
      status: "draft",
      createdBy: req.user ? req.user.id : null,
    });

    res.status(201).json({
      success: true,
      message: "Alert configuration draft created successfully.",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get all alert drafts
// @route GET /api/notifications
// @access Protected (Admin)
const getNotifications = async (req, res) => {
  try {
    const { status, district, severity } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (district) filter.district = district;
    if (severity) filter.severity = severity;

    const notifications = await Notification.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get a single alert draft by ID
// @route GET /api/notifications/:id
// @access Protected (Admin)
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Alert draft not found',
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update an alert draft
// @route PATCH /api/notifications/:id
// @access Protected (Admin)
const updateNotification = async (req, res) => {
  try {
    const { messageBody, district, severity, targetGroups, status } = req.body;

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Alert draft not found',
      });
    }

    // Prevent updating if already sent
    if (notification.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a sent alert',
      });
    }

    // Update fields if provided
    if (messageBody) notification.messageBody = messageBody;
    if (district) notification.district = district;
    if (severity) notification.severity = severity;
    if (targetGroups) {
      notification.targetGroups = Array.isArray(targetGroups) ? targetGroups : [targetGroups];
    }
    if (status && ['draft', 'cancelled'].includes(status)) {
      notification.status = status;
    }

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Alert draft updated successfully',
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Delete an alert draft
// @route DELETE /api/notifications/:id
// @access Protected (Admin)
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Alert draft not found',
      });
    }

    // Prevent deleting if already sent
    if (notification.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a sent alert',
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Alert draft deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get district list
// @route GET /api/notifications/districts
// @access Public
const getDistricts = async (req, res) => {
  const districts = [
    'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogura',
    'Brahmanbaria', 'Chandpur', 'Chapai Nawabganj', 'Chattogram', 'Chuadanga',
    "Cox's Bazar", 'Cumilla', 'Dhaka', 'Dinajpur', 'Faridpur', 'Feni',
    'Gaibandha', 'Gazipur', 'Gopalganj', 'Habiganj', 'Jamalpur', 'Jashore',
    'Jhalokathi', 'Jhenaidah', 'Joypurhat', 'Khagrachhari', 'Khulna',
    'Kishoreganj', 'Kurigram', 'Kushtia', 'Lakshmipur', 'Lalmonirhat',
    'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar',
    'Munshiganj', 'Mymensingh', 'Naogaon', 'Narail', 'Narayanganj',
    'Narsingdi', 'Natore', 'Netrokona', 'Nilphamari', 'Noakhali',
    'Pabna', 'Panchagarh', 'Patuakhali', 'Pirojpur', 'Rajbari', 'Rajshahi',
    'Rangamati', 'Rangpur', 'Satkhira', 'Shariatpur', 'Sherpur',
    'Sirajganj', 'Sunamganj', 'Sylhet', 'Tangail', 'Thakurgaon'
  ];

  res.status(200).json({
    success: true,
    data: districts,
  });
};

// =========================================================
// FEATURE 3: AUTOMATED DONOR THANK-YOU EMAIL (Nodemailer)
// =========================================================

const { sendThankYouEmail } = require("../services/emailService");

// @desc Send thank-you email to donor
// @route POST /api/notifications/send-email
// @access Protected (Admin)
const sendDonorThankYouEmail = async (req, res) => {
  try {
    const { donorEmail, donorName, amount, campaignTitle, donationId } = req.body;

    if (!donorEmail || !donorName || !amount || !campaignTitle || !donationId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const result = await sendThankYouEmail(
      donorEmail,
      donorName,
      amount,
      campaignTitle,
      donationId
    );

    // Save email log to Notification
    const notification = await Notification.findOneAndUpdate(
      { "emailLog.donationId": donationId },
      {
        $push: {
          emailLog: {
            donorEmail,
            donationId,
            status: result.status,
            timestamp: result.timestamp || new Date(),
            errorMessage: result.errorMessage || null,
          },
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: result.success,
      message: result.success ? "Email sent successfully" : "Email failed",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get all email logs
// @route GET /api/notifications/email-logs
// @access Protected (Admin)
const getEmailLogs = async (req, res) => {
  try {
    const logs = await Notification.find({ emailLog: { $exists: true, $ne: [] } })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Retry failed email
// @route POST /api/notifications/retry-email/:id
// @access Protected (Admin)
const retryFailedEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { donorEmail, donorName, amount, campaignTitle, donationId } = req.body;

    const result = await sendThankYouEmail(
      donorEmail,
      donorName,
      amount,
      campaignTitle,
      donationId
    );

    await Notification.findOneAndUpdate(
      { "emailLog.donationId": donationId },
      {
        $set: {
          "emailLog.$.status": result.status,
          "emailLog.$.timestamp": new Date(),
        },
      }
    );

    res.status(200).json({
      success: result.success,
      message: result.success ? "Email resent successfully" : "Retry failed",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================================
// FEATURE 4: VOLUNTEER COMPLETION CERTIFICATE GENERATOR (PDFKit)
// =========================================================

const { generateCertificate } = require("../services/pdfService");

// Helper function to get incident name
const getIncidentName = async (incidentId) => {
  try {
    const DisasterReport = require("../models/disasterReport");
    const incident = await DisasterReport.findById(incidentId);
    return incident ? `${incident.crisisType} - ${incident.district}` : "Disaster Relief Mission";
  } catch {
    return "Disaster Relief Mission";
  }
};

// @desc Generate volunteer completion certificate
// @route GET /api/notifications/certificate/:volunteerId/:missionId
// @access Protected (Admin or Volunteer)
const generateVolunteerCertificate = async (req, res) => {
  try {
    const { volunteerId, missionId } = req.params;

    const Volunteer = require("../models/Volunteer");
    const volunteer = await Volunteer.findById(volunteerId);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    // Prepare certificate data
    const certificateData = {
      fullName: volunteer.fullName || "Volunteer",
      disasterZone: volunteer.assignedIncident
        ? await getIncidentName(volunteer.assignedIncident)
        : "Disaster Relief Mission",
      startDate: volunteer.createdAt
        ? volunteer.createdAt.toLocaleDateString()
        : "N/A",
      endDate: new Date().toLocaleDateString(),
      serialNumber: `VOL-${Date.now()}-${volunteerId.slice(-6)}`,
    };

    // Generate PDF
    const pdfBuffer = await generateCertificate(certificateData);

    // Send PDF as download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate-${volunteer.fullName || "volunteer"}-${Date.now()}.pdf`
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Certificate generation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate certificate",
    });
  }
};

// @desc Get available certificates for a volunteer
// @route GET /api/notifications/certificate/volunteer/:volunteerId
// @access Protected
const getVolunteerCertificates = async (req, res) => {
  try {
    const { volunteerId } = req.params;

    const Volunteer = require("../models/Volunteer");
    const volunteer = await Volunteer.findById(volunteerId);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    // Return list of available certificates (mocked for now)
    res.status(200).json({
      success: true,
      data: [
        {
          id: "1",
          volunteerId: volunteerId,
          missionName: "Mission 1",
          date: new Date().toLocaleDateString(),
          serialNumber: `VOL-${Date.now()}-${volunteerId.slice(-6)}`,
          available: true,
        },
      ],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================================
// MODULE EXPORTS - ALL FEATURES (1, 3, 4)
// =========================================================

module.exports = {
  // Feature 1: Alert Configuration
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getDistricts,

  // Feature 3: Automated Donor Thank-You Email
  sendDonorThankYouEmail,
  getEmailLogs,
  retryFailedEmail,

  // Feature 4: Volunteer Completion Certificate
  generateVolunteerCertificate,
  getVolunteerCertificates,
};