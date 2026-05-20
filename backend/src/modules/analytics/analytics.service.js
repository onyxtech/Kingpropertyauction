import Property from "../property/property.model.js";
import Auction from "../auction/auction.model.js";
import Bid from "../bid/bid.model.js";
import User from "../user/user.model.js";
import Lead from "../lead/lead.model.js";
import Campaign from '../campaign/campaign.model.js';
import cache from '../../utils/cache.js';

// ─── OVERVIEW STATS ────────────────────────────────────────────
export const getOverview = async () => {
  const cacheKey = 'analytics:overview';
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalProperties,
    availableProperties,
    soldProperties,
    totalAuctions,
    liveAuctions,
    scheduledAuctions,
    completedAuctions,
    totalBids,
    bidsThisMonth,
    totalUsers,
    usersThisMonth,
    activeUsers,
    totalLeads,
    leadsThisMonth,
  ] = await Promise.all([
    Property.countDocuments(),
    Property.countDocuments({ propertyStatus: "available" }),
    Property.countDocuments({ propertyStatus: "sold" }),
    Auction.countDocuments(),
    Auction.countDocuments({ status: "live" }),
    Auction.countDocuments({ status: "scheduled" }),
    Auction.countDocuments({ status: "completed" }),
    Bid.countDocuments(),
    Bid.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    User.countDocuments({ isActive: true }),
    Lead.countDocuments(),
    Lead.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
  ]);

  // Calculate total revenue from sold properties
  const soldPropsAgg = await Property.aggregate([
    {
      $match: { propertyStatus: "sold", soldPrice: { $exists: true, $gt: 0 } },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$soldPrice" },
        count: { $sum: 1 },
      },
    },
  ]);
  const revenueData = soldPropsAgg[0] || { totalRevenue: 0, count: 0 };

  const result = {
    properties: {
      total: totalProperties,
      available: availableProperties,
      sold: soldProperties,
      sellThroughRate:
        totalProperties > 0
          ? Math.round((soldProperties / totalProperties) * 100)
          : 0,
    },
    auctions: {
      total: totalAuctions,
      live: liveAuctions,
      scheduled: scheduledAuctions,
      completed: completedAuctions,
    },
    bids: {
      total: totalBids,
      thisMonth: bidsThisMonth,
    },
    users: {
      total: totalUsers,
      active: activeUsers,
      thisMonth: usersThisMonth,
    },
    leads: {
      total: totalLeads,
      thisMonth: leadsThisMonth,
    },
    revenue: {
      total: revenueData.totalRevenue || 0,
      totalSold: revenueData.count || 0,
      averagePrice:
        revenueData.count > 0
          ? Math.round(revenueData.totalRevenue / revenueData.count)
          : 0,
    },
  };

  await cache.set(cacheKey, result, 300);
  return result;
};

