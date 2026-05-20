import {
  createAuctionSchema,
  updateAuctionSchema,
} from "./auction.validation.js";
import * as auctionService from "./auction.service.js";
import Auction from "./auction.model.js";
import {
  completeAuction,
  checkAndCompleteEndedAuctions,
} from "./auction.service.js";
import notificationService, {
  NotificationEvents,
} from "../notifications/trigger.service.js";
import Property from "../property/property.model.js";
import User from "../user/user.model.js";
import { emitAuctionUpdate } from '../../socket.js';
import cache from '../../utils/cache.js';


export const create = async (req, res) => {
  try {
    const { error, value } = createAuctionSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const auction = await auctionService.createAuction(value, req.user._id);
    res.status(201).json({
      success: true,
      data: auction,
      message: "Auction created successfully",
    });
  } catch (error) {
    console.error('[Auction] create error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const result = await auctionService.getAuctions(req.query);
    res.status(200).json({
      success: true,
      data: result.auctions,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('[Auction] getAll error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    let auction = await Auction.findById(id)
      .populate("properties")
      .populate("createdBy", "name email")
      .populate("winningBidder", "name email")
      .catch(() => null);
    if (!auction) {
      auction = await Auction.findOne({ slug: id })
        .populate("properties")
        .populate("createdBy", "name email")
        .populate("winningBidder", "name email");
    }
    if (!auction) {
      return res
        .status(404)
        .json({ success: false, message: "Auction not found" });
    }
    res.status(200).json({ success: true, data: auction });
  } catch (error) {
    console.error('[Auction] getById error:', error.message);
    res.status(404).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { error, value } = updateAuctionSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    
    // Get current auction to check if status is changing to live
    const currentAuction = await Auction.findById(req.params.id);
    const wasNotLive = currentAuction?.status !== 'live';
    
    const auction = await auctionService.updateAuction(req.params.id, value);
    res.status(200).json({ success: true, data: auction, message: "Auction updated" });

    // If status changed to live, notify bidders, notify bidders
    if (wasNotLive && value.status === 'live') {
      notificationService.emit(NotificationEvents.AUCTION_STARTED, { auctionId: req.params.id })
        .catch(e => console.error('Auction started event failed:', e.message));
    }

    // If status changed to completed, run notifications async after response sent
    if (currentAuction?.status !== 'completed' && value.status === 'completed') {
      const isLiveRoom = currentAuction?.auctionType === 'live';
      if (!isLiveRoom) {
        // Only run completeAuction for online auctions — live room results entered manually via /live-results
        setImmediate(async () => {
          try {
            console.log('[Auction] Running manual completion notifications for:', req.params.id);
            await completeAuction(req.params.id);
            console.log('[Auction] Manual completion notifications sent');
          } catch (err) {
            console.error('[Auction] Manual completion notification failed:', err.message);
          }
        });
      } else {
        console.log('[Auction] Live room auction completed — results to be entered manually');
      }
    }
  } catch (error) {
    console.error('[Auction] update error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await auctionService.deleteAuction(req.params.id);
    res.status(200).json({ success: true, message: "Auction deleted" });
  } catch (error) {
    console.error('[Auction] remove error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const start = async (req, res) => {
  try {
    const auction = await auctionService.startAuction(req.params.id);
    res
      .status(200)
      .json({ success: true, data: auction, message: "Auction started" });

    // Notify bidders
    notificationService
      .emit(NotificationEvents.AUCTION_STARTED, { auctionId: req.params.id })
      .catch((e) => console.error("Auction started event failed:", e.message));
  } catch (error) {
    console.error('[Auction] start error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const end = async (req, res) => {
  try {
    const auction = await auctionService.endAuction(req.params.id);
    res
      .status(200)
      .json({ success: true, data: auction, message: "Auction ended" });
  } catch (error) {
    console.error('[Auction] end error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancel = async (req, res) => {
  try {
    const auction = await auctionService.cancelAuction(req.params.id);
    res
      .status(200)
      .json({ success: true, data: auction, message: "Auction cancelled" });
  } catch (error) {
    console.error('[Auction] cancel error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const completeAuctionController = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (auction?.auctionType === 'live') {
      // Live room: just mark as completed — no bid processing, results entered manually
      await Auction.findByIdAndUpdate(req.params.id, { status: 'completed' });
      await cache.delPattern('auctions:*');
      await cache.del(`auction:${req.params.id}`);
      emitAuctionUpdate(req.params.id, { status: 'completed' });
      return res.status(200).json({
        success: true,
        message: 'Live room auction marked as completed. Enter results manually.',
      });
    }
    const result = await completeAuction(req.params.id);
    res.status(200).json({
      success: true,
      data: result,
      message: "Auction completed successfully",
    });
  } catch (error) {
    console.error('[Auction] completeAuction error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkEndedAuctionsController = async (req, res) => {
  try {
    const results = await checkAndCompleteEndedAuctions();
    res.status(200).json({
      success: true,
      data: results,
      message: `Checked ended auctions. ${results.length} completed.`,
    });
  } catch (error) {
    console.error('[Auction] checkEndedAuctions error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveLiveAuctionResults = async (req, res) => {
  try {
    const { id } = req.params;
    const { results } = req.body;

    if (!results || !Array.isArray(results)) {
      return res.status(400).json({ success: false, message: 'Results array is required' });
    }

    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ success: false, message: 'Auction not found' });

    // Validate sold prices before processing anything
    for (const result of results) {
      if (result.status === 'sold') {
        const soldPrice = Number(result.soldPrice);
        if (!soldPrice || soldPrice <= 0) {
          return res.status(400).json({ success: false, message: `Sold price must be greater than 0 for sold properties` });
        }
      }
    }

    const isLiveRoom = auction.auctionType === 'live';
    const { sendEmail } = await import('../notifications/email.service.js');

    for (const result of results) {
      if (!result.id) continue;

      if (result.status === 'sold') {
        const soldPrice = Number(result.soldPrice);

        await Property.findByIdAndUpdate(result.id, {
          propertyStatus: 'sold',
          currentBid: soldPrice,
          'auctionDetails.auctionStatus': 'closed',
        });

        // For live room: send emails directly; skip generic PROPERTY_SOLD event (would send duplicate seller email)
        if (!isLiveRoom) {
          notificationService.emit(NotificationEvents.PROPERTY_SOLD, {
            propertyId: result.id,
          }).catch(() => {});
        }

        // Seller email
        try {
          const prop = await Property.findById(result.id).populate('createdBy', 'name email');
          const seller = prop?.createdBy;
          if (seller?.email) {
            await sendEmail({
              to: seller.email,
              subject: `✅ Your Property Sold — ${prop.propertyTitle}`,
              templateKey: 'propertySold',
              variables: {
                user_name: seller.name,
                property_title: prop.propertyTitle,
                final_price: `£${soldPrice.toLocaleString()}`,
                auction_name: auction.auctionTitle || '',
                site_url: process.env.CLIENT_URL || 'http://localhost:5173',
              },
            });
          }
        } catch (e) {
          console.error('Seller email failed:', e.message);
        }

        // Winner email
        if (result.winnerEmail) {
          const property = await Property.findById(result.id);
          await sendEmail({
            to: result.winnerEmail,
            subject: `🎉 Congratulations! You Won — ${property?.propertyTitle || 'Property'}`,
            templateKey: 'auctionWon',
            variables: {
              user_name: result.winnerName || 'Bidder',
              property_title: property?.propertyTitle || '',
              winning_bid: `£${soldPrice.toLocaleString()}`,
              final_price: `£${soldPrice.toLocaleString()}`,
              auction_name: auction.auctionTitle || '',
              site_url: process.env.CLIENT_URL || 'http://localhost:5173',
            },
          }).catch(e => console.error('Winner email failed:', e.message));
        }
      } else {
        await Property.findByIdAndUpdate(result.id, {
          propertyStatus: 'available',
          'auctionDetails.auctionStatus': 'closed',
          currentBid: 0,
          totalBids: 0,
          winningBidder: null,
          soldPrice: null,
        });

        if (!isLiveRoom) {
          // Online auction: use standard notification event
          notificationService.emit(NotificationEvents.PROPERTY_UNSOLD, {
            propertyId: result.id,
          }).catch(() => {});
        } else {
          // Live room unsold: send custom email directly to seller
          try {
            const prop = await Property.findById(result.id).populate('createdBy', 'name email');
            const seller = prop?.createdBy;
            if (seller?.email) {
              await sendEmail({
                to: seller.email,
                subject: `❌ Auction Result — ${prop.propertyTitle}`,
                templateKey: 'propertyUnsold',
                variables: {
                  user_name: seller.name,
                  property_title: prop.propertyTitle,
                  highest_bid: `£${(prop.currentBid || 0).toLocaleString()}`,
                  reserve_price: `£${(prop.pricing?.reservePrice || 0).toLocaleString()}`,
                },
              });
            }
          } catch (e) {
            console.error('Live room unsold seller email failed:', e.message);
          }
        }
      }
    }

    await Auction.findByIdAndUpdate(id, { status: 'completed' });
    await cache.delPattern('auctions:*');
    await cache.delPattern('properties:*');
    emitAuctionUpdate(id, { status: 'completed' });

    res.status(200).json({ success: true, message: 'Results saved and notifications sent' });
  } catch (error) {
    console.error('[Auction] saveLiveResults error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
