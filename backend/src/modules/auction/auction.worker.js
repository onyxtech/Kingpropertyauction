import { Worker } from 'bullmq';
import { redisConnection } from '../../config/redis.js';
import Auction from './auction.model.js';
import { checkAndCompleteEndedAuctions } from './auction.service.js';
import notificationService, { NotificationEvents } from '../notifications/trigger.service.js';
import { emitAuctionUpdate } from '../../socket.js';

let worker = null;

export const startAuctionWorker = () => {
  worker = new Worker(
    'auction-jobs',
    async (job) => {
      const { auctionId, auctionTitle } = job.data;

      if (job.name === 'start-auction') {
        console.log(`🔵 Processing auction start: ${auctionTitle}`);

        const auction = await Auction.findOneAndUpdate(
          { _id: auctionId, status: 'scheduled' },
          { status: 'live' },
          { new: true }
        );

        if (auction) {
          console.log(`✅ Auction started: ${auction.auctionTitle}`);

          // Emit socket update to all connected clients
          emitAuctionUpdate(auction._id.toString(), { status: 'live' });

          // Send notification emails
          notificationService
            .emit(NotificationEvents.AUCTION_STARTED, { auctionId: auction._id })
            .catch(() => {});

          // Schedule the end job
          const { scheduleAuctionEnd } = await import('./auction.queue.js');
          await scheduleAuctionEnd(
            auction._id,
            auction.endDateTime,
            auction.auctionTitle
          );
        } else {
          console.log(`⚠️ Auction ${auctionId} not found or already started`);
        }
      }

      if (job.name === 'end-auction') {
        console.log(`⏰ Processing auction end: ${auctionTitle}`);

        const auction = await Auction.findById(auctionId);
        if (auction && auction.status === 'live') {
          await checkAndCompleteEndedAuctions();
          emitAuctionUpdate(auctionId, { status: 'completed' });

          notificationService
            .emit(NotificationEvents.AUCTION_ENDED, { auctionId: auction._id })
            .catch(e => console.warn('Auction ended event failed:', e.message));

          console.log(`✅ Auction completed: ${auctionTitle}`);
        }
      }
    },
    {
      connection: redisConnection,
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Job completed: ${job.name} [${job.id}]`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job failed: ${job?.name} [${job?.id}]:`, err.message);
  });

  worker.on('error', (err) => {
    console.error('❌ Worker error:', err.message);
  });

  console.log('🔧 Auction worker started');
  return worker;
};

export const stopAuctionWorker = async () => {
  if (worker) {
    await worker.close();
    console.log('🔧 Auction worker stopped');
  }
};

export default startAuctionWorker;
