const Notification = require("../models/Notification");

// @desc Create a new alert configuration draft
// @route POST /api/notifications
// @access Protected (Admin)
const createNotification = async (req, res) => {
  try {
    const { messageBody, district, severity, targetGroups } = req.body;

    // Validation
    if (!messageBody || !district || !severity || !targetGroups) {
      return res.status(400).json({
        success: false,
        message: "Please provide message body, district, severity, and target group.",
      });
    }

    // Ensure targetGroups is an array
    const groups = Array.isArray(targetGroups) ? targetGroups : [targetGroups];

    const notification = await Notification.create({
      messageBody,
      district,
      severity,
      targetGroups: groups,
      status: "draft",
      createdBy: req.user ? req.user.id : null,
    });

    res.status(201).json({
      success: true,
      message: "Alert configuration draft created successfully.",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get all alert drafts
// @route GET /api/notifications
// @access Protected (Admin)
const getNotifications = async (req, res) => {
  try {
    const { status, district, severity } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (district) filter.district = district;
    if (severity) filter.severity = severity;

    const notifications = await Notification.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get a single alert draft by ID
// @route GET /api/notifications/:id
// @access Protected (Admin)
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Alert draft not found',
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update an alert draft
// @route PATCH /api/notifications/:id
// @access Protected (Admin)
const updateNotification = async (req, res) => {
  try {
    const { messageBody, district, severity, targetGroups, status } = req.body;

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Alert draft not found',
      });
    }

    // Prevent updating if already sent
    if (notification.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a sent alert',
      });
    }

    // Update fields if provided
    if (messageBody) notification.messageBody = messageBody;
    if (district) notification.district = district;
    if (severity) notification.severity = severity;
    if (targetGroups) {
      notification.targetGroups = Array.isArray(targetGroups) ? targetGroups : [targetGroups];
    }
    if (status && ['draft', 'cancelled'].includes(status)) {
      notification.status = status;
    }

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Alert draft updated successfully',
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Delete an alert draft
// @route DELETE /api/notifications/:id
// @access Protected (Admin)
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Alert draft not found',
      });
    }

    // Prevent deleting if already sent
    if (notification.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a sent alert',
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Alert draft deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get district list
// @route GET /api/notifications/districts
// @access Public
const getDistricts = async (req, res) => {
  const districts = [
    'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogura',
    'Brahmanbaria', 'Chandpur', 'Chapai Nawabganj', 'Chattogram', 'Chuadanga',
    "Cox's Bazar", 'Cumilla', 'Dhaka', 'Dinajpur', 'Faridpur', 'Feni',
    'Gaibandha', 'Gazipur', 'Gopalganj', 'Habiganj', 'Jamalpur', 'Jashore',
    'Jhalokathi', 'Jhenaidah', 'Joypurhat', 'Khagrachhari', 'Khulna',
    'Kishoreganj', 'Kurigram', 'Kushtia', 'Lakshmipur', 'Lalmonirhat',
    'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar',
    'Munshiganj', 'Mymensingh', 'Naogaon', 'Narail', 'Narayanganj',
    'Narsingdi', 'Natore', 'Netrokona', 'Nilphamari', 'Noakhali',
    'Pabna', 'Panchagarh', 'Patuakhali', 'Pirojpur', 'Rajbari', 'Rajshahi',
    'Rangamati', 'Rangpur', 'Satkhira', 'Shariatpur', 'Sherpur',
    'Sirajganj', 'Sunamganj', 'Sylhet', 'Tangail', 'Thakurgaon'
  ];

  res.status(200).json({
    success: true,
    data: districts,
  });
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getDistricts,
};