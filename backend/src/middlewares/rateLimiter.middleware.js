import { redisConnection } from '../config/redis.js';

// Rate limit bids per user: max 2 bids per 3 seconds
export const bidRateLimit = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) return next();

    const key = `bid_rate:${userId}`;
    const limit = 2; // max bids
    const window = 3; // seconds

    const current = await redisConnection.incr(key);

    if (current === 1) {
      // First request in this window — set expiry
      await redisConnection.expire(key, window);
    }

    if (current > limit) {
      const ttl = await redisConnection.ttl(key);
      return res.status(429).json({
        success: false,
        message: `Too many bids. Please wait ${ttl} seconds before bidding again.`,
      });
    }

    next();
  } catch (err) {
    // If Redis fails, allow the request through
    console.error('Rate limiter error:', err.message);
    next();
  }
};

// General API rate limit: max 100 requests per minute per IP
export const apiRateLimit = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const key = `api_rate:${ip}`;
    const limit = 100;
    const window = 60; // seconds

    const current = await redisConnection.incr(key);
    if (current === 1) {
      await redisConnection.expire(key, window);
    }

    if (current > limit) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current));

    next();
  } catch (err) {
    // If Redis fails, allow the request through
    console.error('API rate limiter error:', err.message);
    next();
  }
};
