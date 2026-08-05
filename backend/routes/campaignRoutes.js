const express = require("express");
const router = express.Router();

const {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} = require("../controllers/campaignController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Public - View all campaigns
router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);

// Admin - Create campaign
router.post("/", protect, authorizeRoles("admin"), createCampaign);
router.put("/:id", protect, authorizeRoles("admin"), updateCampaign);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCampaign);

module.exports = router;
