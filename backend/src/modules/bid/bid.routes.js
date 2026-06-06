import express from 'express';
import { place, getHistory, getMyBids, getHighBid, retract, getStats, getAllBidsAdmin, getBidsStatsAdmin, notifyNextBidder, getAuctionPropertyStats, getNextBidders, getAuctionBidsAdmin } from './bid.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { bidRateLimit } from '../../middlewares/rateLimiter.middleware.js';

const router = express.Router();

// Public routes
router.get('/auction/:auctionId', getHistory);
router.get('/auction/:auctionId/property/:propertyId', getHistory);
router.get('/auction/:auctionId/high', getHighBid);
router.get('/auction/:auctionId/property/:propertyId/high', getHighBid);
router.get('/auction/:auctionId/stats', getStats);
router.get('/auction/:auctionId/property/:propertyId/stats', getStats);

// Protected routes
router.post('/', protect, bidRateLimit, place);
router.get('/my-bids', protect, getMyBids);
router.patch('/:id/retract', protect, retract);

// Admin routes
router.get('/auction/:auctionId/admin-bids', protect, authorize('admin'), getAuctionBidsAdmin);
router.get('/admin/all', protect, authorize('admin'), getAllBidsAdmin);
router.get('/admin/stats', protect, authorize('admin'), getBidsStatsAdmin);
router.post('/notify-next-bidder', protect, authorize('admin'), notifyNextBidder);
router.get('/auction/:auctionId/property-stats', protect, authorize('admin'), getAuctionPropertyStats);
router.get('/auction/:auctionId/next-bidders', protect, authorize('admin'), getNextBidders);

export default router;