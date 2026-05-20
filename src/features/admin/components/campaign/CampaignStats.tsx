import { Mail, Send, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { useCampaignStats } from "../../api/useCampaignApi";

export default function CampaignStats() {
  const { data: stats, isLoading } = useCampaignStats();

  const cards = [
    { label: "Total Campaigns", value: stats?.total || 0, icon: Mail, gradient: "from-blue-500 to-indigo-600" },
    { label: "Emails Sent", value: stats?.totalEmailsSent?.toLocaleString() || "0", icon: Send, gradient: "from-purple-500 to-pink-600" },
    { label: "Open Rate", value: `${stats?.openRate || 0}%`, icon: TrendingUp, gradient: "from-green-500 to-emerald-600" },
    { label: "Click Rate", value: `${stats?.clickRate || 0}%`, icon: CheckCircle, gradient: "from-orange-500 to-amber-600" },
    { label: "Drafts", value: stats?.draft || 0, icon: Clock, gradient: "from-slate-500 to-slate-600" },
    { label: "Failed", value: stats?.failed || 0, icon: AlertCircle, gradient: "from-red-500 to-rose-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg">
            <div className={`size-8 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-2`}>
              <Icon className="size-4 text-white" />
            </div>
            <p className="text-lg font-black text-slate-900">{isLoading ? "..." : card.value}</p>
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}