// ─── REVENUE TREND (Monthly for charts) ─────────────────────────
export const getRevenueTrend = async (months = 12) => {
  const cacheKey = `analytics:revenue:${months}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

  const result = await Property.aggregate([
    {
      $match: {
        propertyStatus: "sold",
        soldPrice: { $exists: true, $gt: 0 },
        updatedAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$updatedAt" },
          month: { $month: "$updatedAt" },
        },
        revenue: { $sum: "$soldPrice" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Also get auction counts per month
  const auctionResult = await Auction.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthlyData = [];

  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    const rev = result.find(
      (r) => r._id.year === year && r._id.month === month,
    );
    const auc = auctionResult.find(
      (r) => r._id.year === year && r._id.month === month,
    );

    monthlyData.push({
      month: monthNames[d.getMonth()],
      revenue: rev?.revenue || 0,
      auctions: auc?.count || 0,
      soldCount: rev?.count || 0,
    });
  }

  await cache.set(cacheKey, monthlyData, 300);
  return monthlyData;
};

// ─── PROPERTY DISTRIBUTION ──────────────────────────────────────
export const getPropertyDistribution = async () => {
  const cacheKey = 'analytics:property-distribution';
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  // By type
  const byType = await Property.aggregate([
    { $group: { _id: "$propertyType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // By status
  const byStatus = await Property.aggregate([
    { $group: { _id: "$propertyStatus", count: { $sum: 1 } } },
  ]);

  // By category — groups by propertyType so chart data is consistent
  const byCategory = await Property.aggregate([
    { $group: { _id: "$propertyType", count: { $sum: 1 } } },
  ]);

  const typeColors = {
    house: "#3b82f6",
    apartment: "#8b5cf6",
    land: "#f59e0b",
    commercial: "#10b981",
    farmhouse: "#ec4899",
  };

  const distribution = {
    byType: byType.map((t) => ({
      name: t._id ? t._id.charAt(0).toUpperCase() + t._id.slice(1) : "Unknown",
      value: t.count,
      color: typeColors[t._id] || "#94a3b8",
    })),
    byStatus: byStatus.map((s) => ({
      name: s._id ? s._id.charAt(0).toUpperCase() + s._id.slice(1) : "Unknown",
      value: s.count,
    })),
    byCategory: byCategory.map((c) => ({
      name: c._id ? c._id.charAt(0).toUpperCase() + c._id.slice(1) : "Unknown",
      value: c.count,
    })),
  };

  await cache.set(cacheKey, distribution, 300);
  return distribution;
};

// ─── BIDDING ACTIVITY ───────────────────────────────────────────
export const getBiddingActivity = async (months = 6) => {
  const cacheKey = `analytics:bidding:${months}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

  const result = await Bid.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalBids: { $sum: 1 },
        avgAmount: { $avg: "$amount" },
        uniqueBidders: { $addToSet: "$bidder" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthlyData = [];

  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    const data = result.find(
      (r) => r._id.year === year && r._id.month === month,
    );

    monthlyData.push({
      month: monthNames[d.getMonth()],
      totalBids: data?.totalBids || 0,
      avgAmount: data?.avgAmount ? Math.round(data.avgAmount) : 0,
      uniqueBidders: data?.uniqueBidders?.length || 0,
    });
  }

  await cache.set(cacheKey, monthlyData, 300);
  return monthlyData;
};

