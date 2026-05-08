import { Gavel, Zap, Calendar, CheckCircle, TrendingUp, DollarSign } from "lucide-react";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";

export default function AuctionStats() {
  const { useGetAuctions } = useAuctionApi();
  const { data, isLoading } = useGetAuctions();
  const auctions = data?.data || [];
  
  const { useGetProperties } = usePropertyApi();
  const { data: lotsData } = useGetProperties();
  const properties = lotsData?.data || [];

  const live = auctions.filter((a: any) => a.status === "live").length;
  const scheduled = auctions.filter((a: any) => a.status === "scheduled").length;
  const completed = auctions.filter((a: any) => a.status === "completed").length;
  const totalBids = auctions.reduce((sum: number, a: any) => sum + (a.totalBids || 0), 0);
  const soldCount = properties.filter((p: any) => p.propertyStatus === "sold").length;
  const totalRevenue = properties
    .filter((p: any) => p.propertyStatus === "sold")
    .reduce((sum: number, p: any) => sum + (p.soldPrice || p.currentBid || 0), 0);

  const cards = [
    { label: "Live Auctions", value: live, color: "from-green-500 to-emerald-600", icon: Zap },
    { label: "Scheduled", value: scheduled, color: "from-blue-500 to-indigo-600", icon: Calendar },
    { label: "Completed", value: completed, color: "from-purple-500 to-pink-600", icon: CheckCircle },
    { label: "Total Bids", value: totalBids, color: "from-orange-500 to-amber-600", icon: TrendingUp },
    { label: "Properties Sold", value: soldCount, color: "from-emerald-500 to-teal-600", icon: Gavel },
    { label: "Total Revenue", value: totalRevenue >= 1000000 ? `£${(totalRevenue/1000000).toFixed(1)}M` : `£${totalRevenue.toLocaleString()}`, color: "from-cyan-500 to-blue-600", icon: DollarSign },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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