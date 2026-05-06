import { Eye, Edit, Zap, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { useCountdown } from "@/features/shared/ui/useCountdown";
import { Trash2 } from "lucide-react";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";

export default function AuctionCard({ auction }: any) {
  const navigate = useNavigate();
  const countdown = useCountdown(auction.endDateTime);
  const { useDeleteAuction } = useAuctionApi();
  const deleteAuction = useDeleteAuction();

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
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1">
            Starting Bid
          </p>
          <p className="text-sm font-black text-slate-900">
            {auction.startingBid ? auction.startingBid.toLocaleString() : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1">Current Bid</p>
          <p className="text-sm font-black text-green-600">
            {auction.currentBid ? auction.currentBid.toLocaleString() : "N/A"}
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
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-4">
        <Clock className="size-4" />
        {auction.status === "live"
          ? countdown
          : auction.status === "scheduled"
            ? `Starts ${new Date(auction.startDateTime).toLocaleDateString()}`
            : `Ended ${new Date(auction.endDateTime).toLocaleDateString()}`}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/auctions/${auction.slug || auction._id}`)}
          className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-1"
        >
          <Eye className="size-4" /> View Details
        </button>
        {auction.status !== "completed" && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/auctions/${auction._id}/edit`)}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
            >
              <Edit className="size-4" />
            </button>
            <button
              onClick={() => {
                if (confirm("Delete this auction?")) {
                  deleteAuction.mutate(auction._id);
                }
              }}
              className="px-4 py-2.5 bg-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-200 transition-all"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