// ─── USER GROWTH ────────────────────────────────────────────────
export const getUserGrowth = async (months = 12) => {
  const cacheKey = `analytics:users:${months}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

  const result = await User.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthlyData = [];

  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    const data = result.find(
      (r) => r._id.year === year && r._id.month === month,
    );

    monthlyData.push({
      month: monthNames[d.getMonth()],
      newUsers: data?.count || 0,
    });
  }

  // Get total cumulative
  const totalUsers = await User.countDocuments({
    createdAt: { $lt: startDate },
  });
  let cumulative = totalUsers;
  const withCumulative = monthlyData.map((m) => {
    cumulative += m.newUsers;
    return { ...m, totalUsers: cumulative };
  });

  await cache.set(cacheKey, withCumulative, 300);
  return withCumulative;
};

// ─── KPI METRICS ────────────────────────────────────────────────
export const getKpiMetrics = async () => {
  const cacheKey = 'analytics:kpi';
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  // Average property value (from sold properties)
  const avgValueAgg = await Property.aggregate([
    {
      $match: { propertyStatus: "sold", soldPrice: { $exists: true, $gt: 0 } },
    },
    { $group: { _id: null, avgPrice: { $avg: "$soldPrice" } } },
  ]);
  const avgPropertyValue = avgValueAgg[0]?.avgPrice || 0;

  // Average time to sale (in days)
  const timeToSaleAgg = await Property.aggregate([
    {
      $match: { propertyStatus: "sold", soldPrice: { $exists: true, $gt: 0 } },
    },
    {
      $project: {
        daysToSell: {
          $divide: [
            { $subtract: ["$updatedAt", "$createdAt"] },
            1000 * 60 * 60 * 24,
          ],
        },
      },
    },
    { $group: { _id: null, avgDays: { $avg: "$daysToSell" } } },
  ]);
  const avgTimeToSale = timeToSaleAgg[0]?.avgDays || 0;

  // Sell-through rate
  const totalProperties = await Property.countDocuments();
  const soldCount = await Property.countDocuments({ propertyStatus: "sold" });
  const sellThroughRate =
    totalProperties > 0 ? Math.round((soldCount / totalProperties) * 100) : 0;

  // Average bids per auction
  const avgBidsAgg = await Bid.aggregate([
    { $group: { _id: "$auction", bidCount: { $sum: 1 } } },
    { $group: { _id: null, avgBids: { $avg: "$bidCount" } } },
  ]);
  const avgBidsPerAuction = avgBidsAgg[0]?.avgBids || 0;

  // Revenue this month vs last month
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonthRev, lastMonthRev] = await Promise.all([
    Property.aggregate([
      {
        $match: {
          propertyStatus: "sold",
          soldPrice: { $exists: true, $gt: 0 },
          updatedAt: { $gte: thisMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$soldPrice" } } },
    ]),
    Property.aggregate([
      {
        $match: {
          propertyStatus: "sold",
          soldPrice: { $exists: true, $gt: 0 },
          updatedAt: { $gte: lastMonthStart, $lt: thisMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$soldPrice" } } },
    ]),
  ]);

  const thisMonthRevenue = thisMonthRev[0]?.total || 0;
  const lastMonthRevenue = lastMonthRev[0]?.total || 0;
  const revenueChange =
    lastMonthRevenue > 0
      ? Math.round(
          ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100,
        )
      : 0;

  // Active bidders this month
  const activeBidders = await Bid.distinct("bidder", {
    createdAt: { $gte: thisMonthStart },
  });

  const kpi = {
    avgPropertyValue: Math.round(avgPropertyValue),
    avgTimeToSale: Math.round(avgTimeToSale),
    sellThroughRate,
    avgBidsPerAuction: Math.round(avgBidsPerAuction * 10) / 10,
    revenueThisMonth: thisMonthRevenue,
    revenueChange,
    activeBiddersThisMonth: activeBidders.length,
  };

  await cache.set(cacheKey, kpi, 300);
  return kpi;
};

// ─── EXPORT DATA (for report generation) ────────────────────────
export const getExportData = async (type, startDate, endDate) => {
  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  const matchFilter =
    Object.keys(dateFilter).length > 0
      ? { updatedAt: dateFilter, propertyStatus: "sold" }
      : { propertyStatus: "sold" };

  switch (type) {
    case "sales": {
      const soldProperties = await Property.find(matchFilter)
        .select(
          "propertyTitle propertyType location pricing soldPrice updatedAt",
        )
        .sort("-updatedAt")
        .limit(1000)
        .lean();
      return {
        type: "Sales Report",
        generatedAt: new Date().toISOString(),
        totalSold: soldProperties.length,
        totalRevenue: soldProperties.reduce(
          (sum, p) => sum + (p.soldPrice || 0),
          0,
        ),
        ...(soldProperties.length === 1000 && { note: 'Results capped at 1000 records. Narrow your date range for complete data.' }),
        data: soldProperties,
      };
    }
    case "auction": {
      const auctions = await Auction.find(
        Object.keys(dateFilter).length > 0 ? { startDateTime: dateFilter } : {},
      )
        .select(
          "auctionTitle auctionType status startDateTime endDateTime totalBids totalBidders",
        )
        .sort("-startDateTime")
        .lean();
      return {
        type: "Auction Performance Report",
        generatedAt: new Date().toISOString(),
        totalAuctions: auctions.length,
        data: auctions,
      };
    }
    case "user": {
      const users = await User.find(
        Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {},
      )
        .select("name email role isActive createdAt")
        .sort("-createdAt")
        .limit(1000)
        .lean();
      return {
        type: "User Activity Report",
        generatedAt: new Date().toISOString(),
        totalUsers: users.length,
        ...(users.length === 1000 && { note: 'Results capped at 1000 records. Narrow your date range for complete data.' }),
        data: users,
      };
    }
    case "property": {
      const properties = await Property.find(
        Object.keys(dateFilter).length > 0 ? { updatedAt: dateFilter } : {},
      )
        .select(
          "propertyTitle propertyType propertyStatus approvalStatus location createdAt",
        )
        .sort("-createdAt")
        .limit(1000)
        .lean();
      return {
        type: "Property Listings Report",
        generatedAt: new Date().toISOString(),
        totalProperties: properties.length,
        ...(properties.length === 1000 && { note: 'Results capped at 1000 records. Narrow your date range for complete data.' }),
        data: properties,
      };
    }
    case "financial": {
      const revenue = await getRevenueTrend(12);
      const kpi = await getKpiMetrics();
      return {
        type: "Financial Summary",
        generatedAt: new Date().toISOString(),
        revenue,
        kpi,
      };
    }
    case "marketing": {
      const leads = await Lead.find(
        Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {},
      )
        .select("name email leadType status createdAt")
        .sort("-createdAt")
        .lean();
      const userGrowth = await getUserGrowth(12);
      return {
        type: "Marketing Analytics",
        generatedAt: new Date().toISOString(),
        totalLeads: leads.length,
        leadsByType: leads.reduce((acc, l) => {
          acc[l.leadType] = (acc[l.leadType] || 0) + 1;
          return acc;
        }, {}),
        userGrowth,
        data: leads,
      };
    }
    case "leads": {
      const leads = await Lead.find(
        Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {},
      )
        .select("name email phone leadType status subject createdAt")
        .sort("-createdAt")
        .limit(1000)
        .lean();
      return {
        type: "Lead Analytics Report",
        generatedAt: new Date().toISOString(),
        totalLeads: leads.length,
        ...(leads.length === 1000 && { note: 'Results capped at 1000 records. Narrow your date range for complete data.' }),
        leadsByType: leads.reduce((acc, l) => {
          acc[l.leadType] = (acc[l.leadType] || 0) + 1;
          return acc;
        }, {}),
        leadsByStatus: leads.reduce((acc, l) => {
          acc[l.status] = (acc[l.status] || 0) + 1;
          return acc;
        }, {}),
        data: leads,
      };
    }
    case 'campaigns': {
      const campaigns = await Campaign.find(
        Object.keys(dateFilter).length > 0 ? { sentAt: dateFilter, status: 'sent' } : { status: 'sent' }
      )
        .select('name type subject totalSent totalOpened totalClicked sentAt')
        .sort('-sentAt')
        .lean();
      return {
        type: 'Campaign Performance Report',
        generatedAt: new Date().toISOString(),
        totalCampaigns: campaigns.length,
        totalEmailsSent: campaigns.reduce((sum, c) => sum + (c.totalSent || 0), 0),
        totalOpened: campaigns.reduce((sum, c) => sum + (c.totalOpened || 0), 0),
        data: campaigns,
      };
    }
    default:
      throw new Error(`Unknown report type: ${type}`);
  }
};

// ─── CAMPAIGN PERFORMANCE ──────────────────────────────────────
export const getCampaignPerformance = async (months = 6) => {
  const cacheKey = `analytics:campaigns:${months}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

  const result = await Campaign.aggregate([
    { $match: { status: 'sent', sentAt: { $gte: startDate } } },
    {
      $group: {
        _id: { year: { $year: '$sentAt' }, month: { $month: '$sentAt' } },
        totalSent: { $sum: '$totalSent' },
        totalOpened: { $sum: '$totalOpened' },
        totalClicked: { $sum: '$totalClicked' },
        campaigns: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
    const entry = result.find((r) => r._id.year === d.getFullYear() && r._id.month === d.getMonth() + 1);
    return {
      month: monthNames[d.getMonth()],
      sent: entry?.totalSent || 0,
      opened: entry?.totalOpened || 0,
      campaigns: entry?.campaigns || 0,
    };
  });

  await cache.set(cacheKey, data, 300);
  return data;
};

// ─── LEADS ANALYTICS ────────────────────────────────────────────
export const getLeadsAnalytics = async (months = 6) => {
  const cacheKey = `analytics:leads:${months}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

  // Leads by type
  const byType = await Lead.aggregate([
    { $group: { _id: "$leadType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Leads by status
  const byStatus = await Lead.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  // Monthly lead trend
  const monthlyLeads = await Lead.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const trend = [];

  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const data = monthlyLeads.find(
      (r) => r._id.year === year && r._id.month === month,
    );

    trend.push({
      month: monthNames[d.getMonth()],
      leads: data?.count || 0,
    });
  }

  // Conversion rate (leads that became "converted")
  const totalLeads = await Lead.countDocuments();
  const convertedLeads = await Lead.countDocuments({ status: "converted" });
  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  const leadsData = {
    total: totalLeads,
    converted: convertedLeads,
    conversionRate,
    byType: byType.map((t) => ({
      name: t._id
        ? t._id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Unknown",
      value: t.count,
    })),
    byStatus: byStatus.map((s) => ({
      name: s._id ? s._id.charAt(0).toUpperCase() + s._id.slice(1) : "Unknown",
      value: s.count,
    })),
    trend,
  };

  await cache.set(cacheKey, leadsData, 300);
  return leadsData;
};
