import Auction from "./auction.model.js";

export const createAuction = async (data, userId) => {
  const auction = await Auction.create({
    ...data,
    createdBy: userId,
  });
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
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
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
  return auction;
};

export const startAuction = async (id) => {
  const auction = await Auction.findByIdAndUpdate(
    id,
    { status: "live" },
    { new: true },
  );
  if (!auction) throw new Error("Auction not found");
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
  return auction;
};

// ─── AUCTION COMPLETION ───
import Bid from "../bid/bid.model.js";
import Property from "../property/property.model.js";

export const completeAuction = async (auctionId) => {
  const auction = await Auction.findById(auctionId).populate("properties");
  if (!auction) throw new Error("Auction not found");
  if (auction.status !== "live") throw new Error("Auction is not live");

  const results = [];

  for (const property of auction.properties) {
    // Try to find a winning bid
    const winningBid = await Bid.findOne({
      auction: auctionId,
      property: property._id,
      status: "winning",
    }).populate("bidder", "name email");

    // Get FRESH property data from DB
    const freshProperty = await Property.findById(property._id);
    const reservePrice = freshProperty?.pricing?.reservePrice || 0;
    const currentBid = freshProperty?.currentBid || property?.currentBid || 0;
    const freshWinningBidder = freshProperty?.winningBidder || null;

    // Determine winner info
    const winner = winningBid?.bidder || freshWinningBidder || null;
    const winnerName = winner?.name || winner?.toString() || "Unknown";
    const winnerEmail = winningBid?.bidder?.email || "";

    if (currentBid >= reservePrice && reservePrice > 0) {
      // SOLD - Reserve met
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
    } else if (currentBid > 0 && currentBid < reservePrice) {
      // UNSOLD - Had bids but reserve not met
      await Property.findByIdAndUpdate(property._id, {
        propertyStatus: "unsold",
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
    } else {
      // NO BIDS at all
      await Property.findByIdAndUpdate(property._id, {
        propertyStatus: "unsold",
        "auctionDetails.auctionStatus": "closed",
      });

      results.push({
        property: property.propertyTitle,
        status: "UNSOLD",
        reason: "No bids placed",
      });
    }
  }

  // Update auction status
  auction.status = "completed";
  await auction.save();

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
