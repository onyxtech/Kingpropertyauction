import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export default function CampaignPerformanceChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics", "campaign-performance"],
    queryFn: async () => {
      const result = await apiClient.fetch("/analytics/campaign-performance");
      if (!result.success) return [];
      return result.data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
        <h3 className="text-xl font-black text-slate-900 mb-4">Campaign Performance</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="size-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const chartData = data || [];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
      <h3 className="text-xl font-black text-slate-900 mb-4">Campaign Performance</h3>
      {chartData.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-slate-500 font-medium">No campaign data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: "12px", fontWeight: "bold" }} />
            <YAxis stroke="#64748b" style={{ fontSize: "12px", fontWeight: "bold" }} />
            <Tooltip contentStyle={{ backgroundColor: "#fff", border: "2px solid #e2e8f0", borderRadius: "12px", fontWeight: "bold" }} />
            <Legend wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
            <Bar dataKey="sent" fill="#6366f1" name="Emails Sent" radius={[8, 8, 0, 0]} />
            <Bar dataKey="opened" fill="#10b981" name="Opened" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}