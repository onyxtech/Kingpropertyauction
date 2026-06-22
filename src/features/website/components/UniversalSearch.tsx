import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Building2,
  Gavel,
  X,
  Home,
  Clock,
  MapPin,
  Bed,
  Bath,
} from "lucide-react";

export default function UniversalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [maxBeds, setMaxBeds] = useState("");
  const [auctionStatus, setAuctionStatus] = useState("all");
  const [results, setResults] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchResults = async (overrides?: any) => {
    const q = overrides?.query ?? query;
    const t = overrides?.type ?? type;
    const minP = overrides?.minPrice ?? minPrice;
    const maxP = overrides?.maxPrice ?? maxPrice;
    const minB = overrides?.minBeds ?? minBeds;
    const maxB = overrides?.maxBeds ?? maxBeds;
    const aStatus = overrides?.auctionStatus ?? auctionStatus;

    if (!q && !minP && !maxP) {
      setResults(null);
      return;
    }
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (t && t !== "all") params.set("type", t);
      if (t !== "auctions") {
        if (minP) params.set("minPrice", minP);
        if (maxP) params.set("maxPrice", maxP);
        if (minB) params.set("minBeds", minB);
        if (maxB) params.set("maxBeds", maxB);
      }
      if (aStatus && aStatus !== "all") params.set("status", aStatus);
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    val.length >= 2
      ? fetchResults({ query: val })
      : (setResults(null), setShowDropdown(false));
  };

  const buildSearchParams = () => {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minBeds) params.set("minBeds", minBeds);
    if (maxBeds) params.set("maxBeds", maxBeds);
    return params;
  };

  const handleViewAllProperties = () => {
    navigate(`/view-all-lots`);
    setShowDropdown(false);
  };

  const handleViewAllAuctions = () => {
    navigate(`/auctions`);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const p = buildSearchParams();
      if (type === "auctions") {
        if (auctionStatus !== "all") p.set("status", auctionStatus);
        navigate(`/auctions?${p}`);
      } else navigate(`/view-all-lots?${p}`);
      setShowDropdown(false);
    }
  };

  const clearAll = () => {
    setQuery("");
    setMinPrice("");
    setMaxPrice("");
    setMinBeds("");
    setMaxBeds("");
    setType("all");
    setAuctionStatus("all");
    setResults(null);
    setShowDropdown(false);
  };

  const formatPrice = (val: number) =>
    val >= 1000000
      ? `£${(val / 1000000).toFixed(1)}M`
      : `£${(val || 0).toLocaleString()}`;

  const getDisplayPrice = (p: any) => {
    if (p.soldPrice) return p.soldPrice;
    if (p.currentBid) return p.currentBid;
    return p.pricing?.startingAuctionPrice || 0;
  };

  const getPriceLabel = (p: any) => {
    if (p.soldPrice) return "Sold Price";
    if (p.currentBid && p.currentBid > 0) return "Current Bid";
    return "Starting";
  };

  const hasFilters =
    minPrice ||
    maxPrice ||
    minBeds ||
    maxBeds ||
    type !== "all" ||
    auctionStatus !== "all";

  return (
    <div className="relative z-30" ref={searchRef}>
      <div className="bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/50 backdrop-blur-xl border-b border-slate-200">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Input */}
              <div className="flex-1 min-w-[260px] relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by city, area, or postcode..."
                  className="w-full pl-12 pr-10 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setResults(null);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Type */}
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  if (e.target.value !== "auctions") setAuctionStatus("all");
                  fetchResults({ type: e.target.value });
                }}
                className="px-4 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                <option value="all">All Types</option>
                <option value="properties">Properties</option>
                <option value="auctions">Auctions</option>
              </select>

              {/* Auction Status */}
              {type === "auctions" && (
                <select
                  value={auctionStatus}
                  onChange={(e) => {
                    setAuctionStatus(e.target.value);
                    fetchResults({ auctionStatus: e.target.value });
                  }}
                  className="px-4 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                >
                  <option value="all">All Status</option>
                  <option value="live">Live Now</option>
                  <option value="scheduled">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              )}

              {/* Min Price */}
              <input
                type="number"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  fetchResults({ minPrice: e.target.value });
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                placeholder="Min Price £"
                className="w-28 px-3 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />

              {/* Max Price */}
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  fetchResults({ maxPrice: e.target.value });
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                placeholder="Max Price £"
                className="w-28 px-3 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />

              {/* Min Beds */}
              <select
                value={minBeds}
                onChange={(e) => {
                  setMinBeds(e.target.value);
                  fetchResults({ minBeds: e.target.value });
                }}
                className="px-3 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                <option value="">Min Beds</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6plus">6+</option>
              </select>

              {/* Max Beds */}
              <select
                value={maxBeds}
                onChange={(e) => {
                  setMaxBeds(e.target.value);
                  fetchResults({ maxBeds: e.target.value });
                }}
                className="px-3 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                <option value="">Max Beds</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6plus">6+</option>
              </select>

              {/* Clear */}
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="px-4 py-3.5 bg-red-50 border-2 border-red-200 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-100 transition-all flex items-center gap-1"
                >
                  <X className="size-4" /> Clear
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 ml-1">
              Type to see suggestions • Press Enter to view all results
            </p>
          </div>
        </div>
      </div>

      {/* Results Dropdown */}
      {showDropdown && results && (
        <div className="absolute left-0 right-0 mx-auto max-w-7xl px-6 z-50">
          <div className="bg-white rounded-b-3xl shadow-2xl border-2 border-t-0 border-slate-200 max-h-[480px] overflow-y-auto">
            {/* Properties - Show first when All Types */}
            {(type === "all" || type === "properties") &&
              results.properties?.length > 0 && (
                <div>
                  <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b flex items-center justify-between">
                    <h3 className="text-sm font-black text-blue-900 flex items-center gap-2">
                      <Building2 className="size-4" /> Properties (
                      {results.properties.length})
                    </h3>
                    <button
                      onClick={handleViewAllProperties}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      View All →
                    </button>
                  </div>
                  {results.properties.map((p: any) => {
                    const getFirstImage = (p: any) => {
                      const imgs = p.media?.propertyImages;
                      if (!imgs) return null;
                      if (Array.isArray(imgs)) return imgs[0];
                      if (typeof imgs === "string")
                        return imgs.split("\n")[0].trim();
                      return null;
                    };
                    const img = getFirstImage(p);
                    return (
                      <button
                        key={p._id}
                        onClick={() => {
                          navigate(`/view-all-lots?search=${encodeURIComponent(query)}`);
                          setShowDropdown(false);
                        }}
                        className="w-full px-6 py-4 text-left hover:bg-blue-50/50 border-b border-slate-50 flex items-center gap-4 transition-colors"
                      >
                        <div className="size-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                          {img ? (
                            <img
                              src={
                                img.startsWith("http")
                                  ? img
                                  : `${window.location.origin}${img}`
                              }
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Home className="size-8 text-slate-300 m-auto" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {p.propertyTitle}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />{" "}
                              {p.location?.city || "UK"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Bed className="size-3" />{" "}
                              {p.specifications?.bedrooms ?? "-"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="size-3" />{" "}
                              {p.specifications?.bathrooms ?? "-"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div>
                            <p className="font-black text-slate-900">
                              {formatPrice(getDisplayPrice(p))}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {getPriceLabel(p)}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.propertyStatus === "sold"
                                ? "bg-emerald-100 text-emerald-700"
                                : p.propertyStatus === "unsold"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {p.propertyStatus || "available"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            {/* Auctions - Show after Properties */}
            {(type === "all" || type === "auctions") &&
              results.auctions?.length > 0 && (
                <div>
                  <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b flex items-center justify-between">
                    <h3 className="text-sm font-black text-purple-900 flex items-center gap-2">
                      <Gavel className="size-4" /> Auctions (
                      {results.auctions.length})
                    </h3>
                    <button
                      onClick={handleViewAllAuctions}
                      className="text-xs font-bold text-purple-600 hover:text-purple-800"
                    >
                      View All →
                    </button>
                  </div>
                  {results.auctions.map((a: any) => (
                    <button
                      key={a._id}
                      onClick={() => {
                        navigate(`/auctions/${a.slug || a._id}`);
                        setShowDropdown(false);
                      }}
                      className="w-full px-6 py-4 text-left hover:bg-purple-50/50 border-b border-slate-50 flex items-center gap-4 transition-colors"
                    >
                      <div className="size-16 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Gavel className="size-7 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {a.auctionTitle}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />{" "}
                            {new Date(a.startDateTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span>
                            {a.properties?.length || a.totalLots || 0} lots
                          </span>
                          <span>{a.totalBids || 0} bids</span>
                          <span className="capitalize">{a.auctionType}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                          a.status === "live"
                            ? "bg-red-100 text-red-600 animate-pulse"
                            : a.status === "scheduled"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {a.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}

            {!results.properties?.length && !results.auctions?.length && (
              <div className="px-6 py-10 text-center text-slate-500">
                <Search className="size-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-lg">No results for "{query}"</p>
                <p className="text-sm">Try different search terms</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
