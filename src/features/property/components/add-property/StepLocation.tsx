import { MapPin } from "lucide-react";
import AddressAutocomplete from "@/features/shared/components/AddressAutocomplete";
import type { ParsedAddress } from "@/lib/googlePlaces";

interface StepLocationProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  theme: { primary: string };
}

export default function StepLocation({
  formData,
  handleInputChange,
  theme,
}: StepLocationProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
        >
          <MapPin className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Location Details
          </h2>
          <p className="text-slate-600 font-medium">
            Specify the property location
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Country *
          </label>
          <input
            type="text"
            placeholder="United Kingdom"
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            State / Province *
          </label>
          <input
            type="text"
            placeholder="e.g., England"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            City *
          </label>
          <input
            type="text"
            placeholder="e.g., London"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Area / Neighborhood *
          </label>
          <input
            type="text"
            placeholder="e.g., Mayfair"
            value={formData.area}
            onChange={(e) => handleInputChange("area", e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="md:col-span-2">
          <AddressAutocomplete
            label="Street Address"
            required
            value={formData.streetAddress || ""}
            onChange={(val) => handleInputChange("streetAddress", val)}
            onAddressSelect={(address: ParsedAddress) => {
              if (address.streetAddress)
                handleInputChange("streetAddress", address.streetAddress);
              if (address.city) handleInputChange("city", address.city);
              if (address.postalCode)
                handleInputChange("postalCode", address.postalCode);
              if (address.state) handleInputChange("state", address.state);
              if (address.lat) handleInputChange("latitude", address.lat);
              if (address.lng) handleInputChange("longitude", address.lng);
              if (address.city) handleInputChange("city", address.city);
              if (address.state) handleInputChange("state", address.state);
              if (address.country)
                handleInputChange("country", address.country);
              if (address.postalCode)
                handleInputChange("postalCode", address.postalCode);
              if (address.area) handleInputChange("area", address.area);
            }}
            placeholder="e.g., 123 Park Lane, London"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            placeholder="e.g., W1K 1AA"
            value={formData.postalCode}
            onChange={(e) =>
              handleInputChange("postalCode", e.target.value.toUpperCase())
            }
            maxLength={8}
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            UK postcode format (e.g. SW1A 1AA)
          </p>
        </div>
      </div>
    </div>
  );
}
