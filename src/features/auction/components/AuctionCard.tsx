import {
  Eye,
  Edit,
  Zap,
  CheckCircle,
  Gavel,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";
import ConfirmModal from "@/features/shared/components/ConfirmModal";
import AuctionTimer from "@/features/shared/components/AuctionTimer";
import { formatUKDateTime } from "@/features/shared/utils/dateUtils";

export default function AuctionCard({ auction }: any) {
  const navigate = useNavigate();
  const { useDeleteAuction } = useAuctionApi();
  const deleteAuction = useDeleteAuction();
  const queryClient = useQueryClient();
  const [showActivity, setShowActivity] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [auctionBidStats, setAuctionBidStats] = useState<any>({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<any>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyingNextBidder, setNotifyingNextBidder] = useState(false);
  const [notifyResult, setNotifyResult] = useState<any>(null);
  const [nextBidders, setNextBidders] = useState<any[]>([]);
  const [loadingNextBidders, setLoadingNextBidders] = useState(false);

  const completeAuction = useMutation({
    mutationFn: async () => {
      const result = await apiClient.fetch(
        `/auctions/${auction._id}/complete`,
        { method: "PATCH" },
      );
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  useEffect(() => {
    if (!showActivity || auction.status !== "completed") return;
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const result = await apiClient.fetch(`/bids/auction/${auction._id}/property-stats`);
        if (result.success) setAuctionBidStats(result.data || {});
      } catch (e) {
        console.warn("Failed to fetch auction bid stats:", e);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [showActivity, auction._id, auction.status]);

  const { useGetProperties } = usePropertyApi();
  const { data: freshProps } = useGetProperties();
  const allProperties = freshProps?.data || [];

  // Get latest property data for this auction's lots
  const getLatestPropertyData = (propertyId: string) => {
    return allProperties.find((p: any) => p._id === propertyId) || null;
  };

  return (
    <div
      className={`bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 ${
        auction.status === "live" ? "border-green-300" : "border-white/60"
      } shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
              auction.status === "live"
                ? "bg-green-100 text-green-700 animate-pulse"
                : auction.status === "scheduled"
                  ? "bg-blue-100 text-blue-700"
                  : auction.status === "completed"
                    ? "bg-slate-100 text-slate-700"
                    : "bg-red-100 text-red-700"
            }`}
          >
            {auction.status === "live" && <Zap className="size-3" />}
            {auction.status.toUpperCase()}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600">🖥️ Online</span>
        </div>
        <span className="text-xs font-bold text-slate-500">
          #{auction._id?.slice(-6)}
        </span>
      </div>
      <h4 className="text-lg font-black text-slate-900 mb-2">
        {auction.auctionTitle}
      </h4>
      <p className="text-sm text-slate-600 font-medium mb-4">
        {auction.properties?.length || 0} properties linked
      </p>

      {/* Dates + Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1">Start Date</p>
          <p className="text-sm font-black text-slate-900">
            {auction.startDateTime ? formatUKDateTime(auction.startDateTime) : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1">End Date</p>
          <p className="text-sm font-black text-slate-900">
            {auction.endDateTime ? formatUKDateTime(auction.endDateTime) : "N/A"}
          </p>
        </div>
        <div>
            <p className="text-xs text-slate-500 font-medium mb-1">Total Bids</p>
            <p className="text-sm font-black text-slate-900">
              {auction.totalBids || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1">Bidders</p>
            <p className="text-sm font-black text-slate-900">
              {auction.totalBidders || 0}
            </p>
          </div>
      </div>

      {/* Countdown / Status */}
      {auction.startDateTime && auction.endDateTime && (
        <div className="mb-4">
          <AuctionTimer
            startDateTime={auction.startDateTime}
            endDateTime={auction.endDateTime}
            status={auction.status}
            showLabel={true}
          />
        </div>
      )}

      {/* Result Summary for Completed Auctions */}
      {auction.status === "completed" && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <p className="text-xs font-bold text-green-700 flex items-center gap-1">
            <CheckCircle className="size-3" /> Auction Completed
          </p>
        </div>
      )}

      {/* Bidding Activity Toggle */}
      {auction.properties?.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowActivity(!showActivity)}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-sm font-bold text-blue-700 hover:from-blue-100 hover:to-indigo-100 transition-all flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Gavel className="size-4" />
              Bidding Activity ({auction.properties.length}{" "}
              {auction.properties.length === 1 ? "lot" : "lots"})
            </span>
            <ChevronDown
              className={`size-4 transition-transform ${showActivity ? "rotate-180" : ""}`}
            />
          </button>

          {showActivity && (
            <div className="mt-3 space-y-2">
              {loadingStats && auction.status === "completed" && (
                <div className="text-center py-2 text-xs text-slate-400">Loading results...</div>
              )}
              {auction.properties.map((property: any) => {
                const propId =
                  typeof property === "object" ? property._id : property;
                const latestData = getLatestPropertyData(propId);
                if (!latestData) {
                  const isPopulated =
                    typeof property === "object" && property.propertyTitle;
                  if (!isPopulated) return null;
                }

                // For completed auctions use per-auction aggregate; fall back to global for live/scheduled
                const bidStats = auctionBidStats[propId] || {};
                const isCompleted = auction.status === "completed";

                const highestBid = isCompleted
                  ? (bidStats.highestBid ?? 0)
                  : (latestData?.currentBid || property.currentBid || property.pricing?.startingAuctionPrice || 0);
                const totalBids = isCompleted
                  ? (bidStats.totalBids ?? 0)
                  : (latestData?.totalBids || 0);
                const winner = isCompleted ? (bidStats.winner || null) : null;
                const isSold = isCompleted
                  ? (bidStats.isSold ?? false)
                  : false;
                const outcome = bidStats.outcome || null;
                const soldPrice = bidStats.soldPrice || null;
                const displayPrice = (isCompleted && isSold && soldPrice) ? soldPrice : highestBid;
                const isUnsold = isCompleted && !isSold && (bidStats.highestBid !== undefined || latestData?.propertyStatus === "unsold");
                const pReserve =
                  bidStats.reservePrice || latestData?.pricing?.reservePrice || property.pricing?.reservePrice || 0;
                const pReserveMet = highestBid >= pReserve && pReserve > 0;

                // For live auctions, get winning bidder name from global data
                const liveWinnerObj = latestData?.winningBidder || latestData?.soldTo || property.winningBidder;
                const liveWinnerName = liveWinnerObj && typeof liveWinnerObj === "object" && liveWinnerObj.name
                  ? liveWinnerObj.name
                  : liveWinnerObj && typeof liveWinnerObj === "string"
                  ? "Bidder #" + liveWinnerObj.slice(-6)
                  : "No bids yet";

                const title = latestData?.propertyTitle || property.propertyTitle;

                return (
                  <div
                    key={propId}
                    className={`p-3 rounded-xl border ${
                      isSold
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                        : isUnsold
                          ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
                          : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-slate-900 truncate flex-1">
                        {title}
                      </p>
                      {isCompleted ? (
                        outcome?.status === "withdrawn" ? (
                          <div className="ml-2 text-right">
                            <span className="text-xs font-bold text-orange-600 block">⚠️ Winner Withdrew</span>
                            <span className="text-xs text-slate-500">Was: £{(outcome.salePrice || highestBid).toLocaleString()}</span>
                          </div>
                        ) : isSold ? (
                          <span className="text-xs font-bold text-green-600 ml-2">
                            🎉 Sold £{displayPrice.toLocaleString()}
                          </span>
                        ) : highestBid > 0 ? (
                          <span className="text-xs font-bold text-red-600 ml-2">
                            ❌ Unsold
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-500 ml-2">
                            No bids placed
                          </span>
                        )
                      ) : (
                        <span className={`text-xs font-bold ml-2 ${pReserveMet ? "text-green-600" : "text-amber-600"}`}>
                          {pReserveMet ? "✅ Met" : "❌ Not Met"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {isCompleted && isSold ? (
                          <>
                            Winner:{" "}
                            {winner ? (
                              <button
                                onClick={() => {
                                  setSelectedWinner({
                                    ...winner,
                                    propertyTitle: title,
                                    bidAmount: displayPrice,
                                    auctionTitle: auction.auctionTitle,
                                    propertyId: propId,
                                    auctionId: auction._id,
                                    isWithdrawn: bidStats.isWithdrawn === true,
                                  });
                                  setShowWinnerModal(true);
                                  setNotifyResult(null);
                                  setNextBidders([]);
                                  if (bidStats.isWithdrawn === true) {
                                    setLoadingNextBidders(true);
                                    apiClient.fetch(`/bids/auction/${auction._id}/next-bidders?propertyId=${propId}`)
                                      .then(r => { if (r.success) setNextBidders(r.data || []); })
                                      .catch(() => {})
                                      .finally(() => setLoadingNextBidders(false));
                                  }
                                }}
                                className="font-bold text-blue-600 hover:underline cursor-pointer"
                              >
                                {winner.name || winner.email || "Winner"}
                              </button>
                            ) : (
                              <span className="font-bold text-green-600">Unknown</span>
                            )}
                          </>
                        ) : isCompleted && highestBid > 0 ? (
                          <>
                            Highest: <span className="font-bold text-red-600">£{highestBid.toLocaleString()}</span>
                          </>
                        ) : isCompleted ? (
                          <span className="text-slate-400">No bids placed</span>
                        ) : (
                          <>
                            Current: <span className="font-bold text-slate-900">£{highestBid.toLocaleString()}</span>
                            {totalBids > 0 && <> | <span className="font-bold">{totalBids} bids</span></>}
                          </>
                        )}
                      </span>
                    </div>
                    {!isCompleted && (
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-slate-500">
                          Leader: <span className="font-bold text-blue-600">
                            {liveWinnerName.length > 25 ? liveWinnerName.slice(0, 23) + "..." : liveWinnerName}
                          </span>
                        </span>
                        {pReserve > 0 && (
                          <span className="text-slate-400">Reserve: £{pReserve.toLocaleString()}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => navigate(`/auctions/${auction.slug || auction._id}`)}
          className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-1"
        >
          <Eye className="size-4" /> View Details
        </button>

        {auction.status === "live" && (
          <button
            onClick={() => setShowCompleteConfirm(true)}
            disabled={completeAuction.isPending}
            className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1 disabled:opacity-50"
          >
            <CheckCircle className="size-4" />
            {completeAuction.isPending ? "..." : "Complete"}
          </button>
        )}

        {auction.status !== "completed" && (
          <>
            <button
              onClick={() => navigate(`/admin/auctions/${auction._id}/edit`)}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
            >
              <Edit className="size-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2.5 bg-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-200 transition-all"
            >
              <Trash2 className="size-4" />
            </button>
          </>
        )}
      </div>
      <ConfirmModal
        show={showCompleteConfirm}
        title="Complete Auction"
        message="This will determine winners for all lots and cannot be undone."
        confirmLabel="Complete"
        onConfirm={() => {
          completeAuction.mutate();
          setShowCompleteConfirm(false);
        }}
        onCancel={() => setShowCompleteConfirm(false)}
      />
      <ConfirmModal
        show={showDeleteConfirm}
        title="Delete Auction"
        message="This auction will be permanently deleted and properties will become available."
        onConfirm={() => {
          deleteAuction.mutate(auction._id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {showWinnerModal && selectedWinner && createPortal(
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">🏆 Winner Details</h3>
              <button onClick={() => { setShowWinnerModal(false); setNotifyResult(null); }} className="p-2 hover:bg-slate-100 rounded-xl">
                <X className="size-5 text-slate-400" />
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4">
              <p className="text-xs font-bold text-emerald-700 mb-2">🏆 WINNING BIDDER</p>
              <p className="font-black text-slate-900 text-lg">{selectedWinner.name}</p>
              <p className="text-sm text-slate-600">{selectedWinner.email}</p>
              {selectedWinner.phone && <p className="text-sm text-slate-600">{selectedWinner.phone}</p>}
              <p className="text-2xl font-black text-emerald-700 mt-2">£{selectedWinner.bidAmount?.toLocaleString()}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
              <p className="text-xs font-bold text-blue-700 mb-2">🏠 PROPERTY</p>
              <p className="font-bold text-slate-900">{selectedWinner.propertyTitle}</p>
              <p className="text-sm text-slate-500">{selectedWinner.auctionTitle}</p>
            </div>

            {selectedWinner.bankDetails?.accountNumber && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
                <p className="text-xs font-bold text-amber-700 mb-2">🏦 BANK DETAILS</p>
                <table className="w-full text-sm">
                  <tbody>
                    {([
                      ["Account Holder", selectedWinner.bankDetails.accountHolderName],
                      ["Bank Name", selectedWinner.bankDetails.bankName],
                      ["Account No.", selectedWinner.bankDetails.accountNumber],
                      ["Sort Code", selectedWinner.bankDetails.sortCode],
                      ["IBAN", selectedWinner.bankDetails.iban],
                    ] as [string, string][]).filter(([, v]) => v).map(([label, value]) => (
                      <tr key={label} className="border-b border-amber-100">
                        <td className="py-2 text-slate-500 font-semibold w-32">{label}</td>
                        <td className="py-2 font-bold text-slate-900">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedWinner.isWithdrawn && (
              <>
                {/* Next Bidders */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-700 mb-2">📋 Next Highest Bidders</p>
                  {loadingNextBidders ? (
                    <div className="flex items-center gap-2 py-3">
                      <Loader2 className="size-4 animate-spin text-slate-400" />
                      <span className="text-xs text-slate-400">Loading next bidders...</span>
                    </div>
                  ) : nextBidders.length > 0 ? (
                    <div className="space-y-2">
                      {nextBidders.map((b: any, idx: number) => (
                        <div key={b._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className={`size-7 rounded-full flex items-center justify-center text-xs font-black text-white ${
                              idx === 0 ? "bg-amber-500" : idx === 1 ? "bg-slate-400" : "bg-orange-400"
                            }`}>{idx + 1}</div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{b.name}</p>
                              <p className="text-xs text-slate-500">{b.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-900 text-sm">£{b.bidAmount?.toLocaleString()}</p>
                            <p className="text-xs text-slate-400">Bid amount</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-400 text-center">No other bidders found</p>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-slate-100 pt-4">
                  <p className="font-black text-slate-900 mb-1">📨 Notify Next Bidder</p>
                  <p className="text-xs text-slate-500 mb-3">Winner withdrew — notify next highest bidders</p>
                  <textarea
                    value={notifyMessage}
                    onChange={e => setNotifyMessage(e.target.value)}
                    placeholder="Optional custom message..."
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                  {nextBidders.length > 0 ? (
                    <button
                      onClick={async () => {
                        setNotifyingNextBidder(true);
                        try {
                          const result = await apiClient.fetch("/bids/notify-next-bidder", {
                            method: "POST",
                            body: JSON.stringify({
                              propertyId: selectedWinner.propertyId,
                              auctionId: selectedWinner.auctionId,
                              message: notifyMessage || undefined,
                            }),
                          });
                          setNotifyResult(result);
                        } catch {
                          setNotifyResult({ success: false, message: "Failed to send" });
                        } finally {
                          setNotifyingNextBidder(false);
                        }
                      }}
                      disabled={notifyingNextBidder}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {notifyingNextBidder ? "Sending..." : "🔔 Notify Next Bidders"}
                    </button>
                  ) : !loadingNextBidders && (
                    <p className="text-xs text-slate-400 text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
                      No other bidders available to notify.
                    </p>
                  )}
                  {notifyResult && (
                    <div className={`mt-3 p-3 rounded-xl text-sm font-bold ${notifyResult.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      {notifyResult.success ? `✅ ${notifyResult.message}` : `❌ ${notifyResult.message}`}
                      {notifyResult.notified?.map((b: any) => (
                        <p key={b.email} className="text-xs mt-1">→ {b.name} (£{b.bidAmount?.toLocaleString()})</p>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
