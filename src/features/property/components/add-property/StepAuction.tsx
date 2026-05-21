import { Gavel } from "lucide-react";

interface StepAuctionProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  theme: { primary: string };
}

export default function StepAuction({ formData, handleInputChange, theme }: StepAuctionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
        >
          <Gavel className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Auction Details
          </h2>
          <p className="text-slate-600 font-medium">
            Configure auction settings and timeline
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Auction Status *
          </label>
          <select
            value={formData.auctionStatus}
            onChange={(e) =>
              handleInputChange("auctionStatus", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Bid Deposit Amount (£)
          </label>
          <input
            type="number"
            placeholder="e.g., 10000"
            value={formData.bidDepositAmount}
            onChange={(e) =>
              handleInputChange("bidDepositAmount", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Maximum Bid Limit (Optional)
          </label>
          <input
            type="number"
            placeholder="No limit if empty"
            value={formData.maximumBidLimit}
            onChange={(e) =>
              handleInputChange("maximumBidLimit", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Number of Bidders
          </label>
          <input
            type="number"
            placeholder="0"
            value={formData.numberOfBidders}
            onChange={(e) =>
              handleInputChange("numberOfBidders", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={formData.autoBidEnabled}
              onChange={(e) =>
                handleInputChange("autoBidEnabled", e.target.checked)
              }
              className="size-5 rounded accent-blue-600"
            />
            <div>
              <span className="text-sm font-bold text-slate-700 block">
                Enable Auto Bid
              </span>
              <span className="text-xs text-slate-500">
                Allow bidders to set automatic bidding up to their
                maximum
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}