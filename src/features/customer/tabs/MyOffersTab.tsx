import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { FileText, Eye, MapPin, Mail, Phone, Home } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  updated: "bg-blue-100 text-blue-700",
};

export default function MyOffersTab() {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-offers"],
    queryFn: () => apiClient.fetch("/offers/my/offers"),
  });

  const offers = data?.data || [];

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <FileText className="size-6 text-purple-600" /> My Offers
        </h2>
        <p className="text-slate-500 mt-1">Track your submitted property offers</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="size-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <FileText className="size-12 mx-auto mb-3 text-slate-300" />
          <p className="font-bold text-slate-500">No offers submitted yet</p>
          <p className="text-sm text-slate-400 mt-1">Submit an offer on any property to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                {["Property", "Your Offer", "Status", "Solicitor", "Date", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {offers.map((offer: any) => (
                <tr key={offer._id} className="hover:bg-purple-50 cursor-pointer" onClick={() => setSelectedOffer(offer)}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 text-xs">{offer.property?.propertyTitle || "N/A"}</p>
                  </td>
                  <td className="px-4 py-3 font-black text-green-700 text-xs">{formatPrice(offer.offerAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${statusColors[offer.status]}`}>{offer.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-[100px] truncate">{offer.solicitorDetails || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(offer.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-3"><Eye className="size-4 text-slate-400" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOffer(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black">Your Offer</h3>
                  <p className="text-white/80 text-sm">{selectedOffer.property?.propertyTitle}</p>
                </div>
                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  selectedOffer.status === "accepted" ? "bg-green-500" : 
                  selectedOffer.status === "declined" ? "bg-red-500" : 
                  selectedOffer.status === "updated" ? "bg-blue-500" : "bg-yellow-500"
                }`}>{selectedOffer.status?.toUpperCase()}</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Offer Amount */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200 text-center">
                <p className="text-xs text-green-600 font-bold mb-1">YOUR OFFER</p>
                <p className="text-3xl font-black text-green-700">{formatPrice(selectedOffer.offerAmount)}</p>
                <p className="text-xs text-green-500 mt-1 italic">{selectedOffer.offerAmountInWords}</p>
              </div>

              {/* Property */}
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 mb-1">Property</p>
                <button onClick={() => navigate(`/properties/${selectedOffer.property?.slug || selectedOffer.property?._id}`)} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                  <Home className="size-4" /> {selectedOffer.property?.propertyTitle}
                </button>
                {selectedOffer.property?.location && (
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="size-3" />
                    {[selectedOffer.property.location.city, selectedOffer.property.location.postalCode].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>

              {/* Your Details */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-500">Your Details</p>
                <p className="text-sm font-medium flex items-center gap-2"><Mail className="size-4 text-slate-400" />{selectedOffer.email}</p>
                <p className="text-sm font-medium flex items-center gap-2"><Phone className="size-4 text-slate-400" />{selectedOffer.phone}</p>
                <p className="text-sm font-medium flex items-center gap-2"><MapPin className="size-4 text-slate-400" />{selectedOffer.address}, {selectedOffer.city}, {selectedOffer.postcode}</p>
              </div>

              {/* Solicitor */}
              {selectedOffer.solicitorDetails && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-500 mb-1">Solicitor</p>
                  <p className="text-sm text-slate-700">{selectedOffer.solicitorDetails}</p>
                </div>
              )}

              {/* Admin Notes */}
              {selectedOffer.adminNotes && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-500 mb-1">Response from Agent</p>
                  <p className="text-sm text-slate-700">{selectedOffer.adminNotes}</p>
                </div>
              )}

              <button onClick={() => setSelectedOffer(null)} className="w-full py-2.5 bg-slate-100 rounded-xl font-bold text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}