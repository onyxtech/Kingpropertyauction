import { Star } from "lucide-react";

export default function StepFeatures({ form, updateField }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Star className="size-6 text-yellow-600" /> Features & Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["garden","swimmingPool","balcony","airConditioning","securitySystem","elevator","gym","solarSystem"].map((key) => (
          <label key={key} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
            <input type="checkbox" checked={form.features?.[key] || false} onChange={(e) => updateField("features", { ...form.features, [key]: e.target.checked })} className="size-5 rounded accent-blue-600" />
            <span className="text-sm font-bold text-slate-700 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
          </label>
        ))}
      </div>
    </div>
  );
}