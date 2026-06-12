import { useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";
import { apiClient } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import ConfirmModal from "@/features/shared/components/ConfirmModal";
import FilterBar from "@/features/shared/components/FilterBar";

export default function PropertiesTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { useGetProperties } = usePropertyApi();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: lotsData, isLoading } = useGetProperties({
    page,
    pageSize: 10,
    approvalStatus: "all",
  });
  const properties = lotsData?.data || [];
  const total = lotsData?.total || 0;
  const totalPages = lotsData?.totalPages || 1;

  // Client-side filtering
  const filtered = properties.filter((p: any) => {
    if (
      search &&
      !p.propertyTitle?.toLowerCase().includes(search.toLowerCase()) &&
      !p.location?.city?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (typeFilter && p.propertyType !== typeFilter) return false;
    if (statusFilter && p.propertyStatus !== statusFilter) return false;
    return true;
  });

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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

  return (
    <div>
      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by title or city..."
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        filters={[
          {
            label: "All Types",
            value: typeFilter,
            options: [
              { value: "house", label: "House" },
              { value: "apartment", label: "Apartment" },
              { value: "land", label: "Land" },
              { value: "commercial", label: "Commercial" },
              { value: "farmhouse", label: "Farmhouse" },
            ],
            onChange: (v) => {
              setTypeFilter(v);
              setPage(1);
            },
          },
          {
            label: "All Status",
            value: statusFilter,
            options: [
              { value: "available", label: "Available" },
              { value: "sold", label: "Sold" },
              { value: "pending", label: "Pending" },
            ],
            onChange: (v) => {
              setStatusFilter(v);
              setPage(1);
            },
          },
        ]}
        className="mb-4"
      />

      {/* Table */}
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    Loading properties...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No properties found.
                  </td>
                </tr>
              ) : (
                filtered.map((property: any) => (
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
                      £
                      {(
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
                          Sold £
                          {(
                            property.soldPrice ||
                            property.currentBid ||
                            0
                          ).toLocaleString()}
                        </span>
                      ) : property.propertyStatus === "unsold" ? (
                        <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold">
                          Unsold
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          title="View Property"
                          onClick={() =>
                            navigate(
                              `/properties/${property.slug || property._id}`,
                            )
                          }
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                        >
                          <Eye className="size-4" />
                        </button>
                        {property.approvalStatus === "pending" && (
                          <>
                            <button
                              title="Approve"
                              onClick={() => handleApprove(property._id)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                            >
                              <CheckCircle className="size-4" />
                            </button>
                            <button
                              title="Reject"
                              onClick={() => handleReject(property._id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            >
                              <XCircle className="size-4" />
                            </button>
                          </>
                        )}
                        <button
                          title="Edit"
                          onClick={() =>
                            navigate(`/admin/properties/${property._id}/edit`)
                          }
                          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => setDeleteTarget(property._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <Trash2 className="size-4" />
                        </button>
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
            <p className="text-sm text-slate-600 font-medium">
              Showing {(page - 1) * 10 + 1}-{Math.min(page * 10, total)} of{" "}
              {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                title="Previous Page"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 bg-white border-2 border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-100"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`size-9 rounded-xl text-sm font-bold ${page === i + 1 ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "bg-white border-2 border-slate-200"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                title="Next Page"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 bg-white border-2 border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-100"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Property"
        message="This property will be permanently deleted and removed from all auctions."
        onConfirm={() => {
          apiClient
            .fetch(`/properties/${deleteTarget}`, { method: "DELETE" })
            .then(() => {
              queryClient.invalidateQueries({ queryKey: ["properties"] });
              queryClient.invalidateQueries({ queryKey: ["auctions"] });
              setDeleteTarget(null);
            });
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
