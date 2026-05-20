import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLeadsAnalytics } from "../../api/useAnalyticsApi";

export default function LeadsChart() {
  const { data, isLoading } = useLeadsAnalytics(6);

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
        <h3 className="text-xl font-black text-slate-900 mb-4">Lead Generation</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="size-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const chartData = data?.trend || [];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-slate-900">Lead Generation</h3>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full">
            {data?.total || 0} Total
          </span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
            {data?.conversionRate || 0}% Conversion
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            style={{ fontSize: "12px", fontWeight: "bold" }}
          />
          <YAxis
            stroke="#64748b"
            style={{ fontSize: "12px", fontWeight: "bold" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              fontWeight: "bold",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
          <Bar dataKey="leads" fill="#f43f5e" name="New Leads" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}