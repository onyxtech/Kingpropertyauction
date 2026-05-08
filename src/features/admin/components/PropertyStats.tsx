import { Building2, Gavel, TrendingUp } from "lucide-react";
import { useAdminStats } from "../api/useAdminApi";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";

export default function PropertyStats() {
  const { data: stats, isLoading } = useAdminStats();
  const { useGetProperties } = usePropertyApi();
  const { data: lotsData } = useGetProperties();
  const properties = lotsData?.data || [];
  
  const soldCount = properties.filter((p: any) => p.propertyStatus === "sold").length;
  const rejected = (stats?.totalProperties || 0) - (stats?.pendingProperties || 0) - (stats?.approvedProperties || 0);

  const cards = [
    { label: "Total Listings", value: stats?.totalProperties || 0, color: "from-blue-500 to-indigo-600", icon: Building2 },
    { label: "Sold", value: soldCount, color: "from-emerald-500 to-teal-600", icon: Gavel },
    { label: "Pending Approval", value: stats?.pendingProperties || 0, color: "from-yellow-500 to-orange-600", icon: Building2 },
    { label: "Approved", value: stats?.approvedProperties || 0, color: "from-green-500 to-emerald-600", icon: Building2 },
    { label: "Rejected", value: rejected >= 0 ? rejected : 0, color: "from-red-500 to-rose-600", icon: Building2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {cards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg">
            <div className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
              <Icon className="size-5 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{isLoading ? "..." : stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}