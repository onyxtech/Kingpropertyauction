import { MapPin, Globe } from "lucide-react";

export default function StepLocation({ form, updateField }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><MapPin className="size-6 text-green-600" /> Location</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label className="block text-sm font-bold mb-1">Country</label><input type="text" value={form.country} onChange={(e) => updateField("country", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">State *</label><input type="text" value={form.state} onChange={(e) => updateField("state", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">City *</label><input type="text" value={form.city} onChange={(e) => updateField("city", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Area *</label><input type="text" value={form.area} onChange={(e) => updateField("area", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Street Address *</label><input type="text" value={form.streetAddress} onChange={(e) => updateField("streetAddress", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Postal Code *</label><input type="text" value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1"><Globe className="size-3 inline mr-1" />Latitude</label><input type="text" value={form.latitude} onChange={(e) => updateField("latitude", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1"><Globe className="size-3 inline mr-1" />Longitude</label><input type="text" value={form.longitude} onChange={(e) => updateField("longitude", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
      </div>
    </div>
  );
}