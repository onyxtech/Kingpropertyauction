import { MapPin } from "lucide-react";
import AddressAutocomplete from "@/features/shared/components/AddressAutocomplete";
import type { ParsedAddress } from "@/lib/googlePlaces";

export default function StepLocation({ form, updateField }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><MapPin className="size-6 text-green-600" /> Location</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label className="block text-sm font-bold mb-1">Country</label><input type="text" value={form.country} onChange={(e) => updateField("country", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">State *</label><input type="text" value={form.state} onChange={(e) => updateField("state", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">City *</label><input type="text" value={form.city} onChange={(e) => updateField("city", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Area *</label><input type="text" value={form.area} onChange={(e) => updateField("area", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        <div>
          <AddressAutocomplete
            label="Street Address *"
            value={form.streetAddress || ""}
            onChange={(val) => updateField("streetAddress", val)}
            onAddressSelect={(address: ParsedAddress) => {
              if (address.streetAddress) updateField("streetAddress", address.streetAddress);
              if (address.city) updateField("city", address.city);
              if (address.state) updateField("state", address.state);
              if (address.country) updateField("country", address.country);
              if (address.postalCode) updateField("postalCode", address.postalCode);
              if (address.area) updateField("area", address.area);
            }}
            placeholder="e.g., 123 Park Lane, London"
            inputClassName="px-4 py-2.5 text-sm"
          />
        </div>
        <div><label className="block text-sm font-bold mb-1">Postal Code *</label><input type="text" value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
      </div>
    </div>
  );
}