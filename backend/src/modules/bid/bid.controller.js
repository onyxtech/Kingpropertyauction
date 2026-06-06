import { placeBidSchema } from './bid.validation.js';
import * as bidService from './bid.service.js';
import Bid from './bid.model.js';
import Property from '../property/property.model.js';
import mongoose from 'mongoose';

export const place = async (req, res) => {
  try {
    const { error, value } = placeBidSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const bid = await bidService.placeBid(value, req.user._id);
    res.status(201).json({ success: true, data: bid, message: 'Bid placed successfully' });
  } catch (error) {
    console.error('[Bid] place error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await bidService.getBidHistory(req.params.auctionId, req.params.propertyId);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('[Bid] getHistory error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBids = async (req, res) => {
  try {
    const bids = await bidService.getMyBids(req.user._id);
    res.status(200).json({ success: true, data: bids });
  } catch (error) {
    console.error('[Bid] getMyBids error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHighBid = async (req, res) => {
  try {
    const bid = await bidService.getCurrentHighBid(req.params.auctionId, req.params.propertyId);
    res.status(200).json({ success: true, data: bid });
  } catch (error) {
    console.error('[Bid] getHighBid error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const retract = async (req, res) => {
  try {
    const bid = await bidService.retractBid(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: bid, message: 'Bid retracted' });
  } catch (error) {
    console.error('[Bid] retract error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await bidService.getBiddingStats(req.params.auctionId, req.params.propertyId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('[Bid] getStats error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBidsAdmin = async (req, res) => {
  try {
    const result = await bidService.getAllBids(req.query);
    res.status(200).json({ success: true, data: result.bids, pagination: result.pagination });
  } catch (error) {
    console.error('[Bid] getAllBidsAdmin error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBidsStatsAdmin = async (req, res) => {
  try {
    const stats = await bidService.getBidsStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('[Bid] getBidsStatsAdmin error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNextBidders = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { propertyId } = req.query;
    if (!propertyId) {
      return res.status(400).json({ success: false, message: "propertyId required" });
    }
    const bids = await Bid.find({
      auction: new mongoose.Types.ObjectId(auctionId),
      property: new mongoose.Types.ObjectId(propertyId),
      status: { $ne: "retracted" }
    })
      .sort({ amount: -1 })
      .populate("bidder", "name email phone bankDetails")
      .lean();

    const unique = [];
    const seen = new Set();
    for (const bid of bids) {
      const id = bid.bidder?._id?.toString();
      if (id && !seen.has(id)) {
        seen.add(id);
        unique.push({
          _id: id,
          name: bid.bidder.name,
          email: bid.bidder.email,
          phone: bid.bidder.phone,
          bidAmount: bid.amount,
          status: bid.status,
          bankDetails: bid.bidder.bankDetails,
        });
      }
    }
    const nextBidders = unique.slice(1, 4);
    res.json({ success: true, data: nextBidders });
  } catch (error) {
    console.error('[Bid] getNextBidders error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuctionPropertyStats = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const stats = await Bid.aggregate([
      { $match: {
        auction: new mongoose.Types.ObjectId(auctionId),
        status: { $ne: "retracted" }
      }},
      { $sort: { amount: -1 }},
      { $group: {
        _id: "$property",
        highestBid: { $max: "$amount" },
        totalBids: { $sum: 1 },
        winner: { $first: "$bidder" },
        winnerStatus: { $first: "$status" },
      }},
    ]);

    const User = (await import('../user/user.model.js')).default;
    const result = {};

    for (const s of stats) {
      let winnerData = null;
      if (s.winner && (s.winnerStatus === "won" || s.winnerStatus === "winning")) {
        const user = await User.findById(s.winner)
          .select("name email phone bankDetails").lean();
        winnerData = user;
      }

      const prop = await Property.findById(s._id)
        .select("pricing propertyTitle").lean();
      const reservePrice = prop?.pricing?.reservePrice || 0;
      const isSold = s.highestBid >= reservePrice && reservePrice > 0;

      result[s._id.toString()] = {
        highestBid: s.highestBid || 0,
        totalBids: s.totalBids || 0,
        winner: winnerData,
        isSold,
        reservePrice,
      };
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("[Bid] getAuctionPropertyStats error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuctionBidsAdmin = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const limit = parseInt(req.query.limit) || 200;

    const bids = await Bid.find({ auction: auctionId })
      .sort({ amount: -1 })
      .limit(limit)
      .populate("bidder", "name email phone")
      .populate("property", "propertyTitle location media")
      .populate("auction", "auctionTitle")
      .lean();

    res.json({ success: true, data: bids });
  } catch (error) {
    console.error("[Bid] getAuctionBidsAdmin error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const notifyNextBidder = async (req, res) => {
  try {
    const { propertyId, auctionId, message } = req.body;
    if (!propertyId || !auctionId) {
      return res.status(400).json({ success: false, message: "propertyId and auctionId required" });
    }

    const bids = await Bid.find({
      property: propertyId,
      auction: auctionId,
      status: { $in: ["lost", "outbid", "won"] },
    })
      .sort({ amount: -1 })
      .populate("bidder", "name email _id")
      .lean();

    if (bids.length < 2) {
      return res.status(400).json({ success: false, message: "No next bidder found" });
    }

    const property = await Property.findById(propertyId)
      .select("propertyTitle pricing currentBid slug")
      .lean();

    const uniqueBidders = [];
    const seen = new Set();
    for (const bid of bids) {
      const id = bid.bidder?._id?.toString();
      if (id && !seen.has(id)) { seen.add(id); uniqueBidders.push(bid); }
    }
    const nextBidders = uniqueBidders.slice(1, 4);

    if (nextBidders.length === 0) {
      return res.status(400).json({ success: false, message: "No other bidders found" });
    }

    const { sendEmail } = await import("../notifications/email.service.js");
    const { isNotificationEnabled } = await import("../settings/settings.service.js");
    const Notification = (await import("../notifications/notification.model.js")).default;
    const { emitToUser } = await import("../../socket.js");
    const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const enabled = await isNotificationEnabled("offerNotification");

    for (const bid of nextBidders) {
      if (!bid.bidder?.email) continue;

      if (enabled) {
        await sendEmail({
          to: bid.bidder.email,
          subject: `🏠 Property Available - ${property?.propertyTitle}`,
          templateKey: "offerNotification",
          variables: {
            bidder_name: bid.bidder.name,
            property_title: property?.propertyTitle || "Property",
            your_bid: `£${bid.amount?.toLocaleString()}`,
            property_url: `${siteUrl}/properties/${property?.slug || propertyId}`,
            custom_message: message || "The property is now available. Are you interested?",
            site_url: siteUrl,
          },
        }).catch(e => console.warn("Next bidder email failed:", e.message));
      }

      await Notification.create({
        type: "lead",
        icon: "home",
        message: `Property opportunity: ${property?.propertyTitle} may be available for you`,
        link: `/properties/${property?.slug || propertyId}`,
        color: "amber",
        targetUser: bid.bidder._id,
      }).catch(e => console.warn("Next bidder notification failed:", e.message));

      emitToUser(bid.bidder._id.toString(), "new_notification", {
        type: "lead",
        message: `Property opportunity: ${property?.propertyTitle}`,
        link: `/properties/${property?.slug || propertyId}`,
        color: "amber",
      });
    }

    res.json({
      success: true,
      message: `Notified ${nextBidders.length} bidder(s)`,
      notified: nextBidders.map(b => ({
        name: b.bidder.name,
        email: b.bidder.email,
        bidAmount: b.amount,
      })),
    });
  } catch (error) {
    console.error('[Bid] notifyNextBidder error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
