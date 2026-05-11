import * as settingsService from "./settings.service.js";
import * as emailService from "../notifications/email.service.js";

export const getEmailSettingsController = async (req, res) => {
  try {
    const settings = await settingsService.getEmailSettings();
    const safeSettings = {
      ...settings,
      password: settings.password ? "••••••••" : "",
    };
    res.json({ success: true, data: safeSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEmailSettingsController = async (req, res) => {
  try {
    if (req.body.password === "••••••••") {
      const current = await settingsService.getEmailSettings();
      req.body.password = current.password;
    }
    const settings = await settingsService.updateEmailSettings(
      req.body,
      req.user._id,
    );
    res.json({
      success: true,
      data: settings,
      message: "Email settings updated",
    });
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
    const rules = await settingsService.updateNotificationRules(
      req.body,
      req.user._id,
    );
    res.json({ success: true, data: rules, message: "Rules updated" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOAuthConfigController = async (req, res) => {
  try {
    const config = await settingsService.getOAuthConfig();
    const safeConfig = {
      google: {
        ...config.google,
        clientSecret: config.google.clientSecret ? "••••••••" : "",
      },
      github: {
        ...config.github,
        clientSecret: config.github.clientSecret ? "••••••••" : "",
      },
      facebook: {
        ...config.facebook,
        clientSecret: config.facebook.clientSecret ? "••••••••" : "",
      },
    };
    res.json({ success: true, data: safeConfig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOAuthConfigController = async (req, res) => {
  try {
    const current = await settingsService.getOAuthConfig();
    // Preserve secrets if masked OR empty (meaning user didn't re-enter)
    if (
      !req.body.google?.clientSecret ||
      req.body.google?.clientSecret === "••••••••"
    ) {
      req.body.google.clientSecret = current.google?.clientSecret || "";
    }
    if (
      !req.body.github?.clientSecret ||
      req.body.github?.clientSecret === "••••••••"
    ) {
      req.body.github.clientSecret = current.github?.clientSecret || "";
    }
    if (
      !req.body.facebook?.clientSecret ||
      req.body.facebook?.clientSecret === "••••••••"
    ) {
      req.body.facebook.clientSecret = current.facebook?.clientSecret || "";
    }
    const config = await settingsService.updateOAuthConfig(
      req.body,
      req.user._id,
    );
    res.json({
      success: true,
      data: config,
      message: "OAuth settings updated",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
