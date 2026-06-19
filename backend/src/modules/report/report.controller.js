import * as reportService from "./report.service.js";

export const overview = async (req, res) => {
  try {
    const stats = await reportService.getOverviewStats();
    res.json({ success: true, data: stats });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const customers = async (req, res) => {
  try {
    const result = await reportService.getCustomerReport(req.query);
    res.json({ success: true, ...result });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const agents = async (req, res) => {
  try {
    const result = await reportService.getAgentReport(req.query);
    res.json({ success: true, ...result });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const auctions = async (req, res) => {
  try {
    const result = await reportService.getAuctionReport(req.query);
    res.json({ success: true, ...result });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const bids = async (req, res) => {
  try {
    const result = await reportService.getBiddingReport(req.query);
    res.json({ success: true, ...result });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const agentProperties = async (req, res) => {
  try {
    const result = await reportService.getAgentPropertyReport(req.query);
    res.json({ success: true, ...result });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const customerProperties = async (req, res) => {
  try {
    const result = await reportService.getCustomerPropertyReport(req.query);
    res.json({ success: true, ...result });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};