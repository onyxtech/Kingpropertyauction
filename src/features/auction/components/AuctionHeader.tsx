import { Calendar, Hash, Users, Gavel, MapPin } from "lucide-react";
import AuctionTimer from "@/features/shared/components/AuctionTimer";
import { formatUKDateTime } from "@/features/shared/utils/dateUtils";

interface AuctionHeaderProps {
  auction: any;
  isLiveRoomAuction: boolean;
  propertyCount: number;
}

export default function AuctionHeader({ auction, isLiveRoomAuction, propertyCount }: AuctionHeaderProps) {
  return (
    <>
      {/* Auction Header Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/60 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-bold mb-3">
              <span className="size-2 bg-white rounded-full animate-pulse" />
              {auction.status === "live"
                ? "LIVE AUCTION"
                : auction.status?.toUpperCase()}
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              {auction.auctionTitle}
            </h1>
            {auction.description && (
              <p className="text-slate-600">{auction.description}</p>
            )}
          </div>
          <div className="text-right space-y-1">
            {auction.status === "scheduled" && (
              <>
                <p className="text-sm text-slate-500">Starts</p>
                <p className="text-sm font-bold text-slate-900">
                  {formatUKDateTime(auction.startDateTime)}
                </p>
              </>
            )}
            {auction.status === "live" && (
              <>
                <p className="text-sm text-slate-500">Ends</p>
                <p className="text-sm font-bold text-slate-900">
                  {formatUKDateTime(auction.endDateTime)}
                </p>
              </>
            )}
            {auction.startDateTime && auction.endDateTime && (
              <AuctionTimer
                startDateTime={auction.startDateTime}
                endDateTime={auction.endDateTime}
                status={auction.status}
                showLabel={true}
              />
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <Calendar className="size-4" />{" "}
            {formatUKDateTime(auction.startDateTime)} —{" "}
            {formatUKDateTime(auction.endDateTime)}
          </span>
          <span className="flex items-center gap-1">
            <Hash className="size-4" /> {propertyCount} Lots
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-4" /> {auction.totalBidders || 0}{" "}
            Bidders
          </span>
          <span className="flex items-center gap-1">
            <Gavel className="size-4" /> {auction.totalBids || 0} Total
            Bids
          </span>
        </div>
      </div>

      {/* Live Room Banner */}
      {isLiveRoomAuction && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 border-2 border-purple-400 shadow-xl text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="size-5" />
                <span className="font-black text-lg">Live Room Auction</span>
              </div>
              <p className="text-purple-100 text-sm">
                This is a physical venue auction. Online bidding is not available — attend in person to participate.
              </p>
              {auction.venue?.name && (
                <p className="mt-2 font-bold text-purple-50">
                  📍 {auction.venue.name}{auction.venue.address ? `, ${auction.venue.address}` : ''}{auction.venue.city ? `, ${auction.venue.city}` : ''}
                </p>
              )}
            </div>
            {auction.status === 'scheduled' && (
              <a
                href="/view-live-locations"
                className="shrink-0 px-5 py-3 bg-white text-purple-700 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors shadow"
              >
                Register to Attend
              </a>
            )}
            {auction.status === 'live' && (
              <div className="shrink-0 px-5 py-3 bg-red-500 text-white rounded-xl font-bold text-sm">
                🔴 Auction Live Now at Venue
              </div>
            )}
            {auction.status === 'completed' && (
              <div className="shrink-0 px-5 py-3 bg-white/20 text-white rounded-xl font-bold text-sm">
                ✅ Auction Completed
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
