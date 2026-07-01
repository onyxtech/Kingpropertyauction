// src\features\admin\components\users\UserMessaging.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  MoreVertical,
  CircleDot,
  MessageSquare,
  Mail,
  Clock,
  CircleCheck,
  Paperclip,
  Smile,
  ChevronDown,
} from "lucide-react";
import { UserRecord } from "./UserActivityView";
import { UserAvatar } from "./shared/UserAvatar";

interface ChatMessage {
  id: string;
  from: "admin" | "user";
  text: string;
  time: string;
  type: "text" | "email";
  read: boolean;
}

const QUICK_REPLIES = [
  "Thank you for your enquiry.",
  "Your KYC verification is now complete.",
  "Your bid was successful — please complete payment.",
  "Your property listing has been approved.",
  "Please provide the required documents at your earliest convenience.",
  "Your completion statement is ready to download.",
];

export function UserMessaging({ user, onClose }: { user: UserRecord; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m1", from: "user", text: "Hi, I wanted to ask about the completion timeline for my purchase.", time: "09:14", type: "text", read: true },
    { id: "m2", from: "admin", text: "Good morning! The completion is scheduled for 10th June. Our legal team will be in touch shortly.", time: "09:22", type: "text", read: true },
    { id: "m3", from: "user", text: "Great, thank you. Do I need to arrange my solicitor or will you provide one?", time: "09:25", type: "text", read: true },
    { id: "m4", from: "admin", text: "You will need your own solicitor. We recommend you appoint one as soon as possible to avoid delays.", time: "09:30", type: "text", read: true },
  ]);
  const [draft, setDraft] = useState("");
  const [msgType, setMsgType] = useState<"text" | "email">("text");
  const [subject, setSubject] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      from: "admin",
      text: draft.trim(),
      time,
      type: msgType,
      read: true,
    }]);
    setDraft("");
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const unread = messages.filter(m => m.from === "user" && !m.read).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center md:justify-end p-0 md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full md:w-[420px] h-[92vh] md:h-[640px] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="relative shrink-0">
            <UserAvatar name={user.name} size="sm" />
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-green-400 border-2 border-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-white text-sm truncate">{user.name}</p>
            <div className="flex items-center gap-1.5">
              <CircleDot className="size-2.5 text-green-300" />
              <p className="text-white/70 text-xs">{user.role} · Online</p>
            </div>
          </div>
          {unread > 0 && (
            <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{unread} new</span>
          )}
          <div className="flex items-center gap-1">
            <button className="size-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all text-white">
              <MoreVertical className="size-4" />
            </button>
            <button onClick={onClose} className="size-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all text-white">
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Type toggle */}
        <div className="flex border-b border-slate-100 bg-slate-50 shrink-0">
          {(["text", "email"] as const).map(t => (
            <button
              key={t}
              onClick={() => setMsgType(t)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black capitalize transition-all border-b-2 ${
                msgType === t ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {t === "text" ? <MessageSquare className="size-3.5" /> : <Mail className="size-3.5" />}
              {t === "text" ? "Message" : "Email"}
            </button>
          ))}
        </div>

        {/* Email subject line */}
        <AnimatePresence>
          {msgType === "email" && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden shrink-0">
              <div className="px-4 py-2 border-b border-slate-100 bg-white">
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Email subject..."
                  className="w-full text-sm focus:outline-none text-slate-700 placeholder-slate-400"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message thread */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">Today</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {messages.map((msg) => {
            const isAdmin = msg.from === "admin";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isAdmin ? "justify-end" : "justify-start"} gap-2`}
              >
                {!isAdmin && (
                  <div className="size-7 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-black shrink-0 mt-1">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </div>
                )}
                <div className={`max-w-[75%] ${isAdmin ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {msg.type === "email" && (
                    <span className="text-xs text-slate-400 flex items-center gap-1 self-end">
                      <Mail className="size-3" />email
                    </span>
                  )}
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isAdmin
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm"
                      : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 text-xs text-slate-400 ${isAdmin ? "justify-end" : ""}`}>
                    <Clock className="size-2.5" />{msg.time}
                    {isAdmin && <CircleCheck className="size-2.5 text-blue-400" />}
                  </div>
                </div>
                {isAdmin && (
                  <div className="size-7 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-xs font-black shrink-0 mt-1">
                    A
                  </div>
                )}
              </motion.div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        <AnimatePresence>
          {showQuickReplies && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden shrink-0 border-t border-slate-100 bg-white"
            >
              <div className="p-3 space-y-1.5 max-h-40 overflow-y-auto">
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Quick Replies</p>
                {QUICK_REPLIES.map(r => (
                  <button
                    key={r}
                    onClick={() => { setDraft(r); setShowQuickReplies(false); inputRef.current?.focus(); }}
                    className="w-full text-left text-xs text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-xl transition-all font-medium"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compose area */}
        <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0">
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <textarea
                ref={inputRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={handleKey}
                placeholder={msgType === "email" ? "Write your email..." : "Type a message... (Enter to send)"}
                rows={2}
                className="w-full px-3.5 pt-3 pb-1 text-sm bg-transparent focus:outline-none resize-none text-slate-800 placeholder-slate-400"
              />
              <div className="flex items-center gap-1 px-2 pb-2">
                <button
                  onClick={() => setShowQuickReplies(v => !v)}
                  className={`p-1.5 rounded-lg transition-all text-xs font-bold flex items-center gap-1 ${
                    showQuickReplies ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <ChevronDown className="size-3" />Quick
                </button>
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                  <Paperclip className="size-3.5" />
                </button>
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                  <Smile className="size-3.5" />
                </button>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!draft.trim()}
              className="size-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shrink-0"
            >
              <Send className="size-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Sending as <strong className="text-slate-600">Admin</strong> · {msgType === "email" ? "Email" : "Platform Message"}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}