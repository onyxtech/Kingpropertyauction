// src\features\admin\components\users\tabs\PaymentsTab.tsx
import {
  CreditCard,
  Eye,
  FileText,
  DollarSign,
  Receipt,
  Users,
  MapPin,
} from "lucide-react";
import { UserRecord } from "../UserActivityView";
import { useUserApi } from "@/features/admin/api/useUserApi";
import { useState } from "react";
import { StatusBadge } from "../shared/StatusBadge";
import { useNavigate } from "react-router";

export function PaymentsTab({ user }: { user: UserRecord }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { useGetUserPayments } = useUserApi();
  const { data: paymentsData, isLoading } = useGetUserPayments(
    user._id,
    page,
    pageSize,
  );

  const payments = paymentsData?.data || [];
  const totalPayments = paymentsData?.pagination?.total || 0;
  const totalPages = Math.ceil(totalPayments / pageSize);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(val || 0);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle view details navigation based on payment type
  const handleViewDetails = (payment: any) => {
    if (payment.type === "invoice_buyer" || payment.type === "invoice_seller") {
      navigate(`/admin/invoices`);
    } else if (payment.type === "payment_buyer") {
      navigate(`/admin/revenue`);
    } else if (payment.type === "commission") {
      navigate(`/admin/commissions`);
    } else {
      // Fallback to property page
      navigate(`/properties/${payment.propertySlug || payment.propertyId}`);
    }
  };

  // Get icon based on payment type
  const getTypeIcon = (type: string) => {
    if (type === "invoice_buyer" || type === "invoice_seller")
      return <Receipt className="size-5 text-blue-500" />;
    if (type === "payment_buyer")
      return <DollarSign className="size-5 text-green-500" />;
    if (type === "commission")
      return <Users className="size-5 text-purple-500" />;
    return <CreditCard className="size-5 text-slate-500" />;
  };

  // Get badge color based on type
  const getTypeColor = (type: string) => {
    if (type === "invoice_buyer" || type === "invoice_seller")
      return "bg-blue-100 text-blue-700";
    if (type === "payment_buyer") return "bg-green-100 text-green-700";
    if (type === "commission") return "bg-purple-100 text-purple-700";
    return "bg-slate-100 text-slate-600";
  };

  // Get type label
  const getTypeLabel = (type: string) => {
    if (type === "invoice_buyer") return "Invoice (Buyer)";
    if (type === "invoice_seller") return "Invoice (Seller)";
    if (type === "payment_buyer") return "Payment";
    if (type === "commission") return "Commission";
    return type || "N/A";
  };

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="flex items-center justify-center h-40">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="size-4 text-slate-400" /> Payment History (
            {totalPayments})
          </h3>
        </div>

        {totalPayments === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <CreditCard className="size-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No payment records</p>
            <p className="text-sm">This user has no payment history</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {[
                      "Reference",
                      "Property",
                      "Type",
                      "Amount",
                      "Status",
                      "Date",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.map((payment: any) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* Reference */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(payment.type)}
                          <span className="text-xs font-bold text-slate-700">
                            {payment.reference ||
                              payment.invoiceNumber ||
                              "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <button
                            onClick={() =>
                              navigate(
                                `/properties/${payment.propertySlug || payment.propertyId}`,
                              )
                            }
                            className="font-semibold text-slate-900 hover:text-blue-600 hover:underline text-left"
                          >
                            {payment.propertyTitle || "N/A"}
                          </button>
                          {payment.propertyAddress && (
                            <p className="text-slate-400 text-xs flex items-center gap-1">
                              <MapPin className="size-3" />
                              {payment.propertyAddress}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-bold ${getTypeColor(payment.type)}`}
                        >
                          {getTypeLabel(payment.type)}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 font-black text-slate-900">
                        {formatPrice(payment.amount)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={payment.status || "pending"} />
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {payment.date
                          ? new Date(payment.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewDetails(payment)}
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                          title={`View ${getTypeLabel(payment.type)} Details`}
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Showing {(page - 1) * pageSize + 1} to{" "}
                  {Math.min(page * pageSize, totalPayments)} of {totalPayments}{" "}
                  records
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-medium text-slate-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
