import { useState } from "react";
import { useNavigate } from "react-router";
import { Users as UsersIcon, Search, Shield, CheckCircle, XCircle, Clock, Edit, Ban, Eye } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useUserApi } from "../api/useUserApi";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import { showSuccess, showError } from "@/lib/toast";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  agent: "bg-blue-100 text-blue-700",
  seller: "bg-amber-100 text-amber-700",
  buyer: "bg-emerald-100 text-emerald-700",
  user: "bg-slate-100 text-slate-700",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  suspended: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
};

export default function Users() {
  const navigate = useNavigate();
  const { useGetUsers, useUpdateUserStatus } = useUserApi();
  const { data: users = [], isLoading } = useGetUsers();
  const updateStatus = useUpdateUserStatus();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);

  const filtered = users.filter((u: any) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    const matchStatus = !statusFilter || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    try {
      await updateStatus.mutateAsync({ id: user._id, status: newStatus });
      showSuccess(`User ${newStatus === "active" ? "activated" : "suspended"}`);
    } catch (err: any) {
      showError("Update failed", err.message);
    }
  };

  const stats = {
    total: users.length,
    active: users.filter((u: any) => u.status === "active").length,
    pending: users.filter((u: any) => u.status === "pending").length,
    suspended: users.filter((u: any) => u.status === "suspended").length,
  };

  return (
    <AdminLayout activeTab="users" onTabChange={() => {}}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <UsersIcon className="size-7 text-blue-600" /> User Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">{users.length} registered users</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            + Add User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: stats.total, icon: UsersIcon, color: "blue" },
            { label: "Active", value: stats.active, icon: CheckCircle, color: "green" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "yellow" },
            { label: "Suspended", value: stats.suspended, icon: Ban, color: "red" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p>
              <p className={`text-2xl font-black text-${color}-600 mt-1`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap gap-3">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none"
          >
            <option value="">All Roles</option>
            {["admin", "agent", "seller", "buyer", "user"].map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none"
          >
            <option value="">All Status</option>
            {["active", "pending", "suspended", "rejected"].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <UsersIcon className="size-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["User", "Role", "Status", "Joined", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((user: any) => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <button
                            onClick={() => navigate(`/admin/users/${user._id}`)}
                            className="font-bold text-blue-600 hover:underline text-left"
                          >
                            {user.name}
                          </button>
                          <p className="text-slate-500 text-xs">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${ROLE_COLORS[user.role] || "bg-slate-100 text-slate-700"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${STATUS_COLORS[user.status] || "bg-slate-100 text-slate-700"}`}>
                          {user.status || "active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/users/${user._id}`)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                            title="View Profile"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            onClick={() => setEditUser(user)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            title="Quick Edit"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded-lg transition-colors ${user.status === "active" ? "hover:bg-red-50 text-red-500" : "hover:bg-green-50 text-green-500"}`}
                            title={user.status === "active" ? "Suspend" : "Activate"}
                          >
                            {user.status === "active" ? <XCircle className="size-4" /> : <CheckCircle className="size-4" />}
                          </button>
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

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} />}
      {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} />}
    </AdminLayout>
  );
}
