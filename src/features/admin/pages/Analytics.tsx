import { useState } from "react";
import {
  FileText,
  BarChart3,
  X,
  Calendar,
  DollarSign,
  Gavel,
  Users,
  Building2,
  CreditCard,
  TrendingUp,
  Send,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import RevenueChart from "../components/analytics/RevenueChart";
import PropertyDistributionChart from "../components/analytics/PropertyDistributionChart";
import BiddingActivityChart from "../components/analytics/BiddingActivityChart";
import UserGrowthChart from "../components/analytics/UserGrowthChart";
import KpiCards from "../components/analytics/KpiCards";
import { useTheme } from "../../../app/hooks/useTheme";
import { apiClient } from "@/lib/apiClient";
import LeadsChart from "../components/analytics/LeadsChart";
import CampaignPerformanceChart from "../components/analytics/CampaignPerformanceChart";

export default function Analytics() {
  const theme = useTheme();
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  return (
    <AdminLayout activeTab="analytics" onTabChange={() => {}}>
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold animate-in slide-in-from-right">
          {toastMsg}
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Analytics & Reports
            </h2>
            <p className="text-slate-600 font-medium">
              Performance metrics and business insights
            </p>
          </div>
          <button
            onClick={() => setShowGenerateReportModal(true)}
            className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
          >
            <FileText className="size-5" />
            Generate Report
          </button>
        </div>

        {/* KPI Cards */}
        <div className="mb-6">
          <KpiCards />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueChart />
          <PropertyDistributionChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BiddingActivityChart />
          <LeadsChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
          <UserGrowthChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CampaignPerformanceChart />
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-white/60">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 px-8 py-6 rounded-t-3xl border-b-2 border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    Generate Report
                  </h2>
                  <p className="text-white/90 font-medium">
                    Create custom analytics and performance reports
                  </p>
                </div>
                <button
                  onClick={() => setShowGenerateReportModal(false)}
                  className="size-10 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all border border-white/30 hover:scale-110"
                >
                  <X className="size-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form
              className="p-8 space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const type = formData.get("reportType") as string;
                const startDate = formData.get("startDate") as string;
                const endDate = formData.get("endDate") as string;

                if (!type) {
                  showToast("Please select a report type");
                  return;
                }

                try {
                  const params = new URLSearchParams();
                  params.set("type", type);
                  if (startDate) params.set("startDate", startDate);
                  if (endDate) params.set("endDate", endDate);

                  const result = await apiClient.fetch(
                    `/analytics/export?${params}`,
                  );

                  if (result.success && result.data) {
                    // Convert data to CSV
                    const csvData = result.data.data || [];
                    let csv = "";

                    if (csvData.length > 0) {
                      // Headers from first object keys
                      const headers = Object.keys(csvData[0]);
                      csv += headers.join(",") + "\n";

                      // Data rows
                      csvData.forEach((row: any) => {
                        csv +=
                          headers
                            .map((h) => {
                              let val = row[h];
                              if (val === null || val === undefined) val = "";
                              val = String(val).replace(/"/g, '""');
                              return `"${val}"`;
                            })
                            .join(",") + "\n";
                      });
                    } else {
                      // Summary-only report (like financial)
                      csv = `Report Type: ${result.data.type}\n`;
                      csv += `Generated: ${new Date(result.data.generatedAt).toLocaleString()}\n`;
                      csv += `Total Records: 0\n`;
                      csv += `\nNo data available for the selected period.\n`;
                    }

                    // Download as CSV file
                    const blob = new Blob([csv], {
                      type: "text/csv;charset=utf-8;",
                    });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${type}-report-${new Date().toISOString().slice(0, 10)}.csv`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    const recordCount = csvData.length || 0;
                    showToast(
                      `Report downloaded! ${recordCount} records exported.`,
                    );
                  } else {
                    showToast(
                      result.message || "No data available for this report",
                    );
                  }
                } catch (err: any) {
                  showToast(err.message || "Error generating report");
                }

                setShowGenerateReportModal(false);
              }}
            >
              {/* Report Type */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <BarChart3 className="size-6 text-green-600" />
                  Report Type
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { value: "sales", label: "Sales Report", icon: DollarSign },
                    {
                      value: "auction",
                      label: "Auction Performance",
                      icon: Gavel,
                    },
                    { value: "user", label: "User Activity", icon: Users },
                    {
                      value: "property",
                      label: "Property Listings",
                      icon: Building2,
                    },
                    {
                      value: "leads",
                      label: "Lead Analytics",
                      icon: TrendingUp,
                    },
                    {
                      value: "campaigns",
                      label: "Campaign Performance",
                      icon: Send,
                    },
                    {
                      value: "financial",
                      label: "Financial Summary",
                      icon: CreditCard,
                    },
                    {
                      value: "marketing",
                      label: "Marketing Analytics",
                      icon: TrendingUp,
                    },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border-2 border-transparent hover:border-green-300"
                    >
                      <input
                        type="radio"
                        name="reportType"
                        value={type.value}
                        className="size-5 accent-green-600"
                        defaultChecked={type.value === "sales"}
                      />
                      <type.icon className="size-5 text-green-600" />
                      <span className="text-sm font-bold text-slate-700">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="size-6 text-blue-600" />
                  Date Range
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGenerateReportModal(false)}
                  className="flex-1 px-6 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
