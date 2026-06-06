import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, Gavel, User, Mail, Building2, Check, X, CheckCheck, ExternalLink, ChevronDown, Info, Award } from "lucide-react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { getSocket } from "@/lib/socket";

const getIcon = (type: string, icon: string) => {
  if (type === "bid" || type === "auction_live" || type === "auction" || type === "auction_completed" || icon === "gavel") return <Gavel className="size-4" />;
  if (type === "property_sold" || type === "property" || icon === "building") return <Building2 className="size-4" />;
  if (icon === "user") return <User className="size-4" />;
  if (icon === "check") return <Check className="size-4" />;
  if (icon === "mail" || type === "lead" || type === "message") return <Mail className="size-4" />;
  if (icon === "award" || type === "bid_won") return <Award className="size-4" />;
  if (icon === "x-circle" || icon === "x") return <X className="size-4" />;
  if (type === "system") return <Info className="size-4" />;
  return <Info className="size-4" />;
};

const getColorClass = (color: string, isRead: boolean) => {
  if (isRead) return "bg-white border-slate-100";
  switch (color) {
    case "green": return "bg-green-50 border-green-100";
    case "orange": return "bg-orange-50 border-orange-100";
    case "red": return "bg-red-50 border-red-100";
    case "purple": return "bg-purple-50 border-purple-100";
    case "amber": return "bg-amber-50 border-amber-100";
    case "blue": return "bg-blue-50 border-blue-100";
    default: return "bg-slate-50 border-slate-100";
  }
};

const getIconBg = (color: string, isRead: boolean) => {
  if (isRead) return "bg-slate-100 text-slate-500";
  switch (color) {
    case "green": return "bg-green-100 text-green-600";
    case "orange": return "bg-orange-100 text-orange-600";
    case "red": return "bg-red-100 text-red-600";
    case "purple": return "bg-purple-100 text-purple-600";
    case "amber": return "bg-amber-100 text-amber-600";
    case "blue": return "bg-blue-100 text-blue-600";
    default: return "bg-slate-100 text-slate-500";
  }
};

export default function NotificationBell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [show, setShow] = useState(false);
  const [total, setTotal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const portal = document.getElementById("admin-notif-portal");
      if (ref.current?.contains(e.target as Node)) return;
      if (portal?.contains(e.target as Node)) return;
      setShow(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { data: notifications = [] } = useQuery<any[]>({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const r = await apiClient.fetch("/notifications/all?limit=20");
      if (r.success) {
        setTotal(r.total || 0);
        return r.data;
      }
      return [];
    },
    refetchInterval: 30000,
  });

  const { data: unreadData } = useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const r = await apiClient.fetch("/notifications/unread-count");
      return r.success ? r.data : { count: 0 };
    },
    refetchInterval: 15000,
  });

  const unreadCount = unreadData?.count || 0;
  const hasMore = notifications.length < total;

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.fetch(`/notifications/${id}/read`, { method: "PATCH" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      await apiClient.fetch("/notifications/read-all", { method: "PATCH" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });

  const loadMore = async () => {
    const r = await apiClient.fetch(
      `/notifications/all?limit=20&skip=${notifications.length}`
    );
    if (r.success) {
      queryClient.setQueryData(
        ["admin-notifications"],
        (old: any[]) => [...(old || []), ...r.data]
      );
      setTotal(r.total || 0);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    };
    socket.on("new_message_from_user", refresh);
    socket.on("new_conversation", refresh);
    socket.on("new_notification", refresh);
    return () => {
      socket.off("new_message_from_user", refresh);
      socket.off("new_conversation", refresh);
      socket.off("new_notification", refresh);
    };
  }, [queryClient]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setShow(!show)}
        className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all"
      >
        <Bell className="size-5 text-slate-600" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 size-5 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>

      {show && createPortal(
        <div
          id="admin-notif-portal"
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
                  onClick={() => markAllAsRead.mutate()}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <CheckCheck className="size-3" />
                  All read
                </button>
              )}
              <button onClick={() => setShow(false)}>
                <X className="size-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="size-10 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400 text-sm font-medium">No notifications</p>
              </div>
            ) : (
              <>
                {notifications.map((n: any) => (
                  <div
                    key={n._id}
                    onClick={() => {
                      if (!n.isRead) markAsRead.mutate(n._id);
                      if (n.link) { navigate(n.link); setShow(false); }
                    }}
                    className={`flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition-all hover:brightness-95 ${getColorClass(n.color, n.isRead)}`}
                  >
                    <div className={`size-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${getIconBg(n.color, n.isRead)}`}>
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
                      {n.link && <ExternalLink className="size-3 text-slate-400" />}
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
