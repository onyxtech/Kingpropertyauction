import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, Gavel, User, Mail, Building2, Clock, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

const iconMap: Record<string, any> = { gavel: Gavel, user: User, mail: Mail, building: Building2, clock: Clock, check: TrendingUp, trophy: TrendingUp };
const colorMap: Record<string, string> = {
  purple: "bg-purple-100 text-purple-600", blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600", orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600", emerald: "bg-emerald-100 text-emerald-600",
  slate: "bg-slate-200 text-slate-600", yellow: "bg-yellow-100 text-yellow-700",
};

export default function NotificationBell() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setShow(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { data } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const r = await apiClient.fetch("/dashboard/notifications");
      return r.success ? r.data : { notifications: [], unreadCount: 0 };
    },
    refetchInterval: 30000,
  });

  const notifications = data?.notifications || [];
  const unread = data?.unreadCount || 0;

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setShow(!show)} className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all">
        <Bell className="size-5 text-slate-600" />
        {unread > 0 && (
          <div className="absolute -top-1 -right-1 size-5 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
            {unread > 9 ? "9+" : unread}
          </div>
        )}
      </button>
      {show && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border-2 border-slate-100 z-50 max-h-[500px] overflow-y-auto">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-900">Notifications</h3>
            <span className="text-xs font-bold text-slate-500">{unread} new</span>
          </div>
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm font-medium">
              <Bell className="size-10 text-slate-200 mx-auto mb-2" />No recent notifications
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map((n: any, i: number) => {
                const Icon = iconMap[n.icon] || Bell;
                return (
                  <button key={i} onClick={() => { if (n.link) navigate(n.link); setShow(false); }}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-start gap-3 transition-colors">
                    <div className={`size-8 rounded-lg ${colorMap[n.color] || 'bg-slate-100'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 leading-snug">{n.message}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time ? new Date(n.time).toLocaleTimeString() : ""}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}