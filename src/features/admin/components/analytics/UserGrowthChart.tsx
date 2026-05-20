import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useUserGrowth } from "../../api/useAnalyticsApi";

export default function UserGrowthChart() {
  const { data, isLoading } = useUserGrowth(12);

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
        <h3 className="text-xl font-black text-slate-900 mb-4">User Growth</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="size-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
      <h3 className="text-xl font-black text-slate-900 mb-4">User Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data || []}>
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
          <Area
            type="monotone"
            dataKey="totalUsers"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.2}
            strokeWidth={3}
            name="Total Users"
          />
          <Area
            type="monotone"
            dataKey="newUsers"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.2}
            strokeWidth={3}
            name="New Users"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}