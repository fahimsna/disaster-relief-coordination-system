const express = require('express');
const router = express.Router();

const {
  getShelters,
  getShelterById,
  createShelter,
  updateShelter,
  deleteShelter
} = require('../controllers/shelterController');

const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware'); 

// Routes for /api/shelters
router.route('/')
  .get(getShelters)
  .post(protect, admin, createShelter);

// Routes for /api/shelters/:id
router.route('/:id')
  .get(getShelterById)
  .put(protect, admin, updateShelter)
  .delete(protect, admin, deleteShelter);

module.exports = router;