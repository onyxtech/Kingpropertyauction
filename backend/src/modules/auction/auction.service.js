import Auction from "./auction.model.js";
import notificationService, {
  NotificationEvents,
} from "../notifications/trigger.service.js";
import Bid from "../bid/bid.model.js";
import Property from "../property/property.model.js";

export const createAuction = async (data, userId) => {
  // Validate properties before creating
  if (data.properties && data.properties.length > 0) {
    // Check for sold properties
    const soldProperty = await Property.findOne({
      _id: { $in: data.properties },
      propertyStatus: "sold",
    });
    if (soldProperty) {
      throw new Error(
        `Cannot add "${soldProperty.propertyTitle}" - it has already been sold.`,
      );
    }

    // Check for properties already in ANY auction (not just live)
    const existingAuction = await Auction.findOne({
      properties: { $in: data.properties },
      status: { $in: ["live", "scheduled"] },
    });
    if (existingAuction) {
      throw new Error(
        `One or more properties are already in auction: "${existingAuction.auctionTitle}".`,
      );
    }
  }

  const auction = await Auction.create({ ...data, createdBy: userId });
  // If created as live, notify users
  if (auction.status === "live") {
    notificationService
      .emit(NotificationEvents.AUCTION_STARTED, { auctionId: auction._id })
      .catch((e) => console.error("Auction started event failed:", e.message));
  }
  return auction.populate(["properties", "createdBy", "winningBidder"]);
};

