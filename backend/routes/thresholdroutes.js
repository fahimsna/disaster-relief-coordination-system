const router = require('express').Router();
const c = require('../controllers/thresholdController');
// If auth/admin middleware is required, import it like your team:
// const { protect: auth, admin } = require('../middleware/authMiddleware');

router.get('/', c.getThresholds);   // View threshold settings
router.put('/', c.updateThresholds); // Update threshold settings

module.exports = router;