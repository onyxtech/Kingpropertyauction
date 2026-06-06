import { useState, useEffect } from "react";
import { Users, Gavel, Trophy, Eye, RefreshCw, Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "@/app/hooks/useTheme";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { useCustomerApi } from "../api/useCustomerApi";

export default function PropertyBiddersTab() {
  const navigate = useNavigate();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { useMyPropertyBidders } = useCustomerApi();
  const { data: properties = [], isLoading, refetch } = useMyPropertyBidders();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    setVisibleCount(5);
  }, [search, statusFilter]);

  useEffect(() => {
    const socket = getSocket();
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ["my-property-bidders"] });
    };
    socket.on("bid_update", refresh);
    return () => socket.off("bid_update", refresh);
  }, [queryClient]);

  const filteredProperties = (properties as any[])
    .map((item: any) => ({
      ...item,
      bids: statusFilter === "all"
        ? item.bids
        : item.bids?.filter((b: any) => b.status === statusFilter),
    }))
    .filter((item: any) => {
      const matchesSearch = !search ||
        item.property?.propertyTitle?.toLowerCase().includes(search.toLowerCase());
      const hasBids = statusFilter === "all" || (item.bids?.length > 0);
      return matchesSearch && hasBids;
    });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Who's Bidding</h2>
          <p className="text-slate-600 font-medium">Live bidding activity on your properties</p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2.5 hover:bg-slate-100 rounded-xl transition-all"
          title="Refresh"
        >
          <RefreshCw className="size-5 text-slate-600" />
        </button>
      </div>

      {/* Summary Stats */}
      {properties.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-200">
            <Users className="size-6 text-white/80 mb-2" />
            <p className="text-2xl font-black">{(properties as any[]).reduce((sum, p) => sum + (p.bids?.length || 0), 0)}</p>
            <p className="text-xs text-white/80 font-bold">Total Bids</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg shadow-emerald-200">
            <Trophy className="size-6 text-white/80 mb-2" />
            <p className="text-2xl font-black">{(properties as any[]).length}</p>
            <p className="text-xs text-white/80 font-bold">Properties</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-4 text-white shadow-lg shadow-purple-200 hidden md:block">
            <Gavel className="size-6 text-white/80 mb-2" />
            <p className="text-2xl font-black">
              {(properties as any[]).filter((p: any) => p.bids?.some((b: any) => b.status === "winning")).length}
            </p>
            <p className="text-xs text-white/80 font-bold">Active Bidding</p>
          </div>
        </div>
      )}

      {/* Search + status filter */}
      {properties.length > 0 && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by property name..."
              className="w-full pl-10 pr-10 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "All" },
              { key: "winning", label: "🏆 Winning" },
              { key: "won", label: "✅ Won" },
              { key: "outbid", label: "⚠️ Outbid" },
              { key: "lost", label: "❌ Lost" },
              { key: "active", label: "Active" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === f.key
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Users className="size-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-700 mb-2">No bids yet</h3>
          <p className="text-slate-500">When buyers bid on your properties, you'll see them here</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Search className="size-10 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-700 mb-1">No properties found</p>
          <p className="text-slate-500 text-sm">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProperties.slice(0, visibleCount).map((item: any) => (
            <div key={item.property?._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Property Header */}
              <div className="flex items-center gap-4 p-5 border-b border-slate-100 bg-slate-50">
                {item.property?.media?.propertyImages?.[0] ? (
                  <img
                    src={item.property.media.propertyImages[0]}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    alt=""
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <Gavel className="size-6 text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-900 truncate">
                    {item.property?.propertyTitle}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-sm text-slate-500">
                      <span className="font-bold text-slate-700">{item.totalBids}</span> total bids
                    </span>
                    <span className="text-sm text-slate-500">
                      <span className="font-bold text-slate-700">{item.uniqueBidders}</span> bidders
                    </span>
                    <span className="text-sm font-black text-green-600">
                      Highest: £{item.highestBid?.toLocaleString()}
                    </span>
                    {item.property?.pricing?.reservePrice && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.highestBid >= item.property.pricing.reservePrice
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {item.highestBid >= item.property.pricing.reservePrice
                          ? "✅ Reserve Met"
                          : `❌ Reserve not met`}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/properties/${item.property?.slug || item.property?._id}`)}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-all flex-shrink-0"
                  title="View property"
                >
                  <Eye className="size-4 text-slate-600" />
                </button>
              </div>

              {/* Bidders List */}
              <div className="divide-y divide-slate-100">
                {item.bids.map((bid: any, idx: number) => (
                  <div key={bid._id} className={`flex items-center gap-4 px-5 py-4 transition-all ${
                    idx === 0 ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-l-amber-400" : "hover:bg-slate-50"
                  }`}>
                    {/* Rank */}
                    <div className={`size-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                      idx === 0 ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-md" :
                      idx === 1 ? "bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-md" :
                      idx === 2 ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md" :
                      "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700"
                    }`}>
                      {idx === 0 ? <Trophy className="size-4" /> : idx + 1}
                    </div>

                    {/* Bidder Avatar */}
                    <div className={`size-10 rounded-full flex items-center justify-center font-black text-white flex-shrink-0 bg-gradient-to-br ${theme.primary}`}>
                      {bid.bidder.initial}
                    </div>

                    {/* Bidder Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm">{bid.bidder.name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(bid.createdAt).toLocaleDateString()} · {bid.auction?.auctionTitle || "Auction"}
                      </p>
                    </div>

                    {/* Bid Amount + Status */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-slate-900">£{bid.amount?.toLocaleString()}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        bid.status === "winning" ? "bg-green-100 text-green-700" :
                        bid.status === "won" ? "bg-amber-100 text-amber-700" :
                        bid.status === "outbid" ? "bg-orange-100 text-orange-700" :
                        bid.status === "lost" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {bid.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredProperties.length > visibleCount && (
            <button
              onClick={() => setVisibleCount(v => v + 5)}
              className="w-full py-3 bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all rounded-2xl border border-slate-200"
            >
              Load More ({filteredProperties.length - visibleCount} more properties)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
