import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import {
  getEmailSettingsController,
  updateEmailSettingsController,
  testEmailController,
  getNotificationRulesController,
  updateNotificationRulesController,
} from './settings.controller.js';

const router = express.Router();

router.get('/email', protect, authorize('admin'), getEmailSettingsController);
router.put('/email', protect, authorize('admin'), updateEmailSettingsController);
router.post('/test', protect, authorize('admin'), testEmailController);
router.get('/rules', protect, authorize('admin'), getNotificationRulesController);
router.put('/rules', protect, authorize('admin'), updateNotificationRulesController);

export default router;