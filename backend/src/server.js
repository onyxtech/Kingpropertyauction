import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { checkAndCompleteEndedAuctions } from "./modules/auction/auction.service.js";
import Auction from "./modules/auction/auction.model.js";
import notificationService, {
  NotificationEvents,
} from "./modules/notifications/trigger.service.js";
console.log("📧 Notification service initialized");

const PORT = process.env.PORT || 5000;

connectDB();

import { warmCache } from "./modules/settings/settings.service.js";
await warmCache();

// ─── SMART AUCTION SCHEDULER ───
const scheduleNextCompletion = async () => {
  try {
    const nextAuction = await Auction.findOne({ status: "live" })
      .sort({ endDateTime: 1 })
      .select("endDateTime");

    if (nextAuction) {
      const now = Date.now();
      const endTime = nextAuction.endDateTime.getTime();
      const delay = Math.max(endTime - now + 500, 500);

      console.log(`⏰ Next auction completion in ${Math.round(delay / 1000)}s`);

      setTimeout(async () => {
        console.log("⏰ Checking for ended auctions...");
        await checkAndCompleteEndedAuctions();
        scheduleNextCompletion();
      }, delay);
    } else {
      console.log("⏰ No live auctions, checking in 5 minutes");
      setTimeout(scheduleNextCompletion, 5 * 60 * 1000);
    }
  } catch (error) {
    console.error("Scheduler error:", error.message);
    setTimeout(scheduleNextCompletion, 60 * 1000);
  }
};

scheduleNextCompletion();
console.log("⏰ Smart auction scheduler started");

// ─── SMART AUCTION STARTER ───
const scheduleNextStart = async () => {
  try {
    const nextAuction = await Auction.findOne({ status: "scheduled" })
      .sort({ startDateTime: 1 })
      .select("startDateTime");

    if (nextAuction) {
      const now = Date.now();
      const startTime = nextAuction.startDateTime.getTime();
      const delay = Math.max(startTime - now + 500, 500);

      console.log(`🔵 Next auction start in ${Math.round(delay / 1000)}s`);

      setTimeout(async () => {
        const auction = await Auction.findOneAndUpdate(
          { _id: nextAuction._id, status: "scheduled" },
          { status: "live" },
          { new: true },
        );

        if (auction) {
          console.log(`🔵 Auction started: ${auction.auctionTitle}`);
          notificationService
            .emit(NotificationEvents.AUCTION_STARTED, {
              auctionId: auction._id,
            })
            .catch((e) => console.error("Start event failed:", e.message));
        }

        scheduleNextStart();
      }, delay);
    } else {
      console.log("🔵 No scheduled auctions, checking in 5 minutes");
      setTimeout(scheduleNextStart, 5 * 60 * 1000);
    }
  } catch (error) {
    console.error("Start scheduler error:", error.message);
    setTimeout(scheduleNextStart, 60 * 1000);
  }
};

scheduleNextStart();
console.log("🔵 Smart auction starter initialized");

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});
