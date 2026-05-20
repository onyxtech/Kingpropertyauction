import * as analyticsService from './analytics.service.js';

// ─── OVERVIEW ───────────────────────────────────────────────────
export const getOverview = async (req, res) => {
  try {
    const data = await analyticsService.getOverview();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── REVENUE TREND ──────────────────────────────────────────────
export const getRevenueTrend = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const data = await analyticsService.getRevenueTrend(months);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PROPERTY DISTRIBUTION ──────────────────────────────────────
export const getPropertyDistribution = async (req, res) => {
  try {
    const data = await analyticsService.getPropertyDistribution();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── BIDDING ACTIVITY ───────────────────────────────────────────
export const getBiddingActivity = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const data = await analyticsService.getBiddingActivity(months);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── USER GROWTH ────────────────────────────────────────────────
export const getUserGrowth = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const data = await analyticsService.getUserGrowth(months);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── KPI METRICS ────────────────────────────────────────────────
export const getKpiMetrics = async (req, res) => {
  try {
    const data = await analyticsService.getKpiMetrics();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── EXPORT ─────────────────────────────────────────────────────
export const exportData = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    if (!type) {
      return res.status(400).json({ success: false, message: 'Report type is required' });
    }
    const data = await analyticsService.getExportData(type, startDate, endDate);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── LEADS ANALYTICS ────────────────────────────────────────────
export const getLeadsAnalytics = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const data = await analyticsService.getLeadsAnalytics(months);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCampaignPerformance = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const data = await analyticsService.getCampaignPerformance(months);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};