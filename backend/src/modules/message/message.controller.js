import * as messageService from "./message.service.js";

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

// ─── Get user's own conversations (customer dashboard) ───

export const getUserConversations = async (req, res) => {
  try {
    const result = await messageService.getUserConversations(
      req.user.email,
      req.query,
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
