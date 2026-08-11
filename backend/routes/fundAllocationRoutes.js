const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createFundAllocation,
  getFundAllocations,
  getCampaignAllocations,
  getFundAllocationDashboard,
  updateFundAllocation,
  deleteFundAllocation,
} = require("../controllers/fundAllocationController");

const router = express.Router();

// Overall fund allocation transparency dashboard
router.get("/dashboard", protect, getFundAllocationDashboard);

// View all allocations
router.get("/", protect, getFundAllocations);

// View allocations for a specific campaign
router.get("/campaign/:campaignId", protect, getCampaignAllocations);

// Admin-only allocation management
router.post("/", protect, admin, createFundAllocation);

router.put("/:id", protect, admin, updateFundAllocation);

router.delete("/:id", protect, admin, deleteFundAllocation);

module.exports = router;
