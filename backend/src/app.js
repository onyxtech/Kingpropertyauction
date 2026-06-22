import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { apiRateLimit } from "./middlewares/rateLimiter.middleware.js";
import logger from "./middlewares/logger.middleware.js";
import { redisConnection } from "./config/redis.js";

const app = express();
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "https://images.unsplash.com",
          "http://localhost:5000",
          "https://maps.googleapis.com",
          "https://maps.google.com",
          "https://*.googleusercontent.com",
        ],
        scriptSrc: ["'self'", "https://maps.googleapis.com", "https://maps.google.com"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        connectSrc: ["'self'", "https://maps.googleapis.com"],
      },
    },
  }),
);
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(logger);
app.use(apiRateLimit);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  message: "Too many requests, please try again later.",
});
app.use("/api/", limiter);

// ─── AI chat has its own stricter rate limit ───
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many chat requests, please slow down.",
});

app.get("/", (req, res) => {
  res.json({ message: "King Property Auction API is running..." });
});

// ─── Health Check ───
app.get('/health', async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default;
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    let redisStatus = 'disconnected';
    try {
      await redisConnection.ping();
      redisStatus = 'connected';
    } catch (e) {
      redisStatus = 'error';
    }

    const healthy = dbStatus === 'connected' && redisStatus === 'connected';

    res.status(healthy ? 200 : 503).json({
      status: healthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        redis: redisStatus,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

// ─── Routes ───
import authRoutes from "./modules/auth/auth.routes.js";
app.use("/api/auth", authRoutes);

import propertyRoutes from "./modules/property/property.routes.js";
app.use("/api/properties", propertyRoutes);

import auctionRoutes from "./modules/auction/auction.routes.js";
app.use("/api/auctions", auctionRoutes);

import bidRoutes from "./modules/bid/bid.routes.js";
app.use("/api/bids", bidRoutes);

import propertyUploadRoutes from "./modules/property/property.upload.routes.js";
app.use("/api/upload", propertyUploadRoutes);

import userRoutes from "./modules/user/user.routes.js";
app.use("/api/users", userRoutes);

import leadRoutes from "./modules/lead/lead.routes.js";
app.use("/api/leads", leadRoutes);

import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
app.use("/api/dashboard", dashboardRoutes);

import notificationsRoutes from "./modules/notifications/notifications.routes.js";
app.use("/api/notifications", notificationsRoutes);

import settingsRoutes from "./modules/settings/settings.routes.js";
app.use("/api/settings", settingsRoutes);

import messageRoutes from "./modules/message/message.routes.js";
app.use("/api/conversations", messageRoutes);
app.use("/api/messages", messageRoutes);

// ─── AI Chat (Phase 3) ───
import chatRoutes from "./modules/chat/chat.routes.js";
app.use("/api/chat", chatLimiter, chatRoutes);

import knowledgeRoutes from "./modules/knowledge/knowledge.routes.js";
app.use("/api/knowledge", knowledgeRoutes);

import analyticsRoutes from "./modules/analytics/analytics.routes.js";
app.use("/api/analytics", analyticsRoutes);

import menuRoutes from "./modules/menu/menu.routes.js";
app.use("/api/menus", menuRoutes);

import campaignRoutes from "./modules/campaign/campaign.routes.js";
app.use("/api/campaigns", campaignRoutes);

import commissionRoutes from "./modules/commission/commission.routes.js";
app.use("/api/commissions", commissionRoutes);

import paymentRoutes from "./modules/payment/payment.routes.js";
app.use("/api/payments", paymentRoutes);

import searchRoutes from "./modules/search/search.routes.js";
app.use("/api/search", searchRoutes);

import offerRoutes from "./modules/lead/offer.routes.js";
app.use("/api/offers", offerRoutes);

import reportRoutes from "./modules/report/report.routes.js";
app.use("/api/reports", reportRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
