import { useState } from "react";
import { Building2, Gavel, Zap, Star } from "lucide-react";
import PropertyCard from "./PropertyCard";

interface PropertyGridProps {
  properties: any[];
  allAuctions: any[];
  filters: any;
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
  isLoading,
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
      if (info?.status !== "live" || info?.auctionType === "live") return false;
    }
    if (activeTab === "sale" && property.listingType !== "direct_sale") return false;
    if (activeTab === "featured" && !property.featured) return false;

    if (filters.propertyType && property.propertyType !== filters.propertyType.toLowerCase()) return false;

    const priceValue = property.pricing?.reservePrice || property.pricing?.startingAuctionPrice || 0;
    const minPriceValue = filters.minPrice ? parseInt(filters.minPrice) : 0;
    const maxPriceValue = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
    if (priceValue < minPriceValue || priceValue > maxPriceValue) return false;

    const locationStr = `${property.location?.city || ""} ${property.location?.area || ""} ${property.location?.state || ""}`;
    if (filters.location && !locationStr.toLowerCase().includes(filters.location.toLowerCase())) return false;

    if (filters.minBeds && (property.specifications?.bedrooms || 0) < parseInt(filters.minBeds)) return false;
    if (filters.minBaths && (property.specifications?.bathrooms || 0) < parseInt(filters.minBaths)) return false;

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = (property.propertyTitle || "").toLowerCase().includes(query);
      const matchesLocation = locationStr.toLowerCase().includes(query);
      if (!matchesTitle && !matchesLocation) return false;
    }

    return true;
  });

  filteredProperties = [...filteredProperties].sort((a: any, b: any) => {
    const priceA = a.pricing?.reservePrice || a.pricing?.startingAuctionPrice || 0;
    const priceB = b.pricing?.reservePrice || b.pricing?.startingAuctionPrice || 0;
    switch (sortBy) {
      case "lowToHigh": return priceA - priceB;
      case "highToLow": return priceB - priceA;
      default: return 0;
    }
  });

  const auctionCount = properties.filter((p: any) => {
    if (p.listingType !== "auction") return false;
    const info = getAuctionInfo(p, allAuctions);
    return info?.status === "live" && info?.auctionType !== "live";
  }).length;
  const saleCount = properties.filter((p: any) => p.listingType === "direct_sale").length;
  const featuredCount = properties.filter((p: any) => p.featured).length;

  const tabs = [
    { id: "all", label: "All Properties", count: properties.length, icon: Building2, gradient: "from-slate-600 to-slate-800" },
    { id: "auction", label: "Live Auctions", count: auctionCount, icon: Gavel, gradient: "from-red-500 to-orange-500" },
    { id: "sale", label: "For Sale", count: saleCount, icon: Zap, gradient: "from-blue-500 to-cyan-500" },
    { id: "featured", label: "Featured", count: featuredCount, icon: Star, gradient: "from-purple-500 to-pink-500" },
  ];

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 relative z-10" data-section="properties">
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
                  <Icon className={`size-4 ${activeTab === tab.id ? "text-current" : "text-slate-400"}`} />
                  {tab.label}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : "bg-slate-100 text-slate-600"
                  }`}>
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
              Showing <span className="font-bold text-slate-900">{filteredProperties.length}</span>{" "}
              of <span className="font-bold text-slate-900">{properties.length}</span> properties
            </p>
            <p className="text-sm text-slate-500 mt-1">Updated just now ⚡</p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:bg-white transition-all"
          >
            <option value="recent">Sort: Most Recent</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="endingSoon">Ending Soon</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-slate-200 animate-pulse">
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
            <h3 className="text-xl font-bold text-slate-600 mb-2">No properties found</h3>
            <p className="text-slate-500">Try adjusting your filters or search query</p>
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
      </div>
    </>
  );
}
