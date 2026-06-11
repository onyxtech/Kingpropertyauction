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
  getGooglePlacesKey,
} from './settings.controller.js';
import * as settingsService from './settings.service.js';

const router = express.Router();

router.get('/google-places-key', getGooglePlacesKey);

router.get('/email', protect, authorize('admin'), getEmailSettingsController);
router.put('/email', protect, authorize('admin'), updateEmailSettingsController);
router.post('/test', protect, authorize('admin'), testEmailController);
router.get('/rules', protect, authorize('admin'), getNotificationRulesController);
router.put('/rules', protect, authorize('admin'), updateNotificationRulesController);
router.get('/oauth', protect, authorize('admin'), getOAuthConfigController);
router.put('/oauth', protect, authorize('admin'), updateOAuthConfigController);

router.get('/integrations', protect, authorize('admin'), async (req, res) => {
  try {
    const data = await settingsService.getApiIntegrations();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/integrations', protect, authorize('admin'), async (req, res) => {
  try {
    await settingsService.updateApiIntegrations(req.body, req.user._id);
    res.json({ success: true, message: 'API integrations saved' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get('/general', protect, authorize('admin'), async (req, res) => {
  try {
    const data = await settingsService.getGeneralSettings();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/general', protect, authorize('admin'), async (req, res) => {
  try {
    const data = await settingsService.updateGeneralSettings(req.body, req.user._id);
    res.json({ success: true, data, message: 'General settings saved' });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

export default router;