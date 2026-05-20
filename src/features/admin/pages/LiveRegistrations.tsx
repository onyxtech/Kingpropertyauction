import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Search,
  X,
  Calendar,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { apiClient } from "@/lib/apiClient";

export default function LiveRegistrations() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingReg, setRejectingReg] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedReg, setSelectedReg] = useState<any>(null);
  const [auctionDetails, setAuctionDetails] = useState<any>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    const data = await apiClient.fetch("/leads?leadType=live-registration&limit=100");
    if (data.success) setRegistrations(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    if (!selectedReg?.auctionRef) {
      setAuctionDetails(null);
      return;
    }
    const auctionId = typeof selectedReg.auctionRef === 'object'
      ? selectedReg.auctionRef._id
      : selectedReg.auctionRef;
    apiClient.fetch(`/auctions/${auctionId}`)
      .then((data: any) => {
        if (data.success) setAuctionDetails(data.data);
      })
      .catch(() => {});
  }, [selectedReg]);

  const handleApprove = async (id: string) => {
    if (approvingId === id) return;
    setApprovingId(id);
    const data = await apiClient.fetch(`/leads/${id}/approve`, { method: "PATCH" });
    if (data.success) {
      setRegistrations(prev =>
        prev.map(r => r._id === id ? { ...r, approvalStatus: "approved" } : r)
      );
      showToast("Registration approved — confirmation email sent.");
    }
    setApprovingId(null);
  };

  const handleReject = async () => {
    if (!rejectingReg) return;
    const data = await apiClient.fetch(`/leads/${rejectingReg._id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason: rejectReason }),
    });
    if (data.success) {
      setRegistrations(prev =>
        prev.map(r => r._id === rejectingReg._id ? { ...r, approvalStatus: "rejected" } : r)
      );
      setShowRejectModal(false);
      setRejectingReg(null);
      setRejectReason("");
      showToast("Registration rejected — notification email sent.");
    }
  };

  const filtered = registrations.filter(r => {
    const matchesSearch =
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone?.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "pending" && (!r.approvalStatus || r.approvalStatus === "pending")) ||
      r.approvalStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => !r.approvalStatus || r.approvalStatus === "pending").length,
    approved: registrations.filter(r => r.approvalStatus === "approved").length,
    rejected: registrations.filter(r => r.approvalStatus === "rejected").length,
  };

  const statusBadge = (status: string) => {
    if (status === "approved")
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">✅ Approved</span>;
    if (status === "rejected")
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">❌ Rejected</span>;
    return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">⏳ Pending</span>;
  };

  return (
    <AdminLayout activeTab="live-registrations" onTabChange={(tab) => navigate(`/admin/${tab}`)}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 bg-green-500/95 text-white rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2">
          <CheckCircle className="size-5" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">Live Registrations</h2>
          <p className="text-slate-600 font-medium">Manage in-person auction attendance registrations</p>
        </div>
        <button
          onClick={fetchRegistrations}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, color: "from-blue-500 to-indigo-600", icon: Users },
          { label: "Pending Review", value: stats.pending, color: "from-amber-500 to-orange-500", icon: Clock },
          { label: "Approved", value: stats.approved, color: "from-green-500 to-emerald-600", icon: CheckCircle },
          { label: "Rejected", value: stats.rejected, color: "from-red-500 to-rose-600", icon: XCircle },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border-2 border-white/60 shadow-lg">
              <div className={`size-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <Icon className="size-5 text-white" />
              </div>
              <div className="text-3xl font-black text-slate-900">{s.value}</div>
              <div className="text-sm font-medium text-slate-600">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border-2 border-white/60 shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 font-medium text-slate-900 text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 font-bold text-slate-900 text-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-3">
          Showing {filtered.length} of {registrations.length} registrations
        </p>
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/80 rounded-3xl p-16 text-center border-2 border-white/60 shadow-xl">
          <MapPin className="size-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-700 mb-2">No registrations found</h3>
          <p className="text-slate-500 font-medium">
            {registrations.length === 0
              ? "No live auction registrations yet."
              : "No registrations match your search."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((reg: any) => {
            const isExpanded = expandedId === reg._id;
            const auctionTitle = reg.auctionRef?.auctionTitle || "—";
            const venue = reg.auctionRef?.venue?.name || "—";
            const auctionDate = reg.auctionRef?.startDateTime
              ? new Date(reg.auctionRef.startDateTime).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London",
                })
              : "—";
            const submittedAt = new Date(reg.createdAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London",
            });
            const approvalStatus = reg.approvalStatus || "pending";

            return (
              <div
                key={reg._id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-lg overflow-hidden"
              >
                {/* Row */}
                <div className="flex items-center gap-4 p-5">
                  {/* Avatar */}
                  <div className="size-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                    {reg.name?.charAt(0) || "?"}
                  </div>

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-sm">{reg.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Mail className="size-3" /> {reg.email}
                      </span>
                      {reg.phone && (
                        <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Phone className="size-3" /> {reg.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Auction */}
                  <div className="hidden md:block min-w-0 w-44">
                    <p className="text-xs font-bold text-purple-700 truncate">{auctionTitle}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3" /> {venue}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="hidden lg:block w-28">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="size-3" /> {auctionDate}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Submitted {submittedAt}</p>
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">{statusBadge(approvalStatus)}</div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {approvalStatus === "pending" ? (
                      <>
                        <button
                          onClick={() => handleApprove(reg._id)}
                          disabled={approvingId === reg._id}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {approvingId === reg._id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => { setRejectingReg(reg); setShowRejectModal(true); setRejectReason(""); }}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}
                    <button
                      onClick={() => {
                        const nextExpanded = isExpanded ? null : reg._id;
                        setExpandedId(nextExpanded);
                        setSelectedReg(nextExpanded ? reg : null);
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
                    >
                      <ChevronDown className={`size-4 text-slate-600 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-100 pt-4 bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Message / Notes</p>
                        <p className="text-slate-700 font-medium whitespace-pre-wrap text-xs">
                          {reg.message || "No additional message"}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-blue-700 uppercase mb-2">Auction Details</p>
                        {auctionDetails ? (
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-900">{auctionDetails.auctionTitle}</p>
                            {auctionDetails.venue?.name && (
                              <p className="text-sm text-slate-600 flex items-center gap-1">
                                <MapPin className="size-3" />
                                {auctionDetails.venue.name}{auctionDetails.venue.city ? `, ${auctionDetails.venue.city}` : ''}
                              </p>
                            )}
                            {auctionDetails.startDateTime && (
                              <>
                                <p className="text-sm text-slate-600">
                                  {new Date(auctionDetails.startDateTime).toLocaleDateString('en-GB', {
                                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                                    timeZone: 'Europe/London',
                                  })}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {new Date(auctionDetails.startDateTime).toLocaleTimeString('en-GB', {
                                    hour: '2-digit', minute: '2-digit',
                                    timeZone: 'Europe/London',
                                    timeZoneName: 'short',
                                  })}
                                </p>
                              </>
                            )}
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                              auctionDetails.status === 'live' ? 'bg-red-100 text-red-700' :
                              auctionDetails.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {auctionDetails.status}
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">No auction linked</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-slate-900">Reject Registration</h3>
              <button
                onClick={() => { setShowRejectModal(false); setRejectingReg(null); setRejectReason(""); }}
                className="size-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Provide a reason for rejecting <strong>{rejectingReg?.name}</strong>'s registration. This will be included in the notification email.
            </p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason (optional)..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-red-400 resize-none mb-4 text-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
              >
                Reject Registration
              </button>
              <button
                onClick={() => { setShowRejectModal(false); setRejectingReg(null); setRejectReason(""); }}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
