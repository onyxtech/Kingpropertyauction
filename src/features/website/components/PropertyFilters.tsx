import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  X,
  Home,
  MapPin,
  Bed,
  Bath,
} from "lucide-react";
import AddressAutocomplete from "@/features/shared/components/AddressAutocomplete";
import type { ParsedAddress } from "@/lib/googlePlaces";

interface Filters {
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  minBeds: string;
  maxBeds: string;
  minBaths: string;
  searchQuery: string;
}

interface PropertyFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export default function PropertyFilters({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
}: PropertyFiltersProps) {
  const activeFilterCount = Object.values(filters).filter(
    (val) => val !== "",
  ).length;

  return (
    <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200 relative z-10 py-8">
      <div className="container mx-auto px-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-6 text-slate-400" />
              <input
                type="text"
                placeholder="🔍 Search by location, postcode, or property ID..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters({ ...filters, searchQuery: e.target.value })
                }
                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400 shadow-lg text-lg"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-8 py-5 bg-white border-2 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-lg ${showFilters ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}
            >
              <SlidersHorizontal
                className={`size-6 ${showFilters ? "text-blue-600" : "text-slate-600"}`}
              />
              <span
                className={`text-base font-semibold ${showFilters ? "text-blue-600" : "text-slate-700"}`}
              >
                Filters
              </span>
              {activeFilterCount > 0 && (
                <span className="size-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                const grid = document.getElementById("property-grid");
                if (grid)
                  grid.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center gap-2"
            >
              Search
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden animate-in slide-in-from-top-4 duration-300">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <SlidersHorizontal className="size-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-lg">
                        Advanced Filters
                      </h3>
                      <p className="text-white/80 text-xs font-medium">
                        Refine your property search
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setFilters({
                        propertyType: "",
                        minPrice: "",
                        maxPrice: "",
                        location: "",
                        minBeds: "",
                        maxBeds: "",
                        minBaths: "",
                        searchQuery: filters.searchQuery,
                      })
                    }
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-bold transition-all flex items-center gap-2"
                  >
                    <X className="size-4" />
                    Clear All
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Home className="size-4 text-blue-600" />
                    Property Type
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) =>
                      setFilters({ ...filters, propertyType: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 shadow-sm hover:border-slate-300"
                  >
                    <option value="">All Types</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                    <option value="farmhouse">Farmhouse</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-emerald-600">£</span>
                    Min Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === "E")
                        e.preventDefault();
                    }}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: e.target.value })
                    }
                    placeholder="No minimum"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm hover:border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-emerald-600">£</span>
                    Max Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === "E")
                        e.preventDefault();
                    }}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: e.target.value })
                    }
                    placeholder="No maximum"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm hover:border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <MapPin className="size-4 text-red-600" />
                    Location
                  </label>
                  <AddressAutocomplete
                    value={filters.location}
                    onChange={(v) => setFilters({ ...filters, location: v })}
                    onAddressSelect={(parsed: ParsedAddress) =>
                      setFilters({
                        ...filters,
                        location:
                          parsed.city ||
                          parsed.formattedAddress ||
                          parsed.streetAddress,
                      })
                    }
                    placeholder="e.g. London, Manchester..."
                    inputClassName="px-4 py-3 bg-white rounded-xl focus:ring-blue-500 focus:border-blue-500 text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Bed className="size-4 text-purple-600" />
                    Min Bedrooms
                  </label>
                  <select
                    value={filters.minBeds}
                    onChange={(e) =>
                      setFilters({ ...filters, minBeds: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 shadow-sm hover:border-slate-300"
                  >
                    <option value="">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6plus">6+</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Bed className="size-4 text-purple-600" />
                    Max Bedrooms
                  </label>
                  <select
                    value={filters.maxBeds}
                    onChange={(e) =>
                      setFilters({ ...filters, maxBeds: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 shadow-sm hover:border-slate-300"
                  >
                    <option value="">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6plus">6+</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Bath className="size-4 text-cyan-600" />
                    Bathrooms
                  </label>
                  <select
                    value={filters.minBaths}
                    onChange={(e) =>
                      setFilters({ ...filters, minBaths: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 shadow-sm hover:border-slate-300"
                  >
                    <option value="">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6plus">6+</option>
                  </select>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="px-6 pb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4">
                    <p className="text-sm font-bold text-slate-900 mb-3">
                      Active Filters:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {filters.propertyType && (
                        <div className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                          <Home className="size-3" />
                          {filters.propertyType}
                          <button
                            onClick={() =>
                              setFilters({ ...filters, propertyType: "" })
                            }
                            className="hover:bg-white/20 rounded-full p-0.5 transition-all"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      )}
                      {filters.location && (
                        <div className="px-3 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                          <MapPin className="size-3" />
                          {filters.location}
                          <button
                            onClick={() =>
                              setFilters({ ...filters, location: "" })
                            }
                            className="hover:bg-white/20 rounded-full p-0.5 transition-all"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      )}
                      {filters.minBeds && (
                        <div className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                          <Bed className="size-3" />
                          {filters.minBeds === "6plus"
                            ? "6+ beds"
                            : `${filters.minBeds} bed${filters.minBeds === "1" ? "" : "s"}`}
                          <button
                            onClick={() =>
                              setFilters({ ...filters, minBeds: "" })
                            }
                            className="hover:bg-white/20 rounded-full p-0.5 transition-all"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      )}
                      {filters.minBaths && (
                        <div className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                          <Bath className="size-3" />
                          {filters.minBaths === "6plus"
                            ? "6+ baths"
                            : `${filters.minBaths} bath${filters.minBaths === "1" ? "" : "s"}`}
                          <button
                            onClick={() =>
                              setFilters({ ...filters, minBaths: "" })
                            }
                            className="hover:bg-white/20 rounded-full p-0.5 transition-all"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      )}
                      {(filters.minPrice || filters.maxPrice) && (
                        <div className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                          £
                          {filters.minPrice &&
                            parseInt(filters.minPrice).toLocaleString()}
                          {filters.minPrice && filters.maxPrice && " - "}
                          {filters.maxPrice &&
                            `£${parseInt(filters.maxPrice).toLocaleString()}`}
                          <button
                            onClick={() =>
                              setFilters({
                                ...filters,
                                minPrice: "",
                                maxPrice: "",
                              })
                            }
                            className="hover:bg-white/20 rounded-full p-0.5 transition-all"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
