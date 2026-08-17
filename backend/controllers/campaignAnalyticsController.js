const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");

// =====================================================
// CAMPAIGN ANALYTICS
// =====================================================

// @desc Get donation analytics for campaigns
// @route GET /api/campaign-analytics
// @access Protected
const getCampaignAnalytics = async (req, res) => {
  try {
    // --------------------------------------------------
    // Only successful donations count as actual funds.
    // Pending / Failed payments are excluded.
    // --------------------------------------------------

    const paidFilter = {
      paymentStatus: "Paid",
    };

    // --------------------------------------------------
    // Total paid donation amount
    // --------------------------------------------------

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

    const totalRaised = totalRaisedResult[0]?.totalRaised || 0;

    // --------------------------------------------------
    // Total number of successful donations
    // --------------------------------------------------

    const totalDonations = await Donation.countDocuments(paidFilter);

    // --------------------------------------------------
    // Average successful donation
    // --------------------------------------------------

    const averageDonation =
      totalDonations > 0 ? totalRaised / totalDonations : 0;

    // --------------------------------------------------
    // Campaign-wise donation analytics
    // --------------------------------------------------

    const campaignAnalytics = await Donation.aggregate([
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

      {
        $lookup: {
          from: "campaigns",
          localField: "_id",
          foreignField: "_id",
          as: "campaign",
        },
      },

      {
        $unwind: {
          path: "$campaign",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 0,

          campaignId: "$_id",

          title: {
            $ifNull: ["$campaign.title", "Campaign unavailable"],
          },

          disasterType: {
            $ifNull: ["$campaign.disasterType", ""],
          },

          location: {
            $ifNull: ["$campaign.location", ""],
          },

          targetAmount: {
            $ifNull: ["$campaign.targetAmount", 0],
          },

          totalRaised: 1,

          donationCount: 1,

          averageDonation: {
            $round: ["$averageDonation", 2],
          },
        },
      },

      {
        $sort: {
          totalRaised: -1,
        },
      },
    ]);

    // --------------------------------------------------
    // Add percentage of total funds
    // --------------------------------------------------

    const campaignBreakdown = campaignAnalytics.map((campaign) => ({
      ...campaign,

      percentageOfTotal:
        totalRaised > 0
          ? Number(((campaign.totalRaised / totalRaised) * 100).toFixed(2))
          : 0,

      targetProgress:
        campaign.targetAmount > 0
          ? Number(
              ((campaign.totalRaised / campaign.targetAmount) * 100).toFixed(2),
            )
          : 0,
    }));

    // --------------------------------------------------
    // Payment status summary
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Recent successful donations
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      summary: {
        totalRaised,

        totalDonations,

        averageDonation: Number(averageDonation.toFixed(2)),

        campaignCount: campaignAnalytics.length,
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
