import User from "../user/user.model.js";
import Property from "../property/property.model.js";
import Auction from "../auction/auction.model.js";
import Bid from "../bid/bid.model.js";
import Commission from "../commission/commission.model.js";
import Payment from "../payment/payment.model.js";

const formatPrice = (val) => {
  if (!val && val !== 0) return "£0";
  return "£" + val.toLocaleString();
};

const isCustomer = (user) => user.role !== "admin";
const isAgent = (user) => user.role === "agent";

// Sold property value = soldPrice OR currentBid
const getSoldValue = (p) => p.soldPrice || p.currentBid || 0;

// ─── Customer Report ───────────────────────────
export const getCustomerReport = async (query = {}) => {
  const { search } = query;
  const allUsers = await User.find().lean();
  const customers = allUsers.filter(isCustomer);
  const userIds = customers.map((c) => c._id);

  // Get bid stats per user
  const bidStats = await Bid.aggregate([
    { $match: { bidder: { $in: userIds }, status: { $ne: "retracted" } } },
    { $group: { _id: "$bidder", totalBids: { $sum: 1 } } },
  ]);
  const bidMap = {};
  bidStats.forEach((b) => {
    bidMap[b._id.toString()] = b;
  });

  // Sold properties per buyer (winning bidder)
  const soldProps = await Property.find({
    propertyStatus: "sold",
    winningBidder: { $in: userIds },
  })
    .select("winningBidder soldPrice currentBid")
    .lean();
  const spendMap = {};
  soldProps.forEach((p) => {
    const id = p.winningBidder.toString();
    spendMap[id] = (spendMap[id] || 0) + getSoldValue(p);
  });

  // Count won properties per buyer
  const wonPropMap = {};
  soldProps.forEach((p) => {
    const id = p.winningBidder.toString();
    wonPropMap[id] = (wonPropMap[id] || 0) + 1;
  });

  let result = customers.map((c) => ({
    _id: c._id,
    name: c.name,
    email: c.email,
    phone: c.phone || "-",
    location: c.address?.city || "-",
    registered: c.createdAt,
    status: c.isActive ? "Active" : "Inactive",
    role: c.role,
    bids: bidMap[c._id.toString()]?.totalBids || 0,
    won: wonPropMap[c._id.toString()] || 0,
    spent: formatPrice(spendMap[c._id.toString()] || 0),
    kyc: "Pending",
  }));

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s),
    );
  }

  const allSold = await Property.find({ propertyStatus: "sold" })
    .select("soldPrice currentBid")
    .lean();
  const totalSpend = allSold.reduce((s, p) => s + getSoldValue(p), 0);

  return {
    data: result,
    stats: {
      total: customers.length,
      active: customers.filter((c) => c.isActive).length,
      kycVerified: 0,
      totalSpend: formatPrice(totalSpend),
    },
  };
};

