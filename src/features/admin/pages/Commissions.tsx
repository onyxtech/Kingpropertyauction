import { useState } from "react";
import { useNavigate } from "react-router";
import { Percent, CheckCircle, Clock, DollarSign, Search, RefreshCw, TrendingUp } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/toast";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  disputed: "bg-red-100 text-red-700",
};

export default function Commissions() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-commissions", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "50" });
      if (statusFilter) params.set("status", statusFilter);
      const result = await apiClient.fetch(`/commissions?${params}`);
      return result;
    },
  });

  const updateCommission = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const result = await apiClient.fetch(`/commissions/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-commissions"] }),
  });

  const commissions = data?.data || [];
  const stats = data?.stats || { totalAmount: 0, paidAmount: 0, pendingAmount: 0, count: 0 };

  const filtered = commissions.filter((c: any) =>
    !search ||
    c.agent?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.property?.propertyTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateCommission.mutateAsync({ id, status });
      showSuccess(`Commission marked as ${status}`);
    } catch (err: any) {
      showError("Update failed", err.message);
    }
  };

  return (
    <AdminLayout activeTab="commissions" onTabChange={() => {}}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Percent className="size-7 text-purple-600" /> Commissions
            </h1>
            <p className="text-slate-500 text-sm mt-1">{commissions.length} commission records</p>
          </div>
          <button onClick={() => refetch()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <RefreshCw className="size-5 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Commission", value: `£${stats.totalAmount?.toLocaleString() || 0}`, icon: TrendingUp, color: "purple" },
            { label: "Paid Out", value: `£${stats.paidAmount?.toLocaleString() || 0}`, icon: CheckCircle, color: "green" },
            { label: "Pending", value: `£${stats.pendingAmount?.toLocaleString() || 0}`, icon: Clock, color: "yellow" },
            { label: "Total Records", value: stats.count || 0, icon: DollarSign, color: "blue" },
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
              placeholder="Search agent or property..."
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
            {["pending", "approved", "paid", "disputed"].map(s => (
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
              <Percent className="size-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold">No commission records yet</p>
              <p className="text-sm mt-1">Commissions are created when properties are sold via auction.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["Agent", "Property", "Sale Price", "Rate", "Commission", "Status", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((c: any) => (
                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => c.agent?._id && navigate(`/admin/users/${c.agent._id}`)}
                          className="font-bold text-blue-600 hover:underline text-left"
                        >
                          {c.agent?.name || "Unknown"}
                        </button>
                        <p className="text-xs text-slate-500">{c.agent?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{c.property?.propertyTitle || "—"}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">£{c.salePrice?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-700">{c.commissionRate}%</td>
                      <td className="px-4 py-3 font-black text-purple-700">£{c.commissionAmount?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${STATUS_COLORS[c.status] || "bg-slate-100"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {c.status === "pending" && (
                            <button
                              onClick={() => handleUpdateStatus(c._id, "approved")}
                              disabled={updateCommission.isPending}
                              className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                          )}
                          {c.status === "approved" && (
                            <button
                              onClick={() => handleUpdateStatus(c._id, "paid")}
                              disabled={updateCommission.isPending}
                              className="px-2 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
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
