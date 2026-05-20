import { TrendingUp } from "lucide-react";

export default function InvestorsTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Investor Dashboard</h2>
        <p className="text-slate-600 font-medium">
          ROI estimation and investment analytics (UC-014)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Investors", value: "342", color: "from-blue-500 to-indigo-600" },
          { label: "Investment Opportunities", value: "156", color: "from-purple-500 to-pink-600" },
          { label: "Avg. ROI", value: "18.5%", color: "from-green-500 to-emerald-600" },
          { label: "Total Invested", value: "£42.8M", color: "from-orange-500 to-amber-600" },
        ].map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg">
            <div className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
              <TrendingUp className="size-5 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 text-white shadow-2xl">
        <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
          <TrendingUp className="size-8" />
          Top Investment Opportunities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { property: "Commercial Office - Canary Wharf", roi: "22.5%", risk: "Low", demand: "High" },
            { property: "Residential Complex - Shoreditch", roi: "19.8%", risk: "Medium", demand: "Very High" },
            { property: "Mixed-Use Development - Camden", roi: "24.1%", risk: "Medium", demand: "High" },
          ].map((opp, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-md rounded-2xl p-6">
              <h4 className="font-black text-lg mb-3">{opp.property}</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Est. ROI</span>
                  <span className="font-black text-lg">{opp.roi}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Risk Level</span>
                  <span className="font-bold">{opp.risk}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Demand</span>
                  <span className="font-bold">{opp.demand}</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-3 bg-white text-teal-600 rounded-xl font-bold hover:bg-white/90 transition-all">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
