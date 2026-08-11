const FundAllocation = require("../models/FundAllocation");
const Campaign = require("../models/Campaign");

// Create a fund allocation
const createFundAllocation = async (req, res) => {
  try {
    const { campaign, category, amount, description } = req.body;

    if (!campaign || !category || !amount) {
      return res.status(400).json({
        message: "Campaign, category, and amount are required.",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Allocation amount must be greater than 0.",
      });
    }

    // Find campaign
    const selectedCampaign = await Campaign.findById(campaign);

    if (!selectedCampaign) {
      return res.status(404).json({
        message: "Campaign not found.",
      });
    }

    // Find existing allocations for this campaign
    const existingAllocations = await FundAllocation.find({
      campaign,
    });

    const totalAllocated = existingAllocations.reduce(
      (total, allocation) => total + allocation.amount,
      0,
    );

    const remainingAmount = selectedCampaign.raisedAmount - totalAllocated;

    // Prevent over-allocation
    if (amount > remainingAmount) {
      return res.status(400).json({
        message: "Allocation amount exceeds the remaining campaign funds.",
        raisedAmount: selectedCampaign.raisedAmount,
        totalAllocated,
        remainingAmount,
      });
    }

    const allocation = await FundAllocation.create({
      campaign,
      category,
      amount,
      description,
      allocatedBy: req.user.id,
    });

    const populatedAllocation = await FundAllocation.findById(allocation._id)
      .populate("campaign", "title targetAmount raisedAmount")
      .populate("allocatedBy", "name email");

    return res.status(201).json({
      message: "Fund allocation created successfully.",
      allocation: populatedAllocation,
    });
  } catch (error) {
    console.error("Create fund allocation error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get all fund allocations
const getFundAllocations = async (req, res) => {
  try {
    const allocations = await FundAllocation.find()
      .populate("campaign", "title targetAmount raisedAmount")
      .populate("allocatedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      allocations,
    });
  } catch (error) {
    console.error("Get fund allocations error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get allocations for a specific campaign
const getCampaignAllocations = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const selectedCampaign = await Campaign.findById(campaignId);

    if (!selectedCampaign) {
      return res.status(404).json({
        message: "Campaign not found.",
      });
    }

    const allocations = await FundAllocation.find({
      campaign: campaignId,
    })
      .populate("allocatedBy", "name email")
      .sort({ createdAt: -1 });

    const totalAllocated = allocations.reduce(
      (total, allocation) => total + allocation.amount,
      0,
    );

    const remainingAmount = selectedCampaign.raisedAmount - totalAllocated;

    return res.status(200).json({
      campaign: selectedCampaign,
      allocations,
      summary: {
        raisedAmount: selectedCampaign.raisedAmount,
        totalAllocated,
        remainingAmount,
      },
    });
  } catch (error) {
    console.error("Get campaign allocations error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update a fund allocation
const updateFundAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, description } = req.body;

    const allocation = await FundAllocation.findById(id);

    if (!allocation) {
      return res.status(404).json({
        message: "Fund allocation not found.",
      });
    }

    const campaign = await Campaign.findById(allocation.campaign);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found.",
      });
    }

    // Calculate allocations excluding the current allocation
    const otherAllocations = await FundAllocation.find({
      campaign: allocation.campaign,
      _id: { $ne: id },
    });

    const totalOtherAllocated = otherAllocations.reduce(
      (total, item) => total + item.amount,
      0,
    );

    const newAmount = amount !== undefined ? amount : allocation.amount;

    if (newAmount <= 0) {
      return res.status(400).json({
        message: "Allocation amount must be greater than 0.",
      });
    }

    const remainingAmount = campaign.raisedAmount - totalOtherAllocated;

    if (newAmount > remainingAmount) {
      return res.status(400).json({
        message: "Allocation amount exceeds the remaining campaign funds.",
        raisedAmount: campaign.raisedAmount,
        totalOtherAllocated,
        remainingAmount,
      });
    }

    allocation.category = category || allocation.category;
    allocation.amount = newAmount;
    allocation.description =
      description !== undefined ? description : allocation.description;

    await allocation.save();

    const updatedAllocation = await FundAllocation.findById(id)
      .populate("campaign", "title targetAmount raisedAmount")
      .populate("allocatedBy", "name email");

    return res.status(200).json({
      message: "Fund allocation updated successfully.",
      allocation: updatedAllocation,
    });
  } catch (error) {
    console.error("Update fund allocation error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete a fund allocation
const deleteFundAllocation = async (req, res) => {
  try {
    const { id } = req.params;

    const allocation = await FundAllocation.findById(id);

    if (!allocation) {
      return res.status(404).json({
        message: "Fund allocation not found.",
      });
    }

    await FundAllocation.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Fund allocation deleted successfully.",
    });
  } catch (error) {
    console.error("Delete fund allocation error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createFundAllocation,
  getFundAllocations,
  getCampaignAllocations,
  updateFundAllocation,
  deleteFundAllocation,
};
