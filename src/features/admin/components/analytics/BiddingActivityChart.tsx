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
import { useBiddingActivity } from "../../api/useAnalyticsApi";

export default function BiddingActivityChart() {
  const { data, isLoading } = useBiddingActivity(6);

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
        <h3 className="text-xl font-black text-slate-900 mb-4">Bidding Activity</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="size-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
      <h3 className="text-xl font-black text-slate-900 mb-4">Bidding Activity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data || []}>
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
          <Bar dataKey="totalBids" fill="#f97316" name="Total Bids" radius={[8, 8, 0, 0]} />
          <Bar dataKey="uniqueBidders" fill="#3b82f6" name="Unique Bidders" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}