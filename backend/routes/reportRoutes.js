const express = require('express');
const router = express.Router();

const {
    createReport,
    getAllReports,
    getReportById,
    verifyReport
} = require('../controllers/reportController');

// Handles POST /api/reports and GET /api/reports
router.route('/')
    .post(createReport)
    .get(getAllReports);

// Handles GET /api/reports/:id
router.get('/:id', getReportById);

// Handles PUT /api/reports/:id/verify
router.put('/:id/verify', verifyReport);

module.exports = router;