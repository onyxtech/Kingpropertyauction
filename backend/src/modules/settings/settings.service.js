import Settings, { EmailConfigSchema, NotificationRulesSchema } from './settings.model.js';

// ─── In-Memory Cache (Production: swap with Redis) ───
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cacheTimestamps = new Map();

const getFromCache = (key) => {
  const timestamp = cacheTimestamps.get(key);
  if (timestamp && Date.now() - timestamp < CACHE_TTL) {
    return cache.get(key);
  }
  cache.delete(key);
  cacheTimestamps.delete(key);
  return null;
};

const setCache = (key, value) => {
  cache.set(key, value);
  cacheTimestamps.set(key, Date.now());
};

const clearCache = (key) => {
  cache.delete(key);
  cacheTimestamps.delete(key);
};

// ─── Default Values ───
const defaultEmailConfig = EmailConfigSchema.parse({});
const defaultNotificationRules = NotificationRulesSchema.parse({});

// ─── Core Functions ───
export const getSetting = async (key) => {
  // Check cache first
  const cached = getFromCache(key);
  if (cached) return cached;

  // Fetch from DB
  const setting = await Settings.findOne({ key });
  
  let value;
  if (!setting) {
    // Return defaults if not set
    if (key === 'email_config') value = defaultEmailConfig;
    else if (key === 'notification_rules') value = defaultNotificationRules;
    else return null;
  } else {
    value = setting.value;
  }

  // Cache for next time
  setCache(key, value);
  return value;
};

export const updateSetting = async (key, value, userId) => {
  // Validate based on key
  if (key === 'email_config') {
    value = EmailConfigSchema.parse({ ...defaultEmailConfig, ...value });
  } else if (key === 'notification_rules') {
    value = NotificationRulesSchema.parse({ ...defaultNotificationRules, ...value });
  }

  const setting = await Settings.findOneAndUpdate(
    { key },
    { value, updatedBy: userId },
    { upsert: true, new: true, runValidators: true }
  );

  // Invalidate cache
  clearCache(key);

  return setting.value;
};

// ─── Convenience Functions ───
export const getEmailSettings = async () => {
  return await getSetting('email_config');
};

export const updateEmailSettings = async (data, userId) => {
  const current = await getSetting('email_config');
  const updated = { ...current, ...data };
  return await updateSetting('email_config', updated, userId);
};

export const getNotificationRules = async () => {
  return await getSetting('notification_rules');
};

export const updateNotificationRules = async (rules, userId) => {
  const current = await getSetting('notification_rules');
  const updated = { ...current, ...rules };
  return await updateSetting('notification_rules', updated, userId);
};

export const isNotificationEnabled = async (ruleKey) => {
  const rules = await getSetting('notification_rules');
  return rules?.[ruleKey] !== false;
};

// ─── Cache Management ───
export const invalidateCache = (key) => {
  if (key) {
    clearCache(key);
  } else {
    cache.clear();
    cacheTimestamps.clear();
  }
};

export const warmCache = async () => {
  await getSetting('email_config');
  await getSetting('notification_rules');
  console.log('✅ Settings cache warmed');
};