// ─── Agent Report ──────────────────────────────
export const getAgentReport = async (query = {}) => {
  const { search } = query;
  const allUsers = await User.find().lean();
  const agents = allUsers.filter(isAgent);
  const agentIds = agents.map((a) => a._id);

  // Properties listed by agents
  const propertyStats = await Property.aggregate([
    { $match: { createdBy: { $in: agentIds } } },
    {
      $group: {
        _id: "$createdBy",
        totalListings: { $sum: 1 },
        soldListings: {
          $sum: { $cond: [{ $eq: ["$propertyStatus", "sold"] }, 1, 0] },
        },
        totalRevenue: {
          $sum: {
            $cond: [
              { $eq: ["$propertyStatus", "sold"] },
              { $ifNull: ["$soldPrice", "$currentBid", 0] },
              0,
            ],
          },
        },
      },
    },
  ]);
  const propMap = {};
  propertyStats.forEach((p) => {
    propMap[p._id.toString()] = p;
  });

  // Commission stats per agent (non-voided)
  const commissionStats = await Commission.aggregate([
    { $match: { agent: { $in: agentIds }, status: { $ne: "voided" } } },
    {
      $group: { _id: "$agent", totalCommission: { $sum: "$commissionAmount" } },
    },
  ]);
  const commMap = {};
  commissionStats.forEach((c) => {
    commMap[c._id.toString()] = c;
  });

  let result = agents.map((a) => ({
    _id: a._id,
    name: a.name,
    email: a.email,
    phone: a.phone || "-",
    branch: a.agentDetails?.companyName || a.address?.city || "-",
    joined: a.createdAt,
    status: a.isActive ? "Active" : "Inactive",
    listings: propMap[a._id.toString()]?.totalListings || 0,
    sold: propMap[a._id.toString()]?.soldListings || 0,
    revenue: formatPrice(propMap[a._id.toString()]?.totalRevenue || 0),
    commission: formatPrice(commMap[a._id.toString()]?.totalCommission || 0),
    rating: 0,
  }));

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(s) || a.branch.toLowerCase().includes(s),
    );
  }

  const allAgentCommissions = await Commission.aggregate([
    { $match: { agent: { $in: agentIds }, status: { $ne: "voided" } } },
    { $group: { _id: null, total: { $sum: "$commissionAmount" } } },
  ]);

  return {
    data: result,
    stats: {
      total: agents.length,
      active: agents.filter((a) => a.isActive).length,
      totalListings: propertyStats.reduce((s, p) => s + p.totalListings, 0),
      totalCommission: formatPrice(allAgentCommissions[0]?.total || 0),
    },
  };
};

// ─── Auction Report ────────────────────────────
export const getAuctionReport = async (query = {}) => {
  const { search, status } = query;
  const filter = {};
  if (status && status !== "All") filter.status = status;

  const auctions = await Auction.find(filter)
    .populate("winningBidder", "name email")
    .populate("createdBy", "name email role agentDetails")
    .populate({
      path: "properties",
      select:
        "propertyTitle propertyType location pricing currentBid soldPrice winningBidder propertyStatus",
      populate: { path: "winningBidder", select: "name email" },
    })
    .sort("-startDateTime")
    .lean();

  // Flatten: each property becomes a row
  let rows = [];
  for (const auction of auctions) {
    const props = auction.properties || [];
    for (const prop of props) {
      rows.push({
        _id: `${auction._id}_${prop._id}`,
        auctionId: auction._id,
        auctionTitle: auction.auctionTitle,
        auctionSlug: auction.slug,
        auctionStatus: auction.status,
        auctionType: auction.auctionType,
        auctionDate: auction.startDateTime,
        agent: auction.createdBy?.name || "N/A",
        // Property data
        propertyId: prop._id,
        propertyTitle: prop.propertyTitle,
        propertyType: prop.propertyType,
        propertyLocation: prop.location?.city || "-",
        propertyStatus: prop.propertyStatus,
        startingPrice: prop.pricing?.startingAuctionPrice || 0,
        currentBid: prop.currentBid || 0,
        soldPrice: prop.soldPrice || null,
        hammerPrice:
          prop.propertyStatus === "sold"
            ? prop.soldPrice || prop.currentBid
            : prop.currentBid || 0,
        reservePrice: prop.pricing?.reservePrice || 0,
        winner: prop.winningBidder?.name || null,
        winnerId: prop.winningBidder?._id || null,
      });
    }
    // If no properties, show auction row
    if (props.length === 0) {
      rows.push({
        _id: auction._id,
        auctionId: auction._id,
        auctionTitle: auction.auctionTitle,
        auctionSlug: auction.slug,
        auctionStatus: auction.status,
        auctionType: auction.auctionType,
        auctionDate: auction.startDateTime,
        agent: auction.createdBy?.name || "N/A",
        propertyId: null,
        propertyTitle: "No properties",
        propertyType: "-",
        propertyLocation: "-",
        propertyStatus: "-",
        startingPrice: auction.startingBid || 0,
        currentBid: auction.currentBid || 0,
        soldPrice: null,
        hammerPrice: auction.currentBid || 0,
        reservePrice: auction.reservePrice || 0,
        winner: auction.winningBidder?.name || null,
        winnerId: auction.winningBidder?._id || null,
      });
    }
  }

  if (search) {
    const s = search.toLowerCase();
    rows = rows.filter(
      (r) =>
        (r.auctionTitle || "").toLowerCase().includes(s) ||
        (r.propertyTitle || "").toLowerCase().includes(s),
    );
  }

     // Get payment status for sold properties to detect withdrawn (by auction+property)
  const allPropIds = rows.filter(r => r.propertyId).map(r => r.propertyId);
  const allAuctionIds = auctions.map(a => a._id);
  const payments = await Payment.find({
    property: { $in: allPropIds },
    auction: { $in: allAuctionIds },
  })
    .select("property auction status")
    .lean();

  const payMap = {};
  payments.forEach((p) => {
    const key = `${p.auction}_${p.property}`;
    payMap[key] = p.status;
  });

  // Update rows: if property sold but payment withdrawn for this auction, mark as withdrawn
  rows = rows.map((r) => {
    const key = `${r.auctionId}_${r.propertyId}`;
    if (r.propertyStatus === "sold" && payMap[key] === "withdrawn") {
      return {
        ...r,
        propertyStatus: "withdrawn",
        hammerPrice: 0,
        winner: `${r.winner} (Withdrawn)`,
      };
    }
    return r;
  });

  // Stats from sold properties
  const allProps = await Property.find({
    _id: {
      $in: auctions.flatMap((a) => (a.properties || []).map((p) => p._id)),
    },
    propertyStatus: "sold",
  })
    .select("soldPrice currentBid")
    .lean();

  const totalValue = allProps.reduce(
    (s, p) => s + (p.soldPrice || p.currentBid || 0),
    0,
  );

  return {
    data: rows,
    stats: {
      total: rows.length,
      completed: rows.filter((r) => r.auctionStatus === "completed").length,
      live: rows.filter((r) => r.auctionStatus === "live").length,
      totalValue: formatPrice(totalValue),
    },
  };
};

