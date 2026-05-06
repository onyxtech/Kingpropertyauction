import { placeBidSchema } from './bid.validation.js';
import * as bidService from './bid.service.js';

export const place = async (req, res) => {
  try {
    const { error, value } = placeBidSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const bid = await bidService.placeBid(value, req.user._id);
    res.status(201).json({ success: true, data: bid, message: 'Bid placed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await bidService.getBidHistory(req.params.auctionId, req.params.propertyId);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBids = async (req, res) => {
  try {
    const bids = await bidService.getMyBids(req.user._id);
    res.status(200).json({ success: true, data: bids });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHighBid = async (req, res) => {
  try {
    const bid = await bidService.getCurrentHighBid(req.params.auctionId, req.params.propertyId);
    res.status(200).json({ success: true, data: bid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const retract = async (req, res) => {
  try {
    const bid = await bidService.retractBid(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: bid, message: 'Bid retracted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await bidService.getBiddingStats(req.params.auctionId, req.params.propertyId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};