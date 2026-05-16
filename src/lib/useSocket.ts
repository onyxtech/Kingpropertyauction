import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/authStore";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let socketInstance: Socket | null = null;

// ─── Singleton socket — one connection per browser session ───
const getSocket = (token: string): Socket => {
  if (socketInstance?.connected) return socketInstance;

  socketInstance = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  return socketInstance;
};

export const useSocket = () => {
  const { token, isAuthenticated } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = getSocket(token);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
      socket.emit("join_notifications");
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    return () => {
      // Don't disconnect on unmount — keep singleton alive
    };
  }, [isAuthenticated, token]);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit("join_conversation", conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit("leave_conversation", conversationId);
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, text: string, attachments: any[] = []): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          reject(new Error("Socket not connected"));
          return;
        }
        socketRef.current.emit("send_message", { conversationId, text, attachments }, (response: any) => {
          if (response?.success) resolve(response);
          else reject(new Error(response?.error || "Send failed"));
        });
      });
    },
    []
  );

  const sendTyping = useCallback((conversationId: string, isTyping: boolean) => {
    socketRef.current?.emit("typing", { conversationId, isTyping });
  }, []);

  const markRead = useCallback((conversationId: string) => {
    socketRef.current?.emit("mark_read", { conversationId });
  }, []);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  const off = useCallback((event: string, handler?: (...args: any[]) => void) => {
    socketRef.current?.off(event, handler);
  }, []);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected ?? false,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
    markRead,
    on,
    off,
  };
};

// ─── Disconnect on logout (call this from your logout handler) ───
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};