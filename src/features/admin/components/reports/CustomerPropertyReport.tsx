import { useState } from "react";
import {
  Layers,
  CircleCheck,
  TrendingUp,
  DollarSign,
  Search,
  Download,
} from "lucide-react";
import StatBar from "./StatBar";
import ReportCard from "./ReportCard";
import { exportToCSV, exportToPDF } from "./exportUtils";

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Completed: "bg-blue-100 text-blue-700",
    "Awaiting Completion": "bg-amber-100 text-amber-700",
    "Bidding Active": "bg-red-100 text-red-700",
    "Registered to Bid": "bg-blue-100 text-blue-700",
    Watching: "bg-indigo-100 text-indigo-700",
    Outbid: "bg-orange-100 text-orange-700",
    won: "bg-green-100 text-green-700",
    winning: "bg-green-100 text-green-700",
    active: "bg-teal-100 text-teal-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${map[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
};

interface CustomerPropertyReportProps {
  data: any[];
  stats: {
    total: number;
    completed: number;
    activeBids: number;
    totalPurchased: string;
  };
}

export default function CustomerPropertyReport({
  data,
  stats,
}: CustomerPropertyReportProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const statuses = [
    "All",
    "Active",
    "Completed",
    "available",
    "sold",
    "pending",
    "unsold",
  ];

  const filtered = data.filter((p: any) => {
    const matchSearch =
      (p.customer || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.property || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" ||
      p.propertyStatus === statusFilter ||
      p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatPrice = (val: any) => {
    if (!val && val !== 0) return "—";
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
            label: "Total Records",
            value: String(stats.total),
            icon: Layers,
            color: "from-pink-500 to-rose-600",
          },
          {
            label: "Won/Completed",
            value: String(stats.completed),
            icon: CircleCheck,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Active Bids",
            value: String(stats.activeBids),
            icon: TrendingUp,
            color: "from-blue-500 to-indigo-600",
          },
          {
            label: "Total Purchased",
            value: stats.totalPurchased,
            icon: DollarSign,
            color: "from-amber-500 to-orange-600",
          },
        ]}
      />
      <ReportCard
        title="Customer Property List Report"
        subtitle="Properties linked to each customer with full status"
        icon={Layers}
        gradient="from-pink-600 to-rose-600"
        count={filtered.length}
        onExportCSV={() =>
          exportToCSV(
            filtered,
            [
              { header: "Customer", key: "customer" },
              { header: "Property", key: "property" },
              { header: "Type", key: "type" },
              { header: "Location", key: "location" },
              { header: "Status", key: "status" },
            ],
            "customer-property-list",
          )
        }
        onExportPDF={() =>
          exportToPDF(
            filtered,
            [
              { header: "Customer", key: "customer" },
              { header: "Property", key: "property" },
              { header: "Type", key: "type" },
              { header: "Location", key: "location" },
              { header: "Status", key: "status" },
            ],
            "Customer Property List Report",
            "customer-property-list",
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
              placeholder="Search by customer or property..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize ${statusFilter === s ? "bg-pink-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
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
                "Customer",
                "Property",
                "Type",
                "Location",
                "Bid/Purchase Price",
                "Status",
                "Auction Date",
                "Completion",
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
            {filtered.map((p: any) => (
              <tr
                key={p._id || p.id}
                className="hover:bg-pink-50/40 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                  {p.bidder?.name || p.customer || "N/A"}
                </td>
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap max-w-48 truncate font-medium">
                  {p.property?.propertyTitle || p.property || "N/A"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold ${p.property?.propertyType === "commercial" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}
                  >
                    {p.property?.propertyType || p.type || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                  {p.property?.location?.city || p.location || "-"}
                </td>
                <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                  {formatPrice(p.amount || p.purchasePrice)}
                </td>
                <td className="px-4 py-3">{statusBadge(p.status)}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {p.auctionDate
                    ? new Date(p.auctionDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {p.completionDate && p.completionDate !== "—"
                    ? new Date(p.completionDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filtered.length} of {data.length} records
          </span>
          <span>Last updated: {new Date().toLocaleDateString("en-GB")}</span>
        </div>
      </ReportCard>
    </div>
  );
}
