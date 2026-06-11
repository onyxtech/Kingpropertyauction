import { useNavigate } from "react-router";
import { mediaUrl } from "@/lib/mediaUrl";
import { Trophy, Gavel, Eye, CheckCircle, Clock, X } from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";
import { useCustomerApi } from "../api/useCustomerApi";

const PAYMENT_STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Payment Pending" },
  paid: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
  overdue: { bg: "bg-red-100", text: "text-red-700", label: "Overdue" },
  withdrawn: { bg: "bg-orange-100", text: "text-orange-700", label: "❌ Withdrawn" },
};

export default function WonAuctionsTab() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { useMyPayments } = useCustomerApi();
  const { data: payments = [], isLoading } = useMyPayments();

  const paymentList = Array.isArray(payments) ? payments : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Trophy className="size-8 text-amber-500" />
          Won Auctions
        </h2>
        <p className="text-slate-600 font-medium mt-1">Auctions you've won and payment status</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : paymentList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
          <Trophy className="size-14 mx-auto mb-4 text-amber-300 opacity-60" />
          <p className="text-lg font-black text-slate-700">No won auctions yet</p>
          <p className="text-slate-400 text-sm mt-1">Properties you win at auction will appear here</p>
          <button
            onClick={() => navigate("/auctions")}
            className={`mt-6 px-6 py-2.5 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity`}
          >
            Browse Auctions
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentList.map((payment: any) => {
            const payStatus = payment.status || "pending";
            const statusStyle = PAYMENT_STATUS_STYLES[payStatus] || PAYMENT_STATUS_STYLES.pending;

            return (
              <div
                key={payment._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="flex items-start gap-4 p-5">
                  {payment.property?.media?.propertyImages?.[0] ? (
                    <img
                      src={mediaUrl(payment.property.media.propertyImages[0])}
                      className="size-20 rounded-xl object-cover flex-shrink-0"
                      alt=""
                    />
                  ) : (
                    <div className="size-20 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Gavel className="size-8 text-amber-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-black text-slate-900">
                          {payment.property?.propertyTitle || "Property"}
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {payment.auction?.auctionTitle || "Auction"}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black flex-shrink-0 ${statusStyle.bg} ${statusStyle.text}`}>
                        {payStatus === "paid"
                          ? <span className="flex items-center gap-1"><CheckCircle className="size-3" /> {statusStyle.label}</span>
                          : payStatus === "withdrawn"
                          ? <span className="flex items-center gap-1"><X className="size-3" /> {statusStyle.label}</span>
                          : <span className="flex items-center gap-1"><Clock className="size-3" /> {statusStyle.label}</span>}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <p className="text-xs text-slate-500">Sale price</p>
                        <p className="text-base font-black text-green-700">£{payment.amount?.toLocaleString()}</p>
                      </div>
                      {payment.dueDate && (
                        <div>
                          <p className="text-xs text-slate-500">Due date</p>
                          <p className="text-sm font-bold text-slate-900">
                            {new Date(payment.dueDate).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => navigate(`/properties/${payment.property?.slug || payment.property?._id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="size-3.5" /> View Property
                      </button>
                    </div>
                  </div>
                </div>

                {payStatus === "pending" && (
                  <div className="px-5 py-3 bg-amber-50 border-t border-amber-100">
                    <p className="text-xs text-amber-700 font-bold">
                      🎉 Congratulations on winning! Our team will contact you within 24–48 hours to arrange payment.
                    </p>
                  </div>
                )}
                {payStatus === "withdrawn" && (
                  <div className="px-5 py-3 bg-orange-50 border-t border-orange-100">
                    <p className="text-xs text-orange-700 font-bold">
                      ⚠️ You have been withdrawn from this property. Contact our team if you have questions.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
