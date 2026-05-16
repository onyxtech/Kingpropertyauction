import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { checkAndCompleteEndedAuctions } from "./modules/auction/auction.service.js";
import Auction from "./modules/auction/auction.model.js";
import notificationService, { NotificationEvents } from "./modules/notifications/trigger.service.js";
import { warmCache } from "./modules/settings/settings.service.js";
import { initSocket } from "./socket.js";
import { seedDefaultKnowledge, fixKnowledgeURLs } from "./modules/knowledge/knowledge.service.js";
import { resetAllTemplatesToDefault } from "./modules/notifications/template.service.js";

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

// ─── Smart auction completion scheduler ───
const scheduleNextCompletion = async () => {
  try {
    const next = await Auction.findOne({ status: "live" }).sort({ endDateTime: 1 }).select("endDateTime");
    if (next) {
      const delay = Math.max(next.endDateTime.getTime() - Date.now() + 500, 500);
      console.log(`⏰ Next auction completion in ${Math.round(delay / 1000)}s`);
      setTimeout(async () => {
        await checkAndCompleteEndedAuctions();
        scheduleNextCompletion();
      }, delay);
    } else {
      console.log("⏰ No live auctions, checking in 5 minutes");
      setTimeout(scheduleNextCompletion, 5 * 60 * 1000);
    }
  } catch (e) {
    console.error("Completion scheduler error:", e.message);
    setTimeout(scheduleNextCompletion, 60 * 1000);
  }
};

// ─── Smart auction start scheduler ───
const scheduleNextStart = async () => {
  try {
    const next = await Auction.findOne({ status: "scheduled" }).sort({ startDateTime: 1 }).select("startDateTime _id auctionTitle");
    if (next) {
      const delay = Math.max(next.startDateTime.getTime() - Date.now() + 500, 500);
      console.log(`🔵 Next auction start in ${Math.round(delay / 1000)}s`);
      setTimeout(async () => {
        const auction = await Auction.findOneAndUpdate(
          { _id: next._id, status: "scheduled" },
          { status: "live" },
          { new: true }
        );
        if (auction) {
          console.log(`🔵 Auction started: ${auction.auctionTitle}`);
          notificationService.emit(NotificationEvents.AUCTION_STARTED, { auctionId: auction._id }).catch(() => {});
        }
        scheduleNextStart();
      }, delay);
    } else {
      console.log("🔵 No scheduled auctions, checking in 5 minutes");
      setTimeout(scheduleNextStart, 5 * 60 * 1000);
    }
  } catch (e) {
    console.error("Start scheduler error:", e.message);
    setTimeout(scheduleNextStart, 60 * 1000);
  }
};

scheduleNextCompletion();
scheduleNextStart();
console.log("⏰ Smart auction scheduler started");
console.log("🔵 Smart auction starter initialized");

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});