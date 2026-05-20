import { placeBidSchema } from './bid.validation.js';
import * as bidService from './bid.service.js';

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
