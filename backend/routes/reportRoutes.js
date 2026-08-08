// backend/routes/reportRoutes.js
const router = require('express').Router();
const c = require('../controllers/reportController');

router.post('/', c.createReport);          // File a report
router.get('/', c.getAllReports);          // View all reports
router.get('/:id', c.getReportById);       // View report by ID
router.put('/:id/verify', c.verifyReport); // Admin verify report
router.put('/:id/reject', c.rejectReport); // Admin reject report
router.put('/:id/severity', c.updateSeverity); // Admin update severity
module.exports = router;