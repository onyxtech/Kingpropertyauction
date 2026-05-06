import express from 'express';
import { getStats } from './dashboard.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getStats);

export default router;