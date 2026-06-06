import { useNavigate } from "react-router";
import { Trophy, Gavel, Eye, CheckCircle, Clock } from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";
import { useCustomerApi } from "../api/useCustomerApi";

const PAYMENT_STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Payment Pending" },
  paid: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
  overdue: { bg: "bg-red-100", text: "text-red-700", label: "Overdue" },
};

export default function WonAuctionsTab() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { useMyPayments, useMyBids } = useCustomerApi();
  const { data: payments = [], isLoading: loadingPayments } = useMyPayments();
  const { data: bids = [], isLoading: loadingBids } = useMyBids();

  const wonBids = Array.isArray(bids) ? bids.filter((b: any) => b.status === "won") : [];
  const isLoading = loadingPayments || loadingBids;

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
      ) : wonBids.length === 0 ? (
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
          {wonBids.map((bid: any) => {
            const payment = Array.isArray(payments)
              ? payments.find((p: any) =>
                  p.auction?._id === bid.auction?._id || p.auction === bid.auction?._id
                )
              : null;
            const payStatus = payment?.status || "pending";
            const statusStyle = PAYMENT_STATUS_STYLES[payStatus] || PAYMENT_STATUS_STYLES.pending;

            return (
              <div
                key={bid._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="flex items-start gap-4 p-5">
                  {bid.property?.media?.propertyImages?.[0] ? (
                    <img
                      src={bid.property.media.propertyImages[0]}
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
                          {bid.property?.propertyTitle || "Property"}
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {bid.auction?.auctionTitle || "Auction"}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black flex-shrink-0 ${statusStyle.bg} ${statusStyle.text}`}>
                        {payStatus === "paid" ? <span className="flex items-center gap-1"><CheckCircle className="size-3" /> {statusStyle.label}</span> : <span className="flex items-center gap-1"><Clock className="size-3" /> {statusStyle.label}</span>}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <p className="text-xs text-slate-500">Winning bid</p>
                        <p className="text-base font-black text-green-700">£{bid.amount?.toLocaleString()}</p>
                      </div>
                      {payment?.dueDate && (
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
                        onClick={() => navigate(`/properties/${bid.property?.slug || bid.property?._id}`)}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
