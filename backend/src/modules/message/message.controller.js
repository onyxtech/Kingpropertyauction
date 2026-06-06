import * as messageService from "./message.service.js";
import Conversation from "./conversation.model.js";
import Message from "./message.model.js";

// ─── Conversations ───

export const getConversations = async (req, res) => {
  try {
    const result = await messageService.getConversations(req.query);
    res.json({
      success: true,
      data: result.conversations,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const conversation = await messageService.getConversationById(
      req.params.id,
    );
    if (!conversation)
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const conversation = await messageService.updateConversation(
      req.params.id,
      req.body,
    );
    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Messages ───

export const getMessages = async (req, res) => {
  try {
    await messageService.markAsRead(req.params.id, "Admin");
    const result = await messageService.getMessages(req.params.id, req.query);
    res.json({
      success: true,
      data: result.messages,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, attachments } = req.body;
    if (!text?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Message text is required." });

    const message = await messageService.sendMessage(
      req.params.id,
      req.user._id,
      "Admin",
      text,
      attachments || [],
      true,
    );

    // Notify the customer of the admin reply
    try {
      const conv = await Conversation.findById(req.params.id).populate("lead", "email").lean();
      if (conv?.lead?.email) {
        const UserModel = (await import("../user/user.model.js")).default;
        const customer = await UserModel.findOne({ email: conv.lead.email }).select("_id").lean();
        if (customer) {
          const Notification = (await import("../notifications/notification.model.js")).default;
          const { emitToUser } = await import("../../socket.js");
          await Notification.create({
            type: "user",
            icon: "mail",
            message: `New reply from support: "${text.slice(0, 60)}..."`,
            link: "/dashboard/messages",
            color: "blue",
            targetUser: customer._id,
          }).catch(e => console.warn("Message reply notification failed:", e.message));
          emitToUser(customer._id.toString(), "new_notification", {
            type: "message",
            message: "You have a new reply from our support team",
            link: "/dashboard/messages",
          });
        }
      }
    } catch (e) {
      console.warn("Customer reply notification failed:", e.message);
    }

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── User sends a message (customer dashboard) ───

export const sendUserMessage = async (req, res) => {
  try {
    const { text, attachments } = req.body;
    if (!text?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Message text is required." });

    // Verify this conversation belongs to this user
    const conversation = await messageService.getConversationById(
      req.params.id,
    );
    if (!conversation)
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });

    const message = await messageService.sendMessage(
      req.params.id,
      req.user._id,
      "User",
      text,
      attachments || [],
      false,
    );
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── User reads their own conversation ───

export const getUserMessages = async (req, res) => {
  try {
    await messageService.markAsRead(req.params.id, "User");
    const result = await messageService.getMessages(req.params.id, req.query);
    res.json({
      success: true,
      data: result.messages,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Stats ───

export const getStats = async (req, res) => {
  try {
    const stats = await messageService.getConversationStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Convert Lead → Conversation ───

export const convertLeadToConversation = async (req, res) => {
  try {
    const conversation = await messageService.createConversationFromLead(
      req.params.leadId,
    );
    res.json({
      success: true,
      data: conversation,
      message: "Lead converted to conversation",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── User creates a new conversation from dashboard ───

export const createUserConversation = async (req, res) => {
  try {
    const { subject, message, topic } = req.body;
    if (!subject?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    const Lead = (await import("../lead/lead.model.js")).default;
    let lead = await Lead.findOne({ email: req.user.email });

    if (!lead) {
      lead = await Lead.create({
        name: req.user.name,
        email: req.user.email,
        leadType: "chat",
        subject: subject.trim(),
        message: message.trim(),
        status: "new",
      });
    }

    const existing = await Conversation.findOne({
      lead: lead._id,
      status: { $ne: "closed" },
    });

    let conversation;
    if (existing && req.body.newThread !== true) {
      conversation = existing;
    } else {
      conversation = await Conversation.create({
        lead: lead._id,
        subject: subject.trim(),
        source: "contact",
        status: "open",
        priority: topic === "urgent" ? "high" : "normal",
        unreadCount: { admin: 1, user: 0 },
      });
    }

    await Message.create({
      conversation: conversation._id,
      sender: lead._id,
      senderModel: "Lead",
      senderName: req.user.name,
      text: message.trim(),
      isAdminMessage: false,
    });

    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: {
        text: message.trim().substring(0, 200),
        senderModel: "Lead",
        createdAt: new Date(),
      },
    });

    // Send email to admin about new ticket
    try {
      const { sendEmail } = await import("../notifications/email.service.js");
      const { isNotificationEnabled } = await import("../settings/settings.service.js");
      const User = (await import("../user/user.model.js")).default;
      const admins = await User.find({ role: "admin" }).select("email name").lean();
      const enabled = await isNotificationEnabled("newLead");
      if (enabled && admins.length > 0) {
        for (const admin of admins) {
          await sendEmail({
            to: admin.email,
            subject: `New Support Message: ${subject.trim()}`,
            templateKey: "newSupportTicket",
            variables: {
              user_name: req.user.name,
              user_email: req.user.email,
              topic: topic || "general",
              subject: subject.trim(),
              message: message.trim(),
              dashboard_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/admin/inbox`,
            },
          }).catch((e) => console.warn("Admin email failed:", e.message));
        }
      }
    } catch (emailErr) {
      console.warn("Admin email notification failed:", emailErr.message);
    }

    try {
      const { getIO } = await import("../../socket.js");
      const io = getIO();
      if (io) {
        io.to("admins").emit("new_conversation", {
          conversationId: conversation._id.toString(),
          subject: subject.trim(),
          userName: req.user.name,
          userEmail: req.user.email,
          topic,
          message: message.trim(),
          timestamp: new Date(),
        });
      }
    } catch (socketErr) {
      console.warn("Socket notification failed:", socketErr.message);
    }

    res.status(201).json({
      success: true,
      data: conversation,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("[createUserConversation] ERROR:", error.message, error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── User updates their own conversation (e.g. close/reopen) ───

export const updateUserConversation = async (req, res) => {
  try {
    const conversation = await messageService.getConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    const allowedFields = ["status"];
    const update = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    }
    const updated = await messageService.updateConversation(req.params.id, update);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get user's own conversations (customer dashboard) ───

export const getUserConversations = async (req, res) => {
  try {
    const result = await messageService.getUserConversations(
      req.user.email,
      req.query,
      req.user._id,
    );
    res.json({
      success: true,
      data: result.conversations,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
