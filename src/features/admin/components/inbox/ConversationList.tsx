import { InboxIcon, Search } from "lucide-react";

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

interface ConversationListProps {
  conversations: any[];
  selected: any;
  onSelect: (conv: any) => void;
  loading: boolean;
  search: string;
  onSearch: (s: string) => void;
  filter: string;
  onFilterChange: (f: string) => void;
  stats: any;
}

export default function ConversationList({
  conversations,
  selected,
  onSelect,
  loading,
  search,
  onSearch,
  filter,
  onFilterChange,
  stats,
}: ConversationListProps) {
  return (
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
            onChange={e => onSearch(e.target.value)}
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
            <button key={f.key} onClick={() => onFilterChange(f.key)}
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
        {loading ? (
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
              onClick={() => onSelect(conv)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-blue-50 ${
                selected?._id === conv._id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
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
  );
}
