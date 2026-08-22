const router = require("express").Router();
const c = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Public routes
router.post("/", c.createReport);
router.get("/", c.getAllReports);

// Map Clusters endpoint (Public or Protected based on your needs)
router.get("/map-clusters", c.getMapClusters);

// Protected admin routes – MUST be placed BEFORE /:id to prevent route collisions
router.get("/active", protect, admin, c.getActiveIncidents);
router.put("/batch-resolve", protect, admin, c.batchResolve);

// View report by ID – keep dynamic /:id routes AFTER all static string routes
router.get("/:id", c.getReportById);

router.put("/:id/verify", protect, admin, c.verifyReport);
router.put("/:id/reject", protect, admin, c.rejectReport);
router.put("/:id/severity", protect, admin, c.updateSeverity);
router.put(
  "/:id/resolve",
  protect,
  (req, res, next) => {
    if (["admin", "volunteer"].includes(req.user?.role)) {
      return next();
    }
    return res.status(403).json({ message: "Requires Admin or Volunteer role" });
  },
  c.resolveReport
);

module.exports = router;