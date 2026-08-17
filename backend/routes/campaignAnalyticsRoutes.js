const express = require("express");

const router = express.Router();

const {
  getCampaignAnalytics,
} = require("../controllers/campaignAnalyticsController");

const { protect } = require("../middleware/authMiddleware");

const admin = require("../middleware/adminMiddleware");

// =====================================================
// CAMPAIGN ANALYTICS
// =====================================================
//
// Authentication + Admin authorization
//
// Only administrators should be able to access the
// campaign analytics dashboard.
// =====================================================

router.get("/", protect, admin, getCampaignAnalytics);

module.exports = router;
