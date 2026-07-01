// src\features\admin\components\users\tabs\BidsTab.tsx
import { TrendingUp, Eye, MapPin } from "lucide-react";
import { UserRecord } from "../UserActivityView";
import { useUserApi } from "@/features/admin/api/useUserApi";
import { useNavigate } from "react-router";
import { StatusBadge } from "../shared/StatusBadge";
import { useState } from "react";

export function BidsTab({ user }: { user: UserRecord }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { useGetUserBids } = useUserApi();
  const { data: bidsData, isLoading } = useGetUserBids(user._id, page, pageSize);

  const bids = bidsData?.data || [];
  const totalBids = bidsData?.pagination?.total || 0;
  const totalPages = Math.ceil(totalBids / pageSize);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(val || 0);

  // Format date and time
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) + " " + date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Build property address
  const getPropertyAddress = (bid: any) => {
    if (bid.propertyAddress) return bid.propertyAddress;
    if (bid.property?.location) {
      const parts = [
        bid.property.location.streetAddress,
        bid.property.location.city,
        bid.property.location.area,
        bid.property.location.postalCode,
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "N/A";
    }
    return "N/A";
  };

  // ✅ Check if user can bid - includes admin check
  const canBid = user.permissions?.canBid || user.role === "buyer" || user.role === "user";
  // Admin cannot bid even if they have canBid permission (which they don't)
  const hasBidPermission = canBid && user.role !== "admin";

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="flex items-center justify-center h-40">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // ✅ If user cannot bid (agent, seller, admin), show "No Bid History"
  if (!hasBidPermission) {
    return (
      <div className="p-5">
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
          <TrendingUp className="size-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700">No Bid History</h3>
          <p className="text-sm text-slate-400 mt-1">
            This user does not have buyer permissions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="size-4 text-slate-400" /> Bid History ({totalBids})
          </h3>
        </div>

        {!bids || bids.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <TrendingUp className="size-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No bids placed</p>
            <p className="text-sm">This user hasn't placed any bids</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["Bid ID", "Property", "Auction", "Amount", "Status", "Date & Time", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bids.map((bid: any) => (
                    <tr key={bid._id} className="hover:bg-slate-50 transition-colors">
                      {/* Bid ID */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-teal-600">
                          {bid.bidId || bid._id?.slice(-8).toUpperCase() || "N/A"}
                        </span>
                      </td>

                      {/* Property - with title and address */}
                      <td className="px-4 py-3">
                        <div>
                          <button
                            onClick={() => navigate(`/properties/${bid.propertySlug || bid.propertyId}`)}
                            className="font-semibold text-slate-900 hover:text-blue-600 hover:underline text-left"
                          >
                            {bid.propertyTitle || bid.property?.propertyTitle || "N/A"}
                          </button>
                          <p className="text-slate-400 text-xs flex items-center gap-1">
                            <MapPin className="size-3" />
                            {getPropertyAddress(bid)}
                          </p>
                        </div>
                      </td>

                      {/* Auction */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/auctions/${bid.auctionSlug || bid.auctionId}`)}
                          className="text-xs font-bold text-rose-600 hover:underline"
                        >
                          {bid.auctionTitle || bid.auction?.auctionTitle || bid.auctionId?.slice(-8).toUpperCase() || "N/A"}
                        </button>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 font-black text-slate-900">
                        {formatPrice(bid.amount)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={bid.status || "pending"} />
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {formatDateTime(bid.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/auctions/${bid.auctionSlug || bid.auctionId}`)}
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                          title="View Auction"
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ─── Pagination ────────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalBids)} of {totalBids} bids
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-medium text-slate-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}