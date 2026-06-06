import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCheck, ExternalLink, Award, AlertCircle, Info, Gavel, Building2, MessageSquare, User, ChevronDown, Home, Mail } from "lucide-react";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";
import { useCustomerNotifications } from "../hooks/useCustomerNotifications";

export default function CustomerNotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, loadMore, hasMore } = useCustomerNotifications();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const portal = document.getElementById("customer-notif-portal");
      if (ref.current?.contains(e.target as Node)) return;
      if (portal?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getIcon = (type: string, icon: string) => {
    if (type === "bid_won") return <Award className="size-4 text-amber-500" />;
    if (type === "bid") return <Gavel className="size-4 text-orange-500" />;
    if (type === "auction_live") return <Gavel className="size-4 text-green-500" />;
    if (type === "auction_completed") return <Gavel className="size-4 text-purple-500" />;
    if (type === "property_sold") return <Building2 className="size-4 text-emerald-500" />;
    if (type === "property") return <Building2 className="size-4 text-blue-500" />;
    if (icon === "home") return <Home className="size-4 text-amber-500" />;
    if (type === "lead") return <Mail className="size-4 text-blue-500" />;
    if (type === "system") return <Bell className="size-4 text-purple-500" />;
    if (type === "message") return <MessageSquare className="size-4 text-blue-500" />;
    if (icon === "mail") return <Mail className="size-4 text-blue-500" />;
    if (icon === "user" || icon === "check") return <User className="size-4 text-green-500" />;
    if (icon === "alert-circle") return <AlertCircle className="size-4 text-orange-500" />;
    return <Info className="size-4 text-blue-500" />;
  };

  const getColorClass = (color: string, isRead: boolean) => {
    if (isRead) return "bg-white border-slate-100";
    switch (color) {
      case "green": return "bg-green-50 border-green-100";
      case "orange": return "bg-orange-50 border-orange-100";
      case "red": return "bg-red-50 border-red-100";
      case "purple": return "bg-purple-50 border-purple-100";
      case "amber": return "bg-amber-50 border-amber-100";
      default: return "bg-blue-50 border-blue-100";
    }
  };

  const getIconBg = (color: string, isRead: boolean) => {
    if (isRead) return "bg-slate-100";
    switch (color) {
      case "green": return "bg-green-100";
      case "orange": return "bg-orange-100";
      case "red": return "bg-red-100";
      case "purple": return "bg-purple-100";
      case "amber": return "bg-amber-100";
      default: return "bg-blue-100";
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all"
      >
        <Bell className="size-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && createPortal(
        <div
          id="customer-notif-portal"
          className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 overflow-hidden"
          style={{ top: "68px", right: "80px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-slate-600" />
              <span className="font-black text-slate-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-black rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <CheckCheck className="size-3" />
                  All read
                </button>
              )}
              <button onClick={() => setOpen(false)}>
                <X className="size-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-10">
                <Bell className="size-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-sm font-medium">No notifications</p>
              </div>
            ) : (
              <>
                {notifications.map((n: any) => (
                  <div
                    key={n._id}
                    onClick={() => {
                      if (!n.isRead) markAsRead(n._id);
                      if (n.link) { navigate(n.link); setOpen(false); }
                    }}
                    className={`flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition-all hover:brightness-95 ${getColorClass(n.color, n.isRead)}`}
                  >
                    <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${getIconBg(n.color, n.isRead)}`}>
                      {getIcon(n.type, n.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${n.isRead ? "text-slate-500 font-medium" : "text-slate-900 font-bold"}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      {!n.isRead && (
                        <div className="size-2.5 bg-blue-500 rounded-full mt-1" />
                      )}
                      {n.link && (
                        <ExternalLink className="size-3 text-slate-400" />
                      )}
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <button
                    onClick={loadMore}
                    className="w-full py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronDown className="size-4" />
                    Load More
                  </button>
                )}
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
