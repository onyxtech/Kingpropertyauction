import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { requestLogger } from "./utils/logger.js";

const app = express();

// Security middleware
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
        ],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      },
    },
  }),
);
app.use(requestLogger); // logger
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  message: "Too many requests, please try again later.",
});
app.use("/api/", limiter);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "King Property Auction API is running..." });
});

// Routes will be added here

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

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
