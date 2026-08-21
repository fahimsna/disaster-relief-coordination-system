const Shelter = require('../models/Shelter');

// @desc    Get all shelters (with filtering and search)
// @route   GET /api/shelters
// @access  Public or Admin
exports.getShelters = async (req, res) => {
  try {
    const { district, search, status } = req.query;
    
    let query = { isActive: true }; // Only show active shelters by default
    
    // 1. Filter active/inactive status explicitly if passed
    if (status === 'inactive') {
      query.isActive = false;
    } else if (status === 'all') {
      delete query.isActive;
    }

    // 2. Filter by District
    if (district && district.trim() !== '') {
      query.district = district.trim();
    }
    
    // 3. Search by Shelter Name or Manager Name (case-insensitive)
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { managerName: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Fetch from MongoDB, sorting newest updated first
    const shelters = await Shelter.find(query).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: shelters.length,
      data: shelters
    });
  } catch (error) {
    console.error('Error fetching shelters:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching shelters' });
  }
};

// @desc    Create a new shelter
// @route   POST /api/shelters
// @access  Admin
exports.createShelter = async (req, res) => {
  try {
    const shelterCode = 'SHL-' + Math.floor(10000 + Math.random() * 90000);
    
    const shelterData = {
      ...req.body,
      shelterCode
    };

    const shelter = await Shelter.create(shelterData);

    res.status(201).json({
      success: true,
      data: shelter
    });
  } catch (error) {
    console.error('Error creating shelter:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error while creating shelter' });
  }
};

// @desc    Get a single shelter by ID
// @route   GET /api/shelters/:id
// @access  Public or Admin
exports.getShelterById = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }

    res.status(200).json({
      success: true,
      data: shelter
    });
  } catch (error) {
    console.error('Error fetching shelter:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching shelter' });
  }
};

// @desc    Update shelter (occupancy, capacity, supplies, manager info)
// @route   PUT /api/shelters/:id
// @access  Admin
exports.updateShelter = async (req, res) => {
  try {
    let shelter = await Shelter.findById(req.params.id);

    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }

    shelter = await Shelter.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: shelter
    });
  } catch (error) {
    console.error('Error updating shelter:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error while updating shelter' });
  }
};

// @desc    Delete shelter
// @route   DELETE /api/shelters/:id
// @access  Admin
exports.deleteShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);

    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }

    await shelter.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Shelter removed successfully'
    });
  } catch (error) {
    console.error('Error deleting shelter:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting shelter' });
  }
};