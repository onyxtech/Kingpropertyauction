import { Building2 } from "lucide-react";
import { useAdminStats } from "../api/useAdminApi";

export default function PropertyStats() {
  const { data: stats, isLoading } = useAdminStats();
  const rejected = (stats?.totalProperties || 0) - (stats?.pendingProperties || 0) - (stats?.approvedProperties || 0);

  const cards = [
    { label: "Total Listings", value: stats?.totalProperties || 0, color: "from-blue-500 to-indigo-600" },
    { label: "Pending Approval", value: stats?.pendingProperties || 0, color: "from-yellow-500 to-orange-600" },
    { label: "Approved", value: stats?.approvedProperties || 0, color: "from-green-500 to-emerald-600" },
    { label: "Rejected", value: rejected >= 0 ? rejected : 0, color: "from-red-500 to-rose-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((stat, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg">
          <div className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
            <Building2 className="size-5 text-white" />
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
          <p className="text-2xl font-black text-slate-900">{isLoading ? "..." : stat.value}</p>
        </div>
      ))}
    </div>
  );
}