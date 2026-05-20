import { Worker } from 'bullmq';
import { redisConnection } from '../../config/redis.js';
import { sendCampaign } from './campaign.service.js';

let worker = null;

export const startCampaignWorker = () => {
  worker = new Worker(
    'campaign-jobs',
    async (job) => {
      if (job.name === 'send-campaign') {
        const { campaignId } = job.data;
        console.log(`📧 Sending scheduled campaign: ${campaignId}`);
        try {
          const result = await sendCampaign(campaignId);
          console.log(`✅ Campaign sent: ${result.campaign} - ${result.sent} emails`);
        } catch (err) {
          console.error(`❌ Campaign failed: ${err.message}`);
          throw err;
        }
      }
    },
    { connection: redisConnection, concurrency: 3 }
  );

  worker.on('completed', (job) => console.log(`✅ Campaign job done: ${job.id}`));
  worker.on('failed', (job, err) => console.error(`❌ Campaign job failed: ${job?.id}`, err.message));
};

export const stopCampaignWorker = () => {
  if (worker) worker.close();
};