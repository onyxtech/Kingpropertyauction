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
      setImmediate(async () => {
        try {
          console.log('[Auction] Running manual completion notifications for:', req.params.id);
          await completeAuction(req.params.id);
          notificationService
            .emit(NotificationEvents.AUCTION_ENDED, { auctionId: req.params.id })
            .catch(e => console.warn('Auction ended event failed:', e.message));
          console.log('[Auction] Manual completion notifications sent');
        } catch (err) {
          console.error('[Auction] Manual completion notification failed:', err.message);
        }
      });
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

