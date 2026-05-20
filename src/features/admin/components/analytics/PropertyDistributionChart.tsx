import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { usePropertyDistribution } from "../../api/useAnalyticsApi";

export default function PropertyDistributionChart() {
  const { data, isLoading } = usePropertyDistribution();

  const chartData = data?.byType || [];

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
        <h3 className="text-xl font-black text-slate-900 mb-4">Property Distribution</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="size-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
        <h3 className="text-xl font-black text-slate-900 mb-4">Property Distribution</h3>
        <div className="h-[300px] flex items-center justify-center text-slate-500 font-medium">
          No property data yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
      <h3 className="text-xl font-black text-slate-900 mb-4">Property Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => entry.name}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              fontWeight: "bold",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}