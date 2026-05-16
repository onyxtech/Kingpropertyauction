import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./modules/user/user.model.js";
import * as messageService from "./modules/message/message.service.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // ─── JWT Auth Middleware ───
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];
      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select(
        "name email role isActive",
      );
      if (!user || !user.isActive)
        return next(new Error("User not found or inactive"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    console.log(
      `[Socket] Connected: ${user.name} (${user.role}) — ${socket.id}`,
    );

    // ─── Auto-join admins room so backend can emit agent_requested notifications ───
    if (user.role === "admin" || user.role === "agent") {
      socket.join("admins");
    }

    // ─── Join conversation room ───
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conv_${conversationId}`);
    });

    // ─── Leave conversation room ───
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conv_${conversationId}`);
    });

    // ─── Send message ───
    // Rate limiting – max 10 messages per 10 seconds
    if (!socket.messageTimestamps) socket.messageTimestamps = [];

    socket.on(
      "send_message",
      async ({ conversationId, text, attachments = [] }, callback) => {
        try {
          const now = Date.now();
          socket.messageTimestamps = socket.messageTimestamps.filter(
            (t) => now - t < 10000,
          );
          if (socket.messageTimestamps.length >= 10) {
            return callback?.({
              success: false,
              error: "Too many messages. Please wait a moment.",
            });
          }
          socket.messageTimestamps.push(now);

          if (!text?.trim()) throw new Error("Message cannot be empty");

          const senderModel = user.role === "admin" ? "Admin" : "User";
          const isAdmin = user.role === "admin";

          const message = await messageService.sendMessage(
            conversationId,
            user._id,
            senderModel,
            text.trim(),
            attachments,
            isAdmin,
          );

          io.to(`conv_${conversationId}`).emit("new_message", {
            conversationId,
            message,
          });

          io.to(`user_${conversationId}_notify`).emit("conversation_updated", {
            conversationId,
            lastMessage: {
              text: text.substring(0, 100),
              senderModel,
              createdAt: new Date(),
            },
          });

          callback?.({ success: true, message });
        } catch (err) {
          console.error("[Socket] send_message error:", err.message);
          callback?.({ success: false, error: err.message });
        }
      },
    );

    // ─── Typing indicator ───
    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(`conv_${conversationId}`).emit("user_typing", {
        conversationId,
        user: { name: user.name, role: user.role },
        isTyping,
      });
    });

    // ─── Mark messages as read ───
    socket.on("mark_read", async ({ conversationId }) => {
      try {
        const readerModel = user.role === "admin" ? "Admin" : "User";
        await messageService.markAsRead(conversationId, readerModel);
        socket.to(`conv_${conversationId}`).emit("messages_read", {
          conversationId,
          readerModel,
        });
      } catch (err) {
        console.error("[Socket] mark_read error:", err.message);
      }
    });

    // ─── Join personal notification room ───
    socket.on("join_notifications", () => {
      socket.join(`notifications_${user._id}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Disconnected: ${user.name} — ${socket.id}`);
    });
  });

  initGuestSocket(io);
  console.log("🔌 Socket.io initialized");
  return io;
};

// ─── Emit to a specific conversation (called from services) ───
export const emitToConversation = (conversationId, event, data) => {
  if (io) {
    io.to(`conv_${conversationId}`).emit(event, data);
  }
};

// ─── Emit to a specific user (for notifications) ───
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`notifications_${userId}`).emit(event, data);
  }
};

// ─── Emit to all connected admin/agent sockets ───
export const emitToAdmins = (event, data) => {
  if (io) {
    io.to("admins").emit(event, data);
  }
};

// ─── Guest chat namespace (no auth required for public chat widget) ───
let guestNamespace = null;

export const initGuestSocket = (ioInstance) => {
  guestNamespace = ioInstance.of('/guest-chat');

  guestNamespace.on('connection', (socket) => {
    socket.on('join_chat', (conversationId) => {
      if (conversationId) {
        socket.join(`conv_${conversationId}`);
      }
    });

    socket.on('leave_chat', (conversationId) => {
      if (conversationId) {
        socket.leave(`conv_${conversationId}`);
      }
    });

    socket.on('disconnect', () => {});
  });

  return guestNamespace;
};

export const emitToGuestChat = (conversationId, event, data) => {
  if (guestNamespace) {
    guestNamespace.to(`conv_${conversationId}`).emit(event, data);
  }
  if (io) {
    io.to(`conv_${conversationId}`).emit(event, data);
  }
};

export const getIO = () => io;
