import { useState } from "react";
import { Users, Plus, Eye, CheckCircle, XCircle, Edit, Trash2, ChevronLeft, ChevronRight, UserCheck } from "lucide-react";
import FilterBar from "@/features/shared/components/FilterBar";

interface UsersTabProps {
  users: any[] | undefined;
  usersLoading: boolean;
  theme: { primary: string; secondary: string };
  updateUserStatus: { mutate: (args: { id: string; status: string }) => void };
  onEditUser: (user: any) => void;
  onDeleteUser: (id: string) => void;
  onAddAgent: () => void;
  onAddUser: () => void;
}

const PAGE_SIZE = 10;

export default function UsersTab({ users, usersLoading, theme, updateUserStatus, onEditUser, onDeleteUser, onAddAgent, onAddUser }: UsersTabProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const allUsers = users || [];

  // Client-side filtering
  const filtered = allUsers.filter((u: any) => {
    if (search && !u.name?.toLowerCase().includes(search.toLowerCase()) && !u.email?.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && u.role !== roleFilter) return false;
    if (statusFilter === "active" && !u.isActive) return false;
    if (statusFilter === "pending" && u.isActive) return false;
    return true;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">User Management</h2>
          <p className="text-slate-600 font-medium">Manage buyers, sellers, agents, and investors</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onAddAgent} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"><UserCheck className="size-5" /> Add Agent</button>
          <button onClick={onAddUser} className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}><Plus className="size-5" /> Add User</button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {[
          { label: "Total Users", value: allUsers.length, color: "from-blue-500 to-indigo-600" },
          { label: "Active Users", value: allUsers.filter((u: any) => u.isActive).length, color: "from-green-500 to-emerald-600" },
          { label: "Buyers", value: allUsers.filter((u: any) => u.role === "user" || u.role === "buyer").length, color: "from-purple-500 to-pink-600" },
          { label: "Agents", value: allUsers.filter((u: any) => u.role === "agent").length, color: "from-orange-500 to-amber-600" },
        ].map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg">
            <div className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}><Users className="size-5 text-white" /></div>
            <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by name or email..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        filters={[
          {
            label: "All Roles", value: roleFilter,
            options: [
              { value: "admin", label: "Admin" }, { value: "agent", label: "Agent" },
              { value: "user", label: "User" }, { value: "buyer", label: "Buyer" },
              { value: "seller", label: "Seller" }, { value: "investor", label: "Investor" },
            ],
            onChange: (v) => { setRoleFilter(v); setPage(1); },
          },
          {
            label: "All Status", value: statusFilter,
            options: [
              { value: "active", label: "Active" }, { value: "pending", label: "Pending" },
            ],
            onChange: (v) => { setStatusFilter(v); setPage(1); },
          },
        ]}
        className="mb-4"
      />

      {/* User Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">User</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Role</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">Loading users...</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">No users found.</td></tr>
              ) : (
                paged.map((user: any) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
                          <span className="text-white font-bold text-sm">{user.name?.split(" ").map((n: string) => n[0]).join("") || "?"}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{user.name || "Unknown"}</p>
                          <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold capitalize">{user.role}</span></td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${user.isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{user.isActive ? "active" : "pending"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"><Eye className="size-4" /></button>
                        {!user.isActive && (
                          <button onClick={() => updateUserStatus.mutate({ id: user._id, status: "active" })} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><CheckCircle className="size-4" /></button>
                        )}
                        {user.isActive && user.role !== "admin" && (
                          <button onClick={() => updateUserStatus.mutate({ id: user._id, status: "pending" })} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><XCircle className="size-4" /></button>
                        )}
                        <button onClick={() => onEditUser(user)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"><Edit className="size-4" /></button>
                        <button onClick={() => onDeleteUser(user._id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><Trash2 className="size-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-600 font-medium">Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} of {total}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 bg-white border-2 border-slate-200 rounded-xl disabled:opacity-50"><ChevronLeft className="size-4" /></button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button key={i + 1} onClick={() => setPage(i + 1)} className={`size-9 rounded-xl text-sm font-bold ${page === i + 1 ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "bg-white border-2 border-slate-200"}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 bg-white border-2 border-slate-200 rounded-xl disabled:opacity-50"><ChevronRight className="size-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}