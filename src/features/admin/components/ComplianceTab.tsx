import { UserCheck, Clock, FileCheck, AlertTriangle, Shield } from "lucide-react";

export default function ComplianceTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Legal & Compliance</h2>
        <p className="text-slate-600 font-medium">
          KYC verification, AML monitoring & contracts (UC-018, UC-019, UC-020)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "KYC Verified", value: "1,156", color: "from-green-500 to-emerald-600", icon: UserCheck },
          { label: "Pending Verification", value: "34", color: "from-yellow-500 to-orange-600", icon: Clock },
          { label: "Contracts Generated", value: "487", color: "from-blue-500 to-indigo-600", icon: FileCheck },
          { label: "AML Alerts", value: "7", color: "from-red-500 to-rose-600", icon: AlertTriangle },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg">
              <div className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                <Icon className="size-5 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
          <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="size-6 text-blue-600" />
            KYC Verification Queue
          </h3>
          <div className="space-y-3">
            {[
              { name: "Emma Wilson", email: "emma@example.com", submitted: "2 hours ago", docs: 3, status: "pending" },
              { name: "James Davis", email: "james@example.com", submitted: "5 hours ago", docs: 2, status: "review" },
              { name: "Olivia Martinez", email: "olivia@example.com", submitted: "1 day ago", docs: 3, status: "pending" },
            ].map((user, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                    <p className="text-xs text-slate-600 font-medium">{user.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${user.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-3">
                  <span>{user.docs} documents</span>
                  <span>{user.submitted}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-all">Approve</button>
                  <button className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-all">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
          <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="size-6 text-red-600" />
            AML Alerts
          </h3>
          <div className="space-y-3">
            {[
              { user: "Anonymous User #4523", type: "Large Transaction", amount: "£450,000", risk: "high", time: "1 hour ago" },
              { user: "Michael Brown", type: "Multiple Accounts", amount: "N/A", risk: "medium", time: "3 hours ago" },
              { user: "Sarah Johnson", type: "Rapid Bidding", amount: "£125,000", risk: "low", time: "5 hours ago" },
            ].map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 ${alert.risk === "high" ? "bg-red-50 border-red-200" : alert.risk === "medium" ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{alert.type}</h4>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${alert.risk === "high" ? "bg-red-500 text-white" : alert.risk === "medium" ? "bg-yellow-500 text-white" : "bg-blue-500 text-white"}`}>
                    {alert.risk.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mb-1">{alert.user}</p>
                {alert.amount !== "N/A" && (
                  <p className="text-sm font-bold text-slate-900 mb-2">{alert.amount}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{alert.time}</span>
                  <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all">Investigate</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
