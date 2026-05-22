import { DollarSign } from "lucide-react";
import { preventMinus } from "@/utils/validation";

export default function StepPricing({ form, updateField }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><DollarSign className="size-6 text-emerald-600" /> Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label className="block text-sm font-bold mb-1">Currency</label><select value={form.currency} onChange={(e) => updateField("currency", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm"><option value="GBP">GBP (£)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option></select></div>
        <div><label className="block text-sm font-bold mb-1">Starting Price *</label><input type="number" min="1" onKeyDown={preventMinus} value={form.startingAuctionPrice} onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) updateField("startingAuctionPrice", v); }} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Reserve Price *</label><input type="number" min="1" onKeyDown={preventMinus} value={form.reservePrice} onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) updateField("reservePrice", v); }} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Buy Now Price</label><input type="number" min="1" onKeyDown={preventMinus} value={form.buyNowPrice} onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) updateField("buyNowPrice", v); }} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Bid Increment *</label><input type="number" min="100" onKeyDown={preventMinus} value={form.minimumBidIncrement} onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) updateField("minimumBidIncrement", v); }} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Est. Market Value</label><input type="number" min="1" onKeyDown={preventMinus} value={form.estimatedMarketValue} onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) updateField("estimatedMarketValue", v); }} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
      </div>
    </div>
  );
}
