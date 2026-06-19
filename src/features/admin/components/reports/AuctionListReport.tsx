import { useState } from "react";
import {
  Gavel,
  CircleCheck,
  TrendingUp,
  DollarSign,
  Search,
  Download,
  Building2,
} from "lucide-react";
import StatBar from "./StatBar";
import ReportCard from "./ReportCard";
import { useNavigate } from "react-router";
import { exportToCSV, exportToPDF } from "./exportUtils";

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    completed: "bg-blue-100 text-blue-700",
    live: "bg-red-100 text-red-700 animate-pulse",
    scheduled: "bg-amber-100 text-amber-700",
    cancelled: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${map[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
};

const propStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    sold: "bg-green-100 text-green-700",
    available: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    unsold: "bg-red-100 text-red-700",
    withdrawn: "bg-orange-100 text-orange-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold capitalize ${map[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
};

const formatPrice = (val: any) => {
  if (!val && val !== 0) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(val);
};

interface AuctionListReportProps {
  data: any[];
  stats: { total: number; completed: number; live: number; totalValue: string };
}

export default function AuctionListReport({
  data,
  stats,
}: AuctionListReportProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();
  const statuses = ["All", "completed", "live", "scheduled", "cancelled"];

  const filtered = data.filter((r: any) => {
    const matchSearch =
      (r.auctionTitle || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.propertyTitle || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" || r.auctionStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <StatBar
        stats={[
          {
            label: "Total Lots",
            value: String(stats.total),
            icon: Building2,
            color: "from-rose-500 to-red-600",
          },
          {
            label: "Completed",
            value: String(stats.completed),
            icon: CircleCheck,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Live Now",
            value: String(stats.live),
            icon: TrendingUp,
            color: "from-blue-500 to-indigo-600",
          },
          {
            label: "Total Value",
            value: stats.totalValue,
            icon: DollarSign,
            color: "from-amber-500 to-orange-600",
          },
        ]}
      />
      <ReportCard
        title="Auction List Report"
        subtitle="All auction lots with property details"
        icon={Gavel}
        gradient="from-rose-600 to-red-600"
        count={filtered.length}
        onExportCSV={() =>
          exportToCSV(
            filtered,
            [
              { header: "Auction", key: "auctionTitle" },
              { header: "Property", key: "propertyTitle" },
              { header: "Type", key: "propertyType" },
              { header: "Location", key: "propertyLocation" },
              { header: "Auction Date", key: "auctionDate" },
              { header: "Start Price", key: "startingPrice" },
              { header: "Hammer Price", key: "hammerPrice" },
              { header: "Reserve", key: "reservePrice" },
              { header: "Winner", key: "winner" },
            ],
            "auction-list",
          )
        }
        onExportPDF={() =>
          exportToPDF(
            filtered,
            [
              { header: "Auction", key: "auctionTitle" },
              { header: "Property", key: "propertyTitle" },
              { header: "Type", key: "propertyType" },
              { header: "Location", key: "propertyLocation" },
              { header: "Auction Date", key: "auctionDate" },
              { header: "Start Price", key: "startingPrice" },
              { header: "Hammer Price", key: "hammerPrice" },
              { header: "Reserve", key: "reservePrice" },
              { header: "Winner", key: "winner" },
            ],
            "Auction List Report",
            "auction-list",
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
              placeholder="Search auction or property..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div className="flex gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize ${statusFilter === s ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
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
                "Auction",
                "Property",
                "Type",
                "Location",
                "Auction Date",
                "Start Price",
                "Hammer Price",
                "Reserve",
                "Winner",
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
            {filtered.map((r: any) => (
              <tr key={r._id} className="hover:bg-rose-50/40 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-semibold text-slate-900 text-xs">
                    {r.auctionTitle}
                  </span>
                  <span className="ml-2">{statusBadge(r.auctionStatus)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-700 text-xs">
                    {r.propertyTitle}
                  </span>
                  {r.propertyStatus && r.propertyStatus !== "-" && (
                    <span className="ml-1">
                      {propStatusBadge(r.propertyStatus)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold ${r.propertyType === "commercial" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}
                  >
                    {r.propertyType || "-"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                  {r.propertyLocation}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                  {r.auctionDate
                    ? new Date(r.auctionDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap text-xs">
                  {formatPrice(r.startingPrice)}
                </td>
                <td className="px-4 py-3 font-bold text-green-700 whitespace-nowrap text-xs">
                  {r.propertyStatus === "sold"
                    ? formatPrice(r.hammerPrice)
                    : formatPrice(r.currentBid)}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                  {formatPrice(r.reservePrice)}
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-xs">
                  {r.winnerId && r.winner ? (
                    <button
                      onClick={() => navigate(`/admin/users/${r.winnerId}`)}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      {r.winner}
                    </button>
                  ) : (
                    r.winner || "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filtered.length} of {data.length} lots
          </span>
          <span>Last updated: {new Date().toLocaleDateString("en-GB")}</span>
        </div>
      </ReportCard>
    </div>
  );
}
