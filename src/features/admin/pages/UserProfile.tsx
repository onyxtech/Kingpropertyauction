import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import AdminLayout from "../components/AdminLayout";
import { apiClient } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/toast";
import {
  User,
  Mail,
  Phone,
  Building2,
  CreditCard,
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle,
  Gavel,
  Home,
  PoundSterling,
  TrendingUp,
  AlertCircle,
  Percent,
  Crown,
} from "lucide-react";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profileForm, setProfileForm] = useState<any>({});
  const [agentForm, setAgentForm] = useState<any>({});
  const [bankForm, setBankForm] = useState<any>({});

  const fetchUser = async () => {
    setLoading(true);
    try {
      const result = await apiClient.fetch(`/users/${id}`);
      if (result.success) {
        setUserData(result.data);
        setProfileForm({
          name: result.data.name || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          role: result.data.role || "buyer",
          isActive: result.data.isActive,
        });
        setAgentForm({
          companyName: result.data.agentDetails?.companyName || "",
          licenseNumber: result.data.agentDetails?.licenseNumber || "",
          companyAddress: result.data.agentDetails?.companyAddress || "",
          commissionRate: result.data.agentDetails?.commissionRate || 0,
          specialization: result.data.agentDetails?.specialization || "",
        });
        setBankForm({
          accountHolderName: result.data.bankDetails?.accountHolderName || "",
          bankName: result.data.bankDetails?.bankName || "",
          accountNumber: result.data.bankDetails?.accountNumber || "",
          sortCode: result.data.bankDetails?.sortCode || "",
          iban: result.data.bankDetails?.iban || "",
          bankAddress: result.data.bankDetails?.bankAddress || "",
        });
      }
    } catch {
      showError("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await apiClient.fetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(profileForm),
      });
      showSuccess("Profile saved! ✅");
      fetchUser();
    } catch (e: any) {
      showError("Failed to save", e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAgent = async () => {
    setSaving(true);
    try {
      await apiClient.fetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify({ agentDetails: agentForm }),
      });
      showSuccess("Agent details saved! ✅");
      fetchUser();
    } catch (e: any) {
      showError("Failed to save", e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBank = async () => {
    setSaving(true);
    try {
      await apiClient.fetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify({ bankDetails: bankForm }),
      });
      showSuccess("Bank details saved! ✅");
      fetchUser();
    } catch (e: any) {
      showError("Failed to save", e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = userData?.isActive ? "pending" : "active";
      await apiClient.fetch(`/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      showSuccess(`User ${newStatus === "active" ? "activated" : "deactivated"}!`);
      fetchUser();
    } catch {
      showError("Failed to update status");
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="users" onTabChange={(tab) => navigate(`/admin/${tab}`)}>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="size-10 text-blue-500 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!userData) {
    return (
      <AdminLayout activeTab="users" onTabChange={(tab) => navigate(`/admin/${tab}`)}>
        <div className="text-center py-20">
          <p className="text-slate-500 font-bold">User not found</p>
        </div>
      </AdminLayout>
    );
  }

  const stats = userData.stats || {};

  const role = userData.role;
  const isSuperAdmin = userData.isSuperAdmin;
  const canBid = userData.permissions?.canBid;
  const canList = userData.permissions?.canListProperties;

  const roleTabs = (() => {
    const tabs: { id: string; label: string; icon: any }[] = [
      { id: "profile", label: "Profile", icon: User },
    ];

    if (role === "admin") return tabs;

    if (role === "agent") {
      tabs.push(
        { id: "agent", label: "Agent Details", icon: Building2 },
        { id: "bank", label: "Bank Details", icon: CreditCard },
        { id: "activity", label: "Activity", icon: TrendingUp },
        { id: "commissions", label: "Commissions", icon: Percent },
        { id: "payments", label: "Payments Received", icon: PoundSterling },
      );
      return tabs;
    }

    if (role === "seller") {
      tabs.push(
        { id: "agent", label: "Seller Details", icon: Building2 },
        { id: "bank", label: "Bank Details", icon: CreditCard },
        { id: "activity", label: "Activity", icon: TrendingUp },
        { id: "commissions", label: "Commissions", icon: Percent },
        { id: "payments", label: "Payments Received", icon: PoundSterling },
      );
      return tabs;
    }

    if (role === "buyer") {
      tabs.push(
        { id: "activity", label: "Activity", icon: TrendingUp },
        { id: "payments", label: "Payments Made", icon: PoundSterling },
      );
      if (canList) {
        tabs.push(
          { id: "agent", label: "Seller Details", icon: Building2 },
          { id: "bank", label: "Bank Details", icon: CreditCard },
          { id: "commissions", label: "Commissions", icon: Percent },
        );
      }
      return tabs;
    }

    // fallback — show all
    tabs.push(
      { id: "agent", label: "Details", icon: Building2 },
      { id: "bank", label: "Bank Details", icon: CreditCard },
      { id: "activity", label: "Activity", icon: TrendingUp },
      { id: "commissions", label: "Commissions", icon: Percent },
      { id: "payments", label: "Payments", icon: PoundSterling },
    );
    return tabs;
  })();

  const inputClass =
    "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-bold text-slate-700 mb-1";

  return (
    <AdminLayout activeTab="users" onTabChange={(tab) => navigate(`/admin/${tab}`)}>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <ArrowLeft className="size-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-4">
              <div className="size-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                {userData.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">{userData.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                    userData.role === "admin" ? "bg-purple-100 text-purple-700" :
                    userData.role === "agent" ? "bg-blue-100 text-blue-700" :
                    userData.role === "seller" ? "bg-emerald-100 text-emerald-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {userData.role === "admin" && <Crown className="size-3" />}
                    {isSuperAdmin
                      ? "Super Admin"
                      : role === "admin"
                      ? "Administrator"
                      : role === "agent"
                      ? (canBid ? "Agent & Buyer" : "Agent")
                      : role === "seller"
                      ? (canBid ? "Seller & Buyer" : "Seller")
                      : role === "buyer"
                      ? (canList ? "Buyer & Seller" : "Buyer")
                      : role}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    userData.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {userData.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-slate-400">{userData.email}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              userData.isActive
                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
            }`}
          >
            {userData.isActive ? "Deactivate User" : "Activate User"}
          </button>
        </div>

        {/* Stats */}
        {(() => {
          const cards: { label: string; value: any; gradient: string; Icon: any }[] = [];

          if (role === "admin") {
            cards.push({ label: "Properties", value: stats.totalProperties ?? 0, gradient: "from-blue-500 to-indigo-600", Icon: Home });
          } else {
            if (canList || role === "seller" || role === "agent") {
              cards.push({ label: "Properties Listed", value: stats.totalProperties ?? 0, gradient: "from-blue-500 to-indigo-600", Icon: Home });
            }
            if (canBid || role === "buyer") {
              cards.push(
                { label: "Total Bids", value: stats.totalBids ?? 0, gradient: "from-purple-500 to-violet-600", Icon: Gavel },
                { label: "Auctions Won", value: stats.wonBids ?? 0, gradient: "from-amber-500 to-orange-500", Icon: CheckCircle },
              );
            }
            if (role === "agent" || role === "seller" || canList) {
              cards.push({ label: "Commission Due", value: `£${(stats.pendingCommission ?? 0).toLocaleString()}`, gradient: "from-emerald-500 to-teal-600", Icon: PoundSterling });
            }
          }

          return (
            <div className={`grid gap-4 ${cards.length === 1 ? "grid-cols-1 max-w-xs" : cards.length <= 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
              {cards.map(({ label, value, gradient, Icon }) => (
                <div key={label} className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 text-white shadow-lg`}>
                  <Icon className="size-6 text-white/80 mb-2" />
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-xs text-white/80 font-bold">{label}</p>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Tab Nav */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {roleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-black text-slate-900 text-lg">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  className={inputClass}
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((f: any) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  className={inputClass}
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((f: any) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  className={inputClass}
                  value={profileForm.phone || ""}
                  onChange={(e) => setProfileForm((f: any) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                {userData.isSuperAdmin ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-xl">
                    <Crown className="size-4 text-purple-600" />
                    <span className="font-bold text-purple-700">Super Admin</span>
                    <span className="text-xs text-purple-500 ml-1">(cannot be changed)</span>
                  </div>
                ) : (
                  <select
                    className={inputClass}
                    value={profileForm.role}
                    onChange={(e) => setProfileForm((f: any) => ({ ...f, role: e.target.value }))}
                  >
                    {["buyer", "seller", "agent", "admin"].map((r) => (
                      <option key={r} value={r}>
                        {r === "admin" ? "Administrator" :
                         r === "agent" ? "Agent" :
                         r === "seller" ? "Seller" :
                         "Buyer"}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className={labelClass}>Account Status</label>
                <select
                  className={inputClass}
                  value={profileForm.isActive ? "active" : "inactive"}
                  onChange={(e) =>
                    setProfileForm((f: any) => ({ ...f, isActive: e.target.value === "active" }))
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive / Pending</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Member Since</label>
                <input
                  className={`${inputClass} bg-slate-50`}
                  readOnly
                  value={new Date(userData.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save Profile
              </button>
            </div>
          </div>
        )}

        {/* ── Agent Details Tab ── */}
        {activeTab === "agent" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-lg">Agent / Company Details</h3>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
                <Percent className="size-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-700">Commission Rate</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  className={inputClass}
                  value={agentForm.companyName}
                  onChange={(e) => setAgentForm((f: any) => ({ ...f, companyName: e.target.value }))}
                  placeholder="Company or agency name"
                />
              </div>
              <div>
                <label className={labelClass}>License Number</label>
                <input
                  className={inputClass}
                  value={agentForm.licenseNumber}
                  onChange={(e) => setAgentForm((f: any) => ({ ...f, licenseNumber: e.target.value }))}
                  placeholder="Professional license"
                />
              </div>
              <div>
                <label className={labelClass}>Specialization</label>
                <input
                  className={inputClass}
                  value={agentForm.specialization}
                  onChange={(e) => setAgentForm((f: any) => ({ ...f, specialization: e.target.value }))}
                  placeholder="e.g. Residential, Commercial"
                />
              </div>
              <div>
                <label className={labelClass}>
                  Commission Rate (%)
                  <span className="ml-2 text-amber-600 font-black">★ Set by Admin</span>
                </label>
                <input
                  className={`${inputClass} border-amber-300 focus:ring-amber-500`}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={agentForm.commissionRate}
                  onChange={(e) =>
                    setAgentForm((f: any) => ({ ...f, commissionRate: parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="e.g. 5.5"
                />
                <p className="text-xs text-slate-500 mt-1">
                  This rate applies to all property sales by this agent
                </p>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Company Address</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={agentForm.companyAddress}
                  onChange={(e) => setAgentForm((f: any) => ({ ...f, companyAddress: e.target.value }))}
                  placeholder="Company registered address"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveAgent}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save Agent Details
              </button>
            </div>
          </div>
        )}

        {/* ── Bank Details Tab ── */}
        {activeTab === "bank" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertCircle className="size-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm font-bold text-amber-700">
                Bank details are stored securely and used for commission payments and property sale proceeds.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "accountHolderName", label: "Account Holder Name", placeholder: "Full legal name" },
                { key: "bankName", label: "Bank Name", placeholder: "e.g. Barclays, HSBC" },
                { key: "accountNumber", label: "Account Number", placeholder: "8 digit number", maxLen: 8 },
                { key: "sortCode", label: "Sort Code", placeholder: "XX-XX-XX", maxLen: 8 },
                { key: "iban", label: "IBAN (Optional)", placeholder: "International bank number" },
                { key: "bankAddress", label: "Bank Address (Optional)", placeholder: "Branch address" },
              ].map((field) => (
                <div key={field.key}>
                  <label className={labelClass}>{field.label}</label>
                  <input
                    className={inputClass}
                    value={bankForm[field.key] || ""}
                    maxLength={field.maxLen}
                    onChange={(e) => setBankForm((f: any) => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveBank}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save Bank Details
              </button>
            </div>
          </div>
        )}

        {/* ── Activity Tab ── */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-black text-slate-900 text-lg">User Activity Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(() => {
                const items: { label: string; value: any; color: string }[] = [];
                if (canList || role === "agent" || role === "seller") {
                  items.push({ label: "Properties Listed", value: stats.totalProperties ?? 0, color: "text-blue-600" });
                }
                if (canBid || role === "buyer") {
                  items.push(
                    { label: "Total Bids Placed", value: stats.totalBids ?? 0, color: "text-purple-600" },
                    { label: "Auctions Won", value: stats.wonBids ?? 0, color: "text-amber-600" },
                  );
                }
                if (role === "agent" || role === "seller" || canList) {
                  items.push(
                    { label: "Total Commissions", value: stats.totalCommissions ?? 0, color: "text-emerald-600" },
                    { label: "Commission Paid", value: `£${(stats.paidCommission ?? 0).toLocaleString()}`, color: "text-green-600" },
                    { label: "Commission Pending", value: `£${(stats.pendingCommission ?? 0).toLocaleString()}`, color: "text-orange-600" },
                  );
                }
                return items;
              })().map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 font-bold mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Mail className="size-3.5" /> Contact
                </p>
                <p className="font-bold text-slate-900">{userData.email}</p>
                <p className="text-slate-500 text-sm">{userData.phone || "No phone"}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Phone className="size-3.5" /> Role & Permissions
                </p>
                <p className="font-bold text-slate-900">
                  {isSuperAdmin ? "Super Admin" :
                   role === "admin" ? "Administrator" :
                   role === "agent" ? (canBid ? "Agent & Buyer" : "Agent") :
                   role === "seller" ? (canBid ? "Seller & Buyer" : "Seller") :
                   role === "buyer" ? (canList ? "Buyer & Seller" : "Buyer") :
                   role}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {userData.permissions?.canBid ? "✅ Can bid" : "❌ Cannot bid"} ·{" "}
                  {userData.permissions?.canListProperties ? "✅ Can list" : "❌ Cannot list"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Commissions Tab ── */}
        {activeTab === "commissions" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900">Commission History</h3>
              <span className="text-xs text-slate-500 font-bold">
                Rate: {agentForm.commissionRate || 0}%
              </span>
            </div>
            {(userData.commissions || []).length === 0 ? (
              <div className="text-center py-12">
                <Percent className="size-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">No commissions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {["Property", "Sale Price", "Rate", "Amount", "Status", "Withdrawal", "Date"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(userData.commissions || []).map((c: any) => (
                      <tr key={c._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-900">{c.property?.propertyTitle || "—"}</td>
                        <td className="px-4 py-3">£{c.salePrice?.toLocaleString()}</td>
                        <td className="px-4 py-3">{c.commissionRate}%</td>
                        <td className="px-4 py-3 font-black text-emerald-700">£{c.commissionAmount?.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            c.status === "paid" ? "bg-green-100 text-green-700" :
                            c.status === "approved" ? "bg-blue-100 text-blue-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {c.withdrawalRequest?.requested ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg">
                              Requested
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {new Date(c.createdAt).toLocaleDateString("en-GB")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Payments Tab ── */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-black text-slate-900">
                {role === "buyer" && !canList ? "Payments Made" : role === "buyer" && canList ? "Payment History" : "Payments Received"}
              </h3>
            </div>
            {(userData.payments || []).length === 0 ? (
              <div className="text-center py-12">
                <PoundSterling className="size-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">No payments recorded</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {["Property", "Amount", "Method", "Status", "Due Date", "Date"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(userData.payments || []).map((p: any) => (
                      <tr key={p._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-900">{p.property?.propertyTitle || "—"}</td>
                        <td className="px-4 py-3 font-black text-slate-900">£{p.amount?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-500 capitalize">{p.method?.replace("_", " ") || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            p.status === "paid" ? "bg-green-100 text-green-700" :
                            p.status === "overdue" ? "bg-red-100 text-red-700" :
                            p.status === "withdrawn" ? "bg-orange-100 text-orange-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {p.dueDate ? new Date(p.dueDate).toLocaleDateString("en-GB") : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {new Date(p.createdAt).toLocaleDateString("en-GB")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
