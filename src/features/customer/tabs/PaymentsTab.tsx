import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard, Clock, CheckCircle, AlertCircle,
  Phone, Mail, MessageSquare, Calendar,
  PoundSterling, Building2, ArrowDownToLine,
  Hash, TrendingUp, XCircle
} from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";
import { useCustomerRole } from "../hooks/useCustomerRole";
import { apiClient } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/toast";
import { mediaUrl } from "@/lib/mediaUrl";
import { getSocket } from "@/lib/socket";

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  paid: "bg-green-100 text-green-700 border-green-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
  withdrawn: "bg-slate-100 text-slate-600 border-slate-200",
  refunded: "bg-purple-100 text-purple-700 border-purple-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function PaymentsTab() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { canListProperties, canBid, showBuyerView, showSellerView } = useCustomerRole();
  const queryClient = useQueryClient();
  const [requestingId, setRequestingId] =
    useState<string | null>(null);

  useEffect(() => {
    const socket = getSocket();
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
      queryClient.invalidateQueries({ queryKey: ["my-commissions"] });
    };
    socket.on("new_notification", handleUpdate);
    return () => {
      socket.off("new_notification", handleUpdate);
    };
  }, [queryClient]);

  // Fetch payments for buyers
  const { data: paymentsData = [], isLoading: paymentsLoading } =
    useQuery({
      queryKey: ["my-payments"],
      queryFn: async () => {
        const r = await apiClient.fetch("/payments/my");
        return r.success ? r.data : [];
      },
      enabled: canBid,
      refetchInterval: 20000,
      refetchOnWindowFocus: true,
    });

  // Fetch commissions For Owners/agents
  const {
    data: commissionsRes,
    isLoading: commissionsLoading,
  } = useQuery({
    queryKey: ["my-commissions"],
    queryFn: async () => {
      const r = await apiClient.fetch("/commissions/my");
      return r.success ? r : { data: [], stats: {} };
    },
    enabled: canListProperties,
    refetchInterval: 20000,
    refetchOnWindowFocus: true,
  });

  const payments = paymentsData || [];
  const commissions = commissionsRes?.data || [];
  const commissionStats = commissionsRes?.stats || {};

  const handleWithdrawalRequest = async (
    commissionId: string
  ) => {
    setRequestingId(commissionId);
    try {
      const r = await apiClient.fetch(
        `/commissions/${commissionId}/withdraw`,
        { method: "POST" }
      );
      if (r.success) {
        showSuccess(
          "Withdrawal requested! ✅",
          `Expected payment by ${new Date(
            r.data.expectedPaymentDate
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}`
        );
        queryClient.invalidateQueries({
          queryKey: ["my-commissions"],
        });
      } else {
        showError("Cannot withdraw", r.message);
      }
    } catch (e: any) {
      showError("Failed", e.message);
    } finally {
      setRequestingId(null);
    }
  };

  const pendingPayments = payments.filter(
    (p: any) => p.status === "pending"
  );
  const overduePayments = payments.filter(
    (p: any) => p.status === "overdue"
  );
  const paidPayments = payments.filter(
    (p: any) => p.status === "paid"
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900">
          {showSellerView ? "Commission & Earnings" : "My Payments"}
        </h2>
        <p className="text-slate-600 font-medium mt-1">
          {showSellerView ? "Track your commission earnings" : "Track your auction payments"}
        </p>
      </div>

      {/* BUYER - Payments Section */}
      {showBuyerView && (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <CreditCard className="size-5 text-blue-600" />
            My Payments
          </h3>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-yellow-700">
                {pendingPayments.length}
              </p>
              <p className="text-xs font-bold text-yellow-600 mt-1">
                Pending
              </p>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-red-700">
                {overduePayments.length}
              </p>
              <p className="text-xs font-bold text-red-600 mt-1">
                Overdue
              </p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-green-700">
                {paidPayments.length}
              </p>
              <p className="text-xs font-bold text-green-600 mt-1">
                Paid
              </p>
            </div>
          </div>

          {paymentsLoading ? (
            <p className="text-center py-8 text-slate-400">
              Loading payments...
            </p>
          ) : payments.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-10 text-center">
              <CreditCard className="size-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-500">
                No payment records yet
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Payments appear here after winning an auction
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment: any) => {
                const dueDateTime = payment.dueDateTime
                  ? new Date(payment.dueDateTime)
                  : payment.dueDate
                  ? new Date(payment.dueDate)
                  : null;
                const isOverdue =
                  dueDateTime &&
                  dueDateTime < new Date() &&
                  payment.status === "pending";

                return (
                  <div
                    key={payment._id}
                    className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${
                      payment.status === "overdue" || isOverdue
                        ? "border-red-200"
                        : payment.status === "paid"
                        ? "border-green-200"
                        : payment.status === "withdrawn"
                        ? "border-slate-200"
                        : "border-amber-200"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Image */}
                        <div className="size-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          {payment.property?.media
                            ?.propertyImages?.[0] ? (
                            <img
                              src={mediaUrl(
                                payment.property.media
                                  .propertyImages[0]
                              )}
                              className="size-full object-cover"
                              alt=""
                            />
                          ) : (
                            <Building2 className="size-7 text-slate-300 m-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-black text-slate-900 truncate">
                              {payment.property
                                ?.propertyTitle || "Property"}
                            </h4>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 border ${
                                PAYMENT_STATUS_STYLES[
                                  payment.status
                                ] ||
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {payment.status === "withdrawn"
                                ? "❌ Withdrawn"
                                : payment.status === "paid"
                                ? "✅ Paid"
                                : isOverdue
                                ? "⚠️ Overdue"
                                : "⏳ Pending"}
                            </span>
                          </div>

                          <p className="text-2xl font-black text-slate-900 mt-1">
                            £{payment.amount?.toLocaleString()}
                          </p>

                          {payment.auction?.auctionTitle && (
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                              <Hash className="size-3" />
                              {payment.auction.auctionTitle}
                            </p>
                          )}

                          {/* Status messages */}
                          {payment.status === "pending" &&
                            dueDateTime && (
                              <div
                                className={`mt-3 p-3 rounded-xl ${
                                  isOverdue
                                    ? "bg-red-50 border border-red-200"
                                    : "bg-amber-50 border border-amber-200"
                                }`}
                              >
                                <p
                                  className={`text-xs font-bold ${
                                    isOverdue
                                      ? "text-red-700"
                                      : "text-amber-700"
                                  }`}
                                >
                                  {isOverdue
                                    ? `⚠️ Payment overdue since ${dueDateTime.toUTCString()}`
                                    : `⏰ Due by: ${dueDateTime.toUTCString()}`}
                                </p>
                                {!isOverdue && (
                                  <p className="text-xs text-amber-600 mt-1">
                                    Our team will contact you
                                    to arrange payment. Please
                                    get your funds ready.
                                  </p>
                                )}
                              </div>
                            )}

                          {payment.status === "withdrawn" && (
                            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                              <p className="text-xs font-bold text-slate-600">
                                ❌ You have been withdrawn
                                from this purchase. The
                                property will be offered to
                                the next bidder.
                              </p>
                              {payment.withdrawnAt && (
                                <p className="text-xs text-slate-400 mt-1">
                                  Withdrawn:{" "}
                                  {new Date(
                                    payment.withdrawnAt
                                  ).toLocaleDateString("en-GB")}
                                </p>
                              )}
                            </div>
                          )}

                          {payment.status === "paid" && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                              <p className="text-xs font-bold text-green-700">
                                ✅ Payment confirmed.
                                {payment.paidAt &&
                                  ` Paid on ${new Date(
                                    payment.paidAt
                                  ).toLocaleDateString("en-GB")}`}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Payment History Table */}
          {payments.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-black text-slate-800 flex items-center gap-2">
                  <CreditCard className="size-4 text-blue-600" />
                  Payment History
                </h4>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  {payments.length} record(s)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {["Property", "Amount", "Status", "Due Date", "Paid Date"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {payments.map((p: any) => (
                      <tr key={p._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900 truncate max-w-32">
                            {p.property?.propertyTitle || "—"}
                          </p>
                          {p.auction?.auctionTitle && (
                            <p className="text-xs text-slate-400 truncate max-w-32 mt-0.5">
                              {p.auction.auctionTitle}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 font-black text-slate-900 whitespace-nowrap">
                          £{p.amount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                            p.status === "paid" ? "bg-green-100 text-green-700"
                            : p.status === "overdue" ? "bg-red-100 text-red-700"
                            : p.status === "withdrawn" ? "bg-slate-100 text-slate-600"
                            : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {p.status === "paid" ? "✅ Paid"
                              : p.status === "overdue" ? "⚠️ Overdue"
                              : p.status === "withdrawn" ? "❌ Withdrawn"
                              : "⏳ Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                          {p.dueDate ? new Date(p.dueDate).toLocaleDateString("en-GB") : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                          {p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-GB") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SELLER/AGENT - Commissions Section */}
      {showSellerView && (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <PoundSterling className="size-5 text-emerald-600" />
            Commission Earnings
          </h3>

          {/* Commission Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Earned", value: commissionStats.total || 0, gradient: "from-emerald-500 to-teal-600", Icon: TrendingUp },
              { label: "Awaiting Approval", value: commissionStats.pending || 0, gradient: "from-yellow-500 to-orange-500", Icon: Clock },
              { label: "Ready to Withdraw", value: commissionStats.approved || 0, gradient: "from-blue-500 to-indigo-600", Icon: ArrowDownToLine },
              { label: "Received", value: commissionStats.paid || 0, gradient: "from-green-500 to-emerald-600", Icon: CheckCircle },
            ].map(s => (
              <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-4 text-white`}>
                <s.Icon className="size-5 text-white/80 mb-2" />
                <p className="text-xl font-black">£{s.value.toLocaleString()}</p>
                <p className="text-xs text-white/80 font-bold">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
            <p className="text-sm font-bold text-blue-800 flex items-start gap-2">
              <ArrowDownToLine className="size-4 flex-shrink-0 mt-0.5 text-blue-600" />
              <span>
                <strong>How withdrawals work:</strong> Request
                a withdrawal anytime. Funds will be
                transferred to your registered bank account
                within 30 days of your request.
              </span>
            </p>
          </div>

          {commissionsLoading ? (
            <p className="text-center py-8 text-slate-400">
              Loading commissions...
            </p>
          ) : commissions.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-10 text-center">
              <PoundSterling className="size-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-500">
                No commissions yet
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Commissions appear when your properties sell
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {commissions.map((commission: any) => {
                const expectedDate = commission
                  .withdrawalRequest?.expectedPaymentDate
                  ? new Date(
                      commission.withdrawalRequest
                        .expectedPaymentDate
                    )
                  : null;
                const hasWithdrawal =
                  commission.withdrawalRequest?.requested;

                return (
                  <div
                    key={commission._id}
                    className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-slate-900 truncate">
                          {commission.property
                            ?.propertyTitle || "Property"}
                        </h4>

                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xl font-black text-emerald-700">
                            £
                            {commission.commissionAmount?.toLocaleString()}
                          </p>
                          <span className="text-xs text-slate-400">
                            {commission.commissionRate}% of £
                            {commission.salePrice?.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                              commission.status === "paid"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : commission.status === "approved"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : commission.status === "voided"
                                ? "bg-orange-100 text-orange-700 border-orange-200"
                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                            }`}
                          >
                            {commission.status === "paid"
                              ? "✅ Received"
                              : commission.status === "approved"
                              ? "✔ Approved"
                              : commission.status === "voided"
                              ? "❌ Voided - Buyer Withdrew"
                              : "⏳ Awaiting Approval"}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(
                              commission.createdAt
                            ).toLocaleDateString("en-GB")}
                          </span>
                          {commission.auction
                            ?.auctionTitle && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Hash className="size-3" />
                              {commission.auction.auctionTitle}
                            </span>
                          )}
                        </div>

                        {/* Withdrawal status */}
                        {hasWithdrawal &&
                          expectedDate &&
                          commission.status !== "paid" && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                              <p className="text-xs font-bold text-blue-700">
                                ⏳ Withdrawal requested on{" "}
                                {new Date(
                                  commission.withdrawalRequest.requestedAt
                                ).toLocaleDateString("en-GB")}
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                Expected payment by:{" "}
                                <strong>
                                  {expectedDate.toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )}
                                </strong>
                              </p>
                            </div>
                          )}

                        {commission.status === "paid" &&
                          commission.paidAt && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                              <p className="text-xs font-bold text-green-700">
                                ✅ Funds transferred on{" "}
                                {new Date(
                                  commission.paidAt
                                ).toLocaleDateString("en-GB")}
                              </p>
                            </div>
                          )}

                        {commission.status === "voided" && (
                          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                            <p className="text-xs text-orange-600 font-medium">
                              The buyer withdrew from this purchase. This commission has been voided. If the property is re-assigned to a new buyer, a new commission will be created.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Withdrawal button */}
                      <div className="flex-shrink-0">
                        {commission.status === "paid" ? (
                          <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-xl text-xs font-bold flex items-center gap-1">
                            <CheckCircle className="size-3" />
                            Received
                          </span>
                        ) : hasWithdrawal ? (
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1">
                            <Clock className="size-3" />
                            Processing
                          </span>
                        ) : commission.status === "approved" ? (
                          <button
                            onClick={() => handleWithdrawalRequest(commission._id)}
                            disabled={requestingId === commission._id}
                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center gap-1"
                          >
                            <ArrowDownToLine className="size-3" />
                            {requestingId === commission._id ? "Requesting..." : "Request Withdrawal"}
                          </button>
                        ) : commission.status === "voided" ? (
                          <span
                            className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-xl text-xs font-bold flex items-center gap-1"
                            title="Commission voided - buyer withdrew"
                          >
                            <XCircle className="size-3" />
                            Voided
                          </span>
                        ) : (
                          <span
                            className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold flex items-center gap-1"
                            title="Awaiting admin approval"
                          >
                            <Clock className="size-3" />
                            Awaiting Approval
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Withdrawal History */}
          {commissions.some((c: any) => c.withdrawalRequest?.requested) && (
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h4 className="font-black text-slate-800 flex items-center gap-2">
                  <Clock className="size-4 text-blue-600" />
                  Withdrawal History
                </h4>
              </div>
              <div className="divide-y divide-slate-100">
                {commissions
                  .filter((c: any) => c.withdrawalRequest?.requested)
                  .map((c: any) => (
                    <div key={c._id} className="flex items-center justify-between p-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm truncate">
                          {c.property?.propertyTitle}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Requested: {new Date(c.withdrawalRequest.requestedAt).toLocaleDateString("en-GB")}
                        </p>
                        {c.withdrawalRequest.expectedPaymentDate && (
                          <p className="text-xs text-blue-600 font-bold mt-0.5">
                            Expected by:{" "}
                            {new Date(c.withdrawalRequest.expectedPaymentDate).toLocaleDateString("en-GB", {
                              day: "2-digit", month: "long", year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="font-black text-emerald-700">
                          £{c.commissionAmount?.toLocaleString()}
                        </p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          c.status === "paid" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {c.status === "paid" ? "✅ Transferred" : "⏳ Processing"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact section */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-6">
        <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2">
          <Phone className="size-5 text-blue-600" />
          Payment Support
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Questions about payments or withdrawals? Contact
          our team.
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <a
            href="tel:+441234567890"
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
          >
            <Phone className="size-4 text-blue-600" />
            <div>
              <p className="text-xs text-slate-500 font-bold">
                Call
              </p>
              <p className="text-sm font-black text-slate-900">
                +44 123 456 7890
              </p>
            </div>
          </a>
          <a
            href="mailto:payments@kingproperty.com"
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all"
          >
            <Mail className="size-4 text-green-600" />
            <div>
              <p className="text-xs text-slate-500 font-bold">
                Email
              </p>
              <p className="text-sm font-black text-slate-900">
                payments@kingproperty.com
              </p>
            </div>
          </a>
          <button
            onClick={() => navigate("/dashboard/messages")}
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all"
          >
            <MessageSquare className="size-4 text-purple-600" />
            <div className="text-left">
              <p className="text-xs text-slate-500 font-bold">
                Chat
              </p>
              <p className="text-sm font-black text-slate-900">
                Live Support
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
