import { Queue } from 'bullmq';
import { redisConnection } from '../../config/redis.js';

// Bid queue - processes bids in exact FIFO order
export const bidQueue = new Queue('bid-jobs', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 1000,
    removeOnFail: 500,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 500,
    },
  },
});

// Add bid to queue — returns the job ID for tracking
export const enqueueBid = async (bidData, userId) => {
  const job = await bidQueue.add(
    'place-bid',
    { bidData, userId },
    {
      // BullMQ processes jobs in FIFO order — earlier bids are processed first
      timestamp: Date.now(),
    }
  );
  return job.id;
};

export default bidQueue;
