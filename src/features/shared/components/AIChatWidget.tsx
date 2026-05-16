import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, User, Send, X, Minimize2, Maximize2, Loader2, UserCheck, History, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isAgent?: boolean;
}

interface StoredSession {
  conversationId: string;
  visitorName: string;
  visitorEmail: string;
  messages: Message[];
  lastActivity: number;
}

// ─── Session persistence ───
const STORAGE_KEY = 'kpa_chat_session';
const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

const saveSession = (data: Partial<StoredSession>) => {
  try {
    const existing = loadSession() || {} as StoredSession;
    const updated = { ...existing, ...data, lastActivity: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
};

const loadSession = (): StoredSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - (data.lastActivity || 0) > SESSION_EXPIRY) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
};

const clearSession = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
};

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "👋 Hi! I'm the King Property Auction AI Assistant.\n\nI can help with:\n• Finding properties & auctions\n• How auctions work\n• Listing your property\n• Registration & bidding\n• General enquiries\n\nPlease tell me your name and email to get started.",
  timestamp: new Date(),
};

const DEPARTMENTS = [
  { id: 'property', label: 'Property & Listings', emoji: '🏠' },
  { id: 'auction', label: 'Auction & Bidding', emoji: '🔨' },
  { id: 'finance', label: 'Finance & Payments', emoji: '💰' },
  { id: 'legal', label: 'Legal & Contracts', emoji: '⚖️' },
  { id: 'account', label: 'Account Support', emoji: '👤' },
  { id: 'general', label: 'General Enquiry', emoji: '📋' },
];

