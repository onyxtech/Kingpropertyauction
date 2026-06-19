import { useState } from "react";
import {
  Building,
  CircleCheck,
  TrendingUp,
  DollarSign,
  Search,
  Download,
  Clock,
} from "lucide-react";
import StatBar from "./StatBar";
import ReportCard from "./ReportCard";
import { exportToCSV, exportToPDF } from "./exportUtils";

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    available: "bg-green-100 text-green-700",
    sold: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
    unsold: "bg-slate-100 text-slate-500",
    Active: "bg-green-100 text-green-700",
    Sold: "bg-blue-100 text-blue-700",
    Live: "bg-red-100 text-red-700 animate-pulse",
    Scheduled: "bg-amber-100 text-amber-700",
    Withdrawn: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${map[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
};

interface AgentPropertyReportProps {
  data: any[];
  stats: {
    total: number;
    sold: number;
    activeLive: number;
    totalCommission: string;
  };
}

export default function AgentPropertyReport({
  data,
  stats,
}: AgentPropertyReportProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const statuses = ["All", "available", "sold", "pending", "unsold"];

  const filtered = data.filter((p: any) => {
    const matchSearch =
      (p.propertyTitle || p.property || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (p.createdBy?.name || p.agent || "")
        .toLowerCase()
        .includes(search.toLowerCase());
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
            label: "Total Properties",
            value: String(stats.total),
            icon: Building,
            color: "from-emerald-500 to-teal-600",
          },
          {
            label: "Sold",
            value: String(stats.sold),
            icon: CircleCheck,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Available/Pending",
            value: String(stats.activeLive),
            icon: Clock,
            color: "from-blue-500 to-indigo-600",
          },
          {
            label: "Total Commission",
            value: stats.totalCommission,
            icon: DollarSign,
            color: "from-amber-500 to-orange-600",
          },
        ]}
      />
      <ReportCard
        title="Agent Property List Report"
        subtitle="Properties listed by each agent with status"
        icon={Building}
        gradient="from-emerald-600 to-teal-600"
        count={filtered.length}
        onExportCSV={() =>
          exportToCSV(
            filtered,
            [
              { header: "Agent", key: "createdBy.name" },
              { header: "Property", key: "propertyTitle" },
              { header: "Type", key: "propertyType" },
              { header: "Location", key: "location.city" },
              { header: "Status", key: "propertyStatus" },
            ],
            "agent-property-list",
          )
        }
        onExportPDF={() =>
          exportToPDF(
            filtered,
            [
              { header: "Agent", key: "createdBy.name" },
              { header: "Property", key: "propertyTitle" },
              { header: "Type", key: "propertyType" },
              { header: "Location", key: "location.city" },
              { header: "Status", key: "propertyStatus" },
            ],
            "Agent Property List Report",
            "agent-property-list",
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
              placeholder="Search by property or agent..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize ${statusFilter === s ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
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
                "Agent",
                "Property",
                "Type",
                "Location",
                "List Price",
                "Status",
                "Listed Date",
                "Sold Date",
                "Commission",
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
                className="hover:bg-emerald-50/40 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                  {p.createdBy?.name || p.agent || "N/A"}
                </td>
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap max-w-48 truncate font-medium">
                  {p.propertyTitle || p.property}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold ${p.propertyType === "commercial" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}
                  >
                    {p.propertyType || p.type || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                  {p.location?.city || p.city || p.location || "-"}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                  {formatPrice(p.pricing?.startingAuctionPrice || p.listPrice)}
                </td>
                <td className="px-4 py-3">
                  {statusBadge(p.propertyStatus || p.status)}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {p.listed ||
                    new Date(p.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {p._soldDate
                    ? new Date(p._soldDate).toLocaleDateString("en-GB")
                    : p.sold || "—"}
                </td>
                <td className="px-4 py-3 font-bold text-amber-600 whitespace-nowrap">
                  {p._commissionAmount
                    ? formatPrice(p._commissionAmount)
                    : p.commission || "—"}
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
