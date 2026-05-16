import Message from "./message.model.js";
import Conversation from "./conversation.model.js";
import { sendEmail } from "../notifications/email.service.js";
import { isNotificationEnabled } from "../settings/settings.service.js";

// ─── Conversations ───

export const getConversations = async (query = {}) => {
  const { page = 1, limit = 20, status, priority, assignedTo, search } = query;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (search) {
    filter.$or = [{ subject: { $regex: search, $options: "i" } }];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [conversations, total] = await Promise.all([
    Conversation.find(filter)
      .sort("-updatedAt")
      .skip(skip)
      .limit(parseInt(limit))
      .populate("lead", "name email phone leadType")
      .populate("participants", "name email role")
      .populate("assignedTo", "name email")
      .lean(),
    Conversation.countDocuments(filter),
  ]);

  return {
    conversations,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

export const getConversationById = async (id) => {
  return Conversation.findById(id)
    .populate("lead", "name email phone leadType status message subject")
    .populate("participants", "name email role")
    .populate("assignedTo", "name email");
};

export const createConversation = async (data) => {
  const conversation = await Conversation.create(data);
  return Conversation.findById(conversation._id)
    .populate("lead", "name email phone leadType")
    .populate("participants", "name email role");
};

export const updateConversation = async (id, data) => {
  return Conversation.findByIdAndUpdate(id, data, { new: true });
};

// ─── Messages ───

export const getMessages = async (conversationId, query = {}) => {
  const { page = 1, limit = 50 } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const total = await Message.countDocuments({ conversation: conversationId });

  let messages;
  try {
    messages = await Message.find({ conversation: conversationId })
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: "sender",
        select: "name email role",
        strictPopulate: false,
      })
      .lean();
  } catch {
    // Fallback: fetch without populate if all else fails
    messages = await Message.find({ conversation: conversationId })
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
  }

  return {
    messages: messages.reverse(), // oldest first for chat UI
    pagination: { page: parseInt(page), limit: parseInt(limit), total },
  };
};

export const sendMessage = async (
  conversationId,
  senderId,
  senderModel,
  text,
  attachments = [],
  isAdmin = false,
) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new Error("Conversation not found");

  // Admin IS a User in the DB — store as 'User' so Mongoose refPath populate works.
  // isAdminMessage flag is used by frontend for bubble styling and by markAsRead logic.
  const storedSenderModel = isAdmin ? "User" : senderModel;

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    senderModel: storedSenderModel,
    isAdminMessage: isAdmin,
    text,
    attachments,
  });

  // Update conversation last message + unread count
  const updateData = {
    lastMessage: {
      text: text.substring(0, 200),
      sender: senderId,
      senderModel: storedSenderModel,
      createdAt: new Date(),
    },
    status: "open",
  };

  if (isAdmin) {
    updateData["unreadCount.user"] = (conversation.unreadCount?.user || 0) + 1;
  } else {
    updateData["unreadCount.admin"] =
      (conversation.unreadCount?.admin || 0) + 1;
  }

  await Conversation.findByIdAndUpdate(conversationId, updateData);

  // Email notification to lead when admin replies
  if (isAdmin) {
    try {
      const populated = await Conversation.findById(conversationId).populate(
        "lead",
        "email name",
      );
      const replyEmailEnabled = await isNotificationEnabled("adminReply");
      if (replyEmailEnabled && populated?.lead?.email) {
        await sendEmail({
          to: populated.lead.email,
          subject: `Re: ${conversation.subject}`,
          templateKey: "adminReply",
          variables: {
            user_name: populated.lead.name,
            subject: conversation.subject,
            message: text,
            site_url: process.env.CLIENT_URL || "http://localhost:5173",
          },
        });
      }
    } catch (e) {
      console.error("[Message] Email notification failed:", e.message);
    }

    try {
      const { emitToGuestChat } = await import("../../socket.js");
      emitToGuestChat(conversationId.toString(), "admin_reply", {
        conversationId: conversationId.toString(),
        message: {
          text,
          isAdminMessage: true,
          senderName: "Support Agent",
          isAgent: true,
          createdAt: new Date(),
        },
      });
    } catch (e) {
      console.error("[Message] Guest socket emit error:", e.message);
    }
  }

  return Message.findById(message._id).populate("sender", "name email role");
};

export const markAsRead = async (conversationId, readerModel) => {
  const isAdminReading = readerModel === "Admin";

  // Admin reading → mark user/lead messages as read (isAdminMessage !== true)
  // User reading  → mark admin messages as read (isAdminMessage === true)
  await Message.updateMany(
    {
      conversation: conversationId,
      isAdminMessage: isAdminReading ? { $ne: true } : true,
      read: false,
    },
    { read: true, readAt: new Date() },
  );

  const updateField = isAdminReading ? "unreadCount.admin" : "unreadCount.user";
  await Conversation.findByIdAndUpdate(conversationId, { [updateField]: 0 });
};

export const getConversationStats = async () => {
  const [total, open, closed, unreadResult] = await Promise.all([
    Conversation.countDocuments(),
    Conversation.countDocuments({ status: "open" }),
    Conversation.countDocuments({ status: "closed" }),
    Conversation.aggregate([
      { $group: { _id: null, total: { $sum: "$unreadCount.admin" } } },
    ]),
  ]);

  return {
    total,
    open,
    closed,
    unreadAdmin: unreadResult[0]?.total || 0,
  };
};

export const createConversationFromLead = async (leadId) => {
  const Lead = (await import("../lead/lead.model.js")).default;
  const lead = await Lead.findById(leadId);
  if (!lead) throw new Error("Lead not found");

  // Idempotent: don't create duplicate conversations
  const existing = await Conversation.findOne({ lead: leadId });
  if (existing) return existing;

  const conversation = await Conversation.create({
    lead: leadId,
    subject: lead.subject || `Inquiry from ${lead.name}`,
    source: lead.leadType || "contact",
    participants: [],
    unreadCount: { admin: 1, user: 0 },
  });

  // Seed the conversation with the lead's original message
  if (lead.message) {
    await Message.create({
      conversation: conversation._id,
      sender: lead._id,
      senderModel: "Lead",
      text: lead.message,
    });
  }

  return Conversation.findById(conversation._id)
    .populate("lead", "name email phone leadType")
    .populate("participants", "name email role");
};

// ─── Get conversations for a specific user (customer dashboard) ───

export const getUserConversations = async (userEmail, query = {}) => {
  const { page = 1, limit = 20 } = query;

  // Find leads by this user's email
  const Lead = (await import("../lead/lead.model.js")).default;
  const leads = await Lead.find({ email: userEmail }).select("_id");
  const leadIds = leads.map((l) => l._id);

  const filter = { lead: { $in: leadIds } };
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [conversations, total] = await Promise.all([
    Conversation.find(filter)
      .sort("-updatedAt")
      .skip(skip)
      .limit(parseInt(limit))
      .populate("lead", "name email phone leadType")
      .lean(),
    Conversation.countDocuments(filter),
  ]);

  return {
    conversations,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};
