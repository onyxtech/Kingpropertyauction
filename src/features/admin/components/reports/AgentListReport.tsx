import { useState } from "react";
import {
  UserCheck,
  CircleCheck,
  Building,
  DollarSign,
  Search,
  ListFilter,
  Download,
} from "lucide-react";
import StatBar from "./StatBar";
import ReportCard from "./ReportCard";
import { exportToCSV, exportToPDF } from "./exportUtils";

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-slate-100 text-slate-500",
    "On Leave": "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${map[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
};

interface AgentListReportProps {
  data: any[];
  stats: {
    total: number;
    active: number;
    totalListings: number;
    totalCommission: string;
  };
}

export default function AgentListReport({ data, stats }: AgentListReportProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const filtered = data.filter((a: any) => {
    const matchSearch =
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.branch?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });
  return (
    <div className="space-y-6">
      <StatBar
        stats={[
          {
            label: "Total Agents",
            value: String(stats.total),
            icon: UserCheck,
            color: "from-violet-500 to-purple-600",
          },
          {
            label: "Active",
            value: String(stats.active),
            icon: CircleCheck,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Total Listings",
            value: String(stats.totalListings),
            icon: Building,
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
        title="Agent List Report"
        subtitle="All registered platform agents"
        icon={UserCheck}
        gradient="from-violet-600 to-purple-600"
        count={filtered.length}
        onExportCSV={() =>
          exportToCSV(
            filtered,
            [
              { header: "Agent Name", key: "name" },
              { header: "Email", key: "email" },
              { header: "Phone", key: "phone" },
              { header: "Branch", key: "branch" },
              { header: "Status", key: "status" },
              { header: "Listings", key: "listings" },
              { header: "Sold", key: "sold" },
              { header: "Revenue", key: "revenue" },
              { header: "Commission", key: "commission" },
            ],
            "agent-list",
          )
        }
        onExportPDF={() =>
          exportToPDF(
            filtered,
            [
              { header: "Agent Name", key: "name" },
              { header: "Email", key: "email" },
              { header: "Phone", key: "phone" },
              { header: "Branch", key: "branch" },
              { header: "Status", key: "status" },
              { header: "Listings", key: "listings" },
              { header: "Sold", key: "sold" },
              { header: "Revenue", key: "revenue" },
              { header: "Commission", key: "commission" },
            ],
            "Agent List Report",
            "agent-list",
          )
        }
        onPrint={() => window.print()}
      >
        <div className="p-4 border-b border-slate-100 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700">
            <Download className="size-4" /> Export
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {[
                "Agent Name",
                "Email",
                "Phone",
                "Branch",
                "Joined",
                "Status",
                "Listings",
                "Sold",
                "Revenue",
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
            {filtered.map((a: any) => (
              <tr
                key={a._id || a.id}
                className="hover:bg-violet-50/40 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                  {a.name}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {a.email}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {a.phone || "-"}
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {a.branch || a.agentDetails?.companyName || "-"}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {a.joined
                    ? new Date(a.joined).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : new Date(a.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                </td>
                <td className="px-4 py-3">
                  {statusBadge(
                    a.status || (a.isActive ? "Active" : "Inactive"),
                  )}
                </td>
                <td className="px-4 py-3 text-center font-bold text-slate-700">
                  {a.listings || a.totalListings || 0}
                </td>
                <td className="px-4 py-3 text-center font-bold text-green-600">
                  {a.sold || a.totalSold || 0}
                </td>
                <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                  {a.revenue || a.totalRevenue || "£0"}
                </td>
                <td className="px-4 py-3 font-bold text-amber-600 whitespace-nowrap">
                  {a.commission || a.totalCommission || "£0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filtered.length} of {data.length} agents
          </span>
          <span>Last updated: {new Date().toLocaleDateString("en-GB")}</span>
        </div>
      </ReportCard>
    </div>
  );
}
