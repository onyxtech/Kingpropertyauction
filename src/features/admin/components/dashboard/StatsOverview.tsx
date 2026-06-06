import { Clock, AlertTriangle, Building2, Users, ArrowLeftRight } from "lucide-react";
import StatsCards from "../StatsCards";

const getApprovalIcon = (type: string) => {
  switch (type) {
    case "property": return Building2;
    case "user": return Users;
    case "role": return ArrowLeftRight;
    default: return Clock;
  }
};

const getApprovalLabel = (type: string) => {
  switch (type) {
    case "property": return "Property";
    case "user": return "New User";
    case "role": return "Role Request";
    default: return "Pending";
  }
};

interface StatsOverviewProps {
  modules: {
    id: string;
    title: string;
    description: string;
    icon: any;
    gradient: string;
    stats: Record<string, any>;
  }[];
  recentActivities: {
    id: string;
    type: string;
    message: string;
    time: string;
    link?: string;
    icon: any;
    color: string;
  }[];
  pendingApprovals: {
    id: string;
    type: string;
    title: string;
    submittedBy: string;
    date: string;
    status: string;
  }[];
  onModuleClick: (moduleId: string) => void;
  onNavigate: (path: string) => void;
  onApprovalReview: (type: string) => void;
}

export default function StatsOverview({
  modules,
  recentActivities,
  pendingApprovals,
  onModuleClick,
  onNavigate,
  onApprovalReview,
}: StatsOverviewProps) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Welcome back, Admin! 👋
        </h2>
        <p className="text-slate-600 font-medium">
          Here's what's happening with King Property Auction today.
        </p>
      </div>

      <StatsCards />

      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-900 mb-6">
          Management Modules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => onModuleClick(module.id)}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-left group"
              >
                <div
                  className={`size-16 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="size-8 text-white" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">
                  {module.title}
                </h4>
                <p className="text-sm text-slate-600 font-medium mb-4">
                  {module.description}
                </p>
                <div className="flex items-center gap-3 text-xs font-bold flex-wrap">
                  {Object.entries(module.stats || {})
                    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
                    .map(([key, value]) => (
                      <div key={key} className="bg-slate-100 px-3 py-1.5 rounded-lg">
                        <span className="text-slate-500 capitalize">{key}: </span>
                        <span className="text-slate-900">{String(value)}</span>
                      </div>
                    ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="size-6" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">
                No recent activity
              </p>
            ) : (
              recentActivities.map((activity) => {
                const Icon = activity.icon;
                const colorMap: Record<string, string> = {
                  blue: "from-blue-500 to-indigo-600",
                  purple: "from-purple-500 to-pink-600",
                  green: "from-green-500 to-emerald-600",
                  emerald: "from-emerald-500 to-teal-600",
                  red: "from-red-500 to-rose-600",
                  orange: "from-orange-500 to-amber-600",
                };
                return (
                  <div
                    key={activity.id}
                    onClick={() => activity.link && onNavigate(activity.link)}
                    className={`flex items-start gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all ${activity.link ? "cursor-pointer" : ""}`}
                  >
                    <div
                      className={`size-10 rounded-xl bg-gradient-to-br ${colorMap[activity.color] || "from-blue-500 to-indigo-600"} flex items-center justify-center flex-shrink-0 shadow-md`}
                    >
                      <Icon className="size-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 mb-1">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            {recentActivities.length >= 8 && (
              <p className="w-full py-2 text-slate-400 text-xs font-medium text-center">
                Showing most recent activities
              </p>
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="size-6 text-orange-500" />
            Pending Approvals
          </h3>
          <div className="space-y-4">
            {pendingApprovals.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">
                No pending approvals
              </p>
            ) : (
              pendingApprovals.map((item) => {
                const ApprovalIcon = getApprovalIcon(item.type);
                const typeLabel = getApprovalLabel(item.type);
                const badgeColor =
                  item.type === "property" ? "bg-purple-500" :
                  item.type === "user" ? "bg-blue-500" :
                  item.type === "role" ? "bg-violet-500" : "bg-orange-500";
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 hover:border-orange-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 ${badgeColor} text-white text-xs font-black rounded-lg flex items-center gap-1`}>
                            <ApprovalIcon className="size-3" />
                            {typeLabel}
                          </span>
                        </div>
                        <p className="text-sm font-black text-slate-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-600 font-medium mt-1 truncate">
                          {item.submittedBy}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                      </div>
                      <button
                        onClick={() => onApprovalReview(item.type)}
                        className="px-3 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all flex-shrink-0"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                );
              })
            )}
            {pendingApprovals.length >= 8 && (
              <p className="w-full py-2 text-slate-400 text-xs font-medium text-center">
                Showing latest pending approvals
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
