import { useState, useEffect } from "react";
import { mediaUrl } from "@/lib/mediaUrl";
import { useNavigate } from "react-router";
import {
  Building2, Plus, MapPin, Eye, Edit2, Clock, CheckCircle, XCircle,
  Gavel, BarChart3, PoundSterling, Search, X
} from "lucide-react";
import { useTheme } from "../../../app/hooks/useTheme";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { useCustomerApi } from "../api/useCustomerApi";

export default function SellerPropertiesTab() {
  const navigate = useNavigate();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { useMyProperties, useMyPropertyStats } = useCustomerApi();
  const { data: properties = [], isLoading, refetch } = useMyProperties();
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useMyPropertyStats();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    setVisibleCount(10);
  }, [search, statusFilter]);

  useEffect(() => {
    const socket = getSocket();
    const handleBidUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["my-property-stats"] });
      refetch();
      refetchStats();
    };
    const handleAuctionUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["my-property-stats"] });
      refetch();
      refetchStats();
    };
    socket.on("bid_update", handleBidUpdate);
    socket.on("auction_status_update", handleAuctionUpdate);
    return () => {
      socket.off("bid_update", handleBidUpdate);
      socket.off("auction_status_update", handleAuctionUpdate);
    };
  }, [queryClient, refetch, refetchStats]);

  const filteredProperties = (properties as any[]).filter((p: any) => {
    const matchesSearch = !search ||
      p.propertyTitle?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.city?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.approvalStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    approved: { label: "Approved", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    pending: { label: "Pending Review", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
    rejected: { label: "Rejected", icon: XCircle, color: "text-red-600 bg-red-50 border-red-200" },
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">My Properties</h2>
          <p className="text-slate-600 font-medium">{properties.length} listing{properties.length !== 1 ? "s" : ""} as seller</p>
        </div>
        <button
          onClick={() => navigate("/add-property")}
          className={`px-5 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
        >
          <Plus className="size-5" />
          Add Property
        </button>
      </div>

      {/* Search + Filter bar */}
      {properties.length > 0 && (
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties by name or city..."
              className="w-full pl-10 pr-10 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "approved", "pending", "rejected"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === s
                    ? s === "all" ? "bg-slate-800 text-white" :
                      s === "approved" ? "bg-green-500 text-white" :
                      s === "pending" ? "bg-amber-500 text-white" :
                      "bg-red-500 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Auction Stats */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total Properties", value: stats.totalProperties, gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200", icon: Building2 },
            { label: "Approved", value: stats.approvedProperties, gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200", icon: CheckCircle },
            { label: "Pending", value: stats.pendingProperties, gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-200", icon: Clock },
            { label: "Live Auctions", value: stats.liveAuctions, gradient: "from-red-500 to-pink-600", shadow: "shadow-red-200", icon: Gavel },
            { label: "Completed", value: stats.completedAuctions, gradient: "from-purple-500 to-violet-600", shadow: "shadow-purple-200", icon: BarChart3 },
            { label: "Revenue", value: `£${(stats.totalRevenue || 0).toLocaleString()}`, gradient: "from-green-500 to-emerald-600", shadow: "shadow-green-200", icon: PoundSterling },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-4 text-white shadow-lg ${s.shadow} text-center`}>
                <Icon className="size-5 text-white/80 mx-auto mb-1.5" />
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/80 font-bold mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Properties Table */}
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
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <Search className="size-10 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-700 mb-1">No properties found</p>
          <p className="text-slate-500 text-sm">Try a different search or filter</p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-700">{Math.min(visibleCount, filteredProperties.length)}</span> of <span className="font-bold text-slate-700">{filteredProperties.length}</span> properties
              {filteredProperties.length < properties.length && (
                <span className="text-slate-400"> (filtered from {properties.length})</span>
              )}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-100 bg-slate-50">
                  {["Property", "Location", "Starting Price", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProperties.slice(0, visibleCount).map((property: any) => {
                  const status = statusConfig[property.approvalStatus] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={property._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {property.media?.propertyImages?.[0] ? (
                            <img src={mediaUrl(property.media.propertyImages[0])} alt="" className="size-12 rounded-xl object-cover" />
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
                          <p className="text-xs text-emerald-600 font-bold">Current bid: £{property.currentBid?.toLocaleString()}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${status.color}`}>
                          <StatusIcon className="size-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/properties/${property.slug || property._id}`)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="size-4 text-slate-600" />
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/edit-property/${property._id}`)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Property"
                          >
                            <Edit2 className="size-4 text-blue-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredProperties.length > visibleCount && (
            <div className="p-4 text-center border-t border-slate-100">
              <button
                onClick={() => setVisibleCount(v => v + 10)}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm"
              >
                Load More ({filteredProperties.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
