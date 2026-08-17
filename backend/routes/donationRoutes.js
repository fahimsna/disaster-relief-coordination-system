const express = require("express");

const router = express.Router();

const {
  createDonation,
  getMyDonations,
  getAllDonations,
  getDonationReceipt,
  createCheckoutSession,
  cancelDonation,
  stripeWebhook,
} = require("../controllers/donationController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// =====================================================
// STRIPE WEBHOOK
// =====================================================

// Stripe does not use our authentication middleware.
router.post("/webhook", stripeWebhook);

// =====================================================
// DONATION CREATION
// =====================================================

router.post("/", protect, createDonation);

// =====================================================
// STRIPE CHECKOUT
// =====================================================

router.post("/checkout", protect, createCheckoutSession);

// =====================================================
// DONATION RECEIPT
// =====================================================

router.get("/receipt/:sessionId", protect, getDonationReceipt);

// =====================================================
// CANCELLED DONATION
// =====================================================

router.put("/cancel/:sessionId", protect, cancelDonation);

// =====================================================
// DONATION HISTORY
// =====================================================

router.get("/my", protect, getMyDonations);

// =====================================================
// ADMIN - ALL DONATIONS
// =====================================================

router.get("/", protect, authorizeRoles("admin"), getAllDonations);

module.exports = router;
