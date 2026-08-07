const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getDistricts,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Public route - no auth required
router.get("/districts", getDistricts);

// All other routes require authentication and admin role
router.use(protect);
router.use(authorizeRoles("admin"));

// CRUD routes
router.route("/")
  .post(createNotification)
  .get(getNotifications);

router.route("/:id")
  .get(getNotificationById)
  .patch(updateNotification)
  .delete(deleteNotification);

module.exports = router;