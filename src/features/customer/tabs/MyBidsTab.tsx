import { useState, useEffect } from "react";
import { mediaUrl } from "@/lib/mediaUrl";
import { Gavel, Calendar, Award, AlertCircle, Clock, CheckCircle, XCircle, TrendingUp, Search, X, MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "@/app/hooks/useTheme";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { useCustomerApi } from "../api/useCustomerApi";
import CountdownTimer from "../components/CountdownTimer";

type BidFilter = "all" | "active" | "winning" | "won" | "outbid" | "lost";

export default function MyBidsTab() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { useMyBids } = useCustomerApi();
  const { data: bids = [], isLoading } = useMyBids();
  const [filter, setFilter] = useState<BidFilter>("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    const handleBidUpdate = (_data: any) => {
      queryClient.invalidateQueries({ queryKey: ["my-bids"] });
    };
    const handleAuctionUpdate = (_data: any) => {
      queryClient.invalidateQueries({ queryKey: ["my-bids"] });
    };
    socket.on("bid_update", handleBidUpdate);
    socket.on("auction_status_update", handleAuctionUpdate);
    return () => {
      socket.off("bid_update", handleBidUpdate);
      socket.off("auction_status_update", handleAuctionUpdate);
    };
  }, [queryClient]);

  useEffect(() => {
    setVisibleCount(5);
  }, [filter, search]);

  const filters: { key: BidFilter; label: string; color: string }[] = [
    { key: "all", label: "All Bids", color: "bg-slate-100 text-slate-700" },
    { key: "active", label: "Live Now", color: "bg-red-100 text-red-700" },
    { key: "winning", label: "Winning", color: "bg-green-100 text-green-700" },
    { key: "won", label: "Won", color: "bg-amber-100 text-amber-700" },
    { key: "outbid", label: "Outbid", color: "bg-orange-100 text-orange-700" },
    { key: "lost", label: "Lost", color: "bg-red-100 text-red-700" },
  ];

  const filteredBids = Array.isArray(bids)
    ? bids.filter((b: any) => {
        const matchesFilter = filter === "all"
          ? true
          : filter === "active"
          ? ["active", "winning"].includes(b.status) && b.auction?.status === "live"
          : b.status === filter;
        const searchTerm = search.toLowerCase();
        const matchesSearch = !search ||
          b.auction?.auctionTitle?.toLowerCase().includes(searchTerm) ||
          b.property?.propertyTitle?.toLowerCase().includes(searchTerm);
        return matchesFilter && matchesSearch;
      })
    : [];

  const stats = {
    total: bids.length,
    active: bids.filter((b: any) =>
      ["active", "winning"].includes(b.status) && b.auction?.status === "live").length,
    winning: bids.filter((b: any) => b.status === "winning").length,
    won: bids.filter((b: any) => b.status === "won").length,
    lost: bids.filter((b: any) => ["outbid", "lost"].includes(b.status)).length,
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "winning": return { color: "bg-green-100 text-green-700 border-green-200", icon: Award, label: "WINNING" };
      case "won": return { color: "bg-amber-100 text-amber-700 border-amber-200", icon: CheckCircle, label: "WON" };
      case "outbid": return { color: "bg-orange-100 text-orange-700 border-orange-200", icon: AlertCircle, label: "OUTBID" };
      case "lost": return { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, label: "LOST" };
      case "retracted": return { color: "bg-slate-100 text-slate-700 border-slate-200", icon: XCircle, label: "RETRACTED" };
      default: return { color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock, label: "ACTIVE" };
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/80 rounded-3xl h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">My Bids & Auctions</h2>
          <p className="text-slate-600 font-medium">Track all your auction activity</p>
        </div>
        <button
          onClick={() => navigate("/auctions")}
          className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2"
        >
          <Gavel className="size-4" />
          Browse Auctions
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-slate-700" },
          { label: "Active", value: stats.active, color: "text-blue-600" },
          { label: "Winning", value: stats.winning, color: "text-green-600" },
          { label: "Won", value: stats.won, color: "text-amber-600" },
          { label: "Lost", value: stats.lost, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">{s.label}</p>
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
          placeholder="Search by property or auction name..."
          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === f.key
                ? `${f.color} ring-2 ring-offset-1 ring-current scale-105`
                : "bg-white/80 text-slate-600 hover:bg-slate-100 border-2 border-white/60"
            }`}
          >
            {f.label}
            {f.key !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({bids.filter((b: any) => b.status === f.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bids List */}
      {filteredBids.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white/60 shadow-xl">
          <Gavel className="size-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-700 mb-2">
            {search ? "No matching bids" :
             filter === "all" ? "No Bids Yet" :
             filter === "won" ? "No Won Auctions" :
             filter === "winning" ? "Not Currently Winning" :
             filter === "outbid" ? "No Outbid History" :
             filter === "lost" ? "No Lost Auctions" :
             `No ${filter} bids`}
          </h3>
          <p className="text-slate-500 mb-6">
            {search ? `No bids match "${search}"` :
             filter === "all" ? "Browse live auctions to start bidding" :
             filter === "won" ? "Win an auction to see completed purchases here" :
             filter === "winning" ? "Place a bid to start competing" :
             filter === "outbid" ? "When outbid, your history will appear here" :
             filter === "lost" ? "Ended auctions you participated in appear here" :
             `You have no ${filter} bids at this time`}
          </p>
          {filter === "all" && !search && (
            <button
              onClick={() => navigate("/auctions")}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
            >
              Browse Auctions
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBids.slice(0, visibleCount).map((bid: any) => {
            const statusConfig = getStatusConfig(bid.status);
            const StatusIcon = statusConfig.icon;
            const cardBorder = ({
              winning: "border-l-4 border-l-green-500",
              won: "border-l-4 border-l-emerald-500",
              outbid: "border-l-4 border-l-orange-500",
              lost: "border-l-4 border-l-red-400",
              active: "border-l-4 border-l-blue-500",
              retracted: "border-l-4 border-l-slate-300",
            } as Record<string, string>)[bid.status] || "border-l-4 border-l-slate-200";
            return (
              <div key={bid._id} className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-white/60 overflow-hidden hover:shadow-2xl transition-all ${cardBorder}`}>
                <div className="p-5">
                  {/* Status badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black border flex items-center gap-1.5 flex-shrink-0 ${statusConfig.color}`}>
                      <StatusIcon className="size-3.5" />
                      {statusConfig.label}
                    </span>
                    {bid.auction?.status && (
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold flex-shrink-0 ${
                        bid.auction.status === "live"
                          ? "bg-red-100 text-red-700 animate-pulse"
                          : bid.auction.status === "completed"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {bid.auction.status === "live" ? "🔴 LIVE" :
                         bid.auction.status === "completed" ? "ENDED" :
                         bid.auction.status.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Property info */}
                  <div className="flex items-start gap-3 mb-3">
                    {bid.property?.media?.propertyImages?.[0] ? (
                      <img
                        src={mediaUrl(bid.property.media.propertyImages[0])}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        alt=""
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Gavel className="size-6 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">Property</p>
                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        {bid.property?.propertyTitle || "Property"}
                      </h3>
                      {bid.property?.location?.city && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="size-3" />
                          {bid.property.location.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Auction info bar */}
                  {bid.auction && (
                    <div className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Gavel className="size-3.5 text-slate-500 flex-shrink-0" />
                        <span className="text-xs font-bold text-slate-600 truncate">
                          {bid.auction.auctionTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {bid.auction?.status === "live" && (
                          <CountdownTimer
                            endDate={bid.auction.endDateTime}
                            size="sm"
                            onExpire={() => queryClient.invalidateQueries({ queryKey: ["my-bids"] })}
                          />
                        )}
                        {bid.auction?.endDateTime && bid.auction?.status !== "live" && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="size-3" />
                            {bid.auction?.status === "completed" ? "Ended " : "Ends "}
                            {new Date(bid.auction.endDateTime).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bid stats */}
                  <div className="grid gap-3 mb-4 grid-cols-2 md:grid-cols-4">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 font-bold mb-0.5">My Bid</p>
                      <p className="text-lg font-black text-blue-600">
                        £{bid.amount?.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 font-bold mb-0.5">Winning Bid</p>
                      <p className="text-lg font-black text-slate-700">
                        £{bid.property?.currentBid?.toLocaleString() || bid.amount?.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 font-bold mb-0.5">Reserve Price</p>
                      {bid.property?.pricing?.reservePrice ? (
                        <p className="text-lg font-black text-slate-700">
                          £{bid.property.pricing.reservePrice.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-sm font-bold text-slate-400">Not set</p>
                      )}
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 font-bold mb-0.5">Total Bids</p>
                      <p className="text-lg font-black text-slate-700">
                        {bid.property?.totalBids || 1}
                      </p>
                    </div>
                  </div>

                  {bid.status === "won" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 flex items-center gap-2">
                      <Award className="size-5 text-amber-600 flex-shrink-0" />
                      <p className="text-sm font-bold text-amber-700">
                        You won this property! Our team will contact you about payment.
                      </p>
                    </div>
                  )}

                  {bid.status === "outbid" && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-3">
                      <p className="text-sm font-bold text-orange-700">
                        {bid.auction?.status === "live"
                          ? "⚠️ You've been outbid! Place a higher bid to get back in the lead."
                          : "⚠️ You were outbid on this property when the auction ended."}
                      </p>
                    </div>
                  )}

                  {bid.status === "lost" && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
                      <p className="text-sm font-bold text-red-700">
                        {bid.property?.pricing?.reservePrice &&
                         bid.property?.currentBid < bid.property?.pricing?.reservePrice
                          ? "❌ Reserve price was not met — this property was not sold."
                          : "❌ This auction has ended. You did not win this property."}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {bid.status === "won" && (
                      <div className="flex-1 px-4 py-2.5 bg-amber-50 border-2 border-amber-200 rounded-xl text-sm text-center">
                        <p className="font-bold text-amber-700">🏆 Auction Won!</p>
                        <p className="text-xs text-amber-600 mt-0.5">Our team will contact you about payment</p>
                      </div>
                    )}
                    {bid.status === "outbid" && bid.auction?.status === "live" && (
                      <button
                        onClick={() => navigate(`/auctions/${bid.auction?.slug || bid.auction?._id || bid.auctionId}`)}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-md text-sm flex items-center justify-center gap-1"
                      >
                        <Gavel className="size-4" /> Bid Again
                      </button>
                    )}
                    {bid.status === "winning" && bid.auction?.status === "live" && (
                      <button
                        onClick={() => navigate(`/auctions/${bid.auction?.slug || bid.auction?._id || bid.auctionId}`)}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-md text-sm flex items-center justify-center gap-1"
                      >
                        <TrendingUp className="size-4" /> You're Winning!
                      </button>
                    )}
                    {["active"].includes(bid.status) && bid.auction?.status === "live" && (
                      <button
                        onClick={() => navigate(`/auctions/${bid.auction?.slug || bid.auction?._id || bid.auctionId}`)}
                        className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold hover:scale-105 transition-all shadow-md text-sm flex items-center justify-center gap-1`}
                      >
                        <Gavel className="size-4" /> View & Bid
                      </button>
                    )}
                    {(bid.status === "lost" || bid.status === "retracted" ||
                      (bid.status === "outbid" && bid.auction?.status !== "live") ||
                      bid.auction?.status === "completed") && (
                      <button
                        onClick={() => navigate("/auctions")}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-md text-sm flex items-center justify-center gap-1"
                      >
                        <Gavel className="size-4" /> Browse Auctions
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/auctions/${bid.auction?.slug || bid.auction?._id || bid.auctionId}`)}
                      className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredBids.length > visibleCount && (
            <div className="text-center py-4">
              <button
                onClick={() => setVisibleCount(v => v + 5)}
                className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
              >
                Load {Math.min(5, filteredBids.length - visibleCount)} More Bids
                ({filteredBids.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
