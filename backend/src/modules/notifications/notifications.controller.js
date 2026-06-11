import * as templateService from './template.service.js';

import Notification from "./notification.model.js";

export const getAllTemplatesController = async (req, res) => {
  try {
    const templates = await templateService.getAllTemplates();
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTemplateController = async (req, res) => {
  try {
    const template = await templateService.getTemplate(req.params.key);
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTemplateController = async (req, res) => {
  try {
    const template = await templateService.updateTemplate(req.params.key, req.body);
    res.json({ success: true, data: template, message: 'Template updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetTemplateController = async (req, res) => {
  try {
    const template = await templateService.resetTemplate(req.params.key);
    res.json({ success: true, data: template, message: 'Template reset to default' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { $addToSet: { readBy: req.user._id } });
    res.json({ success: true, message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const query = isAdmin
      ? { targetUser: null, readBy: { $ne: req.user._id } }
      : { targetUser: req.user._id, readBy: { $ne: req.user._id } };
    await Notification.updateMany(query, { $addToSet: { readBy: req.user._id } });
    res.json({ success: true, message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    const isAdmin = req.user.role === "admin";
    const query = isAdmin
      ? { targetUser: null }
      : { targetUser: req.user._id };

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
    ]);

    const userId = req.user._id.toString();
    const enriched = notifications.map((n) => ({
      ...n,
      isRead: n.readBy?.some(
        (id) => id.toString() === userId
      ) || false,
    }));

    res.json({
      success: true,
      data: enriched,
      total,
      hasMore: skip + limit < total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    const isAdmin = req.user.role === "admin";
    const query = isAdmin
      ? { targetUser: null }
      : { targetUser: req.user._id };

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
    ]);

    const userId = req.user._id.toString();
    const enriched = notifications.map((n) => ({
      ...n,
      isRead: n.readBy?.some((id) => id.toString() === userId) || false,
    }));

    res.json({
      success: true,
      data: enriched,
      total,
      hasMore: skip + limit < total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const query = isAdmin
      ? { targetUser: null, readBy: { $ne: req.user._id } }
      : { targetUser: req.user._id, readBy: { $ne: req.user._id } };
    const count = await Notification.countDocuments(query);
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const offerResponse = async (req, res) => {
  try {
    const { notificationId, response, propertyId, message } = req.body;
    if (!["accepted", "declined"].includes(response)) {
      return res.status(400).json({ success: false, message: "Invalid response" });
    }

    // Update the notification record
    if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, {
        $addToSet: { readBy: req.user._id },
        $set: { offerResponse: response },
      });
    }

    // Persist response to payment.notifiedBidders
    if (propertyId) {
      const Payment = (await import("../payment/payment.model.js")).default;
      await Payment.findOneAndUpdate(
        {
          property: propertyId,
          status: "withdrawn",
          "notifiedBidders.user": req.user._id,
        },
        {
          $set: {
            "notifiedBidders.$.status": response,
            "notifiedBidders.$.respondedAt": new Date(),
          }
        }
      ).catch(e => console.warn("Failed to update notifiedBidders on payment:", e.message));
    }

    // Notify admins (bell)
    const { emitToAdmins } = await import("../../socket.js");
    const responseNotif = {
      type: "system",
      icon: response === "accepted" ? "check" : "x",
      message: `Buyer ${req.user.name || req.user.email} has ${response} the property offer.`,
      link: "/admin/offers",
      color: response === "accepted" ? "green" : "red",
      targetUser: null,
    };
    await Notification.create(responseNotif);
    emitToAdmins("new_notification", responseNotif);

    // Admin email
    try {
      const { sendEmail } = await import("./email.service.js");
      const { isNotificationEnabled } = await import("../settings/settings.service.js");
      const User = (await import("../user/user.model.js")).default;
      const Property = (await import("../property/property.model.js")).default;

      const property = propertyId
        ? await Property.findById(propertyId).select("propertyTitle").lean()
        : null;

      const admins = await User.find({ role: "admin" }).select("email name").lean();
      if (await isNotificationEnabled("offerNotification")) {
        for (const admin of admins) {
          if (!admin.email) continue;
          sendEmail({
            to: admin.email,
            subject: `${response === "accepted" ? "✅" : "❌"} Offer ${response} - ${property?.propertyTitle || "Property"}`,
            templateKey: "offerresponseadmin",
            variables: {
              admin_name: admin.name || "Admin",
              buyer_name: req.user.name || req.user.email,
              property_title: property?.propertyTitle || "the property",
              response: response,
              dashboard_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/admin/offers`,
            },
          }).catch((e) => console.warn("offerResponseAdmin email failed:", e.message));
        }
      }
    } catch (e) {
      console.warn("Offer response admin email setup failed:", e.message);
    }

    res.json({ success: true, message: `Offer ${response} successfully`, response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};