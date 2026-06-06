import Auction from "./auction.model.js";
import notificationService, {
  NotificationEvents,
} from "../notifications/trigger.service.js";
import Bid from "../bid/bid.model.js";
import Property from "../property/property.model.js";
import Notification from "../notifications/notification.model.js";
import { emitAuctionUpdate } from '../../socket.js';
import cache from '../../utils/cache.js';

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

  if (data.properties && data.properties.length > 0) {
    await Property.updateMany(
      { _id: { $in: data.properties } },
      [{ $set: { propertyStatus: "available", "auctionDetails.auctionStatus": "upcoming", currentBid: "$pricing.startingAuctionPrice", totalBids: 0, winningBidder: null } }]
    );

    try {
      const { emitToUser } = await import("../../socket.js");
      const propertiesWithOwners = await Property.find({
        _id: { $in: data.properties }
      }).select("propertyTitle slug createdBy").populate("createdBy", "_id name").lean();

      for (const prop of propertiesWithOwners) {
        if (!prop.createdBy) continue;

        const msg = auction.status === "live"
          ? `🔴 Your property "${prop.propertyTitle}" is now in a LIVE auction: ${auction.auctionTitle}`
          : `📅 Your property "${prop.propertyTitle}" has been added to auction: ${auction.auctionTitle}`;

        await Notification.create({
          type: "auction_live",
          icon: "gavel",
          message: msg,
          link: `/auctions/${auction.slug || auction._id}`,
          color: auction.status === "live" ? "green" : "blue",
          targetUser: prop.createdBy._id,
        }).catch(e => console.warn("Property owner auction notification failed:", e.message));

        emitToUser(prop.createdBy._id.toString(), "new_notification", {
          type: "auction_live",
          message: msg,
          link: `/auctions/${auction.slug || auction._id}`,
        });
      }
    } catch (e) {
      console.warn("Property owner notifications failed:", e.message);
    }

    // Email property owners when added to auction
    try {
      const { sendEmail } = await import("../notifications/email.service.js");
      const { isNotificationEnabled } = await import("../settings/settings.service.js");
      const emailEnabled = await isNotificationEnabled("propertyAddedToAuction");
      if (emailEnabled) {
        const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const formatDate = (date) => {
          if (!date) return "TBD";
          return new Date(date).toLocaleString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          });
        };
        const propsForEmail = await Property.find({
          _id: { $in: data.properties }
        }).select("propertyTitle createdBy").populate("createdBy", "name email").lean();

        for (const prop of propsForEmail) {
          if (!prop.createdBy?.email) continue;
          await sendEmail({
            to: prop.createdBy.email,
            subject: `Your property added to auction: ${auction.auctionTitle}`,
            templateKey: "propertyAddedToAuction",
            variables: {
              owner_name: prop.createdBy.name || "Property Owner",
              property_title: prop.propertyTitle,
              auction_title: auction.auctionTitle,
              auction_type: auction.auctionType || "online",
              start_date: formatDate(auction.startDateTime),
              end_date: formatDate(auction.endDateTime),
              auction_url: `${siteUrl}/auctions/${auction.slug || auction._id}`,
              dashboard_url: `${siteUrl}/dashboard`,
            },
          }).catch(e => console.warn("Property added to auction email failed:", e.message));
        }
      }
    } catch (emailErr) {
      console.warn("Property added to auction emails failed:", emailErr.message);
    }
  }

  emitAuctionUpdate(auction._id.toString(), { status: auction.status, type: 'auction_created' });
  // If created as live, notify users
  if (auction.status === "live") {
    notificationService
      .emit(NotificationEvents.AUCTION_STARTED, { auctionId: auction._id })
      .catch((e) => console.error("Auction started event failed:", e.message));
  }

  // Schedule BullMQ jobs based on initial status
  const { scheduleAuctionStart, scheduleAuctionEnd } = await import('./auction.queue.js');
  if (auction.status === 'scheduled') {
    await scheduleAuctionStart(auction._id, auction.startDateTime, auction.auctionTitle);
  } else if (auction.status === 'live') {
    await scheduleAuctionEnd(auction._id, auction.endDateTime, auction.auctionTitle);
  }

  // Invalidate auction list caches
  await cache.delPattern('auctions:*');

  return auction.populate(["properties", "createdBy", "winningBidder"]);
};

