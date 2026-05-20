import { Worker } from 'bullmq';
import { redisConnection } from '../../config/redis.js';
import { placeBid } from './bid.service.js';

let bidWorker = null;

export const startBidWorker = () => {
  bidWorker = new Worker(
    'bid-jobs',
    async (job) => {
      const { bidData, userId } = job.data;

      console.log(`🔨 Processing bid: £${bidData.amount?.toLocaleString()} by user ${userId}`);

      const result = await placeBid(bidData, userId);

      console.log(`✅ Bid processed: £${bidData.amount?.toLocaleString()}`);

      return result;
    },
    {
      connection: redisConnection,
      concurrency: 1, // Process ONE bid at a time — guarantees exact ordering, no race conditions
    }
  );

  bidWorker.on('completed', (job) => {
    console.log(`✅ Bid job completed [${job.id}]`);
  });

  bidWorker.on('failed', (job, err) => {
    console.error(`❌ Bid job failed [${job?.id}]:`, err.message);
  });

  bidWorker.on('error', (err) => {
    console.error('❌ Bid worker error:', err.message);
  });

  console.log('🔨 Bid worker started');
  return bidWorker;
};

export const stopBidWorker = async () => {
  if (bidWorker) {
    await bidWorker.close();
    console.log('🔨 Bid worker stopped');
  }
};

export default startBidWorker;
