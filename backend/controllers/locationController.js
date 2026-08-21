const Location = require('../models/Locations');

// @desc    Get complete location hierarchy tree
// @route   GET /api/locations/tree
exports.getLocationTree = async (req, res) => {
  try {
    const locations = await Location.find({}).lean();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch location data', error: error.message });
  }
};