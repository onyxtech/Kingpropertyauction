import { DollarSign, Info } from "lucide-react";

interface StepPricingProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  theme: { primary: string };
}

export default function StepPricing({ formData, handleInputChange, theme }: StepPricingProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
        >
          <DollarSign className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Pricing Information
          </h2>
          <p className="text-slate-600 font-medium">
            Set pricing and value estimates
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Currency *
          </label>
          <select
            value={formData.currency}
            onChange={(e) =>
              handleInputChange("currency", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="GBP">GBP (£)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Starting Auction Price *
          </label>
          <input
            type="number"
            placeholder="e.g., 500000"
            value={formData.startingAuctionPrice}
            onChange={(e) =>
              handleInputChange("startingAuctionPrice", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Reserve Price *
          </label>
          <input
            type="number"
            placeholder="e.g., 600000"
            value={formData.reservePrice}
            onChange={(e) =>
              handleInputChange("reservePrice", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Buy Now Price (Optional)
          </label>
          <input
            type="number"
            placeholder="e.g., 750000"
            value={formData.buyNowPrice}
            onChange={(e) =>
              handleInputChange("buyNowPrice", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Minimum Bid Increment *
          </label>
          <input
            type="number"
            placeholder="e.g., 5000"
            value={formData.minimumBidIncrement}
            onChange={(e) =>
              handleInputChange("minimumBidIncrement", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Estimated Market Value
          </label>
          <input
            type="number"
            placeholder="e.g., 700000"
            value={formData.estimatedMarketValue}
            onChange={(e) =>
              handleInputChange("estimatedMarketValue", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-blue-900 mb-1">
              Pricing Guidelines
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • <strong>Starting Price:</strong> Attractive opening
                bid to encourage participation
              </li>
              <li>
                • <strong>Reserve Price:</strong> Minimum price you're
                willing to accept
              </li>
              <li>
                • <strong>Buy Now:</strong> Fixed price for immediate
                purchase (optional)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}