const DisasterReport = require('../models/disasterReport');

// GET /api/analytics/dashboard - Real-time Aggregation for Chart.js Panel
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // 1. Metric Cards Aggregation (Total, Pending, Active, Resolved)
    const summaryAgg = await DisasterReport.aggregate([
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          pendingCount: {
            $sum: {
              $cond: [
                { $in: [{ $toLower: '$status' }, ['unverified', 'pending']] },
                1,
                0,
              ],
            },
          },
          activeCount: {
            $sum: {
              $cond: [{ $eq: [{ $toLower: '$status' }, 'verified'] }, 1, 0],
            },
          },
          resolvedCount: {
            $sum: {
              $cond: [{ $eq: [{ $toLower: '$status' }, 'resolved'] }, 1, 0],
            },
          },
        },
      },
    ]);

    const summary = summaryAgg[0] || {
      totalReports: 0,
      pendingCount: 0,
      activeCount: 0,
      resolvedCount: 0,
    };

    // 2. Crisis Type Distribution (Donut Chart)
    const crisisTypeDistribution = await DisasterReport.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$crisisType', 'Other'] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 3. Severity Breakdown by District (Grouped Bar Chart)
    const severityByDistrictRaw = await DisasterReport.aggregate([
      {
        $match: {
          district: { $exists: true, $ne: '' },
        },
      },
      {
        $group: {
          _id: {
            district: '$district',
            severity: { $ifNull: ['$severity', 'Low'] },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.district': 1 } },
    ]);

    // Transform aggregation array into formatted structured objects per district
    const districtMap = {};
    severityByDistrictRaw.forEach((item) => {
      const district = item._id.district;
      const severity = item._id.severity || 'Low';
      if (!districtMap[district]) {
        districtMap[district] = { Low: 0, Medium: 0, High: 0, Critical: 0 };
      }
      districtMap[district][severity] = (districtMap[district][severity] || 0) + item.count;
    });

    const severityByDistrict = Object.keys(districtMap).map((district) => ({
      district,
      ...districtMap[district],
    }));

    // 4. 30-Day Rolling Line Chart Trend
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const incidentTrend = await DisasterReport.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      summary,
      crisisTypeDistribution,
      severityByDistrict,
      incidentTrend,
    });
  } catch (error) {
    console.error('Analytics aggregation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compute regional analytics.',
    });
  }
};