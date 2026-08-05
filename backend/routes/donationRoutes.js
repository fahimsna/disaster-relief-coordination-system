const express = require("express");
const router = express.Router();

const {
  createDonation,
  getMyDonations,
  getAllDonations,
  createCheckoutSession,
  stripeWebhook,
} = require("../controllers/donationController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Stripe Webhook (must NOT use protect middleware)
router.post("/webhook", stripeWebhook);

// Create Donation
router.post("/", protect, createDonation);

// Create Stripe Checkout Session
router.post("/checkout", protect, createCheckoutSession);

// Logged-in user's donation history
router.get("/my", protect, getMyDonations);

// Admin - View all donations
router.get("/", protect, authorizeRoles("admin"), getAllDonations);

module.exports = router;
