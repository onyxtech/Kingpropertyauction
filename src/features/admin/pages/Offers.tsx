import { useState } from "react";
import { useNavigate } from "react-router";
import AdminLayout from "../components/AdminLayout";
import { apiClient } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import {
  Trophy, Send, ChevronDown, ChevronUp,
  Search, X, AlertCircle, CheckCircle,
  Users, Home, Loader2, Bell
} from "lucide-react";

export default function Offers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expandedAuction, setExpandedAuction] = useState<string | null>(null);
  const [loadingAuction, setLoadingAuction] = useState<string | null>(null);
  const [auctionData, setAuctionData] = useState<Record<string, {
    stats: Record<string, any>;
    nextBidders: Record<string, any[]>;
    properties: any[];
  }>>({});
  const [notifyMessages, setNotifyMessages] = useState<Record<string, string>>({});
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [notifyResults, setNotifyResults] = useState<Record<string, any>>({});
  const [withdrawnIds, setWithdrawnIds] = useState<Set<string>>(new Set());

  const { data: auctions = [], isLoading } = useQuery({
    queryKey: ["completed-auctions-offers"],
    queryFn: async () => {
      const r = await apiClient.fetch(
        "/auctions?status=completed&limit=50"
      );
      return r.success ? r.data : [];
    },
  });

  const filtered = (auctions as any[]).filter((a: any) =>
    !search ||
    a.auctionTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExpand = async (auction: any) => {
    const id = auction._id;
    if (expandedAuction === id) {
      setExpandedAuction(null);
      return;
    }
    setExpandedAuction(id);
    if (auctionData[id]) return; // already loaded

    setLoadingAuction(id);
    try {
      // 1. Fetch per-auction bid stats
      const statsRes = await apiClient.fetch(
        `/bids/auction/${id}/property-stats`
      );
      const stats = statsRes.success ? statsRes.data : {};

      // 2. Fetch full property details for this auction
      const propIds = (auction.properties || []).map(
        (p: any) => typeof p === "object" ? p._id : p
      ).filter(Boolean);

      let properties: any[] = [];
      if (propIds.length > 0) {
        const propsRes = await apiClient.fetch("/properties/batch", {
          method: "POST",
          body: JSON.stringify({ ids: propIds }),
        });
        properties = propsRes.success ? propsRes.data : [];
      }

      // 3. Fetch next bidders only for SOLD properties
      const nextBidders: Record<string, any[]> = {};
      for (const propId of propIds) {
        const propStats = stats[propId];
        if (propStats?.isSold) {
          const nb = await apiClient.fetch(
            `/bids/auction/${id}/next-bidders?propertyId=${propId}`
          );
          if (nb.success) nextBidders[propId] = nb.data || [];
        }
      }

      setAuctionData(prev => ({
        ...prev,
        [id]: { stats, nextBidders, properties }
      }));
    } catch (e) {
      console.warn("Failed to load auction data:", e);
    } finally {
      setLoadingAuction(null);
    }
  };

  const handleNotify = async (
    propertyId: string,
    auctionId: string
  ) => {
    setNotifyingId(propertyId);
    try {
      const result = await apiClient.fetch("/bids/notify-next-bidder", {
        method: "POST",
        body: JSON.stringify({
          propertyId,
          auctionId,
          message: notifyMessages[propertyId] || undefined,
        }),
      });
      setNotifyResults(prev => ({ ...prev, [propertyId]: result }));
    } catch {
      setNotifyResults(prev => ({
        ...prev,
        [propertyId]: { success: false, message: "Failed to send" },
      }));
    } finally {
      setNotifyingId(null);
    }
  };

  const toggleWithdrawn = (propId: string) => {
    setWithdrawnIds(prev => {
      const next = new Set(prev);
      if (next.has(propId)) next.delete(propId);
      else next.add(propId);
      return next;
    });
  };

  return (
    <AdminLayout
      activeTab="offers"
      onTabChange={tab => navigate(`/admin/${tab}`)}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trophy className="size-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">
                Offers & Negotiations
              </h2>
              <p className="text-white/80 text-sm mt-0.5">
                When a winner withdraws, notify the next highest
                bidders with a custom offer
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">How to use:</p>
              <ol className="list-decimal list-inside space-y-1 font-medium">
                <li>Expand a completed auction below</li>
                <li>Find a SOLD property where the winner has withdrawn</li>
                <li>Toggle "Winner Withdrew" to reveal next bidders</li>
                <li>Send a custom offer message to next highest bidders</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search completed auctions..."
            className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="size-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Auctions List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i}
                className="bg-white rounded-2xl h-16 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Trophy className="size-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-500">
              No completed auctions found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((auction: any) => {
              const data = auctionData[auction._id];
              const isExpanded = expandedAuction === auction._id;
              const isLoading2 = loadingAuction === auction._id;

              return (
                <div key={auction._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                  {/* Auction Header */}
                  <button
                    onClick={() => handleExpand(auction)}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Trophy className="size-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-slate-900">
                          {auction.auctionTitle}
                        </p>
                        <p className="text-xs text-slate-500">
                          Ended:{" "}
                          {new Date(auction.endDateTime).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric"
                          })}
                          {" · "}
                          {auction.properties?.length || 0} lots
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLoading2 && (
                        <Loader2 className="size-4 text-slate-400 animate-spin" />
                      )}
                      {isExpanded
                        ? <ChevronUp className="size-5 text-slate-400" />
                        : <ChevronDown className="size-5 text-slate-400" />}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && data && (
                    <div className="border-t border-slate-100">
                      {data.properties.map((prop: any) => {
                        const propId = prop._id;
                        const stats = data.stats[propId] || {};
                        const nextBidders = data.nextBidders[propId] || [];
                        const isWithdrawn = withdrawnIds.has(propId);
                        const notifyResult = notifyResults[propId];
                        const isSold = stats.isSold === true;

                        return (
                          <div key={propId}
                            className="border-b border-slate-100 last:border-0">

                            {/* Property Row */}
                            <div className="flex items-start gap-4 p-5">
                              {/* Image */}
                              {prop.media?.propertyImages?.[0] ? (
                                <img
                                  src={prop.media.propertyImages[0]}
                                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                                  alt=""
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                  <Home className="size-6 text-slate-400" />
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                {/* Title + Status */}
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div>
                                    <p className="font-black text-slate-900">
                                      {prop.propertyTitle}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {prop.location?.city}
                                      {prop.location?.state && `, ${prop.location.state}`}
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0">
                                    {isSold ? (
                                      <div className="text-right">
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold block">
                                          🎉 SOLD
                                        </span>
                                        <p className="text-lg font-black text-emerald-700 mt-1">
                                          £{stats.highestBid?.toLocaleString()}
                                        </p>
                                      </div>
                                    ) : stats.highestBid > 0 ? (
                                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                        ❌ Reserve Not Met
                                        <span className="block text-center mt-0.5">
                                          £{stats.highestBid?.toLocaleString()}
                                        </span>
                                      </span>
                                    ) : (
                                      <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                                        No Bids
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Winner (only for sold) */}
                                {isSold && stats.winner && (
                                  <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-3">
                                    <Trophy className="size-4 text-amber-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-emerald-700">
                                        WINNER
                                      </p>
                                      <p className="font-bold text-slate-900 text-sm">
                                        {stats.winner.name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {stats.winner.email}
                                      </p>
                                    </div>
                                    {/* Winner Withdrew Toggle */}
                                    <div className="flex-shrink-0">
                                      <button
                                        onClick={() => toggleWithdrawn(propId)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                          isWithdrawn
                                            ? "bg-red-500 text-white"
                                            : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                        }`}
                                      >
                                        {isWithdrawn
                                          ? "⚠️ Withdrew"
                                          : "Mark Withdrew"}
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Next Bidders + Notify
                                    ONLY show when sold + winner withdrew */}
                                {isSold && isWithdrawn && (
                                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Bell className="size-4 text-amber-600" />
                                      <p className="font-bold text-amber-800 text-sm">
                                        Send Offer to Next Bidders
                                      </p>
                                    </div>

                                    {nextBidders.length === 0 ? (
                                      <p className="text-xs text-slate-500">
                                        No other bidders found for this property
                                      </p>
                                    ) : (
                                      <>
                                        {/* Next bidders list */}
                                        <div className="space-y-2">
                                          {nextBidders.map((b: any, idx: number) => (
                                            <div key={b._id}
                                              className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-200">
                                              <div className="flex items-center gap-3">
                                                <div className={`size-7 rounded-full flex items-center justify-center font-black text-white text-xs flex-shrink-0 ${
                                                  idx === 0 ? "bg-amber-500" :
                                                  idx === 1 ? "bg-slate-400" :
                                                  "bg-orange-400"
                                                }`}>
                                                  {idx + 1}
                                                </div>
                                                <div>
                                                  <p className="font-bold text-slate-900 text-sm">
                                                    {b.name}
                                                  </p>
                                                  <p className="text-xs text-slate-400">
                                                    {b.email}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <p className="font-black text-slate-900">
                                                  £{b.bidAmount?.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                  their bid
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>

                                        {/* Custom message */}
                                        <div>
                                          <label className="block text-xs font-bold text-amber-800 mb-1">
                                            Custom Message (optional)
                                          </label>
                                          <textarea
                                            value={notifyMessages[propId] || ""}
                                            onChange={e => setNotifyMessages(prev => ({
                                              ...prev,
                                              [propId]: e.target.value
                                            }))}
                                            placeholder={`The winner has withdrawn. The property "${prop.propertyTitle}" is now available at £${stats.highestBid?.toLocaleString()}. Are you interested?`}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-amber-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none bg-white"
                                          />
                                        </div>

                                        {/* Send button */}
                                        <button
                                          onClick={() => handleNotify(propId, auction._id)}
                                          disabled={notifyingId === propId}
                                          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-amber-200"
                                        >
                                          {notifyingId === propId ? (
                                            <><Loader2 className="size-4 animate-spin" /> Sending...</>
                                          ) : (
                                            <><Send className="size-4" /> Send Offer to {nextBidders.length} Bidder(s)</>
                                          )}
                                        </button>

                                        {/* Result */}
                                        {notifyResult && (
                                          <div className={`p-3 rounded-xl text-sm font-bold flex items-start gap-2 ${
                                            notifyResult.success
                                              ? "bg-green-50 text-green-700 border border-green-200"
                                              : "bg-red-50 text-red-700 border border-red-200"
                                          }`}>
                                            {notifyResult.success
                                              ? <CheckCircle className="size-4 flex-shrink-0 mt-0.5" />
                                              : <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />}
                                            <div>
                                              {notifyResult.success
                                                ? `Successfully notified ${notifyResult.notified?.length || 0} bidder(s)`
                                                : notifyResult.message}
                                              {notifyResult.notified?.map((b: any) => (
                                                <p key={b.email} className="text-xs mt-1 font-medium opacity-80">
                                                  ✓ {b.name} ({b.email})
                                                </p>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                )}

                                {/* For unsold - just show info */}
                                {!isSold && stats.highestBid > 0 && (
                                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                    <p className="text-xs text-slate-500 font-medium">
                                      ℹ️ Reserve not met — offer notifications
                                      apply only to sold properties where
                                      the winner withdraws.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Loading state */}
                  {isExpanded && isLoading2 && (
                    <div className="border-t border-slate-100 p-8 text-center">
                      <Loader2 className="size-8 text-amber-500 animate-spin mx-auto" />
                      <p className="text-sm text-slate-400 mt-2">
                        Loading auction data...
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
