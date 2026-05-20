import { redisConnection } from '../config/redis.js';

const DEFAULT_TTL = 60; // 60 seconds default cache

export const cache = {
  // Get cached value
  get: async (key) => {
    try {
      const data = await redisConnection.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Cache get error:', err.message);
      return null;
    }
  },

  // Set cached value with TTL
  set: async (key, value, ttl = DEFAULT_TTL) => {
    try {
      await redisConnection.setex(key, ttl, JSON.stringify(value));
    } catch (err) {
      console.error('Cache set error:', err.message);
    }
  },

  // Delete a single cached value
  del: async (key) => {
    try {
      await redisConnection.del(key);
    } catch (err) {
      console.error('Cache del error:', err.message);
    }
  },

  // Delete all keys matching a glob pattern
  delPattern: async (pattern) => {
    try {
      const keys = await redisConnection.keys(pattern);
      if (keys.length > 0) {
        await redisConnection.del(...keys);
      }
    } catch (err) {
      console.error('Cache delPattern error:', err.message);
    }
  },
};

export default cache;
