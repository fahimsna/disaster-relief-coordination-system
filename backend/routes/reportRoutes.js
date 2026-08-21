const router = require("express").Router();
const c = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware"); // Adjust filename if named differently (e.g., admin.js)

// Public routes
router.post("/", c.createReport);
router.get("/", c.getAllReports);

// Protected admin routes – must be BEFORE /:id
router.get("/active", protect, admin, c.getActiveIncidents);

// View report by ID – keep this LAST for specific IDs
router.get("/:id", c.getReportById);

router.put("/:id/verify", protect, admin, c.verifyReport);
router.put("/:id/reject", protect, admin, c.rejectReport);
router.put("/:id/severity", protect, admin, c.updateSeverity);
router.put("/:id/resolve", protect, admin, c.resolveReport);

module.exports = router;
