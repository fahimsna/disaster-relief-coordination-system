const router = require('express').Router();
const c = require('../controllers/locationController');

// GET /api/locations/tree - Returns hierarchy (Divisions -> Districts -> Upazilas)
router.get('/tree', c.getLocationTree);

module.exports = router;