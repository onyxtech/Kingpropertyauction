import * as leadService from "./lead.service.js";
import Lead from "./lead.model.js";

export const create = async (req, res) => {
  try {
    const lead = await leadService.createLead(req.body);
    res
      .status(201)
      .json({
        success: true,
        data: lead,
        message: "Your message has been received!",
      });

    // Property inquiry: notify property owner and admin
    if (req.body.leadType === "property_inquiry" && req.body.property) {
      try {
        const { sendEmail } = await import("../notifications/email.service.js");
        const { isNotificationEnabled } =
          await import("../settings/settings.service.js");
        const Notification = (
          await import("../notifications/notification.model.js")
        ).default;
        const Property = (await import("../property/property.model.js"))
          .default;
        const User = (await import("../user/user.model.js")).default;

        const enabled = await isNotificationEnabled("propertyInquiry");
        const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const property = await Property.findById(req.body.property)
          .populate("createdBy", "name email _id")
          .lean();

        const propertyUrl = `${siteUrl}/properties/${property?.slug || req.body.property}`;
        const dashboardUrl = `${siteUrl}/admin/leads`;

        const emailVars = {
          inquirer_name: req.body.name,
          inquirer_email: req.body.email,
          inquirer_phone: req.body.phone || "Not provided",
          property_title: property?.propertyTitle || "Property",
          property_url: propertyUrl,
          message: req.body.message,
          dashboard_url: dashboardUrl,
        };

        // Skip sending enquiry notification to sellers (owners)
        const owner = property?.createdBy
          ? await User.findById(property.createdBy._id || property.createdBy)
              .select("role notificationSettings")
              .lean()
          : null;
        const isOwner = owner?.role === "seller";

        if (enabled && property?.createdBy && !isOwner) {
          await sendEmail({
            to: property.createdBy.email,
            subject: `New enquiry about ${property.propertyTitle}`,
            templateKey: "propertyInquiry",
            variables: emailVars,
          }).catch((e) =>
            console.warn("Property owner inquiry email failed:", e.message),
          );

          const { emitToUser } = await import("../../socket.js");
          await Notification.create({
            type: "lead",
            icon: "mail",
            message: `New enquiry from ${req.body.name} about ${property?.propertyTitle}`,
            link: `/dashboard/messages`,
            color: "blue",
            targetUser: property.createdBy._id,
          }).catch((e) =>
            console.warn("Property owner notification failed:", e.message),
          );

          emitToUser(property.createdBy._id.toString(), "new_notification", {
            type: "lead",
            message: `New enquiry about ${property?.propertyTitle}`,
            link: "/dashboard/messages",
          });
        }

        // Admin notification
        const admins = await User.find({ role: "admin" })
          .select("email name _id")
          .lean();
        for (const admin of admins) {
          if (enabled) {
            await sendEmail({
              to: admin.email,
              subject: `New property enquiry: ${property?.propertyTitle}`,
              templateKey: "propertyInquiry",
              variables: {
                ...emailVars,
                dashboard_url: `${siteUrl}/admin/leads`,
              },
            }).catch((e) =>
              console.warn("Admin inquiry email failed:", e.message),
            );
          }
        }

        await Notification.create({
          type: "lead",
          icon: "mail",
          message: `New property enquiry from ${req.body.name} about ${property?.propertyTitle}`,
          link: "/admin/leads",
          color: "blue",
          targetUser: null,
        }).catch((e) =>
          console.warn("Admin inquiry notification failed:", e.message),
        );

        // Create / update conversation thread for this inquiry
        try {
          const { default: Conversation } =
            await import("../message/conversation.model.js");
          const { default: Message } =
            await import("../message/message.model.js");

          const propertyOwnerId = property?.createdBy?._id;
          const inquirerUser = await User.findOne({ email: req.body.email })
            .select("_id")
            .lean();

          const participants = [propertyOwnerId, inquirerUser?._id].filter(
            Boolean,
          );

          // Upsert: update if exists (from createConversationFromLead race), create if not
          const conversation = await Conversation.findOneAndUpdate(
            { lead: lead._id },
            {
              $set: {
                subject: `Property Enquiry: ${property?.propertyTitle || "Property"}`,
                source: "property_inquiry",
                participants,
                assignedTo: propertyOwnerId || null,
                status: "open",
                priority: "normal",
                tags: ["property-inquiry"],
              },
              $setOnInsert: {
                lead: lead._id,
                unreadCount: { admin: 1, user: 0 },
                lastMessage: {
                  text: req.body.message?.substring(0, 200),
                  senderModel: inquirerUser ? "User" : "Lead",
                  createdAt: new Date(),
                },
              },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );

          // Add initial message only if conversation has no messages yet
          const msgCount = await Message.countDocuments({
            conversation: conversation._id,
          });
          if (msgCount === 0) {
            await Message.create({
              conversation: conversation._id,
              sender: inquirerUser?._id || lead._id,
              senderModel: inquirerUser ? "User" : "Lead",
              senderName: req.body.name,
              text: req.body.message,
              isAdminMessage: false,
            });
          }
        } catch (convErr) {
          console.warn("Conversation creation failed:", convErr.message);
        }
      } catch (e) {
        console.warn("Property inquiry notifications failed:", e.message);
      }
    }
  } catch (error) {
    console.error("[Lead] create error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const result = await leadService.getLeads(req.query);
    res
      .status(200)
      .json({
        success: true,
        data: result.leads,
        pagination: result.pagination,
      });
  } catch (error) {
    console.error("[Lead] getAll error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error("[Lead] getById error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body);
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error("[Lead] update error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await leadService.deleteLead(req.params.id);
    res.status(200).json({ success: true, message: "Lead deleted" });
  } catch (error) {
    console.error("[Lead] remove error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    lead.notes = lead.notes || [];
    lead.notes.push({
      text: req.body.text,
      addedBy: req.user._id,
      createdAt: new Date(),
    });
    await lead.save();

    res.status(200).json({ success: true, data: lead, message: "Note added" });
  } catch (error) {
    console.error("[Lead] addNote error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await leadService.getLeadsStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("[Lead] getStats error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Customer: get their own leads ───
export const getMyLeads = async (req, res) => {
  try {
    const result = await leadService.getLeadsByEmail(req.user.email, req.query);
    res
      .status(200)
      .json({
        success: true,
        data: result.leads,
        pagination: result.pagination,
      });
  } catch (error) {
    console.error("[Lead] getMyLeads error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyToLead = async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    const { message, subject } = req.body;
    if (!message?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });

    const { sendEmail } = await import("../notifications/email.service.js");
    const { getEmailSettings, isNotificationEnabled } =
      await import("../settings/settings.service.js");
    const settings = await getEmailSettings();

    const emailSubject =
      subject?.trim() ||
      "Re: " + (lead.subject || "Your Enquiry at King Property Auction");

    const replyEnabled = await isNotificationEnabled("adminReply");
    if (!replyEnabled) {
      console.log(
        "[Email] adminReply notification disabled - skipping reply email",
      );
      return res
        .status(200)
        .json({
          success: true,
          message: "Reply recorded but email sending is currently disabled.",
        });
    }

    const result = await sendEmail({
      to: lead.email,
      subject: emailSubject,
      templateKey: "adminReply",
      variables: {
        user_name: lead.name,
        subject: lead.subject || "Your Enquiry",
        message: message,
        site_url: process.env.CLIENT_URL || "http://localhost:5173",
      },
    });

    if (!result.success) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to send email: " + result.message,
        });
    }

    lead.notes = lead.notes || [];
    lead.notes.push({
      text:
        "📧 Email reply sent: " +
        message.substring(0, 100) +
        (message.length > 100 ? "..." : ""),
      addedBy: req.user._id,
      createdAt: new Date(),
    });
    await lead.save();

    // ─── Sync reply to Inbox conversation ───
    try {
      const { default: Conversation } =
        await import("../message/conversation.model.js");
      const { default: Message } = await import("../message/message.model.js");

      // Find the conversation linked to this lead
      let conversation = await Conversation.findOne({ lead: lead._id });

      // If no conversation exists yet, create one
      if (!conversation) {
        conversation = await Conversation.create({
          lead: lead._id,
          subject: lead.subject || "Inquiry from " + lead.name,
          source: lead.leadType || "contact",
          participants: [],
          unreadCount: { admin: 0, user: 1 },
        });
        // Add original lead message as first message if exists
        if (lead.message) {
          await Message.create({
            conversation: conversation._id,
            sender: lead._id,
            senderModel: "Lead",
            senderName: lead.name,
            text: lead.message,
          });
        }
      }

      // Save admin reply as a message in the conversation
      await Message.create({
        conversation: conversation._id,
        sender: req.user._id,
        senderModel: "User",
        senderName: req.user.name + " (via Email)",
        text: message,
        isAdminMessage: true,
      });

      // Update conversation lastMessage and mark as open
      await Conversation.findByIdAndUpdate(conversation._id, {
        lastMessage: {
          text: message.substring(0, 200),
          sender: req.user._id,
          senderModel: "User",
          createdAt: new Date(),
        },
        status: "open",
        "unreadCount.user": (conversation.unreadCount?.user || 0) + 1,
      });

      console.log("[Lead Reply] Synced to conversation:", conversation._id);
    } catch (syncError) {
      // Don't fail the email send if sync fails - just log it
      console.error("[Lead Reply] Failed to sync to inbox:", syncError.message);
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Reply sent successfully to " + lead.email,
      });
  } catch (error) {
    console.error("[Lead] replyToLead error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
