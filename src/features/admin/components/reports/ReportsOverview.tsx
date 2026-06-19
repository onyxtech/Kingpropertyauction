import { exportToPDF } from "./exportUtils";
import {
  FileChartColumn,
  Users,
  UserCheck,
  Gavel,
  TrendingUp,
  Building,
  Layers,
  Eye,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const reportMenu = [
  {
    id: "customers",
    label: "Customer List",
    icon: Users,
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "agents",
    label: "Agent List",
    icon: UserCheck,
    color: "from-violet-600 to-purple-600",
  },
  {
    id: "auctions",
    label: "Auction List",
    icon: Gavel,
    color: "from-rose-600 to-red-600",
  },
  {
    id: "bids",
    label: "Bidding List",
    icon: TrendingUp,
    color: "from-teal-600 to-cyan-600",
  },
  {
    id: "agentProperties",
    label: "Agent Property List",
    icon: Building,
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: "customerProperties",
    label: "Customer Property List",
    icon: Layers,
    color: "from-pink-600 to-rose-600",
  },
];

interface ReportsOverviewProps {
  kpis: {
    label: string;
    value: string;
    change: string;
    up: boolean;
    icon: any;
    color: string;
  }[];
  summary: {
    report: string;
    total: string;
    active: string;
    month: string;
    updated: string;
  }[];
  countMap: Record<string, string>;
  onNavigate: (id: string) => void;
}

export default function ReportsOverview({
  kpis,
  summary,
  countMap,
  onNavigate,
}: ReportsOverviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-slate-900">
          Reports & Analytics
        </h2>
        <p className="text-slate-500 mt-1">
          Comprehensive reporting across all platform modules
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`bg-gradient-to-br ${kpi.color} rounded-2xl p-5 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="size-6 opacity-80" />
                <span
                  className={`text-xs font-bold flex items-center gap-1 ${kpi.up ? "text-green-200" : "text-red-200"}`}
                >
                  {kpi.up ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {kpi.change}
                </span>
              </div>
              <p className="text-3xl font-black">{kpi.value}</p>
              <p className="text-white/70 text-sm mt-1">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportMenu.map((report) => {
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              onClick={() => onNavigate(report.id)}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all text-left group"
            >
              <div
                className={`size-12 bg-gradient-to-br ${report.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}
              >
                <Icon className="size-6 text-white" />
              </div>
              <h3 className="font-black text-slate-900 mb-1">{report.label}</h3>
              <p className="text-slate-500 text-sm">{countMap[report.id]}</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600">
                <Eye className="size-3.5" /> View Report
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-slate-900 text-lg">Report Summary</h3>
          <button
            onClick={() =>
              exportToPDF(
                summary,
                [
                  { header: "Report", key: "report" },
                  { header: "Total Records", key: "total" },
                  { header: "Active", key: "active" },
                  { header: "This Month", key: "month" },
                  { header: "Last Updated", key: "updated" },
                ],
                "Reports Summary",
                "reports-summary",
              )
            }
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200"
          >
            <Download className="size-4" /> Export All
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 rounded-xl">
            <tr>
              {[
                "Report",
                "Total Records",
                "Active",
                "This Month",
                "Last Updated",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {summary.map((row) => (
              <tr
                key={row.report}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {row.report}
                </td>
                <td className="px-4 py-3 font-bold text-slate-700">
                  {row.total}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                    {row.active}
                  </span>
                </td>
                <td className="px-4 py-3 text-green-600 font-bold">
                  {row.month}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {row.updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
