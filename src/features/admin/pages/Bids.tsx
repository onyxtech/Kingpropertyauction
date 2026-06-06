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
  X,
  Download,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useBiddingApi } from "@/features/bid/api/useBiddingApi";
import { apiClient } from "@/lib/apiClient";

export default function Bids() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [search, setSearch] = useState("");
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [notifyingNextBidder, setNotifyingNextBidder] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyResult, setNotifyResult] = useState<any>(null);

  const { useGetAllBids, useGetBidsStats } = useBiddingApi();
  const { data: bidsData, isLoading } = useGetAllBids({
    page,
    limit: 20,
    status: statusFilter,
    sortBy,
    search,
  });
  const { data: stats } = useGetBidsStats();

  const bids = bidsData?.data || [];
  const pagination = bidsData?.pagination || {};

  const exportCSV = () => {
    const headers = ["Bidder", "Email", "Property", "Auction", "Amount", "Status", "Date"];
    const rows = bids.map((b: any) => [
      b.bidder?.name || "Unknown",
      b.bidder?.email || "",
      b.property?.propertyTitle || "",
      b.auction?.auctionTitle || "",
      b.amount || 0,
      b.status || "",
      new Date(b.createdAt).toLocaleDateString("en-GB"),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bids-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by bidder name, email or property..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="winning">Winning</option>
              <option value="outbid">Outbid</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="retracted">Retracted</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold cursor-pointer"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-amount">Highest Amount</option>
              <option value="amount">Lowest Amount</option>
            </select>
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Download className="size-4" />
              Export CSV
            </button>
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
                        <div className="flex items-center gap-2">
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
                          {bid.status === "won" && (
                            <button
                              onClick={() => { setSelectedBid(bid); setShowBidModal(true); setNotifyResult(null); setNotifyMessage(""); }}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all whitespace-nowrap"
                            >
                              Winner Details
                            </button>
                          )}
                        </div>
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
      {showBidModal && selectedBid && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">Winner Details</h3>
              <button onClick={() => { setShowBidModal(false); setNotifyResult(null); }}>
                <X className="size-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4">
              <p className="text-xs font-bold text-emerald-700 mb-2">🏆 WINNING BIDDER</p>
              <p className="font-black text-slate-900">{selectedBid.bidder?.name}</p>
              <p className="text-sm text-slate-600">{selectedBid.bidder?.email}</p>
              <p className="text-sm text-slate-600">{selectedBid.bidder?.phone || "No phone on file"}</p>
              <p className="text-2xl font-black text-emerald-700 mt-2">
                £{selectedBid.amount?.toLocaleString()}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
              <p className="text-xs font-bold text-blue-700 mb-2">🏠 PROPERTY</p>
              <p className="font-bold text-slate-900">{selectedBid.property?.propertyTitle}</p>
              <p className="text-sm text-slate-600">{selectedBid.auction?.auctionTitle}</p>
            </div>

            {selectedBid.bidder?.bankDetails?.accountNumber && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
                <p className="text-xs font-bold text-amber-700 mb-2">🏦 BANK DETAILS</p>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ["Account Holder", selectedBid.bidder.bankDetails.accountHolderName],
                      ["Bank", selectedBid.bidder.bankDetails.bankName],
                      ["Account No.", selectedBid.bidder.bankDetails.accountNumber],
                      ["Sort Code", selectedBid.bidder.bankDetails.sortCode],
                      ["IBAN", selectedBid.bidder.bankDetails.iban],
                    ].filter(([, v]) => v).map(([label, value]) => (
                      <tr key={label} className="border-b border-amber-100">
                        <td className="py-1.5 text-slate-500 font-semibold w-32">{label}</td>
                        <td className="py-1.5 font-bold text-slate-900">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t-2 border-slate-100 pt-4 mt-4">
              <p className="font-black text-slate-900 mb-1">📨 Notify Next Bidder</p>
              <p className="text-xs text-slate-500 mb-3">If winner withdraws, notify the next highest bidders</p>
              <textarea
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
                placeholder="Custom message to next bidder (optional)..."
                rows={2}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
              <button
                onClick={async () => {
                  setNotifyingNextBidder(true);
                  try {
                    const result = await apiClient.fetch("/bids/notify-next-bidder", {
                      method: "POST",
                      body: JSON.stringify({
                        propertyId: selectedBid.property?._id,
                        auctionId: selectedBid.auction?._id,
                        message: notifyMessage || undefined,
                      }),
                    });
                    setNotifyResult(result);
                  } catch {
                    setNotifyResult({ success: false, message: "Failed to send notification" });
                  } finally {
                    setNotifyingNextBidder(false);
                  }
                }}
                disabled={notifyingNextBidder}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {notifyingNextBidder ? "Sending..." : "🔔 Notify Next Bidders"}
              </button>
              {notifyResult && (
                <div className={`mt-3 p-3 rounded-xl text-sm font-bold ${notifyResult.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  {notifyResult.success ? `✅ ${notifyResult.message}` : `❌ ${notifyResult.message}`}
                  {notifyResult.notified?.map((b: any) => (
                    <p key={b.email} className="text-xs mt-1 font-medium">→ {b.name} (bid: £{b.bidAmount?.toLocaleString()})</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
