import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { checkAndCompleteEndedAuctions } from './modules/auction/auction.service.js';
import Auction from './modules/auction/auction.model.js';
import notificationService from './modules/notifications/trigger.service.js';
console.log('📧 Notification service initialized');

const PORT = process.env.PORT || 5000;

connectDB();

import { warmCache } from './modules/settings/settings.service.js';
await warmCache();

// ─── SMART AUCTION SCHEDULER ───
const scheduleNextCompletion = async () => {
  try {
    const nextAuction = await Auction.findOne({ status: 'live' })
      .sort({ endDateTime: 1 })
      .select('endDateTime');

    if (nextAuction) {
      const now = Date.now();
      const endTime = nextAuction.endDateTime.getTime();
      const delay = Math.max(endTime - now + 500, 500);

      console.log(`⏰ Next auction completion in ${Math.round(delay / 1000)}s`);

      setTimeout(async () => {
        console.log('⏰ Checking for ended auctions...');
        await checkAndCompleteEndedAuctions();
        scheduleNextCompletion();
      }, delay);
    } else {
      console.log('⏰ No live auctions, checking in 5 minutes');
      setTimeout(scheduleNextCompletion, 5 * 60 * 1000);
    }
  } catch (error) {
    console.error('Scheduler error:', error.message);
    setTimeout(scheduleNextCompletion, 60 * 1000);
  }
};

scheduleNextCompletion();
console.log('⏰ Smart auction scheduler started');

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});