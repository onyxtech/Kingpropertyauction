import { Scale } from "lucide-react";

export default function StepLegal({ form, updateField }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Scale className="size-6 text-amber-600" /> Legal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-bold mb-1">Ownership Type</label><select value={form.ownershipType} onChange={(e) => updateField("ownershipType", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm"><option value="">Select...</option><option value="freehold">Freehold</option><option value="leasehold">Leasehold</option></select></div>
        <div><label className="block text-sm font-bold mb-1">Title Deed Number</label><input type="text" value={form.titleDeedNumber} onChange={(e) => updateField("titleDeedNumber", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
      </div>
    </div>
  );
}