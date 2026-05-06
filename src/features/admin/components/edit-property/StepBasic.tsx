import { Building2 } from "lucide-react";

export default function StepBasic({ form, updateField }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Building2 className="size-6 text-blue-600" /> Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-1">Property Title *</label>
          <input type="text" value={form.propertyTitle} onChange={(e) => updateField("propertyTitle", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-1">Description *</label>
          <textarea rows={3} value={form.propertyDescription} onChange={(e) => updateField("propertyDescription", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
          <select value={form.propertyType} onChange={(e) => updateField("propertyType", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm">
            <option value="house">House</option><option value="apartment">Apartment</option>
            <option value="land">Land</option><option value="commercial">Commercial</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
          <select value={form.propertyCategory} onChange={(e) => updateField("propertyCategory", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm">
            <option value="residential">Residential</option><option value="commercial">Commercial</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Listing Type</label>
          <select value={form.listingType} onChange={(e) => updateField("listingType", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm">
            <option value="auction">Auction</option><option value="direct_sale">Direct Sale</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
          <select value={form.propertyStatus} onChange={(e) => updateField("propertyStatus", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm">
            <option value="available">Available</option><option value="sold">Sold</option><option value="pending">Pending</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Approval Status</label>
          <select value={form.approvalStatus} onChange={(e) => updateField("approvalStatus", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm">
            <option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
    </div>
  );
}