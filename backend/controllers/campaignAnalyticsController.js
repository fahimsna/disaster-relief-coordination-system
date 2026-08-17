const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");

// =====================================================
// CAMPAIGN ANALYTICS
// =====================================================

// @desc    Get donation analytics for campaigns
// @route   GET /api/campaign-analytics
// @access  Admin
const getCampaignAnalytics = async (req, res) => {
  try {
    // ===================================================
    // SECURITY
    // ===================================================

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    // ===================================================
    // FILTER
    // ===================================================

    // Only successful donations count as actual funds.
    const paidFilter = {
      paymentStatus: "Paid",
    };

    // ===================================================
    // TOTAL RAISED
    // ===================================================

    const totalRaisedResult = await Donation.aggregate([
      {
        $match: paidFilter,
      },

      {
        $group: {
          _id: null,

          totalRaised: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalRaised = Number(totalRaisedResult[0]?.totalRaised || 0);

    // ===================================================
    // TOTAL SUCCESSFUL DONATIONS
    // ===================================================

    const totalDonations = await Donation.countDocuments(paidFilter);

    // ===================================================
    // AVERAGE DONATION
    // ===================================================

    const averageDonation =
      totalDonations > 0 ? totalRaised / totalDonations : 0;

    // ===================================================
    // GET ALL CAMPAIGNS
    // ===================================================
    //
    // IMPORTANT:
    // We start from Campaign instead of Donation.
    //
    // This means campaigns with ZERO donations are also
    // included in the analytics dashboard.
    // ===================================================

    const campaigns = await Campaign.find()
      .populate("createdBy", "name email")
      .sort({
        createdAt: -1,
      })
      .lean();

    // ===================================================
    // GET PAID DONATION AGGREGATES BY CAMPAIGN
    // ===================================================

    const donationAnalytics = await Donation.aggregate([
      {
        $match: paidFilter,
      },

      {
        $group: {
          _id: "$campaign",

          totalRaised: {
            $sum: "$amount",
          },

          donationCount: {
            $sum: 1,
          },

          averageDonation: {
            $avg: "$amount",
          },
        },
      },
    ]);

    // ===================================================
    // CONVERT AGGREGATE DATA INTO QUICK LOOKUP MAP
    // ===================================================

    const donationMap = new Map();

    donationAnalytics.forEach((item) => {
      donationMap.set(String(item._id), {
        totalRaised: Number(item.totalRaised || 0),

        donationCount: Number(item.donationCount || 0),

        averageDonation: Number(item.averageDonation || 0),
      });
    });

    // ===================================================
    // CAMPAIGN BREAKDOWN
    // ===================================================

    const campaignBreakdown = campaigns
      .map((campaign) => {
        const donationData = donationMap.get(String(campaign._id)) || {
          totalRaised: 0,
          donationCount: 0,
          averageDonation: 0,
        };

        const campaignRaised = donationData.totalRaised;

        const targetAmount = Number(campaign.targetAmount || 0);

        const percentageOfTotal =
          totalRaised > 0
            ? Number(((campaignRaised / totalRaised) * 100).toFixed(2))
            : 0;

        const targetProgress =
          targetAmount > 0
            ? Number(((campaignRaised / targetAmount) * 100).toFixed(2))
            : 0;

        return {
          campaignId: campaign._id,

          title: campaign.title,

          description: campaign.description,

          disasterType: campaign.disasterType,

          location: campaign.location,

          image: campaign.image || "",

          status: campaign.status,

          startDate: campaign.startDate,

          endDate: campaign.endDate,

          createdAt: campaign.createdAt,

          targetAmount,

          // Use successful donations as the source of
          // truth for analytics.
          totalRaised: campaignRaised,

          // Keep the campaign's stored raisedAmount too,
          // so the dashboard can identify inconsistencies
          // if they ever occur.
          recordedRaisedAmount: Number(campaign.raisedAmount || 0),

          donationCount: donationData.donationCount,

          averageDonation: Number(donationData.averageDonation.toFixed(2)),

          percentageOfTotal,

          targetProgress,
        };
      })
      .sort((a, b) => Number(b.totalRaised) - Number(a.totalRaised));

    // ===================================================
    // PAYMENT STATUS SUMMARY
    // ===================================================

    const paymentStatusSummary = await Donation.aggregate([
      {
        $group: {
          _id: "$paymentStatus",

          count: {
            $sum: 1,
          },

          amount: {
            $sum: "$amount",
          },
        },
      },

      {
        $project: {
          _id: 0,

          status: "$_id",

          count: 1,

          amount: 1,
        },
      },

      {
        $sort: {
          status: 1,
        },
      },
    ]);

    // ===================================================
    // RECENT SUCCESSFUL DONATIONS
    // ===================================================

    const recentDonations = await Donation.find({
      paymentStatus: "Paid",
    })
      .populate("campaign", "title disasterType location")
      .populate("donor", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .lean();

    // ===================================================
    // TOP CAMPAIGN
    // ===================================================

    const topCampaign =
      campaignBreakdown.length > 0 && campaignBreakdown[0].totalRaised > 0
        ? campaignBreakdown[0]
        : null;

    // ===================================================
    // RESPONSE
    // ===================================================

    res.status(200).json({
      summary: {
        totalRaised,

        totalDonations,

        averageDonation: Number(averageDonation.toFixed(2)),

        campaignCount: campaigns.length,

        campaignsWithDonations: campaignBreakdown.filter(
          (campaign) => campaign.donationCount > 0,
        ).length,

        campaignsWithoutDonations: campaignBreakdown.filter(
          (campaign) => campaign.donationCount === 0,
        ).length,

        topCampaign: topCampaign
          ? {
              campaignId: topCampaign.campaignId,

              title: topCampaign.title,

              totalRaised: topCampaign.totalRaised,

              targetAmount: topCampaign.targetAmount,

              targetProgress: topCampaign.targetProgress,
            }
          : null,
      },

      campaignBreakdown,

      paymentStatusSummary,

      recentDonations,
    });
  } catch (error) {
    console.error("Campaign analytics error:", error);

    res.status(500).json({
      message: "Failed to load campaign analytics.",
    });
  }
};

module.exports = {
  getCampaignAnalytics,
};
