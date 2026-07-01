// src\features\admin\components\users\tabs\AuctionsTab.tsx
import { Gavel, Eye, MapPin } from "lucide-react";
import { UserRecord } from "../UserActivityView";
import { useUserApi } from "@/features/admin/api/useUserApi";
import { useNavigate } from "react-router";
import { StatusBadge } from "../shared/StatusBadge";

export function AuctionsTab({ user }: { user: UserRecord }) {
  const navigate = useNavigate();
  const { useGetUserAuctions } = useUserApi();
  const { data: auctions, isLoading } = useGetUserAuctions(user._id);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(val || 0);

  // Check if user has buyer permissions (can bid)
  const hasBuyerPermissions =
    user.permissions?.canBid || user.role === "buyer" || user.role === "user";

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="flex items-center justify-center h-40">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <Gavel className="size-4 text-slate-400" /> Auction History (
            {auctions?.length || 0})
          </h3>
        </div>

        {!auctions || auctions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Gavel className="size-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No auction activity</p>
            <p className="text-sm">
              This user hasn't participated in any auctions
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {[
                    "Auction ID",
                    "Property",
                    "Result",
                    "Hammer Price",
                    "Date",
                    "Your Bids",
                    "Total Bids",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {auctions.map((auction: any) => (
                  <tr
                    key={auction.auctionId + auction.propertyId}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* Auction ID */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-rose-600">
                        {auction.auctionId?.slice(-8).toUpperCase() || "N/A"}
                      </span>
                    </td>

                    {/* Property - with full address */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {auction.propertyTitle || "N/A"}
                        </p>
                        {auction.propertyAddress && (
                          <p className="text-slate-400 text-xs flex items-center gap-1">
                            <MapPin className="size-3" />
                            {auction.propertyAddress}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Result */}
                    <td className="px-4 py-3">
                      <StatusBadge status={auction.result || "N/A"} />
                    </td>

                    {/* Hammer Price */}
                    <td className="px-4 py-3 font-bold text-green-700 whitespace-nowrap">
                      {auction.hammerPrice > 0
                        ? formatPrice(auction.hammerPrice)
                        : "—"}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(auction.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Your Bids - show "-" for listings, count for bids */}
                    <td className="px-4 py-3 text-center font-bold text-blue-600">
                      {auction.source === "listing"
                        ? "—"
                        : auction.userBids || 0}
                    </td>

                    {/* Total Bids */}
                    <td className="px-4 py-3 text-center font-bold text-slate-700">
                      {auction.totalBids || 0}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/auctions/${auction.auctionSlug || auction.auctionId}`,
                          )
                        }
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
        )}
      </div>
    </div>
  );
}
