import { UserCheck } from "lucide-react";

export default function StepSeller({ form, updateField }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><UserCheck className="size-6 text-cyan-600" /> Seller & Agent</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-bold mb-1">Seller Name *</label><input type="text" value={form.sellerName} onChange={(e) => updateField("sellerName", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Seller Contact *</label><input type="text" value={form.sellerContact} onChange={(e) => updateField("sellerContact", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Seller Email *</label><input type="email" value={form.sellerEmail} onChange={(e) => updateField("sellerEmail", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Agent Name</label><input type="text" value={form.agentName} onChange={(e) => updateField("agentName", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Agent Contact</label><input type="text" value={form.agentContact} onChange={(e) => updateField("agentContact", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
      </div>
    </div>
  );
}