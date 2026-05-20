import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRevenueTrend } from "../../api/useAnalyticsApi";

export default function RevenueChart() {
  const { data: revenueData, isLoading } = useRevenueTrend(12);

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
        <h3 className="text-xl font-black text-slate-900 mb-4">Revenue & Auctions</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="size-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
      <h3 className="text-xl font-black text-slate-900 mb-4">Revenue & Auctions</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData || []}>
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
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ fill: "#8b5cf6", r: 5 }}
            name="Revenue (£)"
          />
          <Line
            type="monotone"
            dataKey="auctions"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", r: 5 }}
            name="Auctions"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}