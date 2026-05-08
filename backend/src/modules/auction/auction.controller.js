import {
  createAuctionSchema,
  updateAuctionSchema,
} from "./auction.validation.js";
import * as auctionService from "./auction.service.js";
import Auction from "./auction.model.js";
import { completeAuction, checkAndCompleteEndedAuctions } from './auction.service.js';

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
    res.status(404).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { error, value } = updateAuctionSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const auction = await auctionService.updateAuction(req.params.id, value);
    res
      .status(200)
      .json({ success: true, data: auction, message: "Auction updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await auctionService.deleteAuction(req.params.id);
    res.status(200).json({ success: true, message: "Auction deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const start = async (req, res) => {
  try {
    const auction = await auctionService.startAuction(req.params.id);
    res
      .status(200)
      .json({ success: true, data: auction, message: "Auction started" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const end = async (req, res) => {
  try {
    const auction = await auctionService.endAuction(req.params.id);
    res
      .status(200)
      .json({ success: true, data: auction, message: "Auction ended" });
  } catch (error) {
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
    res.status(500).json({ success: false, message: error.message });
  }
};


export const completeAuctionController = async (req, res) => {
  try {
    const result = await completeAuction(req.params.id);
    res.status(200).json({ success: true, data: result, message: 'Auction completed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkEndedAuctionsController = async (req, res) => {
  try {
    const results = await checkAndCompleteEndedAuctions();
    res.status(200).json({ 
      success: true, 
      data: results, 
      message: `Checked ended auctions. ${results.length} completed.` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