// ─── Bidding Report ────────────────────────────
export const getBiddingReport = async (query = {}) => {
  const { search, status } = query;
  const filter = {};
  if (status && status !== "All") filter.status = status;

  const bids = await Bid.find(filter)
    .populate("bidder", "name email")
    .populate("auction", "auctionTitle slug")
    .populate("property", "propertyTitle slug")
    .sort("-createdAt")
    .lean();

  let result = bids;
  if (search) {
    const s = search.toLowerCase();
    result = bids.filter(
      (b) =>
        (b.bidder?.name || "").toLowerCase().includes(s) ||
        (b.auction?.auctionTitle || "").toLowerCase().includes(s),
    );
  }

  const totalAmount = bids.reduce((s, b) => s + b.amount, 0);
  const uniqueBidders = new Set(
    bids.map((b) => b.bidder?._id?.toString()).filter(Boolean),
  ).size;

  return {
    data: result,
    stats: {
      total: bids.length,
      uniqueBidders,
      avgBidValue: formatPrice(
        bids.length > 0 ? Math.round(totalAmount / bids.length) : 0,
      ),
      winningBids: bids.filter(
        (b) => b.status === "won" || b.status === "winning",
      ).length,
    },
  };
};

// ─── Agent Property Report (AGENTS only) ───────
export const getAgentPropertyReport = async (query = {}) => {
  const { search, propertyStatus } = query;
  const agents = await User.find({ role: "agent" }).select("_id").lean();
  const agentIds = agents.map((a) => a._id);

  const filter = { createdBy: { $in: agentIds } };
  if (propertyStatus && propertyStatus !== "All")
    filter.propertyStatus = propertyStatus;

  const properties = await Property.find(filter)
    .populate("createdBy", "name email role")
    .sort("-createdAt")
    .lean();

  // Get commission per property (non-voided)
  const propertyIds = properties.map((p) => p._id);
  const commissions = await Commission.find({
    property: { $in: propertyIds },
    status: { $ne: "voided" },
  }).lean();
  const commMap = {};
  commissions.forEach((c) => {
    commMap[c.property.toString()] = c;
  });

  let result = properties.map((p) => ({
    ...p,
    _commissionAmount: commMap[p._id.toString()]?.commissionAmount || 0,
    _soldDate: p.propertyStatus === "sold" ? p.updatedAt : null,
  }));

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (p) =>
        (p.propertyTitle || "").toLowerCase().includes(s) ||
        (p.createdBy?.name || "").toLowerCase().includes(s),
    );
  }

  const sold = properties.filter((p) => p.propertyStatus === "sold");

  return {
    data: result,
    stats: {
      total: properties.length,
      sold: sold.length,
      activeLive: properties.filter(
        (p) =>
          p.propertyStatus === "available" || p.propertyStatus === "pending",
      ).length,
      totalCommission: formatPrice(
        commissions.reduce((s, c) => s + c.commissionAmount, 0),
      ),
    },
  };
};

