import * as settingsService from './settings.service.js';
import * as emailService from '../notifications/email.service.js';

export const getEmailSettingsController = async (req, res) => {
  try {
    const settings = await settingsService.getEmailSettings();
    // Never expose password in response
    const safeSettings = { ...settings, password: settings.password ? '••••••••' : '' };
    res.json({ success: true, data: safeSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEmailSettingsController = async (req, res) => {
  try {
    // If password is masked, keep the current one
    if (req.body.password === '••••••••') {
      const current = await settingsService.getEmailSettings();
      req.body.password = current.password;
    }
    const settings = await settingsService.updateEmailSettings(req.body, req.user._id);
    res.json({ success: true, data: settings, message: 'Email settings updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const testEmailController = async (req, res) => {
  try {
    const result = await emailService.testEmailConnection(req.body.testEmail);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotificationRulesController = async (req, res) => {
  try {
    const rules = await settingsService.getNotificationRules();
    res.json({ success: true, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNotificationRulesController = async (req, res) => {
  try {
    const rules = await settingsService.updateNotificationRules(req.body, req.user._id);
    res.json({ success: true, data: rules, message: 'Rules updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};