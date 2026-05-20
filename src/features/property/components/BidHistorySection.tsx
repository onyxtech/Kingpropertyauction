import { Gavel } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BidHistorySectionProps {
  show: boolean;
  history: any;
  loading: boolean;
  onToggle: () => void;
}

export default function BidHistorySection({
  show,
  history,
  loading,
  onToggle,
}: BidHistorySectionProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <Gavel className="size-6 text-red-600" />
          Bid History
        </h2>
        <button
          onClick={onToggle}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            show
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {show ? "Hide" : "View"} History
        </button>
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin size-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
              </div>
            ) : history?.bids?.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.bids.map((bid: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {bid.bidder?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {bid.bidder?.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(bid.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-green-600">
                        £{bid.amount?.toLocaleString()}
                      </p>
                      <span
                        className={`text-xs font-bold ${
                          bid.status === "winning"
                            ? "text-green-600"
                            : "text-slate-500"
                        }`}
                      >
                        {bid.status === "winning" ? "🏆 Winning" : bid.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-slate-500 py-4">
                No bids yet.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
