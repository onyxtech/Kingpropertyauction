import { Home, Square, Bed, Bath, Calendar, Car } from "lucide-react";

export default function StepSpecifications({ form, updateField }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Home className="size-6 text-purple-600" /> Specifications</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div><label className="block text-sm font-bold mb-1"><Square className="size-3 inline mr-1" />Total Area (sq ft) *</label><input type="number" value={form.totalArea} onChange={(e) => updateField("totalArea", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Land Area</label><input type="number" value={form.landArea} onChange={(e) => updateField("landArea", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Covered Area</label><input type="number" value={form.coveredArea} onChange={(e) => updateField("coveredArea", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1"><Bed className="size-3 inline mr-1" />Bedrooms *</label><input type="number" value={form.bedrooms} onChange={(e) => updateField("bedrooms", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1"><Bath className="size-3 inline mr-1" />Bathrooms *</label><input type="number" value={form.bathrooms} onChange={(e) => updateField("bathrooms", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Floors</label><input type="number" value={form.floors} onChange={(e) => updateField("floors", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1"><Calendar className="size-3 inline mr-1" />Year Built</label><input type="number" value={form.yearBuilt} onChange={(e) => updateField("yearBuilt", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1"><Car className="size-3 inline mr-1" />Parking</label><input type="number" value={form.parkingSpaces} onChange={(e) => updateField("parkingSpaces", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div>
          <label className="block text-sm font-bold mb-1">Furnished</label>
          <select value={form.furnishedStatus} onChange={(e) => updateField("furnishedStatus", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm">
            <option value="unfurnished">Unfurnished</option><option value="semi-furnished">Semi</option><option value="fully-furnished">Fully</option>
          </select>
        </div>
      </div>
    </div>
  );
}