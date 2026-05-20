import { X } from "lucide-react";

interface PropertyResult {
  id: string;
  title: string;
  status: "sold" | "unsold";
  soldPrice: string;
  winnerName: string;
  winnerEmail: string;
}

interface LiveRoomResultsModalProps {
  show: boolean;
  resultsAuction: any | null;
  propertyResults: PropertyResult[];
  setPropertyResults: (results: PropertyResult[]) => void;
  savingResults: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function LiveRoomResultsModal({
  show,
  resultsAuction,
  propertyResults,
  setPropertyResults,
  savingResults,
  onSave,
  onClose,
}: LiveRoomResultsModalProps) {
  if (!show || !resultsAuction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">Enter Auction Results</h3>
            <p className="text-sm text-slate-500">{resultsAuction.auctionTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="size-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="size-4 text-slate-600" />
          </button>
        </div>
        {propertyResults.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No properties found for this auction.</p>
        ) : (
          <div className="space-y-4">
            {propertyResults.map((prop, idx) => (
              <div key={prop.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-3">{prop.title || `Property ${idx + 1}`}</h4>
                <div className="flex gap-3 mb-3">
                  <button
                    onClick={() =>
                      setPropertyResults(
                        propertyResults.map((p, i) => i === idx ? { ...p, status: "sold" } : p)
                      )
                    }
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${prop.status === "sold" ? "bg-green-600 text-white" : "bg-slate-200 text-slate-600 hover:bg-green-100"}`}
                  >
                    Sold
                  </button>
                  <button
                    onClick={() =>
                      setPropertyResults(
                        propertyResults.map((p, i) => i === idx ? { ...p, status: "unsold" } : p)
                      )
                    }
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${prop.status === "unsold" ? "bg-red-500 text-white" : "bg-slate-200 text-slate-600 hover:bg-red-100"}`}
                  >
                    Unsold
                  </button>
                </div>
                {prop.status === "sold" && (
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Sold price (£)"
                      value={prop.soldPrice}
                      onChange={e =>
                        setPropertyResults(
                          propertyResults.map((p, i) => i === idx ? { ...p, soldPrice: e.target.value } : p)
                        )
                      }
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-green-400"
                    />
                    <input
                      type="text"
                      placeholder="Winner name"
                      value={prop.winnerName}
                      onChange={e =>
                        setPropertyResults(
                          propertyResults.map((p, i) => i === idx ? { ...p, winnerName: e.target.value } : p)
                        )
                      }
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-green-400"
                    />
                    <input
                      type="email"
                      placeholder="Winner email (for notification)"
                      value={prop.winnerEmail}
                      onChange={e =>
                        setPropertyResults(
                          propertyResults.map((p, i) => i === idx ? { ...p, winnerEmail: e.target.value } : p)
                        )
                      }
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-green-400"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onSave}
            disabled={savingResults}
            className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingResults ? "Saving..." : "Save Results & Send Emails"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
