import { useEffect, useState } from "react";
import { Gavel, Eye, Building2, Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { useCustomerApi } from "../api/useCustomerApi";
import CountdownTimer from "../components/CountdownTimer";

export default function MyAuctionsTab() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { useMyPropertyStats } = useCustomerApi();
  const { data: stats, isLoading, refetch } = useMyPropertyStats();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const socket = getSocket();
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ["my-property-stats"] });
      refetch();
    };
    socket.on("auction_status_update", refresh);
    socket.on("bid_update", refresh);
    return () => {
      socket.off("auction_status_update", refresh);
      socket.off("bid_update", refresh);
    };
  }, [queryClient, refetch]);

  const auctions = stats?.recentAuctions || [];
  const filteredAuctions = auctions.filter((a: any) => {
    const matchesStatus = filter === "all" || a.status === filter;
    const matchesSearch = !search || a.auctionTitle?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl h-40 animate-pulse border border-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900">Auctions</h2>
        <p className="text-slate-600 font-medium">Track auctions containing your properties</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: auctions.length, gradient: "from-slate-600 to-slate-800", shadow: "shadow-slate-200" },
          { label: "Live Now", value: auctions.filter((a: any) => a.status === "live").length, gradient: "from-green-500 to-emerald-600", shadow: "shadow-green-200" },
          { label: "Scheduled", value: auctions.filter((a: any) => a.status === "scheduled").length, gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200" },
          { label: "Completed", value: auctions.filter((a: any) => a.status === "completed").length, gradient: "from-purple-500 to-violet-600", shadow: "shadow-purple-200" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-4 text-center text-white shadow-lg ${s.shadow}`}>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs font-bold text-white/80 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search auctions..."
          className="w-full pl-10 pr-10 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "live", "scheduled", "completed", "cancelled"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
              filter === f
                ? f === "live" ? "bg-green-500 text-white" :
                  f === "scheduled" ? "bg-blue-500 text-white" :
                  f === "completed" ? "bg-purple-500 text-white" :
                  f === "cancelled" ? "bg-red-500 text-white" :
                  "bg-slate-800 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Auctions List */}
      {filteredAuctions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Gavel className="size-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-500">No auctions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAuctions.map((auction: any) => (
            <div key={auction._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Auction Header */}
              <div className={`flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white border-l-4 ${
                auction.status === "live"
                  ? "border-l-green-500"
                  : auction.status === "scheduled"
                  ? "border-l-blue-500"
                  : auction.status === "completed"
                  ? "border-l-purple-500"
                  : "border-l-slate-400"
              }`}>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900 truncate">{auction.auctionTitle}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {auction.startDateTime
                      ? new Date(auction.startDateTime).toLocaleString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })
                      : "—"}
                    {" → "}
                    {auction.endDateTime
                      ? new Date(auction.endDateTime).toLocaleString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })
                      : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    auction.status === "live" ? "bg-green-100 text-green-700" :
                    auction.status === "completed" ? "bg-purple-100 text-purple-700" :
                    auction.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {auction.status === "live" ? "🔴 Live" :
                     auction.status === "completed" ? "✅ Completed" :
                     auction.status === "scheduled" ? "📅 Scheduled" :
                     auction.status}
                  </span>
                  {auction.status === "live" && auction.endDateTime && (
                    <CountdownTimer endDate={auction.endDateTime} size="sm" onExpire={() => refetch()} />
                  )}
                  {auction.status === "scheduled" && auction.startDateTime && (
                    <CountdownTimer endDate={auction.startDateTime} size="sm" onExpire={() => refetch()} />
                  )}
                  <button
                    onClick={() => navigate(`/auctions/${auction.slug || auction._id}`)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <Eye className="size-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Per-Property Breakdown */}
              {auction.propertyBreakdown?.length > 0 && (
                <div className="divide-y divide-slate-100">
                  {auction.propertyBreakdown.map((prop: any, propIdx: number) => (
                    <div key={prop._id} className={`flex items-center gap-4 p-4 transition-all ${propIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      {prop.image ? (
                        <img src={prop.image} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" alt="" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="size-5 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm truncate">{prop.propertyTitle}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 font-bold">
                            Starting Price: £{prop.startingPrice?.toLocaleString()}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-lg bg-green-50 border border-green-100 text-green-700 font-bold">
                            Highest Bid: {prop.highestBid > 0 ? `£${prop.highestBid?.toLocaleString()}` : "—"}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 font-bold">
                            Reserve: {prop.reservePrice > 0 ? `£${prop.reservePrice?.toLocaleString()}` : "—"}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-lg bg-purple-50 border border-purple-100 text-purple-700 font-bold">
                            {prop.totalBids} bids
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {prop.highestBid > 0 ? (
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            prop.reserveMet ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {prop.reserveMet ? "✅ Reserve Met" : "❌ Not Met"}
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-500">
                            No bids yet
                          </span>
                        )}
                        {prop.isSoldInThisAuction && (
                          <p className="text-xs font-black text-emerald-600 mt-1">🎉 SOLD</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
