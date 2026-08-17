const express = require("express");

const router = express.Router();

const {
  getCampaignAnalytics,
} = require("../controllers/campaignAnalyticsController");

const { protect } = require("../middleware/authMiddleware");

// =====================================================
// CAMPAIGN ANALYTICS
// =====================================================

// Protected campaign analytics dashboard
router.get("/", protect, getCampaignAnalytics);

module.exports = router;
