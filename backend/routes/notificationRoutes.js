const express = require("express");
const router = express.Router();

// Feature 1: Alert Configuration
const {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getDistricts,
} = require("../controllers/notificationController");

// Feature 3: Email
const {
  sendDonorThankYouEmail,
  getEmailLogs,
  retryFailedEmail,
} = require("../controllers/notificationController");

// Feature 4: Certificate
const {
  generateVolunteerCertificate,
  getVolunteerCertificates,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// =========================================================
// PUBLIC ROUTES - No Auth Required
// =========================================================

// Get districts list (Feature 1)
router.get("/districts", getDistricts);

// =========================================================
// PROTECTED ROUTES - Require Authentication & Admin Role
// =========================================================

router.use(protect);
router.use(authorizeRoles("admin"));

// =========================================================
// FEATURE 1: Alert Configuration - CRUD Routes
// =========================================================

router.route("/")
  .post(createNotification)
  .get(getNotifications);

router.route("/:id")
  .get(getNotificationById)
  .patch(updateNotification)
  .delete(deleteNotification);

// =========================================================
// FEATURE 3: Automated Donor Thank-You Email
// =========================================================

// Send thank-you email to donor
router.post("/send-email", sendDonorThankYouEmail);

// Get all email delivery logs
router.get("/email-logs", getEmailLogs);

// Retry failed email
router.post("/retry-email/:id", retryFailedEmail);

// =========================================================
// FEATURE 4: Volunteer Completion Certificate
// =========================================================

// Generate and download certificate for a volunteer
router.get(
  "/certificate/:volunteerId/:missionId",
  generateVolunteerCertificate
);

// Get available certificates for a volunteer
router.get(
  "/certificate/volunteer/:volunteerId",
  getVolunteerCertificates
);

module.exports = router;