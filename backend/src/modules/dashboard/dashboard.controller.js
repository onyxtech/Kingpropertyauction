import Property from "../property/property.model.js";
import Auction from "../auction/auction.model.js";
import Bid from "../bid/bid.model.js";
import User from "../user/user.model.js";
import Lead from "../lead/lead.model.js";

export const getStats = async (req, res) => {
  try {
    const [
      totalProperties,
      pendingProperties,
      approvedProperties,
      totalAuctions,
      liveAuctions,
      totalBids,
      totalUsers,
      totalLeads,
      pendingUsers,
      soldCount,
      pendingProps,
      recentBids,
      recentProperties,
      recentUsers,
      soldProperties,
      unsoldProperties,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ approvalStatus: "pending" }),
      Property.countDocuments({ approvalStatus: "approved" }),
      Auction.countDocuments(),
      Auction.countDocuments({ status: "live" }),
      Bid.countDocuments(),
      User.countDocuments(),
      Lead.countDocuments(),
      User.countDocuments({ isActive: false }),
      Property.countDocuments({ propertyStatus: "sold" }),
      Property.find({ approvalStatus: "pending" })
        .limit(8)
        .select("propertyTitle createdBy createdAt"),
      Bid.find()
        .sort("-createdAt")
        .limit(10)
        .populate("bidder", "name email")
        .populate("property", "propertyTitle slug")
        .populate("auction", "auctionTitle slug"),
      Property.find()
        .sort("-createdAt")
        .limit(3)
        .select("propertyTitle createdAt"),
      User.find().sort("-createdAt").limit(3).select("name email createdAt"),
      Property.find({ propertyStatus: "sold" })
        .sort("-updatedAt")
        .limit(5)
        .select(
          "propertyTitle propertyStatus soldPrice currentBid slug updatedAt",
        ),
      Property.find({ propertyStatus: "unsold" })
        .sort("-updatedAt")
        .limit(5)
        .select("propertyTitle propertyStatus currentBid slug updatedAt"),
    ]);

    const activities = [];
    recentBids.forEach((b) => {
      activities.push({
        type: "bid",
        message: `${b.bidder?.name || "Someone"} bid £${b.amount?.toLocaleString()} on ${b.property?.propertyTitle || "a property"}`,
        time: b.createdAt
          ? new Date(b.createdAt).toLocaleTimeString()
          : "Recently",
        icon: "gavel",
        color: "purple",
        link: `/properties/${b.property?.slug || b.property?._id || ""}`,
      });
    });
    soldProperties.forEach((p) => {
      activities.push({
        type: "sold",
        message: `🎉 SOLD: ${p.propertyTitle} for £${(p.soldPrice || p.currentBid || 0).toLocaleString()}`,
        time: p.updatedAt
          ? new Date(p.updatedAt).toLocaleTimeString()
          : "Recently",
        icon: "check",
        color: "emerald",
        link: `/properties/${p.slug || p._id}`,
      });
    });
    unsoldProperties.forEach((p) => {
      activities.push({
        type: "unsold",
        message: `📉 Unsold: ${p.propertyTitle} (highest bid: £${(p.currentBid || 0).toLocaleString()})`,
        time: p.updatedAt
          ? new Date(p.updatedAt).toLocaleTimeString()
          : "Recently",
        icon: "x",
        color: "red",
        link: `/properties/${p.slug || p._id}`,
      });
    });

    const approvals = pendingProps.map((p) => ({
      id: p._id,
      type: "property",
      title: p.propertyTitle,
      submittedBy: p.createdBy?.toString() || "Unknown",
      date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A",
      status: "pending",
    }));

    res.json({
      success: true,
      data: {
        totalProperties,
        pendingProperties,
        approvedProperties,
        totalAuctions,
        liveAuctions,
        totalBids,
        totalUsers,
        totalLeads,
        pendingUsers,
        soldCount,
        activities: activities
          .sort((a, b) => b.time.localeCompare(a.time))
          .slice(0, 10),
        approvals: approvals.slice(0, 8),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GLOBAL SEARCH ──────────────────────────────────────────────
export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: { properties: [], auctions: [], users: [], leads: [] },
      });
    }
    const searchRegex = new RegExp(q.trim(), "i");
    const [properties, auctions, users, leads] = await Promise.all([
      Property.find({
        $or: [
          { propertyTitle: searchRegex },
          { "location.city": searchRegex },
          { propertyType: searchRegex },
        ],
      })
        .select("propertyTitle slug propertyType location.city")
        .limit(5)
        .lean(),
      Auction.find({
        $or: [
          { auctionTitle: searchRegex },
          { auctionType: searchRegex },
          { "venue.city": searchRegex },
        ],
      })
        .select("auctionTitle slug auctionType status")
        .limit(5)
        .lean(),
      User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { role: searchRegex },
        ],
      })
        .select("name email role isActive")
        .limit(5)
        .lean(),
      Lead.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { subject: searchRegex },
        ],
      })
        .select("name email subject leadType status")
        .limit(5)
        .lean(),
    ]);
    res.json({
      success: true,
      data: {
        properties: properties.map((p) => ({
          _id: p._id,
          title: p.propertyTitle,
          slug: p.slug,
          type: p.propertyType,
          subtitle: p.location?.city || "UK",
          route: `/properties/${p.slug || p._id}`,
        })),
        auctions: auctions.map((a) => ({
          _id: a._id,
          title: a.auctionTitle,
          slug: a.slug,
          type: a.auctionType,
          subtitle: a.status,
          route: `/auctions/${a.slug || a._id}`,
        })),
        users: users.map((u) => ({
          _id: u._id,
          title: u.name,
          subtitle: `${u.email} • ${u.role}`,
          type: u.role,
          route: `/admin/users`,
        })),
        leads: leads.map((l) => ({
          _id: l._id,
          title: l.name,
          subtitle: `${l.email} • ${l.subject?.slice(0, 40)}`,
          type: l.leadType,
          route: `/admin/leads`,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── NOTIFICATIONS ──────────────────────────────────────────────
export const getNotifications = async (req, res) => {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      recentBids,
      newUsers,
      newLeads,
      pendingProperties,
      liveAuctions,
      completedAuctions,
      soldProperties,
      wonBids,
    ] = await Promise.all([
      // Recent bids (24h)
      Bid.find({ createdAt: { $gte: twentyFourHoursAgo } })
        .sort("-createdAt")
        .limit(10)
        .populate("bidder", "name")
        .populate("property", "propertyTitle slug pricing")
        .lean(),

      // New users (24h)
      User.find({ createdAt: { $gte: twentyFourHoursAgo } })
        .sort("-createdAt")
        .limit(5)
        .select("name email role createdAt")
        .lean(),

      // New leads (24h)
      Lead.find({ createdAt: { $gte: twentyFourHoursAgo } })
        .sort("-createdAt")
        .limit(5)
        .select("name email subject leadType createdAt")
        .lean(),

      // Pending properties
      Property.find({ approvalStatus: "pending" })
        .sort("-createdAt")
        .limit(5)
        .select("propertyTitle createdAt")
        .lean(),

      // Live auctions
      Auction.find({ status: "live" })
        .select("auctionTitle slug endDateTime")
        .limit(5)
        .lean(),

      // Completed auctions (7 days)
      Auction.find({ status: "completed", updatedAt: { $gte: sevenDaysAgo } })
        .sort("-updatedAt")
        .limit(5)
        .select("auctionTitle slug updatedAt")
        .lean(),

      // Sold properties (7 days)
      Property.find({
        propertyStatus: "sold",
        updatedAt: { $gte: sevenDaysAgo },
      })
        .sort("-updatedAt")
        .limit(5)
        .populate("winningBidder", "name")
        .select("propertyTitle soldPrice winningBidder slug updatedAt")
        .lean(),

      // Won bids (7 days) - shows who won what
      Bid.find({ status: "won", updatedAt: { $gte: sevenDaysAgo } })
        .sort("-updatedAt")
        .limit(5)
        .populate("bidder", "name")
        .populate("property", "propertyTitle slug")
        .lean(),
    ]);

    const notifications = [];

    // Recent bids
    recentBids.forEach((b) => {
      const reserveMet =
        b.property?.pricing?.reservePrice &&
        b.amount >= b.property.pricing.reservePrice;
      notifications.push({
        type: "bid",
        icon: "gavel",
        message: `${b.bidder?.name || "Someone"} bid £${b.amount?.toLocaleString()} on ${b.property?.propertyTitle || "a property"}${reserveMet ? " ✅ Reserve Met!" : ""}`,
        time: b.createdAt,
        link: b.property?.slug ? `/properties/${b.property.slug}` : null,
        color: reserveMet ? "emerald" : "purple",
      });
    });

    // New users
    newUsers.forEach((u) => {
      notifications.push({
        type: "user",
        icon: "user",
        message: `👤 ${u.name} registered as ${u.role}`,
        time: u.createdAt,
        link: "/admin/users",
        color: "blue",
      });
    });

    // New leads
    newLeads.forEach((l) => {
      notifications.push({
        type: "lead",
        icon: "mail",
        message: `📩 ${l.name} submitted ${l.leadType?.replace(/-/g, " ")}: "${l.subject?.slice(0, 40)}"`,
        time: l.createdAt,
        link: "/admin/leads",
        color: "green",
      });
    });

    // Pending properties
    pendingProperties.forEach((p) => {
      notifications.push({
        type: "property",
        icon: "building",
        message: `🏠 Property pending approval: ${p.propertyTitle}`,
        time: p.createdAt,
        link: "/admin/properties",
        color: "orange",
      });
    });

    // Live auctions
    liveAuctions.forEach((a) => {
      const timeLeft = new Date(a.endDateTime).getTime() - now.getTime();
      const hoursLeft = Math.round(timeLeft / (1000 * 60 * 60));
      notifications.push({
        type: "auction_live",
        icon: "clock",
        message: `🔴 LIVE: ${a.auctionTitle}${hoursLeft > 0 ? ` (ends in ${hoursLeft}h)` : " - Ending soon!"}`,
        time: new Date(),
        link: a.slug ? `/auctions/${a.slug}` : null,
        color: "red",
      });
    });

    // Completed auctions
    completedAuctions.forEach((a) => {
      notifications.push({
        type: "auction_completed",
        icon: "check",
        message: `🏁 Auction completed: ${a.auctionTitle}`,
        time: a.updatedAt,
        link: a.slug ? `/auctions/${a.slug}` : null,
        color: "slate",
      });
    });

    // Sold properties - shows who bought
    soldProperties.forEach((p) => {
      const buyerName = p.winningBidder?.name || "a buyer";
      notifications.push({
        type: "property_sold",
        icon: "check",
        message: `🎉 SOLD: ${p.propertyTitle} to ${buyerName} for £${(p.soldPrice || 0).toLocaleString()}`,
        time: p.updatedAt,
        link: p.slug ? `/properties/${p.slug}` : null,
        color: "emerald",
      });
    });

    // Won bids - who won what auction
    wonBids.forEach((b) => {
      notifications.push({
        type: "bid_won",
        icon: "trophy",
        message: `🏆 ${b.bidder?.name || "Someone"} won ${b.property?.propertyTitle || "a property"} with £${b.amount?.toLocaleString()}`,
        time: b.updatedAt,
        link: b.property?.slug ? `/properties/${b.property.slug}` : null,
        color: "yellow",
      });
    });

    // Sort by time, newest first
    notifications.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    );

    res.json({
      success: true,
      data: {
        notifications: notifications.slice(0, 25),
        unreadCount: notifications.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
