const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");

// =====================================================
// CAMPAIGN ANALYTICS
// =====================================================

// @desc    Get campaign analytics
// @route   GET /api/campaign-analytics
// @access  Protected
const getCampaignAnalytics = async (req, res) => {
  try {
    // --------------------------------------------------
    // Get all campaigns
    // --------------------------------------------------

    const campaigns = await Campaign.find()
      .select(
        "title description targetAmount raisedAmount disasterType location status startDate endDate",
      )
      .sort({ createdAt: -1 });

    // --------------------------------------------------
    // Get all successful donations
    // --------------------------------------------------

    const paidDonations = await Donation.find({
      paymentStatus: "Paid",
    })
      .populate(
        "campaign",
        "title targetAmount raisedAmount disasterType location",
      )
      .populate("donor", "name email")
      .sort({ createdAt: -1 });

    // --------------------------------------------------
    // Basic totals
    // --------------------------------------------------

    const totalCampaigns = campaigns.length;

    const totalDonations = paidDonations.length;

    const totalRaised = paidDonations.reduce(
      (total, donation) => total + Number(donation.amount || 0),
      0,
    );

    // --------------------------------------------------
    // Unique donors
    // --------------------------------------------------

    const uniqueDonorIds = new Set();

    paidDonations.forEach((donation) => {
      if (donation.donor?._id) {
        uniqueDonorIds.add(donation.donor._id.toString());
      }
    });

    const uniqueDonors = uniqueDonorIds.size;

    // --------------------------------------------------
    // Average donation
    // --------------------------------------------------

    const averageDonation =
      totalDonations > 0 ? totalRaised / totalDonations : 0;

    // --------------------------------------------------
    // Campaign-wise analytics
    // --------------------------------------------------

    const campaignAnalytics = campaigns.map((campaign) => {
      const campaignDonations = paidDonations.filter(
        (donation) =>
          donation.campaign?._id?.toString() === campaign._id.toString(),
      );

      const donationCount = campaignDonations.length;

      const donationAmount = campaignDonations.reduce(
        (total, donation) => total + Number(donation.amount || 0),
        0,
      );

      const targetAmount = Number(campaign.targetAmount || 0);

      const fundingPercentage =
        targetAmount > 0 ? (donationAmount / targetAmount) * 100 : 0;

      const remainingAmount = Math.max(targetAmount - donationAmount, 0);

      const averageDonation =
        donationCount > 0 ? donationAmount / donationCount : 0;

      return {
        campaignId: campaign._id,
        title: campaign.title,
        description: campaign.description,
        disasterType: campaign.disasterType,
        location: campaign.location,
        status: campaign.status,

        targetAmount,

        // Use actual successful donations for analytics.
        raisedAmount: donationAmount,

        donationCount,

        averageDonation,

        remainingAmount,

        fundingPercentage: Math.min(fundingPercentage, 100),
      };
    });

    // --------------------------------------------------
    // Sort campaigns by amount raised
    // --------------------------------------------------

    const campaignsByPerformance = [...campaignAnalytics].sort(
      (a, b) => b.raisedAmount - a.raisedAmount,
    );

    // --------------------------------------------------
    // Top campaign
    // --------------------------------------------------

    const topCampaign =
      campaignsByPerformance.length > 0 ? campaignsByPerformance[0] : null;

    // --------------------------------------------------
    // Donation activity by date
    // --------------------------------------------------

    const dailyDonationMap = {};

    paidDonations.forEach((donation) => {
      const date = new Date(donation.createdAt).toISOString().split("T")[0];

      if (!dailyDonationMap[date]) {
        dailyDonationMap[date] = {
          date,
          donationCount: 0,
          amount: 0,
        };
      }

      dailyDonationMap[date].donationCount += 1;

      dailyDonationMap[date].amount += Number(donation.amount || 0);
    });

    const donationTrend = Object.values(dailyDonationMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30);

    // --------------------------------------------------
    // Disaster type breakdown
    // --------------------------------------------------

    const disasterTypeMap = {};

    campaignAnalytics.forEach((campaign) => {
      const type = campaign.disasterType || "Other";

      if (!disasterTypeMap[type]) {
        disasterTypeMap[type] = {
          disasterType: type,
          campaignCount: 0,
          raisedAmount: 0,
          donationCount: 0,
        };
      }

      disasterTypeMap[type].campaignCount += 1;

      disasterTypeMap[type].raisedAmount += campaign.raisedAmount;

      disasterTypeMap[type].donationCount += campaign.donationCount;
    });

    const disasterTypeBreakdown = Object.values(disasterTypeMap);

    // --------------------------------------------------
    // Recent donations
    // --------------------------------------------------

    const recentDonations = paidDonations.slice(0, 10).map((donation) => ({
      donationId: donation._id,

      amount: donation.amount,

      transactionId: donation.transactionId,

      paymentMethod: donation.paymentMethod,

      createdAt: donation.createdAt,

      donor: donation.donor
        ? {
            name: donation.donor.name,
            email: donation.donor.email,
          }
        : null,

      campaign: donation.campaign
        ? {
            id: donation.campaign._id,
            title: donation.campaign.title,
          }
        : null,
    }));

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      summary: {
        totalCampaigns,
        totalDonations,
        totalRaised,
        uniqueDonors,
        averageDonation,
      },

      topCampaign,

      campaignAnalytics: campaignsByPerformance,

      donationTrend,

      disasterTypeBreakdown,

      recentDonations,
    });
  } catch (error) {
    console.error("Campaign analytics error:", error);

    res.status(500).json({
      message: "Failed to generate campaign analytics.",
      error: error.message,
    });
  }
};

module.exports = {
  getCampaignAnalytics,
};
