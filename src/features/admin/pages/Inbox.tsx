import { useState, useEffect, useRef, useCallback } from "react";
import {
  Mail, Search, Send, X, MessageCircle, User,
  InboxIcon, Clock, CheckCheck, Circle, AlertCircle,
  ChevronDown, Paperclip, MoreVertical,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useSocket } from "@/lib/useSocket";
import { toast } from "sonner";

export default function Inbox() {
  const queryClient = useQueryClient();
  const { joinConversation, leaveConversation, sendMessage: socketSend, sendTyping, markRead, on, off } = useSocket();

  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [filter, setFilter] = useState("open");
  const [search, setSearch] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [agentRequests, setAgentRequests] = useState<any[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Fetch conversations ───
  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ["conversations", filter, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      if (search) params.set("search", search);
      return apiClient.fetch(`/conversations?${params}`);
    },
    refetchInterval: 30000,
  });

  const conversations = conversationsData?.data || [];

  const { data: stats } = useQuery({
    queryKey: ["conversations", "stats"],
    queryFn: () => apiClient.fetch("/conversations/stats"),
    refetchInterval: 15000,
  });

  // ─── Fetch messages for selected conversation ───
  const { data: messagesData } = useQuery({
    queryKey: ["messages", selectedConv?._id],
    queryFn: () => apiClient.fetch(`/conversations/${selectedConv._id}/messages`),
    enabled: !!selectedConv,
  });

  const messages = messagesData?.data || [];

  // ─── Socket events ───
  useEffect(() => {
    const removeNewMsg = on("new_message", ({ conversationId, message }) => {
      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old) return old;
        const exists = old.data?.some((m: any) => m._id === message._id);
        if (exists) return old;
        return { ...old, data: [...(old.data || []), message] };
      });

      // Update conversation list unread/lastMessage
      queryClient.setQueryData(["conversations", filter, search], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((c: any) =>
            c._id === conversationId
              ? {
                  ...c,
                  lastMessage: message,
                  unreadCount: {
                    ...c.unreadCount,
                    admin: selectedConv?._id === conversationId ? 0 : (c.unreadCount?.admin || 0) + 1,
                  },
                }
              : c
          ),
        };
      });
    });

    const removeTyping = on("user_typing", ({ conversationId, user, isTyping: typing }) => {
      if (conversationId !== selectedConv?._id) return;
      setTypingUsers(prev =>
        typing ? [...prev.filter(n => n !== user.name), user.name] : prev.filter(n => n !== user.name)
      );
    });

    const removeRead = on("messages_read", ({ conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    });

    const removeAgentReq = on("agent_requested", (data: any) => {
      setAgentRequests(prev => {
        if (prev.some((r: any) => r.conversationId === data.conversationId)) return prev;
        return [...prev, data];
      });
      toast.info(`🙋 ${data.visitorName} is requesting a human agent`, { duration: 8000 });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setTimeout(() => {
        setAgentRequests(prev => prev.filter((r: any) => r.conversationId !== data.conversationId));
      }, 60000);
    });

    return () => {
      removeNewMsg();
      removeTyping();
      removeRead();
      removeAgentReq();
    };
  }, [on, selectedConv?._id, filter, search, queryClient]);

  // ─── Join/leave conversation rooms ───
  useEffect(() => {
    if (selectedConv?._id) {
      joinConversation(selectedConv._id);
      markRead(selectedConv._id);
      return () => leaveConversation(selectedConv._id);
    }
  }, [selectedConv?._id, joinConversation, leaveConversation, markRead]);

  // ─── Scroll to bottom within messages container (never scrolls the whole page) ───
  const prevMessageCount = useRef(0);
  useEffect(() => {
    if (!messagesContainerRef.current || messages.length === 0) return;
    const isFirstLoad = prevMessageCount.current === 0 && messages.length > 0;
    prevMessageCount.current = messages.length;
    const container = messagesContainerRef.current;
    if (isFirstLoad) {
      container.scrollTop = container.scrollHeight;
    } else {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  // ─── Typing indicator ───
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    if (!isTyping && selectedConv) {
      setIsTyping(true);
      sendTyping(selectedConv._id, true);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (selectedConv) sendTyping(selectedConv._id, false);
    }, 1500);
  };

  // ─── Send message via socket ───
  const handleSend = async () => {
    if (!messageText.trim() || !selectedConv || isSending) return;
    const text = messageText.trim();
    setMessageText("");
    setIsSending(true);
    setIsTyping(false);
    sendTyping(selectedConv._id, false);

    try {
      await socketSend(selectedConv._id, text);
    } catch (err: any) {
      // Fallback to REST if socket fails
      try {
        await apiClient.fetch(`/conversations/${selectedConv._id}/messages`, {
          method: "POST",
          body: JSON.stringify({ text }),
        });
        queryClient.invalidateQueries({ queryKey: ["messages", selectedConv._id] });
      } catch {
        toast.error("Failed to send message");
        setMessageText(text);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ─── Update conversation (status/priority) ───
  const updateConv = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.fetch(`/conversations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversations"] }),
  });

  const getSenderName = (msg: any) => {
    if (msg.isAdminMessage) return "You";
    if (msg.senderName) return msg.senderName;
    if (msg.sender?.name) return msg.sender.name;
    return selectedConv?.lead?.name || "User";
  };

  const openConversation = (conv: any) => {
    setSelectedConv(conv);
    setTypingUsers([]);
    setAgentRequests(prev => prev.filter((r: any) => r.conversationId !== conv._id));
    prevMessageCount.current = 0;
  };

  const priorityColors: Record<string, string> = {
    low: "bg-slate-100 text-slate-600",
    normal: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  const sourceIcons: Record<string, string> = {
    contact: "💬",
    valuation: "🏠",
    catalogue: "📚",
    chat: "🤖",
    direct: "✉️",
  };

  return (
    <AdminLayout activeTab="inbox" onTabChange={() => {}}>
      <div className="flex h-[calc(100vh-120px)] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">

        {/* ── Left Panel: Conversation List ── */}
        <div className="w-80 flex-shrink-0 border-r-2 border-slate-200 bg-white flex flex-col">

          {/* Header */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <InboxIcon className="size-5 text-blue-600" />
                Inbox
                {(stats?.data?.unreadAdmin || 0) > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {stats.data.unreadAdmin}
                  </span>
                )}
              </h2>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1">
              {[
                { key: "all", label: "All", count: stats?.data?.total },
                { key: "open", label: "Open", count: stats?.data?.open },
                { key: "closed", label: "Closed", count: stats?.data?.closed },
              ].map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                    filter === f.key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  {f.label} {f.count !== undefined ? `(${f.count})` : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12">
                <InboxIcon className="size-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No conversations</p>
              </div>
            ) : (
              conversations.map((conv: any) => (
                <div key={conv._id}
                  onClick={() => openConversation(conv)}
                  className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-blue-50 ${
                    selectedConv?._id === conv._id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                  }`}>
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="size-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                        {conv.lead?.name?.charAt(0) || "?"}
                      </div>
                      {(conv.unreadCount?.admin || 0) > 0 && (
                        <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {conv.unreadCount.admin}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-sm truncate ${conv.unreadCount?.admin > 0 ? "font-black text-slate-900" : "font-semibold text-slate-700"}`}>
                          {conv.lead?.name || "Unknown"}
                        </p>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {new Date(conv.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{conv.subject}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {conv.lastMessage?.text || "No messages yet"}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px]">{sourceIcons[conv.source] || "💬"}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${priorityColors[conv.priority] || "bg-slate-100"}`}>
                          {conv.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Right Panel: Chat ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {agentRequests.length > 0 && (
            <div className="bg-orange-500 text-white px-4 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 flex-shrink-0" />
                <span className="text-sm font-bold">
                  {agentRequests[0].visitorName} wants help with: {agentRequests[0].department || 'General Enquiry'}
                </span>
                <span className="text-xs text-orange-100">
                  · {agentRequests[0].visitorEmail}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const conv = conversations.find(
                      (c: any) => c._id === agentRequests[0].conversationId
                    );
                    if (conv) openConversation(conv);
                    setAgentRequests(prev => prev.slice(1));
                  }}
                  className="px-3 py-1 bg-white text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors"
                >
                  Open Chat
                </button>
                <button
                  onClick={() => setAgentRequests(prev => prev.slice(1))}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          )}
          {!selectedConv ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="size-20 rounded-3xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <InboxIcon className="size-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">Select a conversation</h3>
                <p className="text-sm text-slate-400 mt-1">Choose from the left to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {/* Conversation header */}
              <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {selectedConv.lead?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{selectedConv.subject}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      {selectedConv.lead?.name && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <User className="size-3" />{selectedConv.lead.name}
                        </span>
                      )}
                      {selectedConv.lead?.email && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Mail className="size-3" />{selectedConv.lead.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedConv.priority || "normal"}
                    onChange={e => {
                      setSelectedConv({ ...selectedConv, priority: e.target.value });
                      updateConv.mutate({ id: selectedConv._id, data: { priority: e.target.value } });
                    }}
                    className={`px-2 py-1 rounded-lg text-xs font-bold border-0 cursor-pointer ${priorityColors[selectedConv.priority] || "bg-slate-100"}`}>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>

                  <button
                    onClick={() => {
                      const newStatus = selectedConv.status === "open" ? "closed" : "open";
                      setSelectedConv({ ...selectedConv, status: newStatus });
                      updateConv.mutate({ id: selectedConv._id, data: { status: newStatus } });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedConv.status === "open"
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}>
                    {selectedConv.status === "open" ? "Close" : "Reopen"}
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    No messages yet — start the conversation
                  </div>
                )}

                {messages.map((msg: any, idx: number) => {
                  const isAdmin = !!msg.isAdminMessage;
                  const showDate = idx === 0 || new Date(messages[idx - 1]?.createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

                  return (
                    <div key={msg._id || idx}>
                      {showDate && (
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-slate-200" />
                          <span className="text-[11px] text-slate-400 font-medium">
                            {new Date(msg.createdAt).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                          </span>
                          <div className="flex-1 h-px bg-slate-200" />
                        </div>
                      )}

                      <div className={`flex items-end gap-2 ${isAdmin ? "justify-end" : "justify-start"}`}>
                        {!isAdmin && (
                          <div className="size-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mb-1">
                            {selectedConv.lead?.name?.charAt(0) || "?"}
                          </div>
                        )}

                        <div className={`max-w-[65%] ${isAdmin ? "items-end" : "items-start"} flex flex-col`}>
                          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            isAdmin
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md"
                              : "bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm"
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {/* Attachments */}
                            {msg.attachments?.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {msg.attachments.map((att: any, i: number) =>
                                  att.type?.startsWith("image/") ? (
                                    <img key={i} src={att.url} alt={att.name} className="max-w-[200px] rounded-lg border border-white/20 mt-1" />
                                  ) : (
                                    <a key={i} href={att.url} target="_blank" rel="noopener noreferrer"
                                      className={`flex items-center gap-1 text-xs hover:underline mt-1 ${isAdmin ? "text-white/80" : "text-blue-600"}`}>
                                      <Paperclip className="size-3" />{att.name}
                                    </a>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                          <div className={`flex items-center gap-1 mt-1 ${isAdmin ? "justify-end" : "justify-start"}`}>
                            <span className="text-[10px] text-slate-400">
                              {getSenderName(msg)}
                              {" · "}
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {isAdmin && msg.read && <CheckCheck className="size-3 text-blue-400" />}
                          </div>
                        </div>

                        {isAdmin && (
                          <div className="size-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mb-1">
                            A
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {typingUsers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-slate-300 flex items-center justify-center">
                      <User className="size-3 text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm">
                      <div className="flex items-center gap-1">
                        <div className="size-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="size-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="size-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{typingUsers[0]} is typing...</span>
                  </div>
                )}

              </div>

              {/* Reply box */}
              <div className="px-6 py-4 bg-white border-t border-slate-200 flex-shrink-0">


                {selectedConv.status === "closed" ? (
                  <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-sm text-amber-700 font-medium">This conversation is closed</span>
                    <button
                      onClick={() => {
                        setSelectedConv({ ...selectedConv, status: "open" });
                        updateConv.mutate({ id: selectedConv._id, data: { status: "open" } });
                      }}
                      className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold">
                      Reopen
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={messageText}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your reply... (Enter to send)"
                      className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!messageText.trim() || isSending}
                      className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                      {isSending ? (
                        <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                    </button>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  🔌 Real-time · User notified via email on reply
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