export const getAuctions = async (query = {}) => {
  const cacheKey = `auctions:${JSON.stringify(query)}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

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
  const result = {
    auctions,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };

  // Cache for 10 seconds (short TTL — live auction data changes frequently)
  await cache.set(cacheKey, result, 10);

  return result;
};

export const getAuctionById = async (id) => {
  const cacheKey = `auction:${id}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const auction = await Auction.findById(id)
    .populate("properties")
    .populate("createdBy", "name email")
    .populate("winningBidder", "name email");
  if (!auction) throw new Error("Auction not found");

  await cache.set(cacheKey, auction, 30);
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

  // Snapshot existing properties before update so we can find newly added ones
  const existingBeforeUpdate = data.properties?.length > 0
    ? await Auction.findById(id).select("properties").lean()
    : null;

  const auction = await Auction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate(["properties", "createdBy"]);

  if (!auction) throw new Error("Auction not found");

  if (data.properties && data.properties.length > 0) {
    await Property.updateMany(
      { _id: { $in: data.properties } },
      [{ $set: { propertyStatus: "available", "auctionDetails.auctionStatus": "upcoming", currentBid: "$pricing.startingAuctionPrice", totalBids: 0, winningBidder: null } }]
    );

    try {
      const { emitToUser } = await import("../../socket.js");
      const propertiesWithOwners = await Property.find({
        _id: { $in: data.properties }
      }).select("propertyTitle slug createdBy").populate("createdBy", "_id name").lean();

      for (const prop of propertiesWithOwners) {
        if (!prop.createdBy) continue;

        const msg = auction.status === "live"
          ? `🔴 Your property "${prop.propertyTitle}" is now in a LIVE auction: ${auction.auctionTitle}`
          : `📅 Your property "${prop.propertyTitle}" has been added to auction: ${auction.auctionTitle}`;

        await Notification.create({
          type: "auction_live",
          icon: "gavel",
          message: msg,
          link: `/auctions/${auction.slug || auction._id}`,
          color: auction.status === "live" ? "green" : "blue",
          targetUser: prop.createdBy._id,
        }).catch(e => console.warn("Property owner auction notification failed:", e.message));

        emitToUser(prop.createdBy._id.toString(), "new_notification", {
          type: "auction_live",
          message: msg,
          link: `/auctions/${auction.slug || auction._id}`,
        });
      }
    } catch (e) {
      console.warn("Property owner notifications failed:", e.message);
    }

    // Email only newly added property owners (not those already in auction)
    try {
      const { sendEmail } = await import("../notifications/email.service.js");
      const { isNotificationEnabled } = await import("../settings/settings.service.js");
      const emailEnabled = await isNotificationEnabled("propertyAddedToAuction");
      if (emailEnabled) {
        const previousPropertyIds = (existingBeforeUpdate?.properties || []).map(p => p.toString());
        const newPropertyIds = data.properties.filter(
          pid => !previousPropertyIds.includes(pid.toString())
        );

        if (newPropertyIds.length > 0) {
          const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";
          const formatDate = (date) => {
            if (!date) return "TBD";
            return new Date(date).toLocaleString("en-GB", {
              day: "2-digit", month: "short", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            });
          };
          const newPropsForEmail = await Property.find({
            _id: { $in: newPropertyIds }
          }).select("propertyTitle createdBy").populate("createdBy", "name email").lean();

          for (const prop of newPropsForEmail) {
            if (!prop.createdBy?.email) continue;
            await sendEmail({
              to: prop.createdBy.email,
              subject: `Your property added to auction: ${auction.auctionTitle}`,
              templateKey: "propertyAddedToAuction",
              variables: {
                owner_name: prop.createdBy.name || "Property Owner",
                property_title: prop.propertyTitle,
                auction_title: auction.auctionTitle,
                auction_type: auction.auctionType || "online",
                start_date: formatDate(auction.startDateTime),
                end_date: formatDate(auction.endDateTime),
                auction_url: `${siteUrl}/auctions/${auction.slug || auction._id}`,
                dashboard_url: `${siteUrl}/dashboard`,
              },
            }).catch(e => console.warn("Property added to auction email failed:", e.message));
          }
        }
      }
    } catch (emailErr) {
      console.warn("Property added to auction emails failed:", emailErr.message);
    }
  }

  // Reschedule BullMQ jobs whenever an auction is updated
  const { scheduleAuctionStart, scheduleAuctionEnd, removeAuctionJobs } = await import('./auction.queue.js');
  if (auction.status === 'scheduled') {
    await scheduleAuctionStart(auction._id, auction.startDateTime, auction.auctionTitle);
  } else if (auction.status === 'live') {
    await scheduleAuctionEnd(auction._id, auction.endDateTime, auction.auctionTitle);
  } else if (auction.status === 'cancelled' || auction.status === 'completed') {
    await removeAuctionJobs(auction._id);
  }

  // Invalidate caches
  await cache.delPattern('auctions:*');
  await cache.del(`auction:${id}`);

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

  await cache.delPattern('auctions:*');
  await cache.del(`auction:${id}`);

  return auction;
};

export const startAuction = async (id) => {
  const auction = await Auction.findByIdAndUpdate(
    id,
    { status: "live" },
    { new: true },
  );
  if (!auction) throw new Error("Auction not found");
  emitAuctionUpdate(id, { status: 'live' });
  notificationService
    .emit(NotificationEvents.AUCTION_STARTED, { auctionId: id })
    .catch((e) => console.error("Auction started event failed:", e.message));
  await cache.delPattern('auctions:*');
  await cache.del(`auction:${id}`);
  return auction;
};

export const endAuction = async (id) => {
  const auction = await Auction.findByIdAndUpdate(
    id,
    { status: "completed" },
    { new: true },
  );
  if (!auction) throw new Error("Auction not found");
  emitAuctionUpdate(id, { status: 'completed' });
  await cache.delPattern('auctions:*');
  await cache.del(`auction:${id}`);
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

  // Remove any pending BullMQ jobs for this auction
  const { removeAuctionJobs } = await import('./auction.queue.js');
  await removeAuctionJobs(id);

  await cache.delPattern('auctions:*');
  await cache.del(`auction:${id}`);

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
        propertyStatus: "unsold",
        "auctionDetails.auctionStatus": "closed",
        winningBidder: null,
        soldPrice: null,
        winner: null,
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
        currentBid: 0,
        totalBids: 0,
        winningBidder: null,
        soldPrice: null,
        winner: null,
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
  emitAuctionUpdate(auctionId, { status: 'completed' });
  await cache.delPattern('auctions:*');
  await cache.del(`auction:${auctionId}`);

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
