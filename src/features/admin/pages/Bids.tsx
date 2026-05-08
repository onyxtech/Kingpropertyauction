import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Gavel,
  Users,
  TrendingUp,
  Eye,
  Search,
  Zap,
  Bot,
  Clock,
  CheckCircle,
  Building2,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useBiddingApi } from "@/features/bid/api/useBiddingApi";

export default function Bids() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");

  const { useGetAllBids, useGetBidsStats } = useBiddingApi();
  const { data: bidsData, isLoading } = useGetAllBids({
    page,
    limit: 20,
    status: statusFilter,
    sortBy,
  });
  const { data: stats } = useGetBidsStats();

  const bids = bidsData?.data || [];
  const pagination = bidsData?.pagination || {};

  const formatPrice = (val: number) => `£${(val || 0).toLocaleString()}`;
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusColors: Record<string, string> = {
    winning: "bg-green-100 text-green-700",
    outbid: "bg-amber-100 text-amber-700",
    won: "bg-emerald-100 text-emerald-700",
    lost: "bg-red-100 text-red-700",
    retracted: "bg-slate-100 text-slate-500",
  };

  const statsCards = [
    {
      label: "Total Bids",
      value: stats?.totalBids || 0,
      color: "from-blue-500 to-indigo-600",
      icon: Gavel,
    },
    {
      label: "Today's Bids",
      value: stats?.todayBids || 0,
      color: "from-green-500 to-emerald-600",
      icon: TrendingUp,
    },
    {
      label: "Currently Winning",
      value: stats?.winningBids || 0,
      color: "from-purple-500 to-pink-600",
      icon: CheckCircle,
    },
    {
      label: "Total Won",
      value: stats?.wonBids || 0,
      color: "from-emerald-500 to-teal-600",
      icon: Gavel,
    },
    {
      label: "Unique Bidders",
      value: stats?.totalBidders || 0,
      color: "from-orange-500 to-amber-600",
      icon: Users,
    },
  ];

  return (
    <AdminLayout activeTab="bids" onTabChange={() => {}}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Bids Management
            </h2>
            <p className="text-slate-600 font-medium">
              Monitor all bids across auctions and properties
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg"
              >
                <div
                  className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}
                >
                  <Icon className="size-5 text-white" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="winning">Winning</option>
                <option value="outbid">Outbid</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
                <option value="retracted">Retracted</option>
              </select>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold cursor-pointer"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="-amount">Highest Amount</option>
                <option value="amount">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <tr>
                  {[
                    "Bidder",
                    "Property",
                    "Auction",
                    "Amount",
                    "Type",
                    "Status",
                    "Date",
                    "",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-12 text-slate-500"
                    >
                      Loading bids...
                    </td>
                  </tr>
                ) : bids.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-12 text-slate-500"
                    >
                      No bids found.
                    </td>
                  </tr>
                ) : (
                  bids.map((bid: any, idx: number) => (
                    <tr
                      key={bid._id}
                      className={`hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {bid.bidder?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {bid.bidder?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {bid.bidder?.email || ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(
                              `/properties/${bid.property?.slug || bid.property?._id}`,
                            )
                          }
                          className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Building2 className="size-3" />
                          {bid.property?.propertyTitle || "Unknown"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(
                              `/auctions/${bid.auction?.slug || bid.auction?._id}`,
                            )
                          }
                          className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <Gavel className="size-3" />
                          {bid.auction?.auctionTitle || "Unknown"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-black text-green-600">
                          {formatPrice(bid.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {bid.isAutoBid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
                            <Bot className="size-3" /> Auto
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                            <Zap className="size-3" /> Manual
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[bid.status] || "bg-slate-100 text-slate-700"}`}
                        >
                          {bid.status?.charAt(0).toUpperCase() +
                            bid.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatDate(bid.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(
                              `/properties/${bid.property?.slug || bid.property?._id}`,
                            )
                          }
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                          title="View Property"
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-600 font-medium">
                Showing{" "}
                <span className="font-bold">
                  {(pagination.page - 1) * 20 + 1}-
                  {Math.min(pagination.page * 20, pagination.total)}
                </span>{" "}
                of <span className="font-bold">{pagination.total}</span> bids
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from(
                  { length: Math.min(pagination.pages, 5) },
                  (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`size-10 rounded-xl text-sm font-bold ${page === i + 1 ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "bg-white border-2 border-slate-200"}`}
                    >
                      {i + 1}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
