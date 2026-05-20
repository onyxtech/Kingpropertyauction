import { Lock, TrendingUp, DollarSign, Receipt } from "lucide-react";

export default function FinancialTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Financial Management</h2>
        <p className="text-slate-600 font-medium">
          Escrow, commissions & invoices (UC-021, UC-022)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Escrow Balance", value: "£2.4M", color: "from-green-500 to-emerald-600", icon: Lock },
          { label: "Revenue (MTD)", value: "£187K", color: "from-blue-500 to-indigo-600", icon: TrendingUp },
          { label: "Commissions Paid", value: "£42.3K", color: "from-purple-500 to-pink-600", icon: DollarSign },
          { label: "Pending Invoices", value: "23", color: "from-orange-500 to-amber-600", icon: Receipt },
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
            <Lock className="size-6 text-green-600" />
            Escrow Transactions
          </h3>
          <div className="space-y-3">
            {[
              { id: "ESC001", property: "Modern Luxury Villa", amount: "£125,000", buyer: "Emma Wilson", status: "held", date: "2026-02-20" },
              { id: "ESC002", property: "Contemporary Penthouse", amount: "£95,000", buyer: "James Davis", status: "released", date: "2026-02-19" },
              { id: "ESC003", property: "Waterfront Apartment", amount: "£48,000", buyer: "Michael Brown", status: "held", date: "2026-02-21" },
            ].map((transaction, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">#{transaction.id}</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${transaction.status === "held" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                    {transaction.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{transaction.property}</h4>
                <p className="text-lg font-black text-green-600 mb-2">{transaction.amount}</p>
                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Buyer: {transaction.buyer}</span>
                  <span>{transaction.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
          <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Receipt className="size-6 text-blue-600" />
            Recent Invoices
          </h3>
          <div className="space-y-3">
            {[
              { id: "INV-2847", to: "John Smith", amount: "£12,450", type: "Commission", status: "paid", date: "2026-02-19" },
              { id: "INV-2848", to: "Sarah Johnson", amount: "£8,900", type: "Platform Fee", status: "pending", date: "2026-02-20" },
              { id: "INV-2849", to: "David Lee", amount: "£15,200", type: "Commission", status: "paid", date: "2026-02-21" },
            ].map((invoice, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">#{invoice.id}</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${invoice.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {invoice.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{invoice.to}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">{invoice.type}</span>
                  <span className="text-lg font-black text-slate-900">{invoice.amount}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{invoice.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
