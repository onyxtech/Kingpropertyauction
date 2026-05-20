import express from "express";
import Conversation from "../message/conversation.model.js";
import Message from "../message/message.model.js";
import Lead from "../lead/lead.model.js";
import { getIO } from "../../socket.js";
import { getRAGContext } from "./rag.service.js";
import { getKnowledgeContext } from "../knowledge/knowledge.service.js";
import { getApiIntegrations } from "../settings/settings.service.js";

const router = express.Router();

// ─── Fetch agent messages from knowledge base ───
const getAgentMessages = async () => {
  try {
    const Knowledge = (await import("../knowledge/knowledge.model.js")).default;
    const entry = await Knowledge.findOne({
      key: "agent_messages",
      isActive: true,
    }).lean();
    if (!entry) return null;
    const messages = {};
    for (const line of entry.content.split("\n")) {
      const colonIdx = line.indexOf(":");
      if (colonIdx > 0) {
        const key = line.substring(0, colonIdx).trim();
        const value = line.substring(colonIdx + 1).trim();
        messages[key] = value;
      }
    }
    return messages;
  } catch (e) {
    return null;
  }
};

// ─── System prompt ───
const SYSTEM_CONTEXT = `You are the King Property Auction AI Assistant. Help users with property auctions in the UK.
RULES:
- Be friendly, professional, and concise
- Use British English
- Keep replies under 200 words unless detail is genuinely needed
- Always give specific page URLs when directing users
- Never invent staff names, prices, or details not provided
- Use the PLATFORM KNOWLEDGE and LIVE DATA provided below to give accurate answers
- For property searches, list actual properties from the LIVE DATA section
- For how-to questions, give step by step instructions with URLs
- If asked about specific current prices or availability, use only the LIVE DATA provided
- CRITICAL: Always use relative URLs like /register, /free-valuation, /properties, /auctions, /contact-us, /auctions/:slug - NEVER use www.kingauction.com or any absolute URL in responses`;

// ─── XSS sanitization ───
const sanitizeText = (text) => String(text).replace(/<[^>]*>/g, '');

// ─── Agent request detection ───
const isAgentRequest = (text) => {
  const t = text.toLowerCase();
  return (
    /\b(agent|human|person|staff|representative|support|help desk|customer service|customer support|custom support|live chat|speak to|talk to|connect|transfer|handover|real person|someone|anybody|anyone)\b/.test(
      t,
    ) && !/how (do|can|to)|what is|explain|tell me|information about/.test(t)
  );
};

// ─── Rule-based fallback ───
const getRuleBasedResponse = (text) => {
  const t = text.toLowerCase();
  if (
    /\b(hi|hello|hey|good\s+morning|good\s+afternoon|good\s+evening)\b/.test(t)
  )
    return "Hello! Welcome to King Property Auction. How can I assist you today?";
  if (/list|sell|selling|market/.test(t))
    return "To list your property, start with a free valuation at /free-valuation. No obligation required.";
  if (/auction|how.*(work|process|buy|purchase)/.test(t))
    return "Our auctions work by competitive bidding. The highest bid above the reserve price wins. Visit /auctions to see current listings.";
  if (/register|sign.?up|account/.test(t))
    return "Create a free account at /register to start bidding. ID verification required.";
  if (/bid|bidding|proxy|auto.?bid/.test(t))
    return "Bid live, online, or by telephone. Auto-bidding available - set your maximum and we bid on your behalf. Visit /auctions to browse.";
  if (/valuation|value|worth|estimate/.test(t))
    return "Book a free property valuation at /free-valuation. Our experts respond within 48 hours.";
  if (/contact|phone|call|email|office|address|hours/.test(t))
    return "For contact details, phone numbers, and office hours please visit /contact-us.";
  if (/catalogue|brochure/.test(t))
    return "Request a free catalogue at /catalogue-request. Available online, by email, or by post.";
  if (/legal|solicitor|contract|pack/.test(t))
    return "Legal packs are available for all properties. Always review with a solicitor before bidding. Visit /properties to access legal packs.";
  if (/finance|mortgage|loan|deposit/.test(t))
    return "Auction finance and bridging loans available. Visit /auction-finance for more information.";
  return "For specific assistance please visit /contact-us or use the chat to ask any question about our auctions.";
};

const callAI = async (
  userText,
  conversationHistory = [],
  systemPrompt = SYSTEM_CONTEXT,
) => {
  const integrations = await getApiIntegrations();
  const apiKey = integrations.groqApiKey || process.env.GROQ_API_KEY;
  const Groq = (await import("groq-sdk")).default;
  const groq = new Groq({ apiKey });

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: userText },
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    max_tokens: 400,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || "";
};

