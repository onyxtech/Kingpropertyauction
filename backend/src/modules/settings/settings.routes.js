import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import {
  getEmailSettingsController,
  updateEmailSettingsController,
  testEmailController,
  getNotificationRulesController,
  updateNotificationRulesController,
  getOAuthConfigController,
  updateOAuthConfigController,
} from './settings.controller.js';

const router = express.Router();

router.get('/email', protect, authorize('admin'), getEmailSettingsController);
router.put('/email', protect, authorize('admin'), updateEmailSettingsController);
router.post('/test', protect, authorize('admin'), testEmailController);
router.get('/rules', protect, authorize('admin'), getNotificationRulesController);
router.put('/rules', protect, authorize('admin'), updateNotificationRulesController);
router.get('/oauth', protect, authorize('admin'), getOAuthConfigController);
router.put('/oauth', protect, authorize('admin'), updateOAuthConfigController);

export default router;