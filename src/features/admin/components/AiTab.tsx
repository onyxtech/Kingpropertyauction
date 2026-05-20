import { Sparkles, AlertTriangle, Target, Bot } from "lucide-react";

export default function AiTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 mb-2">AI Optimization Tools</h2>
        <p className="text-slate-600 font-medium">
          Valuation, fraud detection & predictions (UC-015, UC-016, UC-017)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          {
            title: "AI Property Valuation",
            description: "Analyze past sales & predict winning bids",
            icon: Sparkles,
            gradient: "from-purple-500 to-pink-600",
            stats: { valuations: "1,024", accuracy: "94.5%" },
          },
          {
            title: "Fraud Detection Engine",
            description: "Detect suspicious bidding patterns",
            icon: AlertTriangle,
            gradient: "from-red-500 to-rose-600",
            stats: { alerts: "7", blocked: "23" },
          },
          {
            title: "Smart Demand Prediction",
            description: "Hot property zones & timing",
            icon: Target,
            gradient: "from-blue-500 to-indigo-600",
            stats: { predictions: "342", accuracy: "89.2%" },
          },
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg"
            >
              <div
                className={`size-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-md`}
              >
                <Icon className="size-7 text-white" />
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-slate-600 font-medium mb-4">{feature.description}</p>
              <div className="flex items-center gap-3">
                {Object.entries(feature.stats).map(([key, value]) => (
                  <div key={key} className="bg-slate-100 px-3 py-1.5 rounded-lg">
                    <p className="text-xs text-slate-500 capitalize mb-0.5">{key}</p>
                    <p className="text-sm font-black text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-8 text-white mb-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
              <Bot className="size-8" />
              AI Insights & Recommendations
            </h3>
            <p className="text-white/90 font-medium mb-6">
              Powered by advanced machine learning algorithms
            </p>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                <h4 className="font-black mb-1">🔥 Hot Zone Alert</h4>
                <p className="text-sm text-white/90">
                  Mayfair properties seeing 34% increase in demand. Consider scheduling more auctions.
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                <h4 className="font-black mb-1">⏰ Optimal Timing</h4>
                <p className="text-sm text-white/90">
                  Thursday 7-9 PM shows highest bidding activity. Schedule premium auctions accordingly.
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                <h4 className="font-black mb-1">💰 Revenue Forecast</h4>
                <p className="text-sm text-white/90">
                  Projected £245K revenue next month based on current trends (+18% vs last month).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
