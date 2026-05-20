import { Queue } from 'bullmq';
import { redisConnection } from '../../config/redis.js';

// Create auction queue
export const auctionQueue = new Queue('auction-jobs', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 500,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Schedule auction start job
export const scheduleAuctionStart = async (auctionId, startDateTime, auctionTitle) => {
  const delay = Math.max(new Date(startDateTime).getTime() - Date.now(), 0);

  // Remove existing job for this auction if any
  await removeAuctionJobs(auctionId);

  if (delay > 0) {
    await auctionQueue.add(
      'start-auction',
      { auctionId: auctionId.toString(), auctionTitle },
      {
        delay,
        jobId: `start-${auctionId}`,
        attempts: 3,
      }
    );
    console.log(`🔵 Auction start scheduled: "${auctionTitle}" in ${Math.round(delay / 1000)}s`);
  } else {
    // Already past start time - start immediately
    await auctionQueue.add(
      'start-auction',
      { auctionId: auctionId.toString(), auctionTitle },
      {
        jobId: `start-${auctionId}-immediate`,
        attempts: 3,
      }
    );
  }
};

// Schedule auction end job
export const scheduleAuctionEnd = async (auctionId, endDateTime, auctionTitle) => {
  const delay = Math.max(new Date(endDateTime).getTime() - Date.now(), 0);

  if (delay > 0) {
    await auctionQueue.add(
      'end-auction',
      { auctionId: auctionId.toString(), auctionTitle },
      {
        delay,
        jobId: `end-${auctionId}`,
        attempts: 3,
      }
    );
    console.log(`⏰ Auction end scheduled: "${auctionTitle}" in ${Math.round(delay / 1000)}s`);
  }
};

// Remove all jobs for an auction (when updated/cancelled)
export const removeAuctionJobs = async (auctionId) => {
  try {
    const startJob = await auctionQueue.getJob(`start-${auctionId}`);
    if (startJob) await startJob.remove();

    const endJob = await auctionQueue.getJob(`end-${auctionId}`);
    if (endJob) await endJob.remove();
  } catch (e) {
    // Jobs may not exist, ignore
  }
};

export default auctionQueue;
