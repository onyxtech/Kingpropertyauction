import Payment from "./payment.model.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, buyerId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (buyerId) filter.buyer = buyerId;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .sort("-createdAt")
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate("buyer", "name email phone")
        .populate("property", "propertyTitle location media")
        .populate("auction", "auctionTitle")
        .lean(),
      Payment.countDocuments(filter),
    ]);

    const stats = await Payment.aggregate([
      { $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
        paidAmount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] } },
        pendingAmount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] } },
        count: { $sum: 1 },
      }},
    ]);

    res.json({
      success: true,
      data: payments,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
      stats: stats[0] || { totalAmount: 0, paidAmount: 0, pendingAmount: 0, count: 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ buyer: req.user._id })
      .sort("-createdAt")
      .populate("property", "propertyTitle location media")
      .populate("auction", "auctionTitle")
      .lean();
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const payment = await Payment.create({ ...req.body, updatedBy: req.user._id });
    const populated = await Payment.findById(payment._id)
      .populate("buyer", "name email")
      .populate("property", "propertyTitle");
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status, notes, reference } = req.body;
    const update = { status, notes, reference, updatedBy: req.user._id };
    if (status === "paid") update.paidAt = new Date();

    const payment = await Payment.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate("buyer", "name email _id");
    if (!payment) return res.status(404).json({ success: false, message: "Not found" });

    if (status === "paid") {
      const { emitToUser } = await import("../../socket.js");
      const Notification = (await import("../notifications/notification.model.js")).default;
      await Notification.create({
        type: "system", icon: "check",
        message: `✅ Your payment has been confirmed!`,
        link: "/dashboard/payments", color: "green",
        targetUser: payment.buyer._id,
      });
      emitToUser(payment.buyer._id.toString(), "new_notification", {
        type: "system",
        message: "✅ Your payment has been confirmed!",
        link: "/dashboard/payments", color: "green",
      });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
