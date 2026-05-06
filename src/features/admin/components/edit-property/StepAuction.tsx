import { Gavel } from "lucide-react";

export default function StepAuction({ form, updateField }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Gavel className="size-6 text-orange-600" /> Auction Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-bold mb-1">Start Date *</label><input type="datetime-local" value={form.auctionStartDate} onChange={(e) => updateField("auctionStartDate", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">End Date *</label><input type="datetime-local" value={form.auctionEndDate} onChange={(e) => updateField("auctionEndDate", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Status</label><select value={form.auctionStatus} onChange={(e) => updateField("auctionStatus", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm"><option value="upcoming">Upcoming</option><option value="live">Live</option><option value="closed">Closed</option></select></div>
        <div><label className="block text-sm font-bold mb-1">Bid Deposit (£)</label><input type="number" value={form.bidDepositAmount} onChange={(e) => updateField("bidDepositAmount", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Max Bid Limit</label><input type="number" value={form.maximumBidLimit} onChange={(e) => updateField("maximumBidLimit", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div className="flex items-center gap-3 pt-6">
          <input type="checkbox" checked={form.autoBidEnabled} onChange={(e) => updateField("autoBidEnabled", e.target.checked)} className="size-5 rounded accent-blue-600" />
          <span className="text-sm font-bold">Enable Auto Bid</span>
        </div>
      </div>
    </div>
  );
}