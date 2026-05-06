import express from 'express';
import { place, getHistory, getMyBids, getHighBid, retract, getStats } from './bid.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, place);
router.get('/my-bids', protect, getMyBids);
router.get('/auction/:auctionId', getHistory);
router.get('/auction/:auctionId/property/:propertyId', getHistory);  // NEW
router.get('/auction/:auctionId/high', getHighBid);
router.get('/auction/:auctionId/property/:propertyId/high', getHighBid);  // NEW
router.get('/auction/:auctionId/stats', getStats);
router.get('/auction/:auctionId/property/:propertyId/stats', getStats);  // NEW
router.patch('/:id/retract', protect, retract);

export default router;