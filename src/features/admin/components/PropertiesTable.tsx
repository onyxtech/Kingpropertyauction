import { Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";
import { apiClient } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export default function PropertiesTable() {
  const { useGetProperties } = usePropertyApi();
  const { data: lotsData, isLoading } = useGetProperties();
  const properties = lotsData?.data || [];
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleApprove = async (id: string) => {
    await apiClient.fetch(`/properties/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ status: "approved" }),
    });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  };

  const handleReject = async (id: string) => {
    await apiClient.fetch(`/properties/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ status: "rejected" }),
    });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
        <p className="text-slate-500 text-center py-8">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b-2 border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">
                Property
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">
                Approval
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">
                Sale Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.map((property: any) => (
              <tr
                key={property._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      {property.propertyTitle}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {property.location?.city}, {property.location?.area}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold capitalize">
                    {property.propertyType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                  {property.pricing?.currency}{" "}
                  {property.propertyStatus === "sold"
                    ? (
                        property.soldPrice ||
                        property.currentBid ||
                        0
                      ).toLocaleString()
                    : property.listingType === "direct_sale"
                      ? (
                          property.pricing?.buyNowPrice ||
                          property.pricing?.startingAuctionPrice ||
                          0
                        ).toLocaleString()
                      : (
                          property.pricing?.startingAuctionPrice ||
                          property.pricing?.reservePrice ||
                          0
                        ).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      property.approvalStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : property.approvalStatus === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {property.approvalStatus || "pending"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {property.propertyStatus === "sold" ? (
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                      🎉 Sold - £
                      {(
                        property.soldPrice ||
                        property.currentBid ||
                        0
                      ).toLocaleString()}
                    </span>
                  ) : property.propertyStatus === "unsold" ? (
                    <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold">
                      ❌ Unsold
                    </span>
                  ) : property.listingType === "auction" ? (
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                      🔴 In Auction
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
                      🏷️ For Sale
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/properties/${property.slug || property._id}`)
                      }
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                    >
                      <Eye className="size-4" />
                    </button>
                    {property.approvalStatus === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(property._id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                        >
                          <CheckCircle className="size-4" />
                        </button>
                        <button
                          onClick={() => handleReject(property._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                        >
                          <XCircle className="size-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() =>
                        navigate(`/admin/properties/${property._id}/edit`)
                      }
                      className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all"
                    >
                      <Edit className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {properties.length === 0 && (
          <p className="text-center py-8 text-slate-500">
            No properties found.
          </p>
        )}
      </div>
    </div>
  );
}
