import express from 'express';
import { create, getAll, getById, update, remove, approve, getByIds, getMyProperties, getMyPropertyAuctionStats, toggleWatchlist, getWatchlist, getMyPropertyBidders } from './property.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

// Allow if admin/agent/seller by role OR if user has canListProperties permission
const canManageProperty = (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ success: false, message: "Not authenticated" });
  const hasRole = ["admin", "agent", "seller"].includes(user.role);
  const hasPermission = user.permissions?.canListProperties === true;
  if (hasRole || hasPermission) return next();
  return res.status(403).json({ success: false, message: "You don't have permission to manage properties" });
};

// Specific routes BEFORE wildcard /:id
router.get('/my', protect, getMyProperties);
router.get('/my/auction-stats', protect, getMyPropertyAuctionStats);
router.get('/my/bidders', protect, getMyPropertyBidders);
router.get('/watchlist', protect, getWatchlist);
router.post('/batch', getByIds);

// Public routes
router.get('/', getAll);
router.get('/:id', getById);

// Protected routes
router.post('/', protect, canManageProperty, create);
router.put('/:id', protect, canManageProperty, update);
router.delete('/:id', protect, authorize('admin'), remove);
router.patch('/:id/approve', protect, authorize('admin'), approve);
router.post('/:id/watchlist', protect, toggleWatchlist);

export default router;