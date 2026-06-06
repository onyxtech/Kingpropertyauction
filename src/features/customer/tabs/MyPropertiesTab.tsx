import { useNavigate } from "react-router";
import { Building2, Plus, MapPin, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { useTheme } from "../../../app/hooks/useTheme";
import { useCustomerApi } from "../api/useCustomerApi";

export default function MyPropertiesTab() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { useMyProperties } = useCustomerApi();
  const { data: properties = [], isLoading } = useMyProperties();

  const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    approved: { label: "Approved", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
    pending: { label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-50" },
    rejected: { label: "Rejected", icon: XCircle, color: "text-red-600 bg-red-50" },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">My Properties</h2>
          <p className="text-slate-600 font-medium">{properties.length} listing{properties.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => navigate("/add-property")}
          className={`px-5 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
        >
          <Plus className="size-5" />
          Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-sm p-16 text-center">
          <Building2 className="size-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-700 mb-2">No properties yet</h3>
          <p className="text-slate-500 font-medium mb-6">List your first property for auction</p>
          <button
            onClick={() => navigate("/add-property")}
            className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold hover:scale-105 transition-all`}
          >
            Add Property
          </button>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Property</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property: any) => {
                  const status = statusConfig[property.approvalStatus] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={property._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {property.media?.propertyImages?.[0] ? (
                            <img src={property.media.propertyImages[0]} alt="" className="size-12 rounded-xl object-cover" />
                          ) : (
                            <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center">
                              <Building2 className="size-6 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-sm line-clamp-1">{property.propertyTitle}</p>
                            <p className="text-xs text-slate-500 capitalize">{property.propertyType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin className="size-4 text-slate-400" />
                          {property.location?.city || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-sm">
                          £{property.pricing?.startingAuctionPrice?.toLocaleString() || "—"}
                        </p>
                        {property.currentBid > 0 && (
                          <p className="text-xs text-emerald-600 font-bold">Bid: £{property.currentBid?.toLocaleString()}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.color}`}>
                          <StatusIcon className="size-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/properties/${property.slug || property._id}`)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="size-4 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