const QUICK_REPLIES = [
  'How do auctions work?',
  'List my property',
  'View current properties',
  'What properties are available?',
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasProvidedInfo, setHasProvidedInfo] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [agentMode, setAgentMode] = useState(false);
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [showPreviousSession, setShowPreviousSession] = useState(false);
  const [previousSession, setPreviousSession] = useState<StoredSession | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const visitorNameRef = useRef('');
  const visitorEmailRef = useRef('');
  const guestSocketRef = useRef<any>(null);

  // ─── Setup guest socket when conversation is created ───
  const setupGuestSocket = useCallback((conversationId: string) => {
    try {
      import('socket.io-client').then(({ io }) => {
        const socket = io('http://localhost:5000/guest-chat', {
          transports: ['websocket', 'polling'],
        });

        socket.on('connect', () => {
          socket.emit('join_chat', conversationId);
        });

        socket.on('admin_reply', ({ message }: { message: any }) => {
          if (!message?.text) return;
          // Ignore AI Assistant replies — they come via SSE stream already
          // Only show replies from human agents (isAgent: true)
          if (!message.isAgent) return;
          const newMsg: Message = {
            id: `admin_${Date.now()}`,
            role: 'assistant',
            content: message.text,
            timestamp: new Date(message.createdAt || Date.now()),
            isAgent: true,
          };
          setMessages(prev => {
            const isDuplicate = prev.some(m =>
              m.content === message.text &&
              Math.abs(new Date(m.timestamp).getTime() - Date.now()) < 5000
            );
            if (isDuplicate) return prev;
            return [...prev, newMsg];
          });
        });

        guestSocketRef.current = socket;
      });
    } catch (e) {
      console.error('[ChatWidget] Socket setup error:', e);
    }
  }, []);

  // ─── On mount: delay widget, check auth, check previous session ───
  useEffect(() => {
    const t = setTimeout(() => setShowWidget(true), 2000);

    const { user, isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated && user) {
      visitorNameRef.current = user.name;
      visitorEmailRef.current = user.email;
      setHasProvidedInfo(true);
      setNameInput(user.name);
      setEmailInput(user.email);
    } else {
      const session = loadSession();
      if (session?.conversationId) {
        setPreviousSession(session);
        setShowPreviousSession(true);
      }
    }

    return () => clearTimeout(t);
  }, []);

  // ─── Auto scroll ───
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Focus input when panel opens ───
  useEffect(() => {
    if (isOpen && !isMinimized && hasProvidedInfo) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized, hasProvidedInfo]);

  // ─── Cleanup on unmount ───
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (guestSocketRef.current) {
        guestSocketRef.current.disconnect();
      }
    };
  }, []);

  const handleContinuePrevious = useCallback(async () => {
    if (!previousSession) return;
    conversationIdRef.current = previousSession.conversationId;
    visitorNameRef.current = previousSession.visitorName;
    visitorEmailRef.current = previousSession.visitorEmail;
    setHasProvidedInfo(true);
    setShowPreviousSession(false);

    try {
      const res = await fetch(`/api/chat/history/${previousSession.conversationId}`);
      const data = await res.json();
      if (data.success && data.data.messages?.length > 0) {
        const restored: Message[] = data.data.messages.map((m: any) => ({
          id: m._id || `msg_${Date.now()}_${Math.random()}`,
          role: m.isAdminMessage ? 'assistant' : 'user',
          content: m.text,
          timestamp: new Date(m.createdAt),
          isAgent: m.isAdminMessage && m.senderName !== 'AI Assistant',
        }));
        setMessages(restored);
      } else if (previousSession.messages?.length > 0) {
        setMessages(previousSession.messages.map(m => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })));
      }
    } catch (e) {
      console.error('[ChatWidget] History load error:', e);
      if (previousSession.messages?.length > 0) {
        setMessages(previousSession.messages.map(m => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })));
      }
    }

    setupGuestSocket(previousSession.conversationId);
  }, [previousSession, setupGuestSocket]);

  const handleStartFresh = useCallback(() => {
    clearSession();
    setPreviousSession(null);
    setShowPreviousSession(false);
    setMessages([INITIAL_MESSAGE]);
    conversationIdRef.current = null;
    setHasProvidedInfo(false);
    setNameInput('');
    setEmailInput('');
    setAgentMode(false);
    setShowDeptPicker(false);
  }, []);

  const handleSubmitInfo = useCallback(() => {
    const name = nameInput.trim();
    const email = emailInput.trim();
    if (!name || !email || !/\S+@\S+\.\S+/.test(email)) return;

    visitorNameRef.current = name;
    visitorEmailRef.current = email;
    setHasProvidedInfo(true);
    setShowPreviousSession(false);
    saveSession({ visitorName: name, visitorEmail: email });

    setMessages(prev => [...prev, {
      id: `welcome_${Date.now()}`,
      role: 'assistant',
      content: `Hi ${name}! Great to meet you. How can I help you today?`,
      timestamp: new Date(),
    }]);
  }, [nameInput, emailInput]);

  const streamAIResponse = useCallback(async (userText: string, department?: string) => {
    if (isLoading) return;
    setIsLoading(true);

    const assistantMsgId = `asst_${Date.now()}`;
    setMessages(prev => [...prev, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }]);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          conversationId: conversationIdRef.current || undefined,
          visitorName: visitorNameRef.current || undefined,
          visitorEmail: visitorEmailRef.current || undefined,
          department: department || undefined,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const lines = decoder.decode(value, { stream: true }).split('\n');
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullText += data.text;
                setMessages(prev => prev.map(m =>
                  m.id === assistantMsgId ? { ...m, content: fullText, isStreaming: true } : m
                ));
              }
              if (data.done) {
                if (data.conversationId) {
                  const convId = data.conversationId;
                  conversationIdRef.current = convId;
                  saveSession({ conversationId: convId });
                  setupGuestSocket(convId);
                }
                if (data.agentRequested) {
                  setAgentMode(true);
                }
                setMessages(prev => prev.map(m =>
                  m.id === assistantMsgId ? { ...m, isStreaming: false } : m
                ));
              }
            } catch (parseErr) {
              console.error('[Chat] SSE parse error:', parseErr);
            }
          }
        }
      }

      setMessages(prev => {
        const updated = prev.map(m =>
          m.id === assistantMsgId ? { ...m, isStreaming: false } : m
        );
        saveSession({ messages: updated.slice(-30) });
        return updated;
      });

    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('[Chat] Stream error:', err.message);
      setMessages(prev => prev.map(m =>
        m.id === assistantMsgId
          ? { ...m, content: "Sorry, I'm having trouble right now. Please call us on 0800 123 4567 or use the contact form.", isStreaming: false }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, setupGuestSocket]);

  const handleDeptSelect = useCallback((dept: typeof DEPARTMENTS[number]) => {
    setShowDeptPicker(false);
    if (isLoading) return;
    const userMsg = `${dept.emoji} Talk to agent — ${dept.label}`;
    setMessages(prev => [...prev, {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userMsg,
      timestamp: new Date(),
    }]);
    streamAIResponse(userMsg, dept.label);
  }, [isLoading, streamAIResponse]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    setMessages(prev => [...prev, {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }]);
    streamAIResponse(text);
  }, [input, isLoading, streamAIResponse]);

  const sendQuickReply = useCallback((text: string) => {
    if (isLoading || !hasProvidedInfo) return;
    setMessages(prev => [...prev, {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }]);
    streamAIResponse(text);
  }, [isLoading, hasProvidedInfo, streamAIResponse]);

  const clearChat = useCallback(() => {
    abortControllerRef.current?.abort();
    clearSession();
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setIsLoading(false);
    setAgentMode(false);
    setShowDeptPicker(false);
    conversationIdRef.current = null;
    if (guestSocketRef.current) {
      guestSocketRef.current.disconnect();
      guestSocketRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsOpen(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      hasProvidedInfo ? sendMessage() : handleSubmitInfo();
    }
  };

  if (!showWidget) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Bubble button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative size-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-110 active:scale-95"
          aria-label="Open chat">
          <Bot className="size-8 text-white" />
          <span className="absolute -top-1 -right-1 size-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className={`bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-200 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>

          {/* Header */}
          <div className={`px-5 py-4 flex items-center justify-between flex-shrink-0 ${
            agentMode
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
          }`}>
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-white/20 flex items-center justify-center">
                {agentMode ? <UserCheck className="size-5 text-white" /> : <Bot className="size-5 text-white" />}
              </div>
              <div>
                <p className="text-sm font-black text-white">
                  {agentMode ? 'Live Support Agent' : 'AI Assistant'}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className={`size-1.5 rounded-full ${agentMode ? 'bg-yellow-300' : 'bg-green-400'} animate-pulse`} />
                  <span className="text-[11px] text-white/80 font-medium">
                    {agentMode ? 'Agent connected · King Property Auction' : 'Online · King Property Auction'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMinimized(!isMinimized)}
                className="size-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                {isMinimized ? <Maximize2 className="size-4 text-white" /> : <Minimize2 className="size-4 text-white" />}
              </button>
              <button onClick={handleClose}
                className="size-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                <X className="size-4 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Agent mode banner */}
              {agentMode && (
                <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
                  <UserCheck className="size-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">
                    You're now connected to our support team. An agent will respond shortly.
                  </span>
                </div>
              )}

              {/* Previous session restore */}
              {showPreviousSession && previousSession && !hasProvidedInfo && (
                <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 flex-shrink-0">
                  <p className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                    <History className="size-3.5" /> Previous conversation found
                  </p>
                  <p className="text-xs text-amber-700 mb-2">
                    Continue as {previousSession.visitorName}?
                  </p>
                  <div className="flex gap-2">
                    <button onClick={handleContinuePrevious}
                      className="flex-1 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors">
                      Continue Chat
                    </button>
                    <button onClick={handleStartFresh}
                      className="flex-1 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-50 transition-colors">
                      Start Fresh
                    </button>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
                {messages.map(msg => (
                  <div key={msg.id}
                    className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                    {msg.role === 'assistant' && (
                      <div className={`size-7 rounded-full flex items-center justify-center flex-shrink-0 mb-1 ${
                        msg.isAgent
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                          : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      }`}>
                        {msg.isAgent
                          ? <UserCheck className="size-4 text-white" />
                          : <Bot className="size-4 text-white" />
                        }
                      </div>
                    )}

                    <div className={`max-w-[78%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md'
                          : msg.isAgent
                            ? 'bg-emerald-50 border border-emerald-200 text-slate-800 rounded-bl-md shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm'
                      }`}>
                        <p className="whitespace-pre-wrap">
                          {msg.content}
                          {msg.isStreaming && msg.content && (
                            <span className="inline-block w-1.5 h-4 bg-current ml-0.5 animate-pulse rounded-sm align-middle" />
                          )}
                        </p>
                        {msg.isStreaming && !msg.content && (
                          <div className="flex items-center gap-1 py-1">
                            <div className="size-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="size-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="size-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {msg.isAgent ? 'Support Agent · ' : ''}{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {msg.role === 'user' && (
                      <div className="size-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 mb-1">
                        <User className="size-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Department picker — sits between messages and input, never clipped */}
              {showDeptPicker && (
                <div className="flex-shrink-0 bg-white border-t border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-slate-700">What do you need help with?</p>
                    <button onClick={() => setShowDeptPicker(false)}
                      className="size-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                      <X className="size-3.5 text-slate-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {DEPARTMENTS.map(dept => (
                      <button
                        key={dept.id}
                        onClick={() => handleDeptSelect(dept)}
                        className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-colors">
                        <span className="text-lg">{dept.emoji}</span>
                        <span className="text-xs font-semibold text-slate-700">{dept.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick replies */}
              {hasProvidedInfo && messages.filter(m => m.role === 'user').length === 0 && !isLoading && (
                <div className="px-4 pb-2 flex flex-wrap gap-2 bg-slate-50 flex-shrink-0">
                  {QUICK_REPLIES.map(q => (
                    <button key={q} onClick={() => sendQuickReply(q)}
                      disabled={isLoading}
                      className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-40">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input area */}
              {!hasProvidedInfo ? (
                <div className="px-4 pb-4 pt-3 bg-white border-t border-slate-100 flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-600 mb-2">
                    Introduce yourself to get started:
                  </p>
                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Your full name"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Your email address"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleSubmitInfo}
                    disabled={!nameInput.trim() || !emailInput.trim()}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    Start Chat →
                  </button>
                </div>
              ) : (
                <div className="px-4 pb-4 pt-2 bg-white border-t border-slate-100 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={agentMode ? 'Message support agent...' : 'Ask me anything...'}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60 transition-colors"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className="size-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-slate-400">
                      Chatting as <span className="font-semibold">{visitorNameRef.current}</span> · King Property AI
                    </p>
                    <div className="flex items-center gap-2">
                      {!agentMode && (
                        <button
                          onClick={() => setShowDeptPicker(prev => !prev)}
                          className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold transition-colors flex items-center gap-1 border border-emerald-200 hover:border-emerald-300 rounded-full px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100">
                          <UserCheck className="size-2.5" /> Talk to Agent
                        </button>
                      )}
                      <button onClick={clearChat}
                        className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
                        <RefreshCw className="size-2.5" /> New chat
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
