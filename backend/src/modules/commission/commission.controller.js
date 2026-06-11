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
        totalAmount: { $sum: { $cond: [{ $in: ["$status", ["pending", "approved", "paid"]] }, "$commissionAmount", 0] } },
        paidAmount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$commissionAmount", 0] } },
        pendingAmount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$commissionAmount", 0] } },
        voidedAmount: { $sum: { $cond: [{ $in: ["$status", ["voided", "disputed"]] }, "$commissionAmount", 0] } },
        count: { $sum: 1 },
        activeCount: { $sum: { $cond: [{ $in: ["$status", ["pending", "approved", "paid"]] }, 1, 0] } },
      }},
    ]);

    res.json({
      success: true,
      data: commissions,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
      stats: stats[0] || { totalAmount: 0, paidAmount: 0, pendingAmount: 0, voidedAmount: 0, count: 0, activeCount: 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find({ agent: req.user._id })
      .sort("-createdAt")
      .populate("property", "propertyTitle location media")
      .populate("buyer", "name email")
      .populate("auction", "auctionTitle")
      .lean();

    const stats = {
      total: commissions.filter(c => c.status !== "voided").reduce((s, c) => s + c.commissionAmount, 0),
      paid: commissions.filter(c => c.status === "paid").reduce((s, c) => s + c.commissionAmount, 0),
      pending: commissions.filter(c => c.status === "pending").reduce((s, c) => s + c.commissionAmount, 0),
      approved: commissions.filter(c => c.status === "approved").reduce((s, c) => s + c.commissionAmount, 0),
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
      .populate("agent", "name email _id")
      .populate("property", "propertyTitle _id");
    if (!commission) return res.status(404).json({ success: false, message: "Commission not found" });

    try {
      const { emitToAdmins } = await import("../../socket.js");
      emitToAdmins("commission_updated", { commissionId: commission._id.toString(), status });
    } catch (e) {
      console.warn("commission_updated emit failed:", e.message);
    }

    if (status === "approved") {
      const { emitToUser } = await import("../../socket.js");
      const Notification = (await import("../notifications/notification.model.js")).default;
      const agentUser = await (await import("../user/user.model.js")).default
        .findById(commission.agent._id).select("notificationSettings").lean();
      const bellEnabled = agentUser?.notificationSettings?.commissionEarned !== false;
      if (bellEnabled) {
        await Notification.create({
          type: "system", icon: "check",
          message: `✅ Your commission of £${commission.commissionAmount?.toLocaleString()} has been approved. You can now request a withdrawal.`,
          link: "/dashboard/payments", color: "green",
          targetUser: commission.agent._id,
          metadata: { commissionId: commission._id.toString(), event: "approved" },
        });
        emitToUser(commission.agent._id.toString(), "new_notification", {
          type: "system",
          message: `✅ Your commission of £${commission.commissionAmount?.toLocaleString()} has been approved.`,
          link: "/dashboard/payments", color: "green",
        });
      }
    }

    if (status === "paid") {
      const { emitToUser } = await import("../../socket.js");
      const Notification = (await import("../notifications/notification.model.js")).default;
      const agentUser = await (await import("../user/user.model.js")).default
        .findById(commission.agent._id).select("notificationSettings").lean();
      const bellEnabled = agentUser?.notificationSettings?.fundsTransferred !== false;
      if (bellEnabled) {
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
      if (commission.agent?.email) {
        try {
          const { sendEmail } = await import("../notifications/email.service.js");
          const { isNotificationEnabled } = await import("../settings/settings.service.js");
          const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";
          if (await isNotificationEnabled("fundsTransferred")) {
            sendEmail({
              to: commission.agent.email,
              subject: `🎉 Funds Transferred - £${commission.commissionAmount?.toLocaleString()}`,
              templateKey: "fundsTransferred",
              variables: {
                user_name: commission.agent.name || "Agent",
                property_title: commission.property?.propertyTitle || "the property",
                commission_amount: `£${commission.commissionAmount?.toLocaleString()}`,
                dashboard_url: `${siteUrl}/dashboard/payments`,
              },
            }).catch((e) => console.warn("fundsTransferred email failed:", e.message));
          }
        } catch (e) {
          console.warn("fundsTransferred email setup failed:", e.message);
        }
      }
    }
    res.json({ success: true, data: commission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestWithdrawal = async (req, res) => {
  try {
    const commission = await Commission.findOne({ _id: req.params.id, agent: req.user._id }).populate("property", "propertyTitle");
    if (!commission) return res.status(404).json({ success: false, message: "Commission not found" });

    if (commission.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: commission.status === "pending"
          ? "Commission must be approved by admin first"
          : "Commission not eligible for withdrawal",
      });
    }
    if (commission.withdrawalRequest?.requested) {
      return res.status(400).json({ success: false, message: "Withdrawal already requested" });
    }

    const expectedPaymentDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    commission.withdrawalRequest = { requested: true, requestedAt: new Date(), expectedPaymentDate };
    await commission.save();

    try {
      const { emitToAdmins } = await import("../../socket.js");
      const Notification = (await import("../notifications/notification.model.js")).default;
      // Admin bell (always sent — admin pref not user pref)
      await Notification.create({
        type: "system", icon: "dollar",
        message: `💰 Commission withdrawal requested by ${req.user.name}`,
        link: "/admin/commissions", color: "amber",
        targetUser: null,
      });
      emitToAdmins("new_notification", {
        type: "system",
        message: `${req.user.name} requested commission withdrawal`,
        link: "/admin/commissions", color: "amber",
      });
      emitToAdmins("commission_updated", { commissionId: commission._id.toString(), event: "withdrawal_requested" });
    } catch (e) {
      console.warn("Withdrawal notification failed:", e.message);
    }

    if (req.user.email) {
      try {
        const { sendEmail } = await import("../notifications/email.service.js");
        const { isNotificationEnabled } = await import("../settings/settings.service.js");
        const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";
        if (await isNotificationEnabled("withdrawalRequested")) {
          sendEmail({
            to: req.user.email,
            subject: `✅ Withdrawal Request Received`,
            templateKey: "withdrawalRequested",
            variables: {
              user_name: req.user.name || "Agent",
              property_title: commission.property?.propertyTitle || "the property",
              commission_amount: `£${commission.commissionAmount?.toLocaleString()}`,
              expected_date: expectedPaymentDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
              dashboard_url: `${siteUrl}/dashboard/payments`,
            },
          }).catch((e) => console.warn("withdrawalRequested email failed:", e.message));
        }
      } catch (e) {
        console.warn("withdrawalRequested email setup failed:", e.message);
      }
    }

    res.json({ success: true, data: commission, message: "Withdrawal requested. Expected payment within 30 days." });
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
