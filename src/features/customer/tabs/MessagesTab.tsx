import { useState, useEffect, useRef } from "react";
import {
  MessageSquare, Send, RefreshCw, Plus, X,
  ChevronRight, Loader2
} from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";
import { apiClient } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/toast";
import { useCustomerApi } from "../api/useCustomerApi";
import { getSocket } from "@/lib/socket";

const TOPICS = [
  { value: "general", label: "💬 General Enquiry" },
  { value: "property", label: "🏠 Property Query" },
  { value: "bid", label: "🔨 Bid / Auction Issue" },
  { value: "payment", label: "💳 Payment Issue" },
  { value: "account", label: "👤 Account Support" },
  { value: "urgent", label: "🚨 Urgent Matter" },
];

export default function MessagesTab() {
  const theme = useTheme();
  const { user } = useAuthStore();
  const { useMyMessages, useMyProperties } = useCustomerApi();
  const { data: conversations = [], isLoading, refetch } = useMyMessages();
  const { data: myProperties = [] } = useMyProperties();

  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newConvForm, setNewConvForm] = useState({
    topic: "general",
    subject: "",
    message: "",
    propertyId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newConvError, setNewConvError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time socket: refresh conversation list and active thread on new messages
  useEffect(() => {
    const socket = getSocket();
    const handleNewMessage = () => { refetch(); };
    const handleNewNotification = (data: any) => {
      if (data.link === "/dashboard/messages") {
        refetch();
        if (selectedConv) loadMessages(selectedConv);
      }
    };
    socket.on("new_message_from_user", handleNewMessage);
    socket.on("new_notification", handleNewNotification);
    return () => {
      socket.off("new_message_from_user", handleNewMessage);
      socket.off("new_notification", handleNewNotification);
    };
  }, [selectedConv, refetch]);

  const loadMessages = async (conv: any) => {
    setSelectedConv(conv);
    setLoadingMessages(true);
    try {
      const result = await apiClient.fetch(`/messages/my/${conv._id}/messages`);
      if (result.success) setMessages(result.data || []);
    } catch (err) {
      console.warn("Failed to load messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const updateConversation = async (id: string, data: any) => {
    try {
      await apiClient.fetch(`/messages/my/${id}/update`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setSelectedConv((prev: any) => ({ ...prev, ...data }));
      refetch();
    } catch (e) {
      console.warn("Update conversation failed:", e);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv) return;
    setSending(true);
    try {
      const result = await apiClient.fetch(
        `/messages/my/${selectedConv._id}/messages`,
        { method: "POST", body: JSON.stringify({ text: newMessage.trim() }) }
      );
      if (result.success) {
        setMessages((prev) => [...prev, result.data]);
        setNewMessage("");
        refetch();
      }
    } catch (err) {
      showError("Send failed", "Failed to send your message.");
      console.warn("Failed to send:", err);
    } finally {
      setSending(false);
    }
  };

  const handleNewConversation = async () => {
    if (!newConvForm.subject.trim()) { setNewConvError("Subject is required."); return; }
    if (!newConvForm.message.trim()) { setNewConvError("Message is required."); return; }
    setNewConvError("");
    setSubmitting(true);
    try {
      const result = await apiClient.fetch("/messages/my/new", {
        method: "POST",
        body: JSON.stringify({
          subject: newConvForm.subject,
          message: newConvForm.message,
          topic: newConvForm.topic,
          propertyId: newConvForm.propertyId || undefined,
          newThread: true,
        }),
      });
      if (result.success) {
        setSubmitSuccess(true);
        showSuccess("Message sent!", "Your conversation has been created.");
        setNewConvForm({ topic: "general", subject: "", message: "", propertyId: "" });
        refetch();
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowNewModal(false);
        }, 2000);
      }
    } catch (err) {
      showError("Send failed", "Failed to send message. Please try again.");
      console.warn("Failed to create conversation:", err);
      setNewConvError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">Messages</h2>
          <p className="text-slate-600 font-medium">Support conversations and notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all"
            title="Refresh"
          >
            <RefreshCw className="size-5 text-slate-600" />
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className={`px-5 py-2.5 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2`}
          >
            <Plus className="size-4" />
            New Message
          </button>
        </div>
      </div>

      {/* Conversations */}
      <div className="rounded-3xl shadow-2xl overflow-hidden border border-slate-200" style={{ height: "580px" }}>
        <div className="flex h-full">
          {/* Left - Conversation List */}
          <div className="w-80 border-r-2 border-slate-100 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <p className="font-black text-slate-900 text-sm">Support Conversations</p>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                {(conversations as any[]).length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (conversations as any[]).length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageSquare className="size-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-bold text-sm">No conversations yet</p>
                  <p className="text-slate-400 text-xs mt-1">Click "New Message" to contact support</p>
                  <button
                    onClick={() => setShowNewModal(true)}
                    className={`mt-4 px-4 py-2 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold text-sm hover:scale-105 transition-all`}
                  >
                    Start Conversation
                  </button>
                </div>
              ) : (
                (conversations as any[]).map((conv: any) => {
                  const unread = conv.unreadCount?.user || 0;
                  const isSelected = selectedConv?._id === conv._id;
                  return (
                    <button
                      key={conv._id}
                      onClick={() => loadMessages(conv)}
                      className={`w-full p-4 text-left border-b border-slate-100 transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-slate-900 text-sm truncate flex-1 pr-2">
                          {conv.subject || "Support"}
                        </p>
                        {unread > 0 && (
                          <span className="size-5 bg-blue-500 text-white text-xs font-black rounded-full flex items-center justify-center flex-shrink-0">
                            {unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {conv.lastMessage?.text || "No messages yet"}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          conv.status === "open" ? "bg-green-100 text-green-700" :
                          conv.status === "closed" ? "bg-slate-100 text-slate-500" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {conv.status || "open"}
                        </span>
                        <p className="text-xs text-slate-400">
                          {conv.updatedAt ? new Date(conv.updatedAt).toLocaleDateString() : ""}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right - Message Thread */}
          <div className="flex-1 flex flex-col min-w-0">
            {!selectedConv ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-8">
                  <MessageSquare className="size-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold mb-2">Select a conversation</p>
                  <p className="text-slate-400 text-sm mb-4">Or start a new one to get help</p>
                  <button
                    onClick={() => setShowNewModal(true)}
                    className={`px-5 py-2.5 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2 mx-auto`}
                  >
                    <Plus className="size-4" />
                    New Message
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b-2 border-slate-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-full bg-gradient-to-br ${theme.primary} flex items-center justify-center flex-shrink-0`}>
                      <MessageSquare className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">{selectedConv.subject}</p>
                      <p className="text-xs text-slate-500">King Property Support Team</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      selectedConv.status === "open" ? "bg-green-100 text-green-700" :
                      "bg-slate-100 text-slate-500"
                    }`}>
                      {selectedConv.status === "open" ? "🟢 Open" : "⚫ Closed"}
                    </span>
                    <button
                      onClick={() => updateConversation(selectedConv._id, {
                        status: selectedConv.status === "open" ? "closed" : "open"
                      })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedConv.status === "open"
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {selectedConv.status === "open" ? "Close" : "Reopen"}
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="size-8 text-slate-400 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400 text-sm">No messages yet</p>
                    </div>
                  ) : (
                    [...messages].map((msg: any) => {
                      const currentUserId = (user as any)?._id || user?.id;
                      const msgSenderId = msg.sender?._id || msg.sender;

                      // Right side: sent by current user, or initial lead inquiry matching user's email
                      const isMine = !!(
                        (currentUserId && msgSenderId &&
                          msgSenderId.toString() === currentUserId.toString()) ||
                        (msg.senderModel === "Lead" && !msg.isAdminMessage &&
                          selectedConv?.lead?.email === user?.email)
                      );

                      const senderName = msg.senderName ||
                        msg.sender?.name ||
                        (msg.isAdminMessage ? "Support" : "Agent");

                      return (
                        <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                            isMine
                              ? `bg-gradient-to-r ${theme.primary} text-white rounded-tr-none`
                              : "bg-white border-2 border-slate-100 text-slate-800 rounded-tl-none"
                          }`}>
                            {!isMine && (
                              <p className="text-xs font-bold opacity-60 mb-1">
                                {senderName}
                              </p>
                            )}
                            <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                            <p className={`text-xs mt-1.5 ${isMine ? "text-white/70" : "text-slate-400"}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Send Box */}
                {selectedConv?.status === "closed" ? (
                  <div className="flex items-center justify-between p-4 bg-amber-50 border-t border-amber-200">
                    <span className="text-sm text-amber-700 font-medium">This conversation is closed</span>
                    <button
                      onClick={() => updateConversation(selectedConv._id, { status: "open" })}
                      className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-all"
                    >
                      Reopen
                    </button>
                  </div>
                ) : (
                  <div className="p-4 border-t-2 border-slate-100 bg-slate-50">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className={`px-4 py-3 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:scale-100`}
                      >
                        {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className={`bg-gradient-to-r ${theme.primary} p-6 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <MessageSquare className="size-6 text-white" />
                <h3 className="text-xl font-black text-white">New Support Message</h3>
              </div>
              <button
                onClick={() => { setShowNewModal(false); setSubmitSuccess(false); setNewConvError(""); }}
                className="size-9 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <X className="size-5 text-white" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center">
                <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="size-8 text-green-600" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">Message Sent!</h4>
                <p className="text-slate-500">Our support team will respond shortly.</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Topic *</label>
                  <select
                    value={newConvForm.topic}
                    onChange={(e) => setNewConvForm({ ...newConvForm, topic: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TOPICS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {(newConvForm.topic === "property" || newConvForm.topic === "bid") && (Array.isArray(myProperties) && myProperties.length > 0) && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Related Property (optional)</label>
                    <select
                      value={newConvForm.propertyId}
                      onChange={(e) => setNewConvForm(f => ({ ...f, propertyId: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a property (optional)</option>
                      {(myProperties as any[]).map((p: any) => (
                        <option key={p._id} value={p._id}>{p.propertyTitle}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={newConvForm.subject}
                    onChange={(e) => { setNewConvError(""); setNewConvForm({ ...newConvForm, subject: e.target.value }); }}
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Message *</label>
                  <textarea
                    rows={5}
                    value={newConvForm.message}
                    onChange={(e) => { setNewConvError(""); setNewConvForm({ ...newConvForm, message: e.target.value }); }}
                    placeholder="Describe your issue in detail..."
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {newConvError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-bold text-red-700">{newConvError}</p>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setShowNewModal(false); setNewConvError(""); }}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNewConversation}
                    disabled={submitting || !newConvForm.subject.trim() || !newConvForm.message.trim()}
                    className={`flex-1 px-4 py-3 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2`}
                  >
                    {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
