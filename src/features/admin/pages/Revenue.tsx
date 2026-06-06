import { useState } from "react";
import { DollarSign, TrendingUp, Clock, CheckCircle, Search, RefreshCw } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/toast";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
  cancelled: "bg-slate-100 text-slate-500",
};

export default function Revenue() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-payments", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "50" });
      if (statusFilter) params.set("status", statusFilter);
      const result = await apiClient.fetch(`/payments?${params}`);
      return result;
    },
  });

  const updatePayment = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const result = await apiClient.fetch(`/payments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes }),
      });
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-payments"] }),
  });

  const payments = data?.data || [];
  const stats = data?.stats || { totalAmount: 0, paidAmount: 0, pendingAmount: 0, count: 0 };

  const filtered = payments.filter((p: any) =>
    !search ||
    p.buyer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.property?.propertyTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const handleMarkPaid = async (payment: any) => {
    try {
      await updatePayment.mutateAsync({ id: payment._id, status: "paid" });
      showSuccess("Payment marked as paid");
    } catch (err: any) {
      showError("Update failed", err.message);
    }
  };

  return (
    <AdminLayout activeTab="revenue" onTabChange={() => {}}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <DollarSign className="size-7 text-green-600" /> Revenue & Payments
            </h1>
            <p className="text-slate-500 text-sm mt-1">{payments.length} payment records</p>
          </div>
          <button onClick={() => refetch()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <RefreshCw className="size-5 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: `£${stats.totalAmount?.toLocaleString() || 0}`, icon: TrendingUp, color: "blue" },
            { label: "Paid", value: `£${stats.paidAmount?.toLocaleString() || 0}`, icon: CheckCircle, color: "green" },
            { label: "Pending", value: `£${stats.pendingAmount?.toLocaleString() || 0}`, icon: Clock, color: "yellow" },
            { label: "Total Records", value: stats.count || 0, icon: DollarSign, color: "purple" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`size-4 text-${color}-600`} />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p>
              </div>
              <p className={`text-xl font-black text-${color}-600`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap gap-3">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search buyer or property..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none"
          >
            <option value="">All Status</option>
            {["pending", "paid", "overdue", "refunded", "cancelled"].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <DollarSign className="size-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold">No payment records yet</p>
              <p className="text-sm mt-1">Payment records are created when auctions are won.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["Buyer", "Property", "Amount", "Method", "Status", "Due Date", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((p: any) => (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{p.buyer?.name || "Unknown"}</p>
                        <p className="text-xs text-slate-500">{p.buyer?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{p.property?.propertyTitle || "—"}</td>
                      <td className="px-4 py-3 font-black text-green-700">£{p.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-500 capitalize">{p.method?.replace("_", " ") || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${STATUS_COLORS[p.status] || "bg-slate-100"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {p.dueDate ? new Date(p.dueDate).toLocaleDateString("en-GB") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {p.status === "pending" && (
                          <button
                            onClick={() => handleMarkPaid(p)}
                            disabled={updatePayment.isPending}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
