import {
  Eye,
  Edit,
  Zap,
  Clock,
  CheckCircle,
  Gavel,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useCountdown } from "@/features/shared/ui/useCountdown";
import { Trash2 } from "lucide-react";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";
import ConfirmModal from "@/features/shared/components/ConfirmModal";

export default function AuctionCard({ auction }: any) {
  const navigate = useNavigate();
  const countdown = useCountdown(auction.endDateTime);
  const { useDeleteAuction } = useAuctionApi();
  const deleteAuction = useDeleteAuction();
  const queryClient = useQueryClient();
  const [showActivity, setShowActivity] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

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
    },
  });

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
            {auction.startDateTime
              ? new Date(auction.startDateTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1">End Date</p>
          <p className="text-sm font-black text-slate-900">
            {auction.endDateTime
              ? new Date(auction.endDateTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
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
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-4">
        <Clock className="size-4" />
        {auction.status === "live"
          ? countdown
          : auction.status === "scheduled"
            ? `Starts ${new Date(auction.startDateTime).toLocaleDateString()}`
            : `Ended ${new Date(auction.endDateTime).toLocaleDateString()}`}
      </div>

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
              {auction.properties.map((property: any) => {
                const propId =
                  typeof property === "object" ? property._id : property;
                const latestData = getLatestPropertyData(propId);
                if (!latestData) {
                  const isPopulated =
                    typeof property === "object" && property.propertyTitle;
                  if (!isPopulated) return null;
                }

                const pCurrentBid =
                  latestData?.currentBid ||
                  property.currentBid ||
                  property.pricing?.startingAuctionPrice ||
                  0;
                const pReserve =
                  latestData?.pricing?.reservePrice ||
                  property.pricing?.reservePrice ||
                  0;
                const pReserveMet = pCurrentBid >= pReserve;
                const pSoldPrice = latestData?.soldPrice || 0;
                const isSold = latestData?.propertyStatus === "sold";
                const isUnsold = latestData?.propertyStatus === "unsold";
                const winnerObj =
                  latestData?.winningBidder ||
                  latestData?.soldTo ||
                  property.winningBidder;
                const winnerName =
                  winnerObj && typeof winnerObj === "object" && winnerObj.name
                    ? winnerObj.name
                    : winnerObj &&
                        typeof winnerObj === "object" &&
                        winnerObj.email
                      ? winnerObj.email
                      : winnerObj && typeof winnerObj === "string"
                        ? "Bidder #" + winnerObj.slice(-6)
                        : "No bids yet";
                const title =
                  latestData?.propertyTitle || property.propertyTitle;

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
                      {auction.status === "completed" ? (
                        isSold ? (
                          <span className="text-xs font-bold text-green-600 ml-2">
                            🎉 Sold £{pSoldPrice.toLocaleString()}
                          </span>
                        ) : isUnsold ? (
                          <span className="text-xs font-bold text-red-600 ml-2">
                            ❌ Unsold
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-500 ml-2">
                            No result
                          </span>
                        )
                      ) : (
                        <span
                          className={`text-xs font-bold ml-2 ${pReserveMet ? "text-green-600" : "text-amber-600"}`}
                        >
                          {pReserveMet ? "✅ Met" : "❌ Not Met"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {auction.status === "completed" && isSold ? (
                          <>
                            Winner:{" "}
                            <span className="font-bold text-green-600">
                              {typeof winnerName === "string" &&
                              winnerName.length > 25
                                ? winnerName.slice(0, 23) + "..."
                                : winnerName}
                            </span>
                          </>
                        ) : auction.status === "completed" && isUnsold ? (
                          <>
                            Highest:{" "}
                            <span className="font-bold text-red-600">
                              £{pCurrentBid.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <>
                            Current:{" "}
                            <span className="font-bold text-slate-900">
                              £{pCurrentBid.toLocaleString()}
                            </span>
                            {latestData?.totalBids > 0 && (
                              <>
                                {" "}
                                |{" "}
                                <span className="font-bold">
                                  {latestData.totalBids} bids
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      {auction.status !== "completed" ? (
                        <span className="text-slate-500">
                          Leader:{" "}
                          <span className="font-bold text-blue-600">
                            {typeof winnerName === "string" &&
                            winnerName.length > 25
                              ? winnerName.slice(0, 23) + "..."
                              : winnerName}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {new Date(auction.endDateTime).toLocaleDateString()}
                        </span>
                      )}
                      {pReserve > 0 && (
                        <span className="text-slate-400">
                          Reserve: £{pReserve.toLocaleString()}
                        </span>
                      )}
                    </div>
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
    </div>
  );
}
