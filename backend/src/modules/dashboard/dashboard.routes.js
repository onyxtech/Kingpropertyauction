import express from 'express';
import { getStats, globalSearch, getNotifications } from './dashboard.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/search', protect, authorize('admin'), globalSearch);
router.get('/notifications', protect, authorize('admin'), getNotifications);

export default router;