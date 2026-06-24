import { Gavel } from "lucide-react";
import { useBiddingApi } from "@/features/bid/api/useBiddingApi";
import { getAnonymousBidder, resetBidderCounter } from "@/features/shared/utils/anonymizeBidder";
import { useEffect } from "react";

export default function BidHistory({ auctionId }: { auctionId: string }) {
  const { useGetBidHistory } = useBiddingApi();
    useEffect(() => {
    resetBidderCounter();
  }, []);
  const { data: bidHistory, isLoading } = useGetBidHistory(auctionId);
  const bids = bidHistory?.bids || [];

  if (isLoading) {
    return <div className="mt-4 bg-slate-50 rounded-xl p-4"><p className="text-center text-slate-500 text-sm py-4">Loading bid history...</p></div>;
  }

  return (
    <div className="mt-4 bg-slate-50 rounded-xl p-4">
      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <Gavel className="size-4" /> Recent Bid History ({bids.length} bids)
      </h4>
      {bids.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-4">No bids yet. Be the first!</div>
      ) : (
        <div className="space-y-2">
          {bids.map((bid: any, index: number) => (
            <div key={bid._id || index} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
                {(() => {
                  const anon = getAnonymousBidder(bid.bidder?._id || bid.bidder, bid.bidder?.address?.city);
                  return (
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">{anon.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{anon.name} {anon.city && `(${anon.city})`}</p>
                        <p className="text-xs text-slate-600">{new Date(bid.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  );
                })()}
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">£{bid.amount?.toLocaleString()}</p>
                {index === 0 && <span className="text-xs text-green-600 font-medium">Highest Bid</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}