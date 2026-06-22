import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, Building2 } from "lucide-react";
import AddressAutocomplete from "@/features/shared/components/AddressAutocomplete";

export default function UniversalSearch() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  const handleAddressSelect = (data: any) => {
    // Keep the exact selected text from dropdown
    // Address is already set by the autocomplete component
  };

  const handleSearch = () => {
    const term = address.trim();
    if (term) {
      navigate(`/view-all-lots?search=${encodeURIComponent(term)}`);
    }
  };

  return (
    <div className="relative z-30">
      <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Find Your Next Property
            </h2>
            <p className="text-blue-200 text-lg mb-8">
              Search across the UK's premier property auction platform
            </p>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border-2 border-white/20 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <AddressAutocomplete
                    value={address}
                    onChange={setAddress}
                    onAddressSelect={handleAddressSelect}
                    placeholder="Search by city, postcode, or location..."
                    country="gb"
                    className="[&_p]:hidden"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all flex items-center gap-2 flex-shrink-0"
                >
                  <Search className="size-6" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 mt-6 text-white/70 text-sm">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-4 text-blue-300" />
                Properties across the UK
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-blue-300" />
                Search by city or postcode
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}