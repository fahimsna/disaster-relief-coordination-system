const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createFundAllocation,
  getFundAllocations,
  getCampaignAllocations,
  updateFundAllocation,
  deleteFundAllocation,
} = require("../controllers/fundAllocationController");

const router = express.Router();

// View allocations
router.get("/", protect, getFundAllocations);

// View allocations for a campaign
router.get("/campaign/:campaignId", protect, getCampaignAllocations);

// Admin-only allocation management
router.post("/", protect, admin, createFundAllocation);

router.put("/:id", protect, admin, updateFundAllocation);

router.delete("/:id", protect, admin, deleteFundAllocation);

module.exports = router;
