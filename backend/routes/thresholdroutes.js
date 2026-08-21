const router = require('express').Router();
const c = require('../controllers/thresholdController');
const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Public route (accessible for frontend report thresholds)
router.get('/', c.getThresholds);

// Protected admin-only route
router.put('/', protect, admin, c.updateThresholds);

module.exports = router;