import { useState } from "react";
import { mediaUrl } from "@/lib/mediaUrl";
import { useNavigate } from "react-router";
import AdminLayout from "../components/AdminLayout";
import { apiClient } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { showSuccess, showError } from "@/lib/toast";
import {
  Trophy, Send, ChevronDown, ChevronUp,
  Search, X, AlertCircle, CheckCircle,
  Users, Home, Loader2, Bell
} from "lucide-react";
import ConfirmModal from "@/features/shared/components/ConfirmModal";

export default function Offers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expandedAuction, setExpandedAuction] = useState<string | null>(null);
  const [loadingAuction, setLoadingAuction] = useState<string | null>(null);
  const [auctionData, setAuctionData] = useState<Record<string, {
    stats: Record<string, any>;
    nextBidders: Record<string, any[]>;
    properties: any[];
    notifiedBidders: Record<string, any[]>;
  }>>({});
  const [notifyMessages, setNotifyMessages] = useState<Record<string, string>>({});
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [notifyResults, setNotifyResults] = useState<Record<string, any>>({});
  const [withdrawing, setWithdrawing] = useState<string | null>(null);
  const [reofferPropId, setReofferPropId] = useState<string | null>(null);
  const [selectedBuyerId, setSelectedBuyerId] = useState("");
  const [agreedPrice, setAgreedPrice] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [resetting, setResetting] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean; title: string; message: string;
    confirmLabel: string; variant: any; action: () => void;
  }>({ show: false, title: "", message: "", confirmLabel: "Confirm", variant: "primary", action: () => {} });

  const closeConfirm = () => setConfirmModal(s => ({ ...s, show: false }));

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

  const loadAuctionData = async (auctionId: string, auction: any) => {
    setLoadingAuction(auctionId);
    try {
      const statsRes = await apiClient.fetch(`/bids/auction/${auctionId}/property-stats`);
      const stats = statsRes.success ? statsRes.data : {};

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

      const nextBidders: Record<string, any[]> = {};
      for (const propId of propIds) {
        const propStats = stats[propId];
        if (propStats?.isSold) {
          const nb = await apiClient.fetch(
            `/bids/auction/${auctionId}/next-bidders?propertyId=${propId}`
          );
          if (nb.success) nextBidders[propId] = nb.data || [];
        }
      }

      const notifiedBidders: Record<string, any[]> = {};
      for (const propId of propIds) {
        const propStats = stats[propId];
        if (propStats?.isWithdrawn) {
          const nbRes = await apiClient.fetch(`/payments/notified-bidders/${propId}`);
          if (nbRes.success) notifiedBidders[propId] = nbRes.data || [];
        }
      }

      setAuctionData(prev => ({
        ...prev,
        [auctionId]: { stats, nextBidders, properties, notifiedBidders }
      }));
    } catch (e) {
      console.warn("Failed to load auction data:", e);
    } finally {
      setLoadingAuction(null);
    }
  };

  const handleExpand = async (auction: any) => {
    const id = auction._id;
    if (expandedAuction === id) {
      setExpandedAuction(null);
      return;
    }
    setExpandedAuction(id);
    if (auctionData[id]) return;
    await loadAuctionData(id, auction);
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
      if (result.success && expandedAuction) {
        const auction = (auctions as any[]).find(a => a._id === expandedAuction);
        if (auction) {
          setAuctionData(prev => {
            const copy = { ...prev };
            delete copy[expandedAuction];
            return copy;
          });
          await loadAuctionData(expandedAuction, auction);
        }
      }
    } catch {
      setNotifyResults(prev => ({
        ...prev,
        [propertyId]: { success: false, message: "Failed to send" },
      }));
    } finally {
      setNotifyingId(null);
    }
  };

  const toggleWithdrawn = async (propId: string, auction: any) => {
    setWithdrawing(propId);
    try {
      const paymentResult = await apiClient.fetch(`/payments?propertyId=${propId}&limit=1`);
      if (paymentResult.success && paymentResult.data?.length > 0) {
        const payment = paymentResult.data[0];
        await apiClient.fetch(`/payments/${payment._id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: "withdrawn" }),
        });
        showSuccess("Marked as withdrawn — winner and next bidders notified");
        await loadAuctionData(auction._id, auction);
      }
    } catch (e: any) {
      showError("Failed", e.message);
    } finally {
      setWithdrawing(null);
    }
  };

  const handleAssignBuyer = async (auctionId: string) => {
    if (!selectedBuyerId || !agreedPrice || !reofferPropId) {
      showError("Missing fields", "Please select a buyer and enter price");
      return;
    }
    setAssigning(true);
    try {
      const result = await apiClient.fetch("/payments/assign-buyer", {
        method: "POST",
        body: JSON.stringify({
          propertyId: reofferPropId,
          newBuyerId: selectedBuyerId,
          agreedPrice: parseFloat(agreedPrice),
          auctionId,
        }),
      });
      if (result.success) {
        showSuccess("New buyer assigned! ✅", "Payment and commission records updated automatically");
        setReofferPropId(null);
        setSelectedBuyerId("");
        setAgreedPrice("");
      } else {
        showError("Failed", result.message);
      }
    } catch (e: any) {
      showError("Failed", e.message);
    } finally {
      setAssigning(false);
    }
  };

  const handleResetProperty = async (propId: string) => {
    setResetting(propId);
    try {
      const result = await apiClient.fetch("/payments/reset-property", {
        method: "POST",
        body: JSON.stringify({ propertyId: propId }),
      });
      if (result.success) {
        showSuccess("Property reset! ✅", "Property is now available for new auctions");
      } else {
        showError("Failed", result.message);
      }
    } catch (e: any) {
      showError("Failed", e.message);
    } finally {
      setResetting(null);
    }
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
              title="Clear Search"
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
                        const notifiedBidders = data.notifiedBidders?.[propId] || [];
                        const acceptedBidders = notifiedBidders.filter((b: any) => b.status === "accepted");
                        const isWithdrawn = stats.isWithdrawn === true;
                        const isPaid = stats.isPaid === true;
                        const isResetToAvailable = stats.isResetToAvailable === true;
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
                                  src={mediaUrl(prop.media.propertyImages[0])}
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
                                    <div className="flex-shrink-0">
                                      {isPaid ? (
                                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500 text-white">
                                          ✅ Paid - Completed
                                        </span>
                                      ) : isResetToAvailable ? (
                                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500 text-white">
                                          🔄 Withdrew → Available Again
                                        </span>
                                      ) : isWithdrawn ? (
                                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500 text-white">
                                          ⚠️ Withdrew
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() => setConfirmModal({
                                            show: true,
                                            title: "Mark Winner as Withdrawn?",
                                            message: "This voids their purchase + commission and notifies them. The property can then be offered to next bidders.",
                                            confirmLabel: "Withdraw",
                                            variant: "warning",
                                            action: () => { closeConfirm(); toggleWithdrawn(propId, auction); },
                                          })}
                                          disabled={withdrawing === propId}
                                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 bg-slate-200 text-slate-600 hover:bg-slate-300"
                                        >
                                          {withdrawing === propId ? "Processing..." : "Mark Withdrew"}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Available Again banner */}
                                {isSold && isWithdrawn && !isPaid && isResetToAvailable && (
                                  <div className="mb-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-start gap-2">
                                    <Home className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="text-xs font-bold text-blue-800">
                                        ✅ Reset to Available — this property can be added to a new auction OR assigned directly if a buyer is found offline.
                                      </p>
                                      <p className="text-xs text-blue-600 mt-0.5">
                                        It was previously withdrawn. Notify/assign options remain available below.
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Next Bidders + Notify
                                    ONLY show when sold + winner withdrew */}
                                {isSold && isWithdrawn && !isPaid && (
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
                                          onClick={() => setConfirmModal({
                                            show: true,
                                            title: "Send Offer to Next Bidders?",
                                            message: "Eligible next bidders will receive an email + notification about this property.",
                                            confirmLabel: "Send Offer",
                                            variant: "primary",
                                            action: () => { closeConfirm(); handleNotify(propId, auction._id); },
                                          })}
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

                                {/* Bidder Responses Panel */}
                                {isSold && isWithdrawn && !isPaid && notifiedBidders.length > 0 && (
                                  <div className="mt-4 bg-white border-2 border-slate-200 rounded-xl p-4">
                                    <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2 text-sm">
                                      <Users className="size-4" />
                                      Bidder Responses
                                    </h4>
                                    <div className="space-y-2">
                                      {notifiedBidders.map((b: any) => (
                                        <div key={b.user || b.email}
                                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                          <div>
                                            <p className="font-bold text-slate-900 text-sm">{b.name}</p>
                                            <p className="text-xs text-slate-400">{b.email}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-xs text-slate-400">
                                              Original bid: £{b.bidAmount?.toLocaleString()}
                                            </p>
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                                              b.status === "accepted"
                                                ? "bg-green-100 text-green-700"
                                                : b.status === "declined"
                                                ? "bg-red-100 text-red-600"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                              {b.status === "accepted"
                                                ? "✅ Accepted"
                                                : b.status === "declined"
                                                ? "❌ Declined"
                                                : "⏳ Pending"}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Re-offer Section */}
                                {isSold && isWithdrawn && !isPaid && (
                                  <div className="mt-4 space-y-3">
                                    {/* Assign New Buyer */}
                                    {acceptedBidders.length > 0 && (
                                      <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                                        <h4 className="font-black text-green-800 mb-2 flex items-center gap-2 text-sm">
                                          <CheckCircle className="size-4" />
                                          Assign New Buyer
                                        </h4>
                                        {reofferPropId === propId ? (
                                          <div className="space-y-3">
                                            <div>
                                              <label className="block text-xs font-bold text-slate-600 mb-1">Select Accepted Bidder</label>
                                              <select
                                                value={selectedBuyerId}
                                                onChange={e => setSelectedBuyerId(e.target.value)}
                                                className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
                                              >
                                                <option value="">Select bidder...</option>
                                                {acceptedBidders.map((b: any) => (
                                                  <option key={b.user} value={b.user}>
                                                    {b.name} — Bid: £{b.bidAmount?.toLocaleString()}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                            <div>
                                              <label className="block text-xs font-bold text-slate-600 mb-1">Agreed Price (£)</label>
                                              <input
                                                type="number"
                                                min="0"
                                                value={agreedPrice}
                                                onChange={e => setAgreedPrice(e.target.value)}
                                                className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
                                                placeholder="Enter agreed sale price"
                                              />
                                              <p className="text-xs text-slate-400 mt-1">Pre-filled with bidder's original bid. Adjust if negotiated differently.</p>
                                            </div>
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => setConfirmModal({
                                                  show: true,
                                                  title: "Assign Property to Buyer?",
                                                  message: `Assign at £${Number(agreedPrice || 0).toLocaleString()}. Creates a new payment + commission and makes them the new owner.`,
                                                  confirmLabel: "Confirm & Assign",
                                                  variant: "success",
                                                  action: () => { closeConfirm(); handleAssignBuyer(auction._id); },
                                                })}
                                                disabled={assigning}
                                                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                              >
                                                {assigning ? (
                                                  <><Loader2 className="size-4 animate-spin" /> Assigning...</>
                                                ) : (
                                                  <><CheckCircle className="size-4" /> Confirm & Assign</>
                                                )}
                                              </button>
                                              <button
                                                onClick={() => { setReofferPropId(null); setSelectedBuyerId(""); setAgreedPrice(""); }}
                                                className="px-4 py-2.5 bg-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-300"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <button
                                            onClick={() => {
                                              setReofferPropId(propId);
                                              const top = acceptedBidders[0];
                                              if (top?.bidAmount) {
                                                setAgreedPrice(String(top.bidAmount));
                                              }
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all flex items-center gap-2"
                                          >
                                            <Users className="size-4" />
                                            Assign New Buyer
                                          </button>
                                        )}
                                      </div>
                                    )}
                                    {/* Reset Property */}
                                    <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                                      <h4 className="font-black text-slate-700 mb-2 flex items-center gap-2 text-sm">
                                        <Home className="size-4" />
                                        No Buyer Found?
                                      </h4>
                                      <p className="text-xs text-slate-500 mb-3">
                                        If no next bidder is interested, reset this property so it can be added to a future auction. All previous records are preserved.
                                      </p>
                                      <button
                                        onClick={() => setConfirmModal({
                                          show: true,
                                          title: "Reset Property to Available?",
                                          message: "The property will be available for future auctions. All payment and commission records are preserved.",
                                          confirmLabel: "Reset to Available",
                                          variant: "primary",
                                          action: () => { closeConfirm(); handleResetProperty(propId); },
                                        })}
                                        disabled={resetting === propId}
                                        className="px-4 py-2 bg-slate-600 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-50"
                                      >
                                        {resetting === propId ? (
                                          <><Loader2 className="size-4 animate-spin" /> Resetting...</>
                                        ) : (
                                          <><Home className="size-4" /> Reset to Available</>
                                        )}
                                      </button>
                                    </div>
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
      <ConfirmModal
        show={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        variant={confirmModal.variant}
        onConfirm={confirmModal.action}
        onCancel={closeConfirm}
      />
    </AdminLayout>
  );
}
