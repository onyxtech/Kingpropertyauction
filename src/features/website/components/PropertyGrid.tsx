import { useState } from "react";
import { Building2, Gavel, Zap, Star } from "lucide-react";
import PropertyCard from "./PropertyCard";

interface PropertyGridProps {
  properties: any[];
  allAuctions: any[];
  filters: any;
  setFilters?: (filters: any) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wishlisted: string[];
  onBid: (property: any) => void;
  onWishlist: (e: React.MouseEvent, id: string) => void;
  onShare: (e: React.MouseEvent, property: any) => void;
  onTour: (property: any) => void;
  onNavigate: (path: string) => void;
  onAuctionEnded: () => void;
}

const getAuctionInfo = (property: any, allAuctions: any[]) => {
  const matchingAuction = allAuctions.find((auction: any) =>
    auction.properties?.some(
      (p: any) => (typeof p === "string" ? p : p._id) === property._id,
    ),
  );
  return matchingAuction || null;
};

export default function PropertyGrid({
  properties,
  allAuctions,
  filters,
  setFilters,
  isLoading,
  hasMore,
  onLoadMore,
  isLoadingMore,
  activeTab,
  setActiveTab,
  wishlisted,
  onBid,
  onWishlist,
  onShare,
  onTour,
  onNavigate,
  onAuctionEnded,
}: PropertyGridProps) {
  const [sortBy, setSortBy] = useState("recent");

  let filteredProperties = properties.filter((property: any) => {
    if (activeTab === "auction") {
      if (property.listingType !== "auction") return false;
      const info = getAuctionInfo(property, allAuctions);
      if (info?.status !== "live") return false;
    }
    if (activeTab === "sale" && property.listingType !== "direct_sale")
      return false;
    if (activeTab === "featured" && !property.featured) return false;

    if (
      filters.propertyType &&
      property.propertyType !== filters.propertyType.toLowerCase()
    )
      return false;

    const priceValue =
      property.pricing?.startingAuctionPrice ||
      property.pricing?.startingAuctionPrice ||
      0;
    const minPriceValue = filters.minPrice ? parseInt(filters.minPrice) : 0;
    const maxPriceValue = filters.maxPrice
      ? parseInt(filters.maxPrice)
      : Infinity;
    if (priceValue < minPriceValue || priceValue > maxPriceValue) return false;

    const locationStr = `${property.location?.city || ""} ${property.location?.area || ""} ${property.location?.state || ""} ${property.location?.postalCode || ""}`;
    if (filters.location) {
      const filterLoc = filters.location.toLowerCase().trim();
      // Try exact match on city first, then partial on full location
      const cityMatch =
        (property.location?.city || "").toLowerCase() === filterLoc;
      const areaMatch =
        (property.location?.area || "").toLowerCase() === filterLoc;
      const postcodeMatch =
        (property.location?.postalCode || "")
          .toLowerCase()
          .replace(/\s/g, "") === filterLoc.replace(/\s/g, "");
      const partialMatch = locationStr.toLowerCase().includes(filterLoc);
      if (!cityMatch && !areaMatch && !postcodeMatch && !partialMatch)
        return false;
    }

    if (filters.minBeds) {
      const beds = property.specifications?.bedrooms || 0;
      if (filters.minBeds === "6plus") {
        if (beds < 6) return false;
      } else if (beds < parseInt(filters.minBeds)) {
        return false;
      }
    }
    if (filters.maxBeds) {
      const beds = property.specifications?.bedrooms || 0;
      if (filters.maxBeds === "6plus") {
        // 6+ means no upper limit
      } else if (beds > parseInt(filters.maxBeds)) {
        return false;
      }
    }
    if (filters.minBaths) {
      const baths = property.specifications?.bathrooms || 0;
      if (filters.minBaths === "6plus") {
        if (baths < 6) return false;
      } else if (baths !== parseInt(filters.minBaths)) {
        return false;
      }
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = (property.propertyTitle || "")
        .toLowerCase()
        .includes(query);
      const matchesLocation = locationStr.toLowerCase().includes(query);
      const matchesId = (property.propertyID || "")
        .toLowerCase()
        .includes(query);
      const matchesType = (property.propertyType || "")
        .toLowerCase()
        .includes(query);
      const matchesPostcode = (property.location?.postalCode || "")
        .toLowerCase()
        .replace(/\s/g, "")
        .includes(query.replace(/\s/g, ""));
      const matchesDescription = (property.propertyDescription || "")
        .substring(0, 200)
        .toLowerCase()
        .includes(query);
      const matchesStreet = (property.location?.streetAddress || "")
        .toLowerCase()
        .includes(query);
      if (
        !matchesTitle &&
        !matchesLocation &&
        !matchesId &&
        !matchesType &&
        !matchesPostcode &&
        !matchesDescription &&
        !matchesStreet
      )
        return false;
    }

    return true;
  });

  filteredProperties = [...filteredProperties].sort((a: any, b: any) => {
    const priceA =
      a.pricing?.startingAuctionPrice || 0;
    const priceB =
      b.pricing?.startingAuctionPrice || 0;
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();

    switch (sortBy) {
      case "price-asc":
        return priceA - priceB;
      case "price-desc":
        return priceB - priceA;
      case "oldest":
        return dateA - dateB;
      case "recent":
      default:
        return dateB - dateA;
    }
  });

  const auctionCount = properties.filter((p: any) => {
    if (p.listingType !== "auction") return false;
    const info = getAuctionInfo(p, allAuctions);
    return info?.status === "live";
  }).length;
  const saleCount = properties.filter(
    (p: any) => p.listingType === "direct_sale",
  ).length;
  const featuredCount = properties.filter((p: any) => p.featured).length;

  const tabs = [
    {
      id: "all",
      label: "All Properties",
      count: properties.length,
      icon: Building2,
      gradient: "from-slate-600 to-slate-800",
    },
    {
      id: "auction",
      label: "Live Auctions",
      count: auctionCount,
      icon: Gavel,
      gradient: "from-red-500 to-orange-500",
    },
    {
      id: "sale",
      label: "For Sale",
      count: saleCount,
      icon: Zap,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "featured",
      label: "Featured",
      count: featuredCount,
      icon: Star,
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <>
      <div
        className="bg-white/80 backdrop-blur-xl border-b border-slate-200 relative z-10"
        data-section="properties"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-bold border-b-4 transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? `border-transparent bg-gradient-to-r ${tab.gradient} bg-clip-text text-transparent`
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`size-4 ${activeTab === tab.id ? "text-current" : "text-slate-400"}`}
                  />
                  {tab.label}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-slate-600 text-lg">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredProperties.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900">
                {properties.length}
              </span>{" "}
              properties
            </p>
            <p className="text-sm text-slate-500 mt-1">Updated just now ⚡</p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:bg-white transition-all"
          >
            <option value="recent">Sort: Most Recent</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-slate-200 animate-pulse"
              >
                <div className="h-64 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="size-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">
              No properties found
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {filters.searchQuery ||
              filters.location ||
              filters.propertyType ||
              filters.minBeds ||
              filters.maxBeds ||
              filters.minPrice ||
              filters.maxPrice ? (
                <>Try adjusting your search filters to see more results.</>
              ) : (
                <>No properties are currently available. Check back soon!</>
              )}
            </p>
            {(filters.searchQuery ||
              filters.location ||
              filters.propertyType ||
              filters.minBeds ||
              filters.maxBeds ||
              filters.minPrice ||
              filters.maxPrice) && (
              <button
                onClick={() => {
                  if (setFilters) {
                    setFilters({
                      propertyType: "",
                      minPrice: "",
                      maxPrice: "",
                      location: "",
                      minBeds: "",
                      maxBeds: "",
                      minBaths: "",
                      searchQuery: "",
                    });
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property: any) => (
              <PropertyCard
                key={property._id}
                property={property}
                auctionInfo={getAuctionInfo(property, allAuctions)}
                wishlisted={wishlisted}
                onBid={onBid}
                onWishlist={onWishlist}
                onShare={onShare}
                onTour={onTour}
                onNavigate={onNavigate}
                onAuctionEnded={onAuctionEnded}
              />
            ))}
          </div>
            )}

        {/* Load More Button */}
        {hasMore && onLoadMore && (
          <div className="text-center mt-10 pb-6">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {isLoadingMore ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin size-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </span>
              ) : (
                <>Load More Properties</>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
