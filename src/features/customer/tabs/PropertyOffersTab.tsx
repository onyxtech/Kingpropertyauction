import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { FileText, Mail, Phone, MapPin, Eye, Home } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
};

export default function PropertyOffersTab() {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["agent-offers"],
    queryFn: () => apiClient.fetch("/offers/agent/my"),
  });

  const offers = data?.data || [];

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <FileText className="size-6 text-purple-600" /> Property Offers
        </h2>
        <p className="text-slate-500 mt-1">Offers received on your listed properties</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="size-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <FileText className="size-12 mx-auto mb-3 text-slate-300" />
          <p className="font-bold text-slate-500">No offers received yet</p>
          <p className="text-sm text-slate-400 mt-1">Offers on your properties will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                {["Offeror", "Property", "Amount", "Status", "Date", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {offers.map((offer: any) => (
                <tr key={offer._id} className="hover:bg-purple-50 cursor-pointer" onClick={() => setSelectedOffer(offer)}>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{offer.name}</p>
                    <p className="text-xs text-slate-500">{offer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{offer.property?.propertyTitle || "N/A"}</td>
                  <td className="px-4 py-3 font-black text-green-700">{formatPrice(offer.offerAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${statusColors[offer.status]}`}>{offer.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(offer.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-3"><Eye className="size-4 text-slate-400" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal - Read Only */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOffer(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black text-slate-900 mb-4">Offer Details</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-xl text-sm font-bold ${statusColors[selectedOffer.status]}`}>{selectedOffer.status?.toUpperCase()}</span>
                <p className="text-2xl font-black text-green-700">{formatPrice(selectedOffer.offerAmount)}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <p className="font-bold text-slate-900">{selectedOffer.name}</p>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Mail className="size-4" />{selectedOffer.email}</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Phone className="size-4" />{selectedOffer.phone}</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin className="size-4" />{selectedOffer.address}, {selectedOffer.city}, {selectedOffer.postcode}</div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <button onClick={() => navigate(`/properties/${selectedOffer.property?.slug || selectedOffer.property?._id}`)} className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                  <Home className="size-4" /> {selectedOffer.property?.propertyTitle}
                </button>
              </div>

              {selectedOffer.solicitorDetails && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-500 mb-1">Solicitor</p>
                  <p className="text-sm text-slate-700">{selectedOffer.solicitorDetails}</p>
                </div>
              )}

              {selectedOffer.signature && (
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2">Signature</p>
                  <img src={selectedOffer.signature} alt="Signature" className="border rounded-xl max-h-24" />
                </div>
              )}

              <p className="text-xs text-slate-400 text-center">View only — admin will respond to this offer</p>
            </div>

            <button onClick={() => setSelectedOffer(null)} className="w-full mt-4 py-2 bg-slate-100 rounded-xl font-bold text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}