export const getAuctions = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    type,
    search,
    sortBy = "-createdAt",
  } = query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.auctionType = type;
  const skip = (page - 1) * limit;
  const [auctions, total] = await Promise.all([
    Auction.find(filter)
      .populate(
        "properties",
        "propertyTitle propertyType location pricing media",
      )
      .populate("createdBy", "name email")
      .populate("winningBidder", "name email")
      .sort(sortBy)
      .skip(skip)
      .limit(limit),
    Auction.countDocuments(filter),
  ]);
  return {
    auctions,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getAuctionById = async (id) => {
  const auction = await Auction.findById(id)
    .populate("properties")
    .populate("createdBy", "name email")
    .populate("winningBidder", "name email");
  if (!auction) throw new Error("Auction not found");
  return auction;
};

export const updateAuction = async (id, data) => {
  // If properties are being updated, validate them
  if (data.properties && data.properties.length > 0) {
    // Check no property is sold
    const soldProperty = await Property.findOne({
      _id: { $in: data.properties },
      propertyStatus: "sold",
    });
    if (soldProperty) {
      throw new Error(
        `Cannot add "${soldProperty.propertyTitle}" - it has already been sold.`,
      );
    }

    // Check no property is in another auction
    const otherAuction = await Auction.findOne({
      _id: { $ne: id },
      properties: { $in: data.properties },
      status: { $in: ["live", "scheduled"] },
    });
    if (otherAuction) {
      throw new Error(
        `One or more properties are already in auction: "${otherAuction.auctionTitle}".`,
      );
    }
  }

  const auction = await Auction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate(["properties", "createdBy"]);

  if (!auction) throw new Error("Auction not found");
  return auction;
};

export const deleteAuction = async (id) => {
  const auction = await Auction.findByIdAndDelete(id);
  if (!auction) throw new Error("Auction not found");

  // Reset properties that were in this auction back to available
  if (auction.properties?.length > 0) {
    await Property.updateMany(
      { _id: { $in: auction.properties }, propertyStatus: { $ne: "sold" } },
      {
        propertyStatus: "available",
        "auctionDetails.auctionStatus": "upcoming",
      },
    );
  }

  return auction;
};

export const startAuction = async (id) => {
  const auction = await Auction.findByIdAndUpdate(
    id,
    { status: "live" },
    { new: true },
  );
  if (!auction) throw new Error("Auction not found");
  notificationService
    .emit(NotificationEvents.AUCTION_STARTED, { auctionId: id })
    .catch((e) => console.error("Auction started event failed:", e.message));
  return auction;
};

export const endAuction = async (id) => {
  const auction = await Auction.findByIdAndUpdate(
    id,
    { status: "completed" },
    { new: true },
  );
  if (!auction) throw new Error("Auction not found");
  return auction;
};

export const cancelAuction = async (id) => {
  const auction = await Auction.findByIdAndUpdate(
    id,
    { status: "cancelled" },
    { new: true },
  );
  if (!auction) throw new Error("Auction not found");

  // Reset properties back to available
  if (auction.properties?.length > 0) {
    await Property.updateMany(
      { _id: { $in: auction.properties }, propertyStatus: { $ne: "sold" } },
      {
        propertyStatus: "available",
        "auctionDetails.auctionStatus": "upcoming",
      },
    );
  }

  return auction;
};

// ─── AUCTION COMPLETION ───

export const completeAuction = async (auctionId) => {
  const auction = await Auction.findById(auctionId).populate("properties");
  if (!auction) throw new Error("Auction not found");

  // Atomically mark as completing to prevent duplicate runs
  const updated = await Auction.findOneAndUpdate(
    { _id: auctionId, status: { $in: ["live", "completed"] } },
    { status: "completing" },
    { new: true },
  );

  // Allow completion notifications even if already marked completed
  if (!updated) {
    return { auction: auction.auctionTitle, alreadyCompleted: true };
  }

  const results = [];

  for (const property of auction.properties) {
    const winningBid = await Bid.findOne({
      auction: auctionId,
      property: property._id,
      status: "winning",
    }).populate("bidder", "name email");

    const freshProperty = await Property.findById(property._id);
    const reservePrice = freshProperty?.pricing?.reservePrice || 0;
    const currentBid = freshProperty?.currentBid || property?.currentBid || 0;
    const freshWinningBidder = freshProperty?.winningBidder || null;

    const winner = winningBid?.bidder || freshWinningBidder || null;
    const winnerName = winner?.name || winner?.toString() || "Unknown";
    const winnerEmail = winningBid?.bidder?.email || "";

    if (currentBid >= reservePrice && reservePrice > 0) {
      await Property.findByIdAndUpdate(property._id, {
        propertyStatus: "sold",
        soldTo: winner?._id || winner || null,
        soldPrice: currentBid,
        "auctionDetails.auctionStatus": "closed",
      });
      if (winningBid) {
        await Bid.updateMany(
          { auction: auctionId, property: property._id, status: "winning" },
          { status: "won" },
        );
      }
      results.push({
        property: property.propertyTitle,
        status: "SOLD",
        winner: winnerName,
        email: winnerEmail,
        price: currentBid,
        reserve: reservePrice,
      });

      // Notify winner
      if (winner?._id) {
        notificationService
          .emit(NotificationEvents.AUCTION_WON, {
            userId: winner._id,
            propertyId: property._id,
            auctionId,
            finalPrice: currentBid,
          })
          .catch((e) => console.error("Auction won event failed:", e.message));
      }

      // Notify seller
      notificationService
        .emit(NotificationEvents.PROPERTY_SOLD, { propertyId: property._id })
        .catch((e) => console.error("Property sold event failed:", e.message));
    } else if (currentBid > 0 && currentBid < reservePrice) {
      await Property.findByIdAndUpdate(property._id, {
        propertyStatus: "available",
        "auctionDetails.auctionStatus": "closed",
      });
      if (winningBid) {
        await Bid.updateMany(
          { auction: auctionId, property: property._id, status: "winning" },
          { status: "lost" },
        );
      }
      results.push({
        property: property.propertyTitle,
        status: "UNSOLD",
        reason: `Reserve not met (highest bid: £${currentBid.toLocaleString()}, reserve: £${reservePrice.toLocaleString()})`,
        highestBid: currentBid,
        reserve: reservePrice,
      });

      // Notify seller
      notificationService
        .emit(NotificationEvents.PROPERTY_UNSOLD, { propertyId: property._id })
        .catch((e) =>
          console.error("Property unsold event failed:", e.message),
        );
    } else {
      await Property.findByIdAndUpdate(property._id, {
        propertyStatus: "available",
        "auctionDetails.auctionStatus": "closed",
      });
      results.push({
        property: property.propertyTitle,
        status: "UNSOLD",
        reason: "No bids placed",
      });

      // Notify seller
      notificationService
        .emit(NotificationEvents.PROPERTY_UNSOLD, { propertyId: property._id })
        .catch((e) =>
          console.error("Property unsold event failed:", e.message),
        );
    }

    // Notify losing bidders for THIS property (inside main loop - runs once per property)
    const allBidders = await Bid.find({
      auction: auctionId,
      property: property._id,
      status: { $ne: "retracted" },
    }).distinct("bidder");

    const winnerStr = winner?._id?.toString();
    for (const bidderId of allBidders) {
      if (bidderId.toString() !== winnerStr) {
        notificationService
          .emit(NotificationEvents.AUCTION_LOST, {
            userId: bidderId,
            propertyId: property._id,
            auctionId,
            finalPrice: currentBid,
          })
          .catch((e) => console.error("Auction lost event failed:", e.message));
      }
    }
  }

  await Auction.findByIdAndUpdate(auctionId, { status: "completed" });

  return {
    auction: auction.auctionTitle,
    completedAt: new Date(),
    totalLots: auction.properties.length,
    results,
    summary: {
      sold: results.filter((r) => r.status === "SOLD").length,
      unsold: results.filter((r) => r.status === "UNSOLD").length,
      totalRevenue: results
        .filter((r) => r.status === "SOLD")
        .reduce((sum, r) => sum + (r.price || 0), 0),
    },
  };
};

// ─── CRON: Check for ended auctions ───
export const checkAndCompleteEndedAuctions = async () => {
  const now = new Date();
  const endedAuctions = await Auction.find({
    status: "live",
    endDateTime: { $lte: now },
  });
  const results = [];
  for (const auction of endedAuctions) {
    try {
      const result = await completeAuction(auction._id);
      results.push(result);
      console.log(`✅ Auction completed: ${auction.auctionTitle}`);
    } catch (error) {
      console.error(
        `❌ Failed to complete auction ${auction._id}:`,
        error.message,
      );
    }
  }
  return results;
};
