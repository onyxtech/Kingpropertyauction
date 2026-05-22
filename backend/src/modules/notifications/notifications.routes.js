import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import {
  getAllTemplatesController,
  getTemplateController,
  updateTemplateController,
  resetTemplateController,
} from './notifications.controller.js';
import { markAsRead, markAllAsRead, getUnreadCount } from "./notifications.controller.js";

const router = express.Router();

router.get('/templates', protect, authorize('admin'), getAllTemplatesController);
router.get('/templates/:key', protect, authorize('admin'), getTemplateController);
router.put('/templates/:key', protect, authorize('admin'), updateTemplateController);
router.post('/templates/:key/reset', protect, authorize('admin'), resetTemplateController);
router.get("/unread-count", protect, getUnreadCount);
router.patch("/:id/read", protect, markAsRead);
router.patch("/read-all", protect, markAllAsRead);

export default router;