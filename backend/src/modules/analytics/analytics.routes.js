import express from "express";
import {
  getOverview,
  getRevenueTrend,
  getPropertyDistribution,
  getBiddingActivity,
  getUserGrowth,
  getKpiMetrics,
  exportData,
  getLeadsAnalytics,
  getCampaignPerformance,
} from "./analytics.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

// All analytics routes are admin-only
router.get("/overview", protect, authorize("admin"), getOverview);
router.get("/revenue", protect, authorize("admin"), getRevenueTrend);
router.get(
  "/property-distribution",
  protect,
  authorize("admin"),
  getPropertyDistribution,
);
router.get(
  "/bidding-activity",
  protect,
  authorize("admin"),
  getBiddingActivity,
);
router.get("/user-growth", protect, authorize("admin"), getUserGrowth);
router.get("/kpi", protect, authorize("admin"), getKpiMetrics);
router.get("/export", protect, authorize("admin"), exportData);
router.get("/leads", protect, authorize("admin"), getLeadsAnalytics);
router.get('/campaign-performance', protect, authorize('admin'), getCampaignPerformance);

export default router;
