const express = require("express");
const router = express.Router();

const {
  sendBroadcast,
  getSMSLogs,
  getSMSLogById,
  getVolunteersByDistrict,
} = require("../controllers/smsController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// All routes require authentication and admin role
router.use(protect);
router.use(authorizeRoles("admin"));

// Send SMS broadcast
router.post("/broadcast", sendBroadcast);

// Get SMS logs
router.get("/logs", getSMSLogs);

// Get SMS log by ID
router.get("/logs/:id", getSMSLogById);

// Get volunteers by district (for preview)
router.get("/volunteers/:district", getVolunteersByDistrict);

module.exports = router;