import { ArrowUp, ArrowDown } from "lucide-react";
import { useKpiMetrics } from "../../api/useAnalyticsApi";

function formatPrice(val: number) {
  if (val >= 1000000) return `£${(val / 1000000).toFixed(2)}M`;
  return `£${val.toLocaleString()}`;
}

export default function KpiCards() {
  const { data: kpi, isLoading } = useKpiMetrics();

  const cards = [
    {
      label: "Avg. Property Value",
      value: formatPrice(kpi?.avgPropertyValue || 0),
      change: kpi?.sellThroughRate ? `${kpi.sellThroughRate}%` : "0%",
      changeLabel: "Sell-through rate",
      positive: true,
    },
    {
      label: "Avg. Time to Sale",
      value: `${kpi?.avgTimeToSale || 0} days`,
      change: `${kpi?.avgBidsPerAuction || 0}`,
      changeLabel: "Avg bids/auction",
      positive: true,
    },
    {
      label: "Revenue This Month",
      value: formatPrice(kpi?.revenueThisMonth || 0),
      change: `${kpi?.revenueChange >= 0 ? "+" : ""}${kpi?.revenueChange || 0}%`,
      changeLabel: "vs last month",
      positive: (kpi?.revenueChange || 0) >= 0,
    },
    {
      label: "Active Bidders",
      value: kpi?.activeBiddersThisMonth?.toString() || "0",
      change: "This month",
      changeLabel: "",
      positive: true,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
      <h3 className="text-2xl font-black mb-6">Key Performance Indicators</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((kpi, index) => (
          <div
            key={index}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-6"
          >
            <p className="text-sm text-white/80 font-medium mb-2">{kpi.label}</p>
            <p className="text-2xl font-black mb-2">
              {isLoading ? "..." : kpi.value}
            </p>
            <div className="flex items-center gap-1 text-sm font-bold">
              {kpi.positive ? (
                <ArrowUp className="size-4" />
              ) : (
                <ArrowDown className="size-4" />
              )}
              {kpi.change}
              {kpi.changeLabel && (
                <span className="text-white/70 font-medium ml-1">
                  {kpi.changeLabel}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}