// ─── Customer Property Report (SELLERS + AGENTS) ──
export const getCustomerPropertyReport = async (query = {}) => {
  const { search } = query;
  const listers = await User.find({ role: { $in: ["seller", "agent"] } })
    .select("_id name email role")
    .lean();

  const properties = await Property.find({
    createdBy: { $in: listers.map((l) => l._id) },
  })
    .populate("createdBy", "name email role")
    .sort("-createdAt")
    .lean();

  let result = properties.map((p) => ({
    _id: p._id,
    customer: p.createdBy?.name || "N/A",
    customerId: p.createdBy?._id,
    property: p.propertyTitle,
    type: p.propertyType,
    location: p.location?.city || "-",
    purchasePrice: getSoldValue(p),
    status:
      p.propertyStatus === "sold"
        ? "Completed"
        : p.propertyStatus === "available"
          ? "Active"
          : p.propertyStatus,
    auctionDate: p.createdAt,
    completionDate: p.propertyStatus === "sold" ? p.updatedAt : "—",
    agent: p.createdBy?.name || "N/A",
    propertyStatus: p.propertyStatus,
  }));

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (p) =>
        (p.customer || "").toLowerCase().includes(s) ||
        (p.property || "").toLowerCase().includes(s),
    );
  }

  const sold = result.filter((p) => p.propertyStatus === "sold");

  return {
    data: result,
    stats: {
      total: result.length,
      completed: sold.length,
      activeBids: result.filter(
        (p) =>
          p.propertyStatus === "available" || p.propertyStatus === "pending",
      ).length,
      totalPurchased: formatPrice(
        sold.reduce((s, p) => s + (p.purchasePrice || 0), 0),
      ),
    },
  };
};

// ─── Overview Stats ────────────────────────────
export const getOverviewStats = async () => {
  const allUsers = await User.find().lean();
  const customers = allUsers.filter(isCustomer);
  const agents = allUsers.filter(isAgent);

  const [totalAuctions, totalBids, totalProperties] = await Promise.all([
    Auction.countDocuments(),
    Bid.countDocuments(),
    Property.countDocuments(),
  ]);

  const soldProps = await Property.find({ propertyStatus: "sold" })
    .select("soldPrice currentBid")
    .lean();
  const totalRevenue = soldProps.reduce((s, p) => s + getSoldValue(p), 0);

  const commissionAgg = await Commission.aggregate([
    { $match: { status: { $ne: "voided" } } },
    { $group: { _id: null, total: { $sum: "$commissionAmount" } } },
  ]);

  const liveAuctions = await Auction.countDocuments({ status: "live" });

  return {
    totalCustomers: customers.length,
    activeCustomers: customers.filter((c) => c.isActive).length,
    totalAgents: agents.length,
    activeAgents: agents.filter((a) => a.isActive).length,
    totalAuctions,
    liveAuctions,
    totalBids,
    totalRevenue: formatPrice(totalRevenue),
    totalCommission: formatPrice(commissionAgg[0]?.total || 0),
    totalProperties,
  };
};
