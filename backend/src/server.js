import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import Auction from "./modules/auction/auction.model.js";
import Property from "./modules/property/property.model.js";
import { warmCache } from "./modules/settings/settings.service.js";
import { initSocket } from "./socket.js";
import { redisConnection } from "./config/redis.js";
import { scheduleAuctionStart, scheduleAuctionEnd } from "./modules/auction/auction.queue.js";
import { startAuctionWorker, stopAuctionWorker } from "./modules/auction/auction.worker.js";
import { startBidWorker, stopBidWorker } from "./modules/bid/bid.worker.js";
import { seedDefaultKnowledge, fixKnowledgeURLs } from "./modules/knowledge/knowledge.service.js";
import { resetAllTemplatesToDefault } from "./modules/notifications/template.service.js";
import "./modules/notifications/trigger.service.js";
import { startCampaignWorker, stopCampaignWorker } from "./modules/campaign/campaign.worker.js";
import { seedDefaultMenus, patchAdminSidebarItems } from "./modules/menu/menu.service.js";
import User from "./modules/user/user.model.js";

const PORT = process.env.PORT || 5000;

// ─── HTTP server (required for Socket.io) ───
const httpServer = http.createServer(app);

// ─── Init Socket.io ───
initSocket(httpServer);

// ─── DB + cache ───
await connectDB();
await warmCache();
await seedDefaultKnowledge();
await fixKnowledgeURLs();
await resetAllTemplatesToDefault();
console.log("🔧 Notification service initialized");

// ─── Start BullMQ workers ───
startAuctionWorker();
startBidWorker();
startCampaignWorker();
console.log("📧 Campaign worker started");

// ─── Menu Editor Seeds ───
await seedDefaultMenus();
patchAdminSidebarItems().catch(e => console.warn("Sidebar patch failed:", e.message));
// ─── On startup: reschedule all pending auctions (handles server restarts) ───
const rescheduleAllPendingAuctions = async () => {
  try {
    const now = new Date();

    // Find all scheduled auctions and queue start jobs
    const scheduledAuctions = await Auction.find({ status: 'scheduled' });
    for (const auction of scheduledAuctions) {
      await scheduleAuctionStart(
        auction._id,
        auction.startDateTime,
        auction.auctionTitle
      );
    }

    // Find all live auctions and queue end jobs (or complete immediately if overdue)
    const liveAuctions = await Auction.find({ status: 'live' });
    for (const auction of liveAuctions) {
      if (new Date(auction.endDateTime) > now) {
        await scheduleAuctionEnd(
          auction._id,
          auction.endDateTime,
          auction.auctionTitle
        );
      } else {
        // Already past end time - complete immediately
        const { checkAndCompleteEndedAuctions } = await import('./modules/auction/auction.service.js');
        await checkAndCompleteEndedAuctions();
      }
    }

    console.log(`✅ Rescheduled ${scheduledAuctions.length} scheduled and ${liveAuctions.length} live auctions`);
  } catch (e) {
    console.error('❌ Reschedule error:', e.message);
  }
};

await rescheduleAllPendingAuctions();

// ─── One-time migration: backfill soldPrice from currentBid ───
const fixSoldProperties = async () => {
  try {
    const result = await Property.updateMany(
      {
        propertyStatus: "sold",
        $or: [{ soldPrice: null }, { soldPrice: { $exists: false } }, { soldPrice: 0 }],
        currentBid: { $gt: 0 },
      },
      [{ $set: { soldPrice: "$currentBid" } }],
    );
    if (result.modifiedCount > 0) {
      console.log(`✅ Fixed ${result.modifiedCount} sold properties missing soldPrice`);
    }
  } catch (err) {
    console.error('Migration error:', err.message);
  }
};
await fixSoldProperties();

// ─── Set oldest admin as super admin if none set yet ───
try {
  const alreadySet = await User.findOne({ role: "admin", isSuperAdmin: true });
  if (!alreadySet) {
    const admins = await User.find({ role: "admin" }).sort({ createdAt: 1 }).limit(1);
    if (admins.length > 0) {
      await User.findByIdAndUpdate(admins[0]._id, { isSuperAdmin: true });
      console.log("✅ Super admin flag set for oldest admin");
    }
  }
} catch (e) {
  console.warn("Super admin seed failed:", e.message);
}

// ─── Graceful shutdown ───
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await stopAuctionWorker();
  await stopBidWorker();
  await stopCampaignWorker();
  await redisConnection.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await stopAuctionWorker();
  await stopBidWorker();
  await stopCampaignWorker();
  await redisConnection.quit();
  process.exit(0);
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
