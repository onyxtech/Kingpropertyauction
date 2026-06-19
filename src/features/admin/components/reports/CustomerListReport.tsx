import { useState } from "react";
import {
  Users,
  CircleCheck,
  UserCheck,
  DollarSign,
  Search,
  ListFilter,
  Download,
  MapPin,
  Clock,
  CircleX,
} from "lucide-react";
import StatBar from "./StatBar";
import ReportCard from "./ReportCard";
import { exportToCSV, exportToPDF } from "./exportUtils";

// Move helpers inside for now - will be shared later
const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-slate-100 text-slate-500",
    Suspended: "bg-red-100 text-red-700",
    Verified: "bg-green-100 text-green-700",
    Pending: "bg-amber-100 text-amber-700",
    Failed: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${map[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
};

const kycBadge = (kyc: string) => {
  if (kyc === "Verified")
    return (
      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold">
        <CircleCheck className="size-3.5" />
        Verified
      </span>
    );
  if (kyc === "Pending")
    return (
      <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-bold">
        <Clock className="size-3.5" />
        Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold">
      <CircleX className="size-3.5" />
      Failed
    </span>
  );
};

interface CustomerListReportProps {
  data: any[];
  stats: {
    total: number;
    active: number;
    kycVerified: number;
    totalSpend: string;
  };
}

export default function CustomerListReport({
  data,
  stats,
}: CustomerListReportProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const filtered = data.filter((c: any) => {
    const matchSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <StatBar
        stats={[
          {
            label: "Total Customers",
            value: String(stats.total),
            icon: Users,
            color: "from-blue-500 to-indigo-600",
          },
          {
            label: "Active",
            value: String(stats.active),
            icon: CircleCheck,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "KYC Verified",
            value: String(stats.kycVerified),
            icon: UserCheck,
            color: "from-violet-500 to-purple-600",
          },
          {
            label: "Total Spend",
            value: stats.totalSpend,
            icon: DollarSign,
            color: "from-amber-500 to-orange-600",
          },
        ]}
      />
      <ReportCard
        title="Customer List Report"
        subtitle="All registered platform customers"
        icon={Users}
        gradient="from-blue-600 to-indigo-600"
        count={filtered.length}
        onExportCSV={() =>
          exportToCSV(
            filtered,
            [
              { header: "Name", key: "name" },
              { header: "Email", key: "email" },
              { header: "Phone", key: "phone" },
              { header: "Location", key: "location" },
              { header: "Status", key: "status" },
              { header: "Bids", key: "bids" },
              { header: "Won", key: "won" },
              { header: "Total Spent", key: "spent" },
            ],
            "customer-list",
          )
        }
        onExportPDF={() =>
          exportToPDF(
            filtered,
            [
              { header: "Name", key: "name" },
              { header: "Email", key: "email" },
              { header: "Phone", key: "phone" },
              { header: "Location", key: "location" },
              { header: "Status", key: "status" },
              { header: "Bids", key: "bids" },
              { header: "Won", key: "won" },
              { header: "Total Spent", key: "spent" },
            ],
            "Customer List Report",
            "customer-list",
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
              placeholder="Search customers..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="flex gap-2">
            <button
              onClick={() =>
                exportToCSV(
                  filtered,
                  [
                    { header: "Name", key: "name" },
                    { header: "Email", key: "email" },
                    { header: "Phone", key: "phone" },
                    { header: "Location", key: "location" },
                    { header: "Status", key: "status" },
                    { header: "Bids", key: "bids" },
                    { header: "Won", key: "won" },
                    { header: "Total Spent", key: "spent" },
                  ],
                  "customer-list",
                )
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
            >
              <Download className="size-4" /> CSV
            </button>
            <button
              onClick={() =>
                exportToPDF(
                  filtered,
                  [
                    { header: "Name", key: "name" },
                    { header: "Email", key: "email" },
                    { header: "Phone", key: "phone" },
                    { header: "Location", key: "location" },
                    { header: "Status", key: "status" },
                    { header: "Bids", key: "bids" },
                    { header: "Won", key: "won" },
                    { header: "Total Spent", key: "spent" },
                  ],
                  "Customer List Report",
                  "customer-list",
                )
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
            >
              <Download className="size-4" /> PDF
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {[
                "Name",
                "Email",
                "Phone",
                "Location",
                "Registered",
                "Status",
                "Bids",
                "Won",
                "Total Spent",
                "KYC",
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
            {filtered.map((c: any) => (
              <tr
                key={c._id || c.id}
                className="hover:bg-blue-50/40 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                  {c.name}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {c.email}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {c.phone || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin className="size-3 text-slate-400" />
                    {c.location || c.address?.city || "-"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {c.registered
                    ? new Date(c.registered).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : new Date(c.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                </td>
                <td className="px-4 py-3">
                  {statusBadge(
                    c.status || (c.isActive ? "Active" : "Inactive"),
                  )}
                </td>
                <td className="px-4 py-3 text-center font-bold text-slate-700">
                  {c.bids || c.totalBids || 0}
                </td>
                <td className="px-4 py-3 text-center font-bold text-green-600">
                  {c.won || 0}
                </td>
                <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                  {c.spent || c.totalSpend || "£0"}
                </td>
                <td className="px-4 py-3">{kycBadge(c.kyc || "Pending")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filtered.length} of {data.length} customers
          </span>
          <span>Last updated: {new Date().toLocaleDateString("en-GB")}</span>
        </div>
      </ReportCard>
    </div>
  );
}
