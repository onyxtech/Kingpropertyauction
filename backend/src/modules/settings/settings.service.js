import Settings, {
  EmailConfigSchema,
  NotificationRulesSchema,
  OAuthConfigSchema,
  ApiIntegrationsSchema,
  GeneralSchema,
} from "./settings.model.js";
import cache from "../../utils/cache.js";

const SETTINGS_TTL = 5 * 60; // 5 minutes in seconds

// ─── Default Values ───
const defaultEmailConfig = EmailConfigSchema.parse({});
const defaultNotificationRules = NotificationRulesSchema.parse({});
const defaultOAuthConfig = OAuthConfigSchema.parse({});
const defaultGeneralSettings = GeneralSchema.parse({});

// ─── Core Functions ───
export const getSetting = async (key) => {
  const cached = await cache.get(`setting:${key}`);
  if (cached) return cached;

  const setting = await Settings.findOne({ key });

  let value;
  if (!setting) {
    if (key === "email_config") value = defaultEmailConfig;
    else if (key === "notification_rules") value = defaultNotificationRules;
    else if (key === "oauth_config") value = defaultOAuthConfig;
    else if (key === "general") value = defaultGeneralSettings;
    else return null;
  } else {
    value = setting.value;
  }

  await cache.set(`setting:${key}`, value, SETTINGS_TTL);
  return value;
};

export const updateSetting = async (key, value, userId) => {
  // Validate based on key
  if (key === "email_config") {
    value = EmailConfigSchema.parse({ ...defaultEmailConfig, ...value });
  } else if (key === "notification_rules") {
    value = NotificationRulesSchema.parse({
      ...defaultNotificationRules,
      ...value,
    });
  }

  const setting = await Settings.findOneAndUpdate(
    { key },
    { value, updatedBy: userId },
    { upsert: true, new: true, runValidators: true },
  );

  await cache.del(`setting:${key}`);

  return setting.value;
};

// ─── Convenience Functions ───
export const getEmailSettings = async () => {
  return await getSetting("email_config");
};

export const updateEmailSettings = async (data, userId) => {
  const current = await getSetting("email_config");
  const updated = { ...current, ...data };
  return await updateSetting("email_config", updated, userId);
};

export const getNotificationRules = async () => {
  return await getSetting("notification_rules");
};

export const updateNotificationRules = async (rules, userId) => {
  const current = await getSetting("notification_rules");
  const updated = { ...current, ...rules };
  return await updateSetting("notification_rules", updated, userId);
};

export const isNotificationEnabled = async (ruleKey) => {
  const rules = await getSetting("notification_rules");
  return rules?.[ruleKey] !== false;
};

// ─── Cache Management ───
export const invalidateCache = async (key) => {
  if (key) {
    await cache.del(`setting:${key}`);
  } else {
    await cache.delPattern('setting:*');
  }
};

export const warmCache = async () => {
  await getSetting("email_config");
  await getSetting("notification_rules");
  console.log("✅ Settings cache warmed");
};

// ─── API Integrations ───
export const getApiIntegrations = async () => {
  const setting = await Settings.findOne({ key: 'api_integrations' });
  if (!setting) {
    return ApiIntegrationsSchema.parse({
      groqApiKey: process.env.GROQ_API_KEY || '',
      geminiApiKey: process.env.GEMINI_API_KEY || '',
    });
  }
  return setting.value;
};

export const updateApiIntegrations = async (data, userId) => {
  const validated = ApiIntegrationsSchema.parse({ ...ApiIntegrationsSchema.parse({}), ...data });
  return Settings.findOneAndUpdate(
    { key: 'api_integrations' },
    { value: validated, updatedBy: userId },
    { upsert: true, new: true, runValidators: true },
  );
};

// ─── General Settings ───
export const getGeneralSettings = async () => {
  return await getSetting("general");
};

export const updateGeneralSettings = async (data, userId) => {
  const current = (await getSetting("general")) || defaultGeneralSettings;
  const updated = GeneralSchema.parse({ ...current, ...data });
  return await updateSetting("general", updated, userId);
};

// ─── OAuth Convenience ───
export const getOAuthConfig = async () => {
  return await getSetting("oauth_config");
};

export const updateOAuthConfig = async (data, userId) => {
  const current = await getSetting("oauth_config");
  const updated = { ...current, ...data };
  return await updateSetting("oauth_config", updated, userId);
};
