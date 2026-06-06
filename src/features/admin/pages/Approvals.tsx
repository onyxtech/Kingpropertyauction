import { useState } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle, XCircle, Clock, User, Shield,
  Search, Building2, Home, Loader2
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useUserApi } from "../api/useUserApi";
import { apiClient } from "@/lib/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "@/lib/toast";

export default function Approvals() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("properties");
  const [search, setSearch] = useState("");
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { useGetUsers, useReviewRoleRequest, useUpdateUserStatus } = useUserApi();
  const { data: users = [], isLoading: usersLoading } = useGetUsers();
  const reviewRole = useReviewRoleRequest();
  const updateStatus = useUpdateUserStatus();

  const { data: pendingPropsData, isLoading: propsLoading } = useQuery({
    queryKey: ["pending-properties"],
    queryFn: async () => {
      const r = await apiClient.fetch("/properties?approvalStatus=pending&limit=50");
      return r.success ? (r.data?.properties || r.data || []) : [];
    },
  });
  const pendingProperties = Array.isArray(pendingPropsData) ? pendingPropsData : [];

  const pendingUsers = (users as any[]).filter((u: any) => !u.isActive);
  const roleRequests = (users as any[]).filter(
    (u: any) => u.roleRequest?.status === "pending"
  );

  const tabs = [
    { id: "properties", label: "Pending Properties", icon: Building2, count: pendingProperties.length, color: "blue" },
    { id: "users",      label: "Pending Users",      icon: User,      count: pendingUsers.length,      color: "amber" },
    { id: "roles",      label: "Role Requests",      icon: Shield,    count: roleRequests.length,      color: "purple" },
  ];

  const handleApproveProperty = async (propertyId: string, action: "approved" | "rejected") => {
    setProcessingId(propertyId);
    try {
      const result = await apiClient.fetch(`/properties/${propertyId}/approve`, {
        method: "PATCH",
        body: JSON.stringify({ status: action, reason: reviewNote[propertyId] || undefined }),
      });
      if (!result.success) throw new Error(result.message);
      queryClient.invalidateQueries({ queryKey: ["pending-properties"] });
      showSuccess(
        `Property ${action}! ✅`,
        action === "approved" ? "Owner has been notified." : "Owner has been notified with reason."
      );
    } catch (err: any) {
      showError("Action failed", err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReviewUser = async (userId: string, decision: "approved" | "rejected") => {
    setProcessingId(userId);
    try {
      await updateStatus.mutateAsync({
        id: userId,
        status: decision === "approved" ? "active" : "rejected",
      });
      showSuccess(`User ${decision}! ✅`);
    } catch (err: any) {
      showError("Action failed", err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReviewRole = async (userId: string, decision: "approved" | "rejected") => {
    setProcessingId(userId);
    try {
      await reviewRole.mutateAsync({ id: userId, decision, reviewNote: reviewNote[userId] });
      showSuccess(`Role request ${decision}! ✅`);
    } catch (err: any) {
      showError("Action failed", err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const totalPending = pendingProperties.length + pendingUsers.length + roleRequests.length;

  return (
    <AdminLayout activeTab="approvals" onTabChange={(tab) => navigate(`/admin/${tab}`)}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Pending Approvals</h2>
            <p className="text-slate-600 font-medium">
              {totalPending} item{totalPending !== 1 ? "s" : ""} require your attention
            </p>
          </div>
          {totalPending > 0 && (
            <div className="size-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <span className="text-red-600 font-black text-lg">{totalPending}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch(""); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? tab.color === "blue"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : tab.color === "amber"
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                    : "bg-purple-600 text-white shadow-lg shadow-purple-200"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === tab.id ? "bg-white/30 text-white" : "bg-red-100 text-red-600"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ── PROPERTIES TAB ── */}
        {activeTab === "properties" && (
          <div className="space-y-4">
            {propsLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="size-8 text-blue-500 animate-spin" />
              </div>
            ) : pendingProperties.filter((p: any) =>
                !search ||
                p.propertyTitle?.toLowerCase().includes(search.toLowerCase()) ||
                p.location?.city?.toLowerCase().includes(search.toLowerCase())
              ).length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <CheckCircle className="size-14 mx-auto mb-4 text-green-400" />
                <p className="font-black text-slate-700 text-lg">No pending properties!</p>
                <p className="text-slate-400 text-sm mt-1">All properties have been reviewed.</p>
              </div>
            ) : (
              pendingProperties
                .filter((p: any) =>
                  !search ||
                  p.propertyTitle?.toLowerCase().includes(search.toLowerCase()) ||
                  p.location?.city?.toLowerCase().includes(search.toLowerCase())
                )
                .map((prop: any) => (
                  <div key={prop._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-start gap-4 p-5">
                      {prop.media?.propertyImages?.[0] ? (
                        <img
                          src={prop.media.propertyImages[0]}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                          alt=""
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Home className="size-8 text-slate-400" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p
                              className="font-black text-slate-900 hover:text-blue-600 cursor-pointer"
                              onClick={() => navigate(`/properties/${prop.slug || prop._id}`)}
                            >
                              {prop.propertyTitle}
                            </p>
                            <p className="text-sm text-slate-500 mt-0.5">
                              {prop.location?.city}{prop.location?.state && `, ${prop.location.state}`}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              By: {prop.createdBy?.name || "Unknown"} ·{" "}
                              {new Date(prop.createdAt).toLocaleDateString("en-GB")}
                            </p>
                            <p className="font-black text-blue-600 mt-1">
                              £{(prop.pricing?.startingAuctionPrice || 0).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 items-end flex-shrink-0">
                            <input
                              type="text"
                              placeholder="Rejection reason..."
                              value={reviewNote[prop._id] || ""}
                              onChange={(e) =>
                                setReviewNote((prev) => ({ ...prev, [prop._id]: e.target.value }))
                              }
                              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveProperty(prop._id, "approved")}
                                disabled={processingId === prop._id}
                                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                              >
                                {processingId === prop._id ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="size-4" />
                                )}
                                Approve
                              </button>
                              <button
                                onClick={() => handleApproveProperty(prop._id, "rejected")}
                                disabled={processingId === prop._id}
                                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                              >
                                <XCircle className="size-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* ── PENDING USERS TAB ── */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {usersLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="size-8 text-amber-500 animate-spin" />
              </div>
            ) : pendingUsers.filter((u: any) =>
                !search ||
                u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase())
              ).length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <CheckCircle className="size-14 mx-auto mb-4 text-green-400" />
                <p className="font-black text-slate-700 text-lg">No pending users!</p>
              </div>
            ) : (
              pendingUsers
                .filter((u: any) =>
                  !search ||
                  u.name?.toLowerCase().includes(search.toLowerCase()) ||
                  u.email?.toLowerCase().includes(search.toLowerCase())
                )
                .map((user: any) => (
                  <div key={user._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-2xl bg-amber-100 flex items-center justify-center font-black text-amber-600 text-lg">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p
                            className="font-black text-slate-900 hover:text-blue-600 cursor-pointer"
                            onClick={() => navigate(`/admin/users/${user._id}`)}
                          >
                            {user.name}
                          </p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg flex items-center gap-1">
                              <Clock className="size-3" /> Pending Activation
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-lg">
                              {user.role}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs mt-1">
                            Registered: {new Date(user.createdAt).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReviewUser(user._id, "approved")}
                          disabled={processingId === user._id}
                          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50"
                        >
                          {processingId === user._id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <CheckCircle className="size-4" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReviewUser(user._id, "rejected")}
                          disabled={processingId === user._id}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle className="size-4" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* ── ROLE REQUESTS TAB ── */}
        {activeTab === "roles" && (
          <div className="space-y-4">
            {usersLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="size-8 text-purple-500 animate-spin" />
              </div>
            ) : roleRequests.filter((u: any) =>
                !search ||
                u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase())
              ).length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <CheckCircle className="size-14 mx-auto mb-4 text-green-400" />
                <p className="font-black text-slate-700 text-lg">No role requests!</p>
              </div>
            ) : (
              roleRequests
                .filter((u: any) =>
                  !search ||
                  u.name?.toLowerCase().includes(search.toLowerCase()) ||
                  u.email?.toLowerCase().includes(search.toLowerCase())
                )
                .map((user: any) => (
                  <div key={user._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-2xl bg-purple-100 flex items-center justify-center font-black text-purple-600 text-lg">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p
                            className="font-black text-slate-900 hover:text-blue-600 cursor-pointer"
                            onClick={() => navigate(`/admin/users/${user._id}`)}
                          >
                            {user.name}
                          </p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-lg">
                              Current: {user.role}
                            </span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg flex items-center gap-1">
                              <Shield className="size-3" />
                              Wants: {user.roleRequest?.requestedRole}
                            </span>
                          </div>
                          {user.roleRequest?.reason && (
                            <p className="text-slate-500 text-sm mt-2 italic max-w-md">
                              "{user.roleRequest.reason}"
                            </p>
                          )}
                          <p className="text-slate-400 text-xs mt-1">
                            Requested:{" "}
                            {new Date(
                              user.roleRequest?.requestedAt || user.createdAt
                            ).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        <input
                          type="text"
                          placeholder="Optional note..."
                          value={reviewNote[user._id] || ""}
                          onChange={(e) =>
                            setReviewNote((prev) => ({ ...prev, [user._id]: e.target.value }))
                          }
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 w-48"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReviewRole(user._id, "approved")}
                            disabled={processingId === user._id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50"
                          >
                            {processingId === user._id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <CheckCircle className="size-4" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReviewRole(user._id, "rejected")}
                            disabled={processingId === user._id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50"
                          >
                            <XCircle className="size-4" /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
