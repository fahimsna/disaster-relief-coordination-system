const Campaign = require("../models/Campaign");

// @desc Create a new relief campaign
// @route POST /api/campaigns
// @access Protected (Admin)

const createCampaign = async (req, res) => {
  try {
    const {
      title,
      description,
      targetAmount,
      disasterType,
      location,
      image,
      startDate,
      endDate,
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !targetAmount ||
      !disasterType ||
      !location ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        message: "Please provide all required fields.",
      });
    }

    const campaign = await Campaign.create({
      title,
      description,
      targetAmount,
      disasterType,
      location,
      image,
      startDate,
      endDate,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Campaign created successfully.",
      campaign,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// @desc Get all campaigns
// @route GET /api/campaigns
// @access Public

const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate(
      "createdBy",
      "name email role",
    );

    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// @desc Get campaign by ID
// @route GET /api/campaigns/:id
// @access Public

const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "createdBy",
      "name email role",
    );

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found.",
      });
    }

    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// @desc Update campaign
// @route PUT /api/campaigns/:id
// @access Protected (Admin)

const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found.",
      });
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      message: "Campaign updated successfully.",
      campaign: updatedCampaign,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// @desc Delete campaign
// @route DELETE /api/campaigns/:id
// @access Protected (Admin)

const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found.",
      });
    }

    await campaign.deleteOne();

    res.status(200).json({
      message: "Campaign deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
};
