import { Info, Calendar } from "lucide-react";
import { formatUKDateTime } from "@/features/shared/utils/dateUtils";

interface AuctionSidebarProps {
  auction: any;
  propertyCount: number;
}

export default function AuctionSidebar({ auction, propertyCount }: AuctionSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Auction Status */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl">
        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <Info className="size-5 text-blue-600" /> Auction Status
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Status</span>
            <span
              className={`font-bold ${auction.status === "live" ? "text-green-600" : "text-slate-900"}`}
            >
              {auction.status === "live"
                ? "🟢 Live"
                : auction.status?.charAt(0).toUpperCase() +
                  auction.status?.slice(1)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Total Lots</span>
            <span className="font-bold">{propertyCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Total Bids</span>
            <span className="font-bold">{auction.totalBids || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Registered Bidders</span>
            <span className="font-bold">{auction.totalBidders || 0}</span>
          </div>
        </div>
      </div>

      {/* Auction Details */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl">
        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="size-5 text-indigo-600" /> Auction Details
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Start Date</span>
            <span className="font-bold text-xs text-right">
              {formatUKDateTime(auction.startDateTime)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">End Date</span>
            <span className="font-bold text-xs text-right">
              {formatUKDateTime(auction.endDateTime)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Auction Type</span>
            <span className="font-bold capitalize">
              {auction.auctionType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
