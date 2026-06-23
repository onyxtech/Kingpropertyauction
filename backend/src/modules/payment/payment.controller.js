import Payment from "./payment.model.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, buyerId } = req.query;
    const { propertyId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (buyerId) filter.buyer = buyerId;
    if (propertyId) filter.property = propertyId;

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
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: {
              $cond: [
                { $in: ["$status", ["pending", "paid", "overdue"]] },
                "$amount",
                0,
              ],
            },
          },
          paidAmount: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] },
          },
          pendingAmount: {
            $sum: {
              $cond: [
                { $in: ["$status", ["pending", "overdue"]] },
                "$amount",
                0,
              ],
            },
          },
          withdrawnAmount: {
            $sum: { $cond: [{ $eq: ["$status", "withdrawn"] }, "$amount", 0] },
          },
          withdrawnCount: {
            $sum: { $cond: [{ $eq: ["$status", "withdrawn"] }, 1, 0] },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: payments,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
      stats: stats[0] || {
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        count: 0,
      },
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
    const payment = await Payment.create({
      ...req.body,
      updatedBy: req.user._id,
    });
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
    if (status === "withdrawn") {
      update.withdrawnAt = new Date();
      update.withdrawnBy = req.user._id;
    }

    const payment = await Payment.findByIdAndUpdate(req.params.id, update, {
      new: true,
    })
      .populate("buyer", "name email _id")
      .populate("auction", "_id auctionTitle")
      .populate("property", "_id propertyTitle");
    if (!payment)
      return res.status(404).json({ success: false, message: "Not found" });

    const { emitToUser, emitToAdmins } = await import("../../socket.js");
    const Notification = (
      await import("../notifications/notification.model.js")
    ).default;
    const { sendEmail } = await import("../notifications/email.service.js");
    const { isNotificationEnabled } =
      await import("../settings/settings.service.js");
    const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";

    if (status === "paid") {
      const buyerUser = await (await import("../user/user.model.js")).default
        .findById(payment.buyer._id)
        .select("notificationSettings")
        .lean();
      const bellEnabled = buyerUser?.notificationSettings?.paymentDue !== false;
      if (bellEnabled) {
        await Notification.create({
          type: "system",
          icon: "check",
          message: `✅ Your payment has been confirmed!`,
          link: "/dashboard/payments",
          color: "green",
          targetUser: payment.buyer._id,
        });
        emitToUser(payment.buyer._id.toString(), "new_notification", {
          type: "system",
          message: "✅ Your payment has been confirmed!",
          link: "/dashboard/payments",
          color: "green",
        });
      }
      if (payment.buyer?.email) {
        if (await isNotificationEnabled("paymentDue")) {
          sendEmail({
            to: payment.buyer.email,
            subject: `✅ Payment Confirmed - ${payment.property?.propertyTitle || "Property"}`,
            templateKey: "paymentconfirmed",
            variables: {
              user_name: payment.buyer.name || "Buyer",
              property_title: payment.property?.propertyTitle || "Property",
              amount: `£${payment.amount?.toLocaleString()}`,
              dashboard_url: `${siteUrl}/dashboard/payments`,
            },
          }).catch((e) =>
            console.warn("paymentConfirmed email failed:", e.message),
          );
        }
      }
    }

    if (status === "overdue" && payment.buyer?.email) {
      if (await isNotificationEnabled("paymentOverdue")) {
        sendEmail({
          to: payment.buyer.email,
          subject: `⚠️ URGENT: Payment Overdue - ${payment.property?.propertyTitle || "Property"}`,
          templateKey: "paymentOverdue",
          variables: {
            user_name: payment.buyer.name || "Bidder",
            property_title: payment.property?.propertyTitle || "the property",
            amount: `£${payment.amount?.toLocaleString()}`,
            due_datetime: payment.dueDate
              ? new Date(payment.dueDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "N/A",
            dashboard_url: `${siteUrl}/dashboard/payments`,
          },
        }).catch((e) =>
          console.warn("paymentOverdue email failed:", e.message),
        );
      }
    }

    if (status === "withdrawn") {
      await Notification.create({
        type: "system",
        icon: "x-circle",
        message: `❌ You have been withdrawn from the purchase of "${payment.property?.propertyTitle}".`,
        link: "/dashboard/won-auctions",
        color: "red",
        targetUser: payment.buyer._id,
        metadata: {
          propertyId: payment.property?._id?.toString(),
          propertyTitle: payment.property?.propertyTitle,
          propertyUrl: `/properties/${payment.property?._id}`,
          event: "withdrawn",
        },
      });
      emitToUser(payment.buyer._id.toString(), "new_notification", {
        type: "system",
        message: `❌ You have been withdrawn from the purchase of "${payment.property?.propertyTitle}".`,
        link: "/dashboard/won-auctions",
        color: "red",
        metadata: {
          propertyId: payment.property?._id?.toString(),
          propertyTitle: payment.property?.propertyTitle,
          propertyUrl: `/properties/${payment.property?._id}`,
          event: "withdrawn",
        },
      });

      if (
        payment.buyer?.email &&
        (await isNotificationEnabled("paymentWithdrawn"))
      ) {
        sendEmail({
          to: payment.buyer.email,
          subject: `❌ Withdrawn from Purchase - ${payment.property?.propertyTitle || "Property"}`,
          templateKey: "paymentWithdrawn",
          variables: {
            user_name: payment.buyer.name || "Bidder",
            property_title: payment.property?.propertyTitle || "the property",
            dashboard_url: `${siteUrl}/dashboard/payments`,
          },
        }).catch((e) =>
          console.warn("paymentWithdrawn email failed:", e.message),
        );
      }

      // Void any pending/approved commissions for this property
      const Commission = (await import("../commission/commission.model.js"))
        .default;
      await Commission.updateMany(
        {
          property: payment.property._id,
          status: { $in: ["pending", "approved"] },
        },
        {
          $set: {
            status: "voided",
            notes: "Voided - buyer withdrew from purchase",
          },
        },
      );

      const voidedCommissions = await Commission.find({
        property: payment.property._id,
        status: "voided",
      })
        .populate("agent", "_id name email notificationSettings")
        .lean();

      for (const comm of voidedCommissions) {
        if (!comm.agent?._id) continue;
        const bellOn =
          comm.agent.notificationSettings?.commissionEarned !== false;
        if (bellOn) {
          await Notification.create({
            type: "system",
            icon: "x-circle",
            message: `⚠️ Commission for "${payment.property?.propertyTitle}" was voided — the buyer withdrew.`,
            link: "/dashboard/payments",
            color: "orange",
            targetUser: comm.agent._id,
          });
          emitToUser(comm.agent._id.toString(), "new_notification", {
            type: "system",
            message: `⚠️ Commission voided — buyer withdrew from "${payment.property?.propertyTitle}".`,
            link: "/dashboard/payments",
            color: "orange",
          });
        }
      }

      emitToAdmins("commission_updated", {
        event: "voided_on_withdraw",
        propertyId: payment.property._id.toString(),
      });

      // Snapshot outcome on auction
      if (payment.auction?._id && payment.property?._id) {
        try {
          const Auction = (await import("../auction/auction.model.js")).default;
          await Auction.findByIdAndUpdate(payment.auction._id, {
            $set: {
              [`propertyOutcomes.${payment.property._id}`]: {
                status: "withdrawn",
                buyerName: payment.buyer?.name || "Buyer",
                buyerId: payment.buyer?._id || null,
                salePrice: payment.amount || 0,
                note: "Winner withdrew from purchase",
                updatedAt: new Date(),
              },
            },
          });
        } catch (e) {
          console.warn("Outcome snapshot (withdraw) failed:", e.message);
        }
      }
    }

    emitToAdmins("payment_updated", {
      type: "payment",
      status,
      paymentId: payment._id,
    });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignNewBuyer = async (req, res) => {
  try {
    const { propertyId, newBuyerId, agreedPrice, auctionId } = req.body;
    if (!propertyId || !newBuyerId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "propertyId and newBuyerId required",
        });
    }

    const Property = (await import("../property/property.model.js")).default;
    const User = (await import("../user/user.model.js")).default;
    const Commission = (await import("../commission/commission.model.js"))
      .default;
    const Notification = (
      await import("../notifications/notification.model.js")
    ).default;
    const { emitToUser } = await import("../../socket.js");
    const { sendEmail } = await import("../notifications/email.service.js");
    const { getSetting } = await import("../settings/settings.service.js");
    const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";

    // 1. Fetch property to determine final price
    const existingProperty = await Property.findById(propertyId).lean();
    if (!existingProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const finalPrice =
      agreedPrice && Number(agreedPrice) > 0
        ? Number(agreedPrice)
        : existingProperty.currentBid ||
          existingProperty.pricing?.reservePrice ||
          0;

    // Update property with new buyer
    const property = await Property.findByIdAndUpdate(
      propertyId,
      {
        soldTo: newBuyerId,
        soldPrice: finalPrice,
        currentBid: finalPrice,
        propertyStatus: "sold",
        winningBidder: newBuyerId,
      },
      { new: true },
    ).populate("createdBy", "name email agentDetails");

    // Update auction winningBidder to reflect re-assignment
    if (auctionId) {
      try {
        const Auction = (await import("../auction/auction.model.js")).default;
        await Auction.findByIdAndUpdate(auctionId, {
          $set: { winningBidder: newBuyerId },
        });
      } catch (e) {
        console.warn("Auction winner update failed:", e.message);
      }
    }

    // 2. Create new payment
    const general = await getSetting("general").catch(() => ({}));
    const dueHours = general?.paymentDueHours || 48;
    const dueDate = new Date(Date.now() + dueHours * 60 * 60 * 1000);

    const newPayment = await Payment.create({
      buyer: newBuyerId,
      property: propertyId,
      auction: auctionId || null,
      amount: finalPrice,
      status: "pending",
      method: "bank_transfer",
      dueDate,
      notes: `Re-offer sale after winner withdrawal - ${property.propertyTitle}`,
    });

    // 3. Void old commissions + create new one
    await Commission.updateMany(
      { property: propertyId, status: { $in: ["pending", "approved"] } },
      {
        $set: {
          status: "voided",
          notes: "Voided - property re-assigned to new buyer",
        },
      },
    );

    const owner = property.createdBy;
    if (owner) {
      const defaultRate = general?.defaultCommissionRate || 5;
      const commissionRate =
        owner.agentDetails?.commissionRate > 0
          ? owner.agentDetails.commissionRate
          : defaultRate;
      const commissionAmount = (finalPrice * commissionRate) / 100;
      await Commission.create({
        agent: owner._id,
        property: propertyId,
        auction: auctionId || null,
        buyer: newBuyerId,
        salePrice: finalPrice,
        commissionRate,
        commissionAmount,
        status: "pending",
        notes: "Re-offer commission - assigned to new buyer",
      });
    }

    // 4. Notify new buyer
    const newBuyer = await User.findById(newBuyerId)
      .select("name email")
      .lean();

    // Write sold snapshot to auction
    if (auctionId && property?._id) {
      try {
        const Auction = (await import("../auction/auction.model.js")).default;
        await Auction.findByIdAndUpdate(auctionId, {
          $set: {
            [`propertyOutcomes.${propertyId}`]: {
              status: "sold",
              buyerName: newBuyer?.name || "New Buyer",
              buyerId: newBuyerId,
              salePrice: finalPrice,
              note: "Re-assigned to next bidder after withdrawal",
              updatedAt: new Date(),
            },
          },
        });
      } catch (e) {
        console.warn("Outcome snapshot (assign) failed:", e.message);
      }
    }

    if (newBuyer) {
      await Notification.create({
        type: "system",
        icon: "check",
        message: `🎉 "${property.propertyTitle}" has been assigned to you at £${finalPrice.toLocaleString()}. Payment is now due.`,
        link: "/dashboard/payments",
        color: "green",
        targetUser: newBuyerId,
        metadata: {
          propertyId: propertyId,
          propertyTitle: property.propertyTitle,
          event: "assigned",
        },
      });
      emitToUser(newBuyerId.toString(), "new_notification", {
        type: "system",
        message: `🎉 You are the new buyer for "${property.propertyTitle}"`,
        link: "/dashboard/payments",
        color: "green",
        metadata: {
          propertyId: propertyId,
          propertyTitle: property.propertyTitle,
          event: "assigned",
        },
      });
      sendEmail({
        to: newBuyer.email,
        subject: `🎉 Property Assigned - ${property.propertyTitle}`,
        templateKey: "paymentDue",
        variables: {
          user_name: newBuyer.name,
          property_title: property.propertyTitle,
          amount: `£${finalPrice.toLocaleString()}`,
          due_datetime: dueDate.toUTCString(),
          auction_name: "Re-offer Sale",
          dashboard_url: `${siteUrl}/dashboard/payments`,
        },
      }).catch((e) => console.warn("New buyer email failed:", e.message));
    }

    // 5. Notify seller
    if (owner) {
      await Notification.create({
        type: "system",
        icon: "home",
        message: `✅ New buyer assigned for "${property.propertyTitle}" at £${finalPrice.toLocaleString()}`,
        link: "/dashboard/payments",
        color: "green",
        targetUser: owner._id,
      });
      emitToUser(owner._id.toString(), "new_notification", {
        type: "system",
        message: `✅ New buyer for "${property.propertyTitle}" at £${finalPrice.toLocaleString()}`,
        link: "/dashboard/payments",
        color: "green",
      });
    }

    // Auto-cancel old invoice for withdrawn buyer
    try {
      const Invoice = (await import("../invoice/invoice.model.js")).default;
      await Invoice.updateMany(
        { property: propertyId, buyer: { $ne: newBuyerId }, status: "pending" },
        { status: "withdrawn" },
      );
      console.log(
        `[Invoice] Cancelled old invoices for property: ${property.propertyTitle}`,
      );
    } catch (e) {
      console.warn("[Invoice] Failed to cancel old invoices:", e.messFage);
    }

    // Auto-generate invoice for new buyer
    try {
      const { generateInvoice } = await import("../invoice/invoice.service.js");
      await generateInvoice(
        {
          propertyId,
          auctionId: auctionId || null,
          buyerId: newBuyerId,
          sellerId: property.createdBy?._id || property.createdBy,
          salePrice: finalPrice,
          invoiceType: "reassigned",
        },
        req.user._id,
      );
      console.log(
        `[Invoice] Generated for reassigned property: ${property.propertyTitle}`,
      );
    } catch (e) {
      console.warn("[Invoice] Reassigned invoice failed:", e.message);
    }

    res.json({
      success: true,
      message: "New buyer assigned successfully",
      data: { property, payment: newPayment },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPropertyToAvailable = async (req, res) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId)
      return res
        .status(400)
        .json({ success: false, message: "propertyId required" });

    const Property = (await import("../property/property.model.js")).default;
    const Commission = (await import("../commission/commission.model.js"))
      .default;

    const property = await Property.findByIdAndUpdate(
      propertyId,
      {
        propertyStatus: "available",
        soldTo: null,
        soldPrice: null,
        winningBidder: null,
        currentBid: 0,
        "auctionDetails.auctionStatus": "upcoming",
      },
      { new: true },
    );
    if (!property)
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });

    await Commission.updateMany(
      { property: propertyId, status: { $in: ["pending", "approved"] } },
      {
        status: "voided",
        notes: "Voided - no buyer found, property reset to available",
      },
    );

    await Payment.updateMany(
      { property: propertyId, status: "withdrawn" },
      { $set: { resetToAvailable: true, resetAt: new Date() } },
    );

    // Update existing withdrawn snapshot note (keep history, add reset context)
    try {
      const Auction = (await import("../auction/auction.model.js")).default;
      const auctionsWithProp = await Auction.find({ properties: propertyId })
        .select("_id propertyOutcomes")
        .lean();
      for (const auc of auctionsWithProp) {
        const existing = auc.propertyOutcomes?.get
          ? auc.propertyOutcomes.get(propertyId)
          : auc.propertyOutcomes?.[propertyId];
        if (existing && existing.status === "withdrawn") {
          await Auction.findByIdAndUpdate(auc._id, {
            $set: {
              [`propertyOutcomes.${propertyId}.note`]:
                "Winner withdrew — property reset to available",
              [`propertyOutcomes.${propertyId}.updatedAt`]: new Date(),
            },
          });
        }
      }
    } catch (e) {
      console.warn("Outcome snapshot (reset) failed:", e.message);
    }

    res.json({
      success: true,
      message: "Property reset to available successfully",
      data: property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotifiedBidders = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const payment = await Payment.findOne({
      property: propertyId,
      status: "withdrawn",
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!payment) {
      return res.json({ success: true, data: [] });
    }

    res.json({
      success: true,
      data: payment.notifiedBidders || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendReminder = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("buyer", "name email _id")
      .populate("property", "propertyTitle _id")
      .populate("auction", "auctionTitle")
      .lean();
    if (!payment)
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    if (!payment.buyer?.email)
      return res
        .status(400)
        .json({ success: false, message: "Buyer has no email address" });

    const { sendEmail } = await import("../notifications/email.service.js");
    const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";

    const emailResult = await sendEmail({
      to: payment.buyer.email,
      subject: `⏰ Payment Reminder - ${payment.property?.propertyTitle}`,
      templateKey: "paymentDue",
      variables: {
        user_name: payment.buyer.name || "Bidder",
        property_title: payment.property?.propertyTitle || "",
        amount: `£${payment.amount?.toLocaleString()}`,
        due_datetime: payment.dueDate
          ? new Date(payment.dueDate).toUTCString()
          : "Contact us for details",
        auction_name: payment.auction?.auctionTitle || "King Property Auction",
        dashboard_url: `${siteUrl}/dashboard/payments`,
      },
    });

    console.log("[sendReminder] Email result:", JSON.stringify(emailResult));

    if (!emailResult.success) {
      console.warn("[sendReminder] Email failed:", emailResult.message);
    }

    res.json({
      success: true,
      message: emailResult.success
        ? `Reminder sent to ${payment.buyer.email}`
        : `Bell notification sent. Email: ${emailResult.message}`,
      emailSent: emailResult.success,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
