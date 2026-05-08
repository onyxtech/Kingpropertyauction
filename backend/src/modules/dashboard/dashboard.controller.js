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
      Property.find({ approvalStatus: "pending" }).limit(8).select("propertyTitle createdBy createdAt"),
      Bid.find().sort("-createdAt").limit(10).populate("bidder", "name email").populate("property", "propertyTitle slug").populate("auction", "auctionTitle slug"),
      Property.find().sort("-createdAt").limit(3).select("propertyTitle createdAt"),
      User.find().sort("-createdAt").limit(3).select("name email createdAt"),
      Property.find({ propertyStatus: "sold" }).sort("-updatedAt").limit(5).select("propertyTitle propertyStatus soldPrice currentBid slug updatedAt"),
      Property.find({ propertyStatus: "unsold" }).sort("-updatedAt").limit(5).select("propertyTitle propertyStatus currentBid slug updatedAt"),
    ]);

    // Build enhanced activities array
    const activities = [];

    // Recent bids with property context
    recentBids.forEach((b) => {
      activities.push({
        type: "bid",
        message: `${b.bidder?.name || "Someone"} bid £${b.amount?.toLocaleString()} on ${b.property?.propertyTitle || "a property"}`,
        time: b.createdAt ? new Date(b.createdAt).toLocaleTimeString() : "Recently",
        icon: "gavel",
        color: "purple",
        link: `/properties/${b.property?.slug || b.property?._id || ""}`,
      });
    });

    // Sold properties
    soldProperties.forEach((p) => {
      activities.push({
        type: "sold",
        message: `🎉 SOLD: ${p.propertyTitle} for £${(p.soldPrice || p.currentBid || 0).toLocaleString()}`,
        time: p.updatedAt ? new Date(p.updatedAt).toLocaleTimeString() : "Recently",
        icon: "check",
        color: "emerald",
        link: `/properties/${p.slug || p._id}`,
      });
    });

    // Unsold properties
    unsoldProperties.forEach((p) => {
      activities.push({
        type: "unsold",
        message: `❌ UNSOLD: ${p.propertyTitle} - Reserve not met (Highest: £${(p.currentBid || 0).toLocaleString()})`,
        time: p.updatedAt ? new Date(p.updatedAt).toLocaleTimeString() : "Recently",
        icon: "x",
        color: "red",
        link: `/properties/${p.slug || p._id}`,
      });
    });

    // New properties
    recentProperties.forEach((p) => {
      activities.push({
        type: "property",
        message: `New property listed: ${p.propertyTitle}`,
        time: p.createdAt ? new Date(p.createdAt).toLocaleTimeString() : "Recently",
        icon: "building",
        color: "blue",
        link: `/admin/properties`,
      });
    });

    // New users
    recentUsers.forEach((u) => {
      activities.push({
        type: "user",
        message: `New user registered: ${u.name}`,
        time: u.createdAt ? new Date(u.createdAt).toLocaleTimeString() : "Recently",
        icon: "user",
        color: "green",
        link: `/admin/users`,
      });
    });

    // Sort by most recent first and limit to 8
    activities.sort((a, b) => {
      if (a.time === "Recently") return -1;
      if (b.time === "Recently") return 1;
      return b.time.localeCompare(a.time);
    });

    // Build pending approvals
    const approvals = [];

    pendingProps.forEach((p) => {
      approvals.push({
        type: "Property",
        id: p._id?.toString().slice(-6) || "N/A",
        title: p.propertyTitle,
        submittedBy: "System",
        date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        status: "pending",
      });
    });

    if (pendingUsers > 0) {
      approvals.push({
        type: "Users",
        id: "PENDING",
        title: `${pendingUsers} Pending User Approvals`,
        submittedBy: "System",
        date: new Date().toLocaleDateString(),
        status: "pending",
      });
    }

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
        soldProperties: soldCount || 0,
        activities: activities.slice(0, 8),
        approvals,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};