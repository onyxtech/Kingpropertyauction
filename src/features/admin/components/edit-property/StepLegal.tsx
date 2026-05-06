import { Scale } from "lucide-react";

export default function StepLegal({ form, updateField }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Scale className="size-6 text-amber-600" /> Legal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-bold mb-1">Ownership Type</label><select value={form.ownershipType} onChange={(e) => updateField("ownershipType", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm"><option value="">Select...</option><option value="freehold">Freehold</option><option value="leasehold">Leasehold</option></select></div>
        <div><label className="block text-sm font-bold mb-1">Title Deed Number</label><input type="text" value={form.titleDeedNumber} onChange={(e) => updateField("titleDeedNumber", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Property Tax Info</label><input type="text" value={form.propertyTaxInfo} onChange={(e) => updateField("propertyTaxInfo", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Mortgage Status</label><select value={form.mortgageStatus} onChange={(e) => updateField("mortgageStatus", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm"><option value="clear">Clear</option><option value="mortgaged">Mortgaged</option></select></div>
        <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Zoning Type</label><input type="text" value={form.zoningType} onChange={(e) => updateField("zoningType", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
      </div>
    </div>
  );
}