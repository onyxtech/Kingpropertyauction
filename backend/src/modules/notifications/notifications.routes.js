import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import {
  getAllTemplatesController,
  getTemplateController,
  updateTemplateController,
  resetTemplateController,
} from './notifications.controller.js';

const router = express.Router();

router.get('/templates', protect, authorize('admin'), getAllTemplatesController);
router.get('/templates/:key', protect, authorize('admin'), getTemplateController);
router.put('/templates/:key', protect, authorize('admin'), updateTemplateController);
router.post('/templates/:key/reset', protect, authorize('admin'), resetTemplateController);

export default router;