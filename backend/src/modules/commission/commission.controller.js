import Commission from "./commission.model.js";
import User from "../user/user.model.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, agentId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (agentId) filter.agent = agentId;

    const [commissions, total] = await Promise.all([
      Commission.find(filter)
        .sort("-createdAt")
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate("agent", "name email agentDetails")
        .populate("property", "propertyTitle location media")
        .populate("buyer", "name email")
        .populate("auction", "auctionTitle")
        .lean(),
      Commission.countDocuments(filter),
    ]);

    const stats = await Commission.aggregate([
      { $group: {
        _id: null,
        totalAmount: { $sum: "$commissionAmount" },
        paidAmount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$commissionAmount", 0] } },
        pendingAmount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$commissionAmount", 0] } },
        count: { $sum: 1 },
      }},
    ]);

    res.json({
      success: true,
      data: commissions,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
      stats: stats[0] || { totalAmount: 0, paidAmount: 0, pendingAmount: 0, count: 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find({ agent: req.user._id })
      .sort("-createdAt")
      .populate("property", "propertyTitle location")
      .populate("buyer", "name email")
      .lean();

    const stats = {
      total: commissions.reduce((s, c) => s + c.commissionAmount, 0),
      paid: commissions.filter(c => c.status === "paid").reduce((s, c) => s + c.commissionAmount, 0),
      pending: commissions.filter(c => c.status === "pending").reduce((s, c) => s + c.commissionAmount, 0),
    };

    res.json({ success: true, data: commissions, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { agentId, propertyId, auctionId, buyerId, salePrice, commissionRate, notes } = req.body;
    if (!agentId || !propertyId || !salePrice || !commissionRate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const commissionAmount = (salePrice * commissionRate) / 100;
    const commission = await Commission.create({
      agent: agentId, property: propertyId, auction: auctionId,
      buyer: buyerId, salePrice, commissionRate, commissionAmount, notes,
    });
    const populated = await Commission.findById(commission._id)
      .populate("agent", "name email")
      .populate("property", "propertyTitle");
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = { status, notes };
    if (status === "paid") {
      update.paidAt = new Date();
      update.paidBy = req.user._id;
    }
    const commission = await Commission.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate("agent", "name email _id");
    if (!commission) return res.status(404).json({ success: false, message: "Commission not found" });

    if (status === "paid") {
      const { emitToUser } = await import("../../socket.js");
      const Notification = (await import("../notifications/notification.model.js")).default;
      await Notification.create({
        type: "system", icon: "check",
        message: `💰 Commission of £${commission.commissionAmount?.toLocaleString()} has been paid!`,
        link: "/dashboard/payments", color: "green",
        targetUser: commission.agent._id,
      });
      emitToUser(commission.agent._id.toString(), "new_notification", {
        type: "system",
        message: `💰 Your commission of £${commission.commissionAmount?.toLocaleString()} has been paid!`,
        link: "/dashboard/payments", color: "green",
      });
    }
    res.json({ success: true, data: commission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAgentRate = async (req, res) => {
  try {
    const { commissionRate } = req.body;
    const agent = await User.findByIdAndUpdate(
      req.params.agentId,
      { "agentDetails.commissionRate": commissionRate },
      { new: true }
    ).select("name email agentDetails");
    res.json({ success: true, data: agent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
