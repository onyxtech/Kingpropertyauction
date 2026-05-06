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
      pendingProps,
      recentBids,
      recentProperties,
      recentUsers,
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
      Property.find({ approvalStatus: "pending" })
        .limit(8)
        .select("propertyTitle createdBy createdAt"),
      Bid.find()
        .sort("-createdAt")
        .limit(5)
        .populate("bidder", "name")
        .populate("auction", "auctionTitle slug"),
      Property.find()
        .sort("-createdAt")
        .limit(3)
        .select("propertyTitle createdAt"),
      User.find().sort("-createdAt").limit(3).select("name email createdAt"),
    ]);

    // Build activities array
    const activities = [];

    recentProperties.forEach((p) => {
      activities.push({
        type: "property",
        message: `New property listed: ${p.propertyTitle}`,
        time: p.createdAt
          ? new Date(p.createdAt).toLocaleTimeString()
          : "Recently",
        icon: "building",
        color: "blue",
        link: `/admin/properties`,
      });
    });

    recentUsers.forEach((u) => {
      activities.push({
        type: "user",
        message: `New user registered: ${u.name}`,
        time: u.createdAt
          ? new Date(u.createdAt).toLocaleTimeString()
          : "Recently",
        icon: "user",
        color: "green",
        link: `/admin/users`,
      });
    });

    recentBids.forEach((b) => {
      activities.push({
        type: "bid",
        message: `${b.bidder?.name || "Someone"} bid £${b.amount?.toLocaleString()}`,
        time: new Date(b.createdAt).toLocaleTimeString(),
        icon: "gavel",
        color: "purple",
        link: `/auctions/${b.auction?.slug || b.auction?._id}`,
      });
    });

    // Build pending approvals
    const approvals = [];

    pendingProps.forEach((p) => {
      approvals.push({
        type: "Property",
        id: p._id?.toString().slice(-6) || "N/A",
        title: p.propertyTitle,
        submittedBy: "System",
        date: p.createdAt
          ? new Date(p.createdAt).toLocaleDateString()
          : new Date().toLocaleDateString(),
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
        activities: activities.slice(0, 8),
        approvals,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
