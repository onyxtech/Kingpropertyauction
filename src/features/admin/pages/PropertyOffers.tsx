import { useState } from "react";
import { useNavigate } from "react-router";
import AdminLayout from "../components/AdminLayout";
import { apiClient } from "@/lib/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "@/lib/toast";
import {
  FileText, Search, Eye, X, CheckCircle, XCircle,
  Mail, Phone, MapPin, Home, PoundSterling, Clock,
  Loader2, Send, Image as ImageIcon
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  withdrawn: "bg-slate-100 text-slate-500",
};

export default function PropertyOffers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [processing, setProcessing] = useState<"accepted" | "declined" | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["property-offers", statusFilter],
    queryFn: () => apiClient.fetch(`/offers?status=${statusFilter}`),
  });

  const offers = data?.data || [];

  const filtered = offers.filter((o: any) =>
    !search ||
    o.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.property?.propertyTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(val || 0);

  const handleRespond = async (status: "accepted" | "declined") => {
    if (!selectedOffer) return;
    setProcessing(status);
    try {
      const result = await apiClient.fetch(`/offers/${selectedOffer._id}/${status === "accepted" ? "accept" : "decline"}`, {
        method: "PUT",
        body: JSON.stringify({ message: replyMessage }),
      });
      if (result.success) {
        showSuccess(`Offer ${status}`, "Offeror has been notified by email");
        queryClient.invalidateQueries({ queryKey: ["property-offers"] });
        setSelectedOffer(null);
        setReplyMessage("");
      } else {
        showError("Failed", result.message);
      }
    } catch (e: any) {
      showError("Error", e.message);
    } finally {
    setProcessing(null);
    }
  };

  return (
    <AdminLayout activeTab="property-offers" onTabChange={() => {}}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Property Offers</h2>
            <p className="text-slate-600 font-medium mt-1">Review and respond to property offers</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email or property..."
              className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-bold"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12"><Loader2 className="size-8 animate-spin mx-auto" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FileText className="size-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold">No offers yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-indigo-600">
                <tr>
                  {["Offeror", "Property", "Offer Amount", "Status", "Date", ""].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-black text-white uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((offer: any) => (
                  <tr key={offer._id} className="hover:bg-purple-50 transition-colors cursor-pointer"
                    onClick={() => { setSelectedOffer(offer); setReplyMessage(""); }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {offer.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{offer.name}</p>
                          <p className="text-xs text-slate-500">{offer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{offer.property?.propertyTitle || "N/A"}</td>
                    <td className="px-6 py-4 font-black text-green-700">{formatPrice(offer.offerAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[offer.status]}`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(offer.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4">
                      <Eye className="size-4 text-slate-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedOffer(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white rounded-t-3xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="size-7" />
                  <div>
                    <h3 className="text-xl font-black">Offer Details</h3>
                    <p className="text-white/80 text-sm">{selectedOffer.property?.propertyTitle}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedOffer(null)} className="size-10 bg-white/20 rounded-full flex items-center justify-center">
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Status + Amount */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1.5 rounded-xl text-sm font-bold ${statusColors[selectedOffer.status]}`}>
                  {selectedOffer.status?.toUpperCase()}
                </span>
                <p className="text-3xl font-black text-green-700">{formatPrice(selectedOffer.offerAmount)}</p>
              </div>

              {/* Offeror Details */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-slate-900 text-sm">Offeror Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2"><Mail className="size-4 text-slate-400" /><span>{selectedOffer.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="size-4 text-slate-400" /><span>{selectedOffer.phone}</span></div>
                  <div className="flex items-center gap-2 col-span-2"><MapPin className="size-4 text-slate-400" /><span>{selectedOffer.address}, {selectedOffer.city}, {selectedOffer.postcode}</span></div>
                </div>
              </div>

              {/* Property */}
              <div className="bg-blue-50 rounded-2xl p-4">
                <h4 className="font-black text-slate-900 text-sm mb-2">Property</h4>
                <button onClick={() => navigate(`/properties/${selectedOffer.property?.slug || selectedOffer.property?._id}`)} className="text-blue-600 font-bold hover:underline">
                  {selectedOffer.property?.propertyTitle}
                </button>
              </div>

              {/* Solicitor */}
              <div className="bg-amber-50 rounded-2xl p-4">
                <h4 className="font-black text-slate-900 text-sm mb-1">Solicitor Details</h4>
                <p className="text-sm text-slate-700">{selectedOffer.solicitorDetails}</p>
              </div>

              {/* Amount in Words */}
              <div className="bg-slate-50 rounded-2xl p-4">
                <h4 className="font-black text-slate-900 text-sm mb-1">Amount in Words</h4>
                <p className="text-sm text-slate-700 italic">{selectedOffer.offerAmountInWords}</p>
              </div>

              {/* Terms */}
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-600" />
                <span className="text-slate-700">Terms of Sale Accepted</span>
              </div>

              {/* Signature */}
              {selectedOffer.signature && (
                <div>
                  <h4 className="font-black text-slate-900 text-sm mb-2">Signature</h4>
                  <img src={selectedOffer.signature} alt="Signature" className="border rounded-xl max-h-32 bg-white" />
                </div>
              )}

              {/* Admin Reply (for pending offers) */}
              {selectedOffer.status === "pending" && (
                <div className="border-t-2 border-slate-200 pt-5 space-y-4">
                  <h4 className="font-black text-slate-900">Respond to Offer</h4>
                  <textarea
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    placeholder="Add a message to the offeror (optional)..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRespond("accepted")}
                    disabled={processing !== null}
                      className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {processing === "accepted" ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
                      Accept Offer
                    </button>
                    <button
                      onClick={() => handleRespond("declined")}
                    disabled={processing !== null}
                      className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {processing === "declined" ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
                      Decline Offer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}