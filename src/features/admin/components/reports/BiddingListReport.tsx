import { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  CircleCheck,
  Search,
  Download,
} from "lucide-react";
import StatBar from "./StatBar";
import ReportCard from "./ReportCard";
import { exportToCSV, exportToPDF } from "./exportUtils";

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    winning: "bg-green-100 text-green-700",
    active: "bg-teal-100 text-teal-700",
    outbid: "bg-orange-100 text-orange-700",
    lost: "bg-red-100 text-red-700",
    won: "bg-green-100 text-green-700",
    retracted: "bg-slate-100 text-slate-500",
    Leading: "bg-teal-100 text-teal-700",
    Winning: "bg-green-100 text-green-700",
    Outbid: "bg-orange-100 text-orange-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${map[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
};

interface BiddingListReportProps {
  data: any[];
  stats: {
    total: number;
    uniqueBidders: number;
    avgBidValue: string;
    winningBids: number;
  };
}

export default function BiddingListReport({
  data,
  stats,
}: BiddingListReportProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const statuses = ["All", "winning", "active", "outbid", "won", "lost"];

  const filtered = data.filter((b: any) => {
    const matchSearch =
      (b.bidder?.name || b.bidderName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (b.auction?.auctionTitle || b.auctionTitle || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatPrice = (val: any) => {
    if (!val && val !== 0) return "£0";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      <StatBar
        stats={[
          {
            label: "Total Bids",
            value: String(stats.total),
            icon: TrendingUp,
            color: "from-teal-500 to-cyan-600",
          },
          {
            label: "Unique Bidders",
            value: String(stats.uniqueBidders),
            icon: Users,
            color: "from-blue-500 to-indigo-600",
          },
          {
            label: "Avg Bid Value",
            value: stats.avgBidValue,
            icon: DollarSign,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Winning Bids",
            value: String(stats.winningBids),
            icon: CircleCheck,
            color: "from-amber-500 to-orange-600",
          },
        ]}
      />
      <ReportCard
        title="Bidding List Report"
        subtitle="Full bid history across all auctions"
        icon={TrendingUp}
        gradient="from-teal-600 to-cyan-600"
        count={filtered.length}
        onExportCSV={() =>
          exportToCSV(
            filtered,
            [
              { header: "Bidder", key: "bidder.name" },
              { header: "Auction", key: "auction.auctionTitle" },
              { header: "Property", key: "property.propertyTitle" },
              { header: "Amount", key: "amount" },
              { header: "Status", key: "status" },
              { header: "Date", key: "createdAt" },
            ],
            "bidding-list",
          )
        }
        onExportPDF={() =>
          exportToPDF(
            filtered,
            [
              { header: "Bidder", key: "bidder.name" },
              { header: "Auction", key: "auction.auctionTitle" },
              { header: "Property", key: "property.propertyTitle" },
              { header: "Amount", key: "amount" },
              { header: "Status", key: "status" },
              { header: "Date", key: "createdAt" },
            ],
            "Bidding List Report",
            "bidding-list",
          )
        }
        onPrint={() => window.print()}
      >
        <div className="p-4 border-b border-slate-100 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bids..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize ${statusFilter === s ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {s}
              </button>
            ))}
          </div>
    
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {[
                "Bidder",
                "Auction",
                "Property",
                "Bid Amount",
                "Date & Time",
                "Status",
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
            {filtered.map((b: any) => (
              <tr
                key={b._id || b.id}
                className="hover:bg-teal-50/40 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                  {b.bidder?.name || b.bidderName || "N/A"}
                </td>
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap max-w-48 truncate">
                  {b.auction?.auctionTitle || b.auctionTitle || "N/A"}
                </td>
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap max-w-48 truncate">
                  {b.property?.propertyTitle || b.propertyTitle || "N/A"}
                </td>
                <td className="px-4 py-3 font-black text-slate-900 whitespace-nowrap">
                  {formatPrice(b.amount)}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                  {new Date(b.createdAt).toLocaleString("en-GB")}
                </td>
                <td className="px-4 py-3">{statusBadge(b.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filtered.length} of {data.length} bids
          </span>
          <span>Last updated: {new Date().toLocaleDateString("en-GB")}</span>
        </div>
      </ReportCard>
    </div>
  );
}
