import { Building2, Gavel, Users, Clock } from "lucide-react";
import { useAdminStats } from "../api/useAdminApi";

export default function StatsCards() {
  const { data: stats, isLoading } = useAdminStats();

  const cards = [
    { label: "Total Properties", value: stats?.totalProperties || 0, icon: Building2, gradient: "from-blue-500 to-indigo-600" },
    { label: "Active Auctions", value: stats?.liveAuctions || 0, icon: Gavel, gradient: "from-purple-500 to-pink-600" },
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, gradient: "from-emerald-500 to-teal-600" },
    { label: "Pending Approval", value: (stats?.pendingProperties || 0) + (stats?.pendingUsers || 0), icon: Clock, gradient: "from-rose-500 to-red-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div className={`size-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <Icon className="size-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900">{isLoading ? "..." : stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}