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

  // Emit to admins when user sends message
  if (!isAdmin) {
    try {
      const { emitToAdmins } = await import("../../socket.js");
      emitToAdmins("new_message_from_user", {
        conversationId: conversationId.toString(),
        message: {
          text: text.substring(0, 100),
          senderName: senderModel || "User",
          createdAt: new Date(),
        },
      });
    } catch (socketErr) {
      console.warn("Socket emit to admins failed:", socketErr.message);
    }
  }

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
      const User = (await import("../user/user.model.js")).default;
      const populated2 = await Conversation.findById(conversationId).populate("lead", "email name");
      const userAccount = await User.findOne({ email: populated2?.lead?.email }).select("name email").lean();
      if (userAccount) {
        const supportReplyEnabled = await isNotificationEnabled("adminReply");
        if (supportReplyEnabled) {
          await sendEmail({
            to: userAccount.email,
            subject: `Support Reply: ${populated2?.subject || "Your enquiry"}`,
            templateKey: "supportReply",
            variables: {
              user_name: userAccount.name,
              subject: populated2?.subject || "Your enquiry",
              message: text.substring(0, 500),
              dashboard_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard/messages`,
            },
          });
        }
      }
    } catch (e) {
      console.warn("supportReply email failed:", e.message);
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

  // Create DB notification + real-time socket for user when admin replies
  if (isAdmin) {
    try {
      const Notification = (await import("../notifications/notification.model.js")).default;
      const conv = await Conversation.findById(conversationId).populate("lead", "email name");
      if (conv?.lead?.email) {
        const User = (await import("../user/user.model.js")).default;
        const userAccount = await User.findOne({ email: conv.lead.email }).select("_id").lean();
        if (userAccount) {
          await Notification.create({
            type: "lead",
            icon: "message-square",
            message: `Support replied: ${text.substring(0, 80)}${text.length > 80 ? "..." : ""}`,
            link: "/dashboard/messages",
            color: "blue",
            targetUser: userAccount._id,
          }).catch((e) => console.warn("User notification failed:", e.message));

          const { emitToUser } = await import("../../socket.js");
          emitToUser(userAccount._id.toString(), "new_notification", {
            type: "message",
            message: `Support replied to your message`,
            link: "/dashboard/messages",
          });
        }
      }
    } catch (notifErr) {
      console.warn("User notification for admin reply failed:", notifErr.message);
    }
  }

  // Email admin when user replies (skip for property_inquiry - handled by CC block below)
  if (!isAdmin) {
    try {
      const convSource = await Conversation.findById(conversationId).select("source").lean();
      if (convSource?.source !== "property_inquiry") {
        const enabled = await isNotificationEnabled("newLead");
        if (enabled) {
          const User = (await import("../user/user.model.js")).default;
          const populated = await Conversation.findById(conversationId)
            .populate("lead", "email name")
            .populate("assignedTo", "email name");
          const admins = await User.find({ role: "admin" }).select("email name").lean();
          const replyText = text.substring(0, 200);
          for (const admin of admins) {
            await sendEmail({
              to: admin.email,
              subject: `New Reply: ${populated?.subject || "Support Conversation"}`,
              templateKey: "newSupportTicket",
              variables: {
                user_name: populated?.lead?.name || "User",
                user_email: populated?.lead?.email || "",
                topic: "reply",
                subject: `Re: ${populated?.subject || "Support Conversation"}`,
                message: replyText,
                dashboard_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/admin/inbox`,
              },
            }).catch((e) => console.warn("Admin reply email failed:", e.message));
          }
        }
      }
    } catch (e) {
      console.warn("User reply email to admin failed:", e.message);
    }
  }

  // Property inquiry: typed emails + admin CC for all non-admin messages
  if (!isAdmin) {
    try {
      const conv = await Conversation.findById(conversationId)
        .populate("lead", "name email subject")
        .populate("assignedTo", "_id name email role")
        .lean();

      if (conv?.source === "property_inquiry") {
        const User = (await import("../user/user.model.js")).default;
        const Notification = (await import("../notifications/notification.model.js")).default;
        const { emitToUser } = await import("../../socket.js");
        const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const propertyTitle = conv.subject?.replace("Property Enquiry: ", "") || "Property";

        const isOwnerSending = conv.assignedTo?._id &&
          conv.assignedTo._id.toString() === senderId?.toString();

        if (isOwnerSending) {
          // Owner/agent replying to buyer
          const replyEnabled = await isNotificationEnabled("ownerToBuyerReply");
          if (replyEnabled && conv.lead?.email) {
            const ownerRole = conv.assignedTo?.role === "agent" ? "Estate Agent" :
                              conv.assignedTo?.role === "seller" ? "Property Seller" : "Owner";
            await sendEmail({
              to: conv.lead.email,
              subject: `Reply about your property enquiry`,
              templateKey: "ownerToBuyerReply",
              variables: {
                buyer_name: conv.lead?.name || "Buyer",
                owner_name: conv.assignedTo?.name || "Property Team",
                owner_role: ownerRole,
                property_title: propertyTitle,
                message: text,
                property_url: `${siteUrl}/properties`,
                dashboard_url: `${siteUrl}/dashboard/messages`,
              },
            }).catch(e => console.warn("Owner reply email failed:", e.message));
          }

          // Bell notification to buyer when owner replies
          if (conv.lead?.email) {
            try {
              const UserModel = (await import("../user/user.model.js")).default;
              const buyerUser = await UserModel.findOne({ email: conv.lead.email }).select("_id").lean();
              if (buyerUser) {
                await Notification.create({
                  type: "lead",
                  icon: "mail",
                  message: `New reply about your property enquiry: "${text.substring(0, 60)}${text.length > 60 ? "..." : ""}`,
                  link: "/dashboard/messages",
                  color: "green",
                  targetUser: buyerUser._id,
                }).catch(e => console.warn("Buyer reply notification failed:", e.message));

                emitToUser(buyerUser._id.toString(), "new_notification", {
                  type: "lead",
                  message: "You have a new reply about your property enquiry",
                  link: "/dashboard/messages",
                  color: "green",
                });
              }
            } catch (e) {
              console.warn("Buyer bell notification failed:", e.message);
            }
          }

          // Admin CC when owner sends
          const ccEnabled = await isNotificationEnabled("adminInquiryCC");
          if (ccEnabled) {
            const admins = await User.find({ role: "admin" }).select("email name _id").lean();
            const ownerRole = conv.assignedTo?.role === "agent" ? "Estate Agent" :
                              conv.assignedTo?.role === "seller" ? "Property Seller" : "Owner";
            for (const admin of admins) {
              await sendEmail({
                to: admin.email,
                subject: `[CC] Property Enquiry Message: ${propertyTitle}`,
                templateKey: "adminInquiryCC",
                variables: {
                  sender_name: conv.assignedTo?.name || "Owner",
                  sender_role: ownerRole,
                  recipient_name: conv.lead?.name || "Buyer",
                  property_title: propertyTitle,
                  message: text,
                  admin_url: `${siteUrl}/admin/inbox`,
                },
              }).catch(e => console.warn("Admin CC email failed:", e.message));
            }
          }
        } else {
          // Buyer sending to owner
          if (conv.assignedTo?._id) {
            const ownerMsgEnabled = await isNotificationEnabled("buyerToOwnerMessage");
            if (ownerMsgEnabled) {
              const ownerUser = await User.findById(conv.assignedTo._id).select("name email").lean();
              if (ownerUser?.email) {
                await sendEmail({
                  to: ownerUser.email,
                  subject: `New message about your property`,
                  templateKey: "buyerToOwnerMessage",
                  variables: {
                    owner_name: ownerUser.name || "Owner",
                    buyer_name: conv.lead?.name || "Buyer",
                    buyer_email: conv.lead?.email || "Unknown",
                    property_title: propertyTitle,
                    message: text,
                    dashboard_url: `${siteUrl}/dashboard/messages`,
                  },
                }).catch(e => console.warn("Owner message email failed:", e.message));
              }
            }
          }

          // Admin CC when buyer sends
          const ccEnabled = await isNotificationEnabled("adminInquiryCC");
          if (ccEnabled) {
            const admins = await User.find({ role: "admin" }).select("email name _id").lean();
            for (const admin of admins) {
              await sendEmail({
                to: admin.email,
                subject: `[CC] Property Enquiry Message: ${propertyTitle}`,
                templateKey: "adminInquiryCC",
                variables: {
                  sender_name: conv.lead?.name || "Buyer",
                  sender_role: "Buyer",
                  recipient_name: conv.assignedTo?.name || "Property Owner",
                  property_title: propertyTitle,
                  message: text,
                  admin_url: `${siteUrl}/admin/inbox`,
                },
              }).catch(e => console.warn("Admin CC email failed:", e.message));
            }
          }

          // Owner bell notification when buyer sends
          if (conv.assignedTo?._id && conv.assignedTo._id.toString() !== senderId?.toString()) {
            await Notification.create({
              type: "lead",
              icon: "mail",
              message: `New enquiry message: "${text.substring(0, 60)}${text.length > 60 ? "..." : ""}`,
              link: "/dashboard/messages",
              color: "blue",
              targetUser: conv.assignedTo._id,
            }).catch(e => console.warn("Owner notification failed:", e.message));

            emitToUser(conv.assignedTo._id.toString(), "new_notification", {
              type: "lead",
              message: "New message about your property",
              link: "/dashboard/messages",
            });
          }
        }

        // Admin bell notification (always for both directions)
        await Notification.create({
          type: "lead",
          icon: "mail",
          message: `[CC] New message in property enquiry: "${text.substring(0, 60)}${text.length > 60 ? "..." : ""}`,
          link: "/admin/inbox",
          color: "blue",
          targetUser: null,
        }).catch(e => console.warn("Admin CC notification failed:", e.message));
      }
    } catch (ccErr) {
      console.warn("Admin CC failed:", ccErr.message);
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
    source: (() => {
      const sourceMap = {
        faq_support: 'faq',
        legal_enquiry: 'legal',
        register_alert: 'alert',
        referral_fee: 'referral',
        home_report: 'home-report',
      };
      const validSources = new Set([
        'contact','valuation','catalogue','chat','direct','general','referral',
        'finance','alert','solicitor','home-report','buying','selling','legal',
        'faq','newsletter','property_inquiry','faq_support','legal_enquiry',
        'register_alert','referral_fee','home_report',
      ]);
      const mapped = sourceMap[lead.leadType] || lead.leadType;
      return validSources.has(mapped) ? mapped : 'general';
    })(),
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

export const getUserConversations = async (userEmail, query = {}, userId = null) => {
  const { page = 1, limit = 20 } = query;

  // Find leads by this user's email
  const Lead = (await import("../lead/lead.model.js")).default;
  const leads = await Lead.find({ email: userEmail }).select("_id");
  const leadIds = leads.map((l) => l._id);

  // Include conversations by lead email OR by participant (for property_inquiry seller/agent)
  const orConditions = [];
  if (leadIds.length > 0) orConditions.push({ lead: { $in: leadIds } });
  if (userId) orConditions.push({ participants: userId });

  const filter = orConditions.length > 0 ? { $or: orConditions } : { _id: null };
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
