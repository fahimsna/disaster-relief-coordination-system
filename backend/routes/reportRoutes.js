// backend/routes/reportRoutes.js
const router = require("express").Router();
const c = require("../controllers/reportController");
const { protect: auth } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/", c.createReport); // File a report
router.get("/", c.getAllReports); // View all reports
router.get("/active", auth, admin, c.getActiveIncidents); // Verified incidents for the task board -- must stay ABOVE '/:id' or express will treat "active" as an :id
router.get("/:id", c.getReportById); // View report by ID
router.put("/:id/verify", c.verifyReport); // Admin verify report
router.put("/:id/reject", c.rejectReport); // Admin reject report
router.put("/:id/severity", c.updateSeverity); // Admin update severity
router.put("/:id/resolve", c.resolveReport); // Admin resolve report
module.exports = router;
