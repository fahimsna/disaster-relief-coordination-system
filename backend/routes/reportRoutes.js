const router = require('express').Router();
const c = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware'); // Adjust filename if named differently (e.g., admin.js)

// Public routes
router.post('/', c.createReport);          // File a report
router.get('/', c.getAllReports);          // View all reports
router.get('/:id', c.getReportById);       // View report by ID

// Protected admin routes
router.put('/:id/verify', protect, admin, c.verifyReport);
router.put('/:id/reject', protect, admin, c.rejectReport);
router.put('/:id/severity', protect, admin, c.updateSeverity);
router.put('/:id/resolve', protect, admin, c.resolveReport);

module.exports = router;