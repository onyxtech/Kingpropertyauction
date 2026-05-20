import IORedis from 'ioredis';

// IORedis connection for BullMQ (maxRetriesPerRequest: null required by BullMQ)
export const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Create a fresh IORedis connection (for Socket.io adapter pub/sub pair)
export const createRedisClient = () => new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redisConnection.on('connect', () => {
  console.log('✅ Redis connected (BullMQ)');
});

redisConnection.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});

export default redisConnection;