// ─── POST /api/chat/ai ───
router.post("/ai", async (req, res) => {
  try {
    const { message, conversationId, visitorName, visitorEmail, department } =
      req.body;

    if (!message?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    const userText = sanitizeText(message.trim());

    // ─── Find or create conversation + lead ───
    let conversation = null;
    let lead = null;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId).catch(
        () => null,
      );
      if (conversation?.lead) {
        lead = await Lead.findById(conversation.lead).catch(() => null);
      }
    }

    if (!conversation && visitorName && visitorEmail) {
      const emailLower = visitorEmail.toLowerCase().trim();

      lead = await Lead.findOneAndUpdate(
        { email: emailLower },
        {
          $setOnInsert: {
            name: visitorName.trim(),
            email: emailLower,
            leadType: "chat",
            subject: "Live Chat Enquiry",
            message: userText.substring(0, 5000),
          },
        },
        { upsert: true, new: true },
      );

      conversation = await Conversation.findOne({ lead: lead._id });
      if (!conversation) {
        conversation = await Conversation.create({
          lead: lead._id,
          subject: `Chat with ${visitorName.trim()}`,
          source: "chat",
          participants: [],
          unreadCount: { admin: 1, user: 0 },
        });
      }
    }

    const wasAgentRequested = conversation?.agentModeActive || false;

    // ─── Save visitor message to DB ───
    if (conversation && lead) {
      await Message.create({
        conversation: conversation._id,
        sender: lead._id,
        senderModel: "Lead",
        senderName: visitorName?.trim() || lead.name || "Visitor",
        text: userText,
        isAdminMessage: false,
      });

      await Conversation.findByIdAndUpdate(conversation._id, {
        $set: {
          lastMessage: {
            text: userText.substring(0, 200),
            senderModel: "Lead",
            createdAt: new Date(),
          },
          status: "open",
        },
        $inc: { "unreadCount.admin": 1 },
      });

      const io = getIO();
      if (io) {
        io.to(`conv_${conversation._id}`).emit("new_message", {
          conversationId: conversation._id.toString(),
          message: {
            _id: `visitor_${Date.now()}`,
            text: userText,
            isAdminMessage: false,
            senderName: visitorName?.trim() || lead.name || "Visitor",
            senderModel: "Lead",
            createdAt: new Date(),
          },
        });
      }
    }

    // ─── Agent detection — checked BEFORE AI is invoked ───
    const agentRequested = isAgentRequest(userText);

    if (agentRequested) {
      // Notify admins
      const io = getIO();
      if (io) {
        io.to("admins").emit("agent_requested", {
          conversationId: conversation?._id?.toString() || null,
          visitorName: visitorName?.trim() || lead?.name || "Visitor",
          visitorEmail: visitorEmail?.toLowerCase() || lead?.email || "",
          department: department || "General Enquiry",
          message: userText,
          timestamp: new Date(),
        });
      }
      // Persist agent mode on conversation
      if (conversation) {
        await Conversation.findByIdAndUpdate(conversation._id, {
          agentModeActive: true,
          priority: "urgent",
        });
      }
      // Stream acknowledgment — skip AI entirely
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();
      const agentMsgs = await getAgentMessages();
      const ackMsg =
        agentMsgs?.AGENT_ACK ||
        "I've notified our support team. Someone will be with you shortly. Please visit /contact-us for immediate help.";
      for (const word of ackMsg.split(" ")) {
        res.write(`data: ${JSON.stringify({ text: word + " " })}\n\n`);
        await new Promise((r) => setTimeout(r, 20));
      }
      res.write(
        `data: ${JSON.stringify({
          done: true,
          conversationId: conversation?._id?.toString() || null,
          agentRequested: true,
        })}\n\n`,
      );
      res.end();
      return;
    }

    if (wasAgentRequested) {
      // Agent mode already active — holding message, skip AI
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();
      const agentMsgs2 = await getAgentMessages();
      const waitMsg =
        agentMsgs2?.AGENT_HOLD ||
        "Our support agent will respond to your message shortly. Please hold on.";
      for (const word of waitMsg.split(" ")) {
        res.write(`data: ${JSON.stringify({ text: word + " " })}\n\n`);
        await new Promise((r) => setTimeout(r, 20));
      }
      res.write(
        `data: ${JSON.stringify({
          done: true,
          conversationId: conversation?._id?.toString() || null,
          agentRequested: false,
        })}\n\n`,
      );
      res.end();
      return;
    }

    // ─── SSE headers ───
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let fullText = "";

    const integrations2 = await getApiIntegrations();
    const activeApiKey = integrations2.groqApiKey || process.env.GROQ_API_KEY;
    if (!activeApiKey) {
      // Rule-based fallback
      const fallback = getRuleBasedResponse(userText);

      for (const word of fallback.split(" ")) {
        res.write(`data: ${JSON.stringify({ text: word + " " })}\n\n`);
        await new Promise((r) => setTimeout(r, 25));
      }
      fullText = fallback;
    } else {
      try {
        // ─── Build context: Knowledge Base + RAG ───
        let enrichedPrompt = SYSTEM_CONTEXT;
        try {
          const knowledgeContext = await getKnowledgeContext();
          if (knowledgeContext) {
            enrichedPrompt +=
              "\n\n=== PLATFORM KNOWLEDGE (USE THIS TO ANSWER HOW-TO QUESTIONS) ===\n" +
              knowledgeContext;
          }
          const ragContext = await getRAGContext(userText);
          if (ragContext) {
            enrichedPrompt +=
              "\n\n=== LIVE PLATFORM DATA (USE THIS FOR CURRENT LISTINGS AND AUCTIONS) ===\n" +
              ragContext;
          }
        } catch (contextErr) {
          console.error("[Chat] Context build error:", contextErr.message);
        }

        // ─── Build conversation history ───
        let history = [];
        if (conversation) {
          const recentMsgs = await Message.find({
            conversation: conversation._id,
          })
            .sort("-createdAt")
            .limit(8)
            .lean();

          history = recentMsgs
            .reverse()
            .slice(0, -1)
            .map((m) => ({
              role: m.isAdminMessage ? "assistant" : "user",
              content: m.text,
            }))
            .filter((m) => m.content?.trim());
        }

        const aiText = await callAI(userText, history, enrichedPrompt);
        fullText = aiText;

        // Stream word by word
        const words = aiText.split(" ");
        for (const word of words) {
          res.write(`data: ${JSON.stringify({ text: word + " " })}\n\n`);
          await new Promise((r) => setTimeout(r, 18));
        }
      } catch (aiErr) {
        console.error("[AI Chat] Error:", aiErr.message);
        const fallback = agentRequested
          ? "I've notified our team. Someone will be in touch shortly!"
          : getRuleBasedResponse(userText);
        fullText = fallback;
        for (const word of fallback.split(" ")) {
          res.write(`data: ${JSON.stringify({ text: word + " " })}\n\n`);
          await new Promise((r) => setTimeout(r, 25));
        }
      }
    }

    // ─── Save AI response to DB ───
    if (conversation && lead && fullText) {
      try {
        await Message.create({
          conversation: conversation._id,
          sender: lead._id,
          senderModel: "Lead",
          senderName: "AI Assistant",
          text: fullText,
          isAdminMessage: true,
        });

        await Conversation.findByIdAndUpdate(conversation._id, {
          $set: {
            lastMessage: {
              text: fullText.substring(0, 200),
              senderModel: "User",
              createdAt: new Date(),
            },
          },
        });

        const io = getIO();
        if (io) {
          io.to(`conv_${conversation._id}`).emit("new_message", {
            conversationId: conversation._id.toString(),
            message: {
              _id: `ai_${Date.now()}`,
              text: fullText,
              isAdminMessage: true,
              senderName: "AI Assistant",
              senderModel: "User",
              createdAt: new Date(),
            },
          });
        }
        try {
          const { emitToGuestChat } = await import("../../socket.js");
          emitToGuestChat(conversation._id.toString(), "admin_reply", {
            conversationId: conversation._id.toString(),
            message: {
              _id: `ai_${Date.now()}`,
              text: fullText,
              isAdminMessage: true,
              senderName: "AI Assistant",
              isAgent: false,
              createdAt: new Date(),
            },
          });
        } catch (emitErr) {
          console.error("[Chat] Guest emit error:", emitErr.message);
        }
      } catch (saveErr) {
        console.error("[AI Chat] Failed to save AI response:", saveErr.message);
      }
    }

    res.write(
      `data: ${JSON.stringify({
        done: true,
        conversationId: conversation?._id?.toString() || null,
        agentRequested,
      })}\n\n`,
    );
    res.end();
  } catch (error) {
    console.error("[AI Chat] Error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "AI service error" });
    } else {
      try {
        res.write(`data: ${JSON.stringify({ error: true, done: true })}\n\n`);
      } catch (e) {
        console.error("[AI Chat] Write error:", e.message);
      }
      res.end();
    }
  }
});

// ─── GET /api/chat/history/:conversationId — for widget session restore ───
router.get("/history/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversation: conversationId })
      .sort("createdAt")
      .limit(50)
      .lean();
    res.json({ success: true, data: { messages } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
