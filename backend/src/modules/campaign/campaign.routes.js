import express from 'express';
import { create, getAll, getById, update, remove, duplicate, send, sendTest, getStats, getTemplates, getProperties, getAuctions, trackOpen, trackClick, unsubscribe } from './campaign.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

// Public
router.get('/track/open/:campaignId', trackOpen);
router.get('/track/click/:campaignId', trackClick);
router.get('/unsubscribe', unsubscribe);

// Admin only
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/templates', protect, authorize('admin'), getTemplates);
router.get('/properties', protect, authorize('admin'), getProperties);
router.get('/auctions', protect, authorize('admin'), getAuctions);
router.post('/', protect, authorize('admin'), create);
router.get('/', protect, authorize('admin'), getAll);
router.get('/:id', protect, authorize('admin'), getById);
router.put('/:id', protect, authorize('admin'), update);
router.delete('/:id', protect, authorize('admin'), remove);
router.post('/:id/duplicate', protect, authorize('admin'), duplicate);
router.post('/:id/send', protect, authorize('admin'), send);
router.post('/:id/test', protect, authorize('admin'), sendTest);

export default router;