import { useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles, X, Filter, Search, Home, MapPin, Bed, Bath, Maximize, Clock } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function ViewAllLots() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    minBeds: "",
    auctionDate: "",
    searchQuery: ""
  });

  const lots = [
    { id: 1, title: "Victorian Terrace House", location: "Hackney, London", guide: "£425,000", beds: 3, baths: 2, sqft: "1,850", image: "https://images.unsplash.com/photo-1706808849777-96e0d7be3bb7?w=800", auction: "March 15", type: "House" },
    { id: 2, title: "Modern Apartment", location: "Canary Wharf", guide: "£550,000", beds: 2, baths: 2, sqft: "1,200", image: "https://images.unsplash.com/photo-1614622350812-96b09c78af77?w=800", auction: "March 15", type: "Apartment" },
    { id: 3, title: "Detached Bungalow", location: "Surrey", guide: "£685,000", beds: 4, baths: 3, sqft: "2,400", image: "https://images.unsplash.com/photo-1763114766629-724ce8da8f58?w=800", auction: "March 22", type: "Bungalow" },
    { id: 4, title: "Period Conversion", location: "Islington", guide: "£775,000", beds: 3, baths: 2, sqft: "1,650", image: "https://images.unsplash.com/photo-1760611656071-a8bef0578874?w=800", auction: "March 22", type: "Apartment" },
    { id: 5, title: "Family Home", location: "Richmond", guide: "£895,000", beds: 5, baths: 3, sqft: "3,200", image: "https://images.unsplash.com/photo-1706808849777-96e0d7be3bb7?w=800", auction: "March 29", type: "House" },
    { id: 6, title: "Investment Property", location: "Stratford", guide: "£325,000", beds: 2, baths: 1, sqft: "950", image: "https://images.unsplash.com/photo-1614622350812-96b09c78af77?w=800", auction: "March 29", type: "Apartment" },
    { id: 7, title: "Luxury Villa", location: "Kensington", guide: "£1,250,000", beds: 6, baths: 4, sqft: "4,500", image: "https://images.unsplash.com/photo-1706808849777-96e0d7be3bb7?w=800", auction: "April 5", type: "House" },
    { id: 8, title: "Studio Flat", location: "Shoreditch", guide: "£285,000", beds: 1, baths: 1, sqft: "550", image: "https://images.unsplash.com/photo-1614622350812-96b09c78af77?w=800", auction: "April 5", type: "Apartment" },
    { id: 9, title: "Semi-Detached House", location: "Wimbledon", guide: "£725,000", beds: 4, baths: 2, sqft: "2,100", image: "https://images.unsplash.com/photo-1763114766629-724ce8da8f58?w=800", auction: "April 12", type: "House" },
  ];

  // Filter logic
  const filteredLots = lots.filter(lot => {
    const priceValue = parseInt(lot.guide.replace(/[£,]/g, ''));
    const minPriceValue = filters.minPrice ? parseInt(filters.minPrice) : 0;
    const maxPriceValue = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
    
    const matchesType = !filters.propertyType || lot.type === filters.propertyType;
    const matchesPrice = priceValue >= minPriceValue && priceValue <= maxPriceValue;
    const matchesLocation = !filters.location || lot.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesBeds = !filters.minBeds || lot.beds >= parseInt(filters.minBeds);
    const matchesAuction = !filters.auctionDate || lot.auction === filters.auctionDate;
    const matchesSearch = !filters.searchQuery || 
      lot.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      lot.location.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    return matchesType && matchesPrice && matchesLocation && matchesBeds && matchesAuction && matchesSearch;
  });

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(val => val !== "").length;

  const clearFilters = () => {
    setFilters({
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      location: "",
      minBeds: "",
      auctionDate: "",
      searchQuery: ""
    });
    setShowFilters(false);
  };

  const propertyTypes = ["House", "Apartment", "Bungalow"];
  const auctionDates = ["March 15", "March 22", "March 29", "April 5", "April 12"];
  const locations = ["Hackney, London", "Canary Wharf", "Surrey", "Islington", "Richmond", "Stratford", "Kensington", "Shoreditch", "Wimbledon"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <Header />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-95" />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">📦 147 Lots Available • Updated Daily</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              All Auction Lots
              <br />
              <span className="text-cyan-300">Browse & Bid</span>
            </h1>
            
            <p className="text-2xl text-white/90 font-medium">
              Explore all upcoming auction lots in one place
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-slate-600 text-lg font-medium mb-2">
              Showing <span className="font-black text-slate-900">{filteredLots.length}</span> of <span className="font-black text-slate-900">{lots.length}</span> lots
            </p>
            {/* Active Filter Badges */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {filters.propertyType && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                    Type: {filters.propertyType}
                    <button onClick={() => setFilters({ ...filters, propertyType: "" })} className="hover:bg-white/20 rounded-full p-0.5 transition-all">
                      <X className="size-3" />
                    </button>
                  </div>
                )}
                {filters.location && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                    {filters.location}
                    <button onClick={() => setFilters({ ...filters, location: "" })} className="hover:bg-white/20 rounded-full p-0.5 transition-all">
                      <X className="size-3" />
                    </button>
                  </div>
                )}
                {filters.minBeds && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                    Min {filters.minBeds} beds
                    <button onClick={() => setFilters({ ...filters, minBeds: "" })} className="hover:bg-white/20 rounded-full p-0.5 transition-all">
                      <X className="size-3" />
                    </button>
                  </div>
                )}
                {filters.auctionDate && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                    {filters.auctionDate}
                    <button onClick={() => setFilters({ ...filters, auctionDate: "" })} className="hover:bg-white/20 rounded-full p-0.5 transition-all">
                      <X className="size-3" />
                    </button>
                  </div>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                    {filters.minPrice && `£${parseInt(filters.minPrice).toLocaleString()}`}
                    {filters.minPrice && filters.maxPrice && ' - '}
                    {filters.maxPrice && `£${parseInt(filters.maxPrice).toLocaleString()}`}
                    <button onClick={() => setFilters({ ...filters, minPrice: "", maxPrice: "" })} className="hover:bg-white/20 rounded-full p-0.5 transition-all">
                      <X className="size-3" />
                    </button>
                  </div>
                )}
                <button 
                  onClick={clearFilters}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          <button 
            className={`px-6 py-3 bg-white/80 backdrop-blur-xl rounded-xl border-2 ${showFilters ? 'border-blue-500 bg-blue-50/80' : 'border-white/60'} shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-bold ${showFilters ? 'text-blue-600' : 'text-slate-700'} relative`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="size-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {activeFilterCount > 0 && (
              <div className="absolute -top-2 -right-2 size-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black flex items-center justify-center shadow-lg border-2 border-white">
                {activeFilterCount}
              </div>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60 mb-8 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Filter className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Filter Auction Lots</h3>
                    <p className="text-white/90 font-medium">Refine your search to find the perfect property</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="size-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer hover:scale-110 active:scale-95"
                  type="button"
                  aria-label="Close filters"
                >
                  <X className="size-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              {/* Search Bar */}
              <div className="mb-8">
                <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Search className="size-4 text-emerald-600" />
                  Quick Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-5 py-4 pl-12 bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-900 shadow-lg"
                    placeholder="Search by property title or location..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  />
                  <Search className="size-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                    <Home className="size-4 text-blue-600" />
                    Property Type
                  </label>
                  <select
                    className="w-full px-5 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-slate-900 shadow-lg appearance-none cursor-pointer"
                    value={filters.propertyType}
                    onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                    <MapPin className="size-4 text-emerald-600" />
                    Location
                  </label>
                  <select
                    className="w-full px-5 py-4 bg-gradient-to-r from-slate-50 to-emerald-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-900 shadow-lg appearance-none cursor-pointer"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Min Bedrooms */}
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                    <Bed className="size-4 text-purple-600" />
                    Min Bedrooms
                  </label>
                  <select
                    className="w-full px-5 py-4 bg-gradient-to-r from-slate-50 to-purple-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-semibold text-slate-900 shadow-lg appearance-none cursor-pointer"
                    value={filters.minBeds}
                    onChange={(e) => setFilters({ ...filters, minBeds: e.target.value })}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="size-4 text-cyan-600" />
                    Min Price (£)
                  </label>
                  <input
                    type="number"
                    className="w-full px-5 py-4 bg-gradient-to-r from-slate-50 to-cyan-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-semibold text-slate-900 shadow-lg"
                    placeholder="e.g., 250000"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="size-4 text-cyan-600" />
                    Max Price (£)
                  </label>
                  <input
                    type="number"
                    className="w-full px-5 py-4 bg-gradient-to-r from-slate-50 to-cyan-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-semibold text-slate-900 shadow-lg"
                    placeholder="e.g., 750000"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>

                {/* Auction Date */}
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="size-4 text-orange-600" />
                    Auction Date
                  </label>
                  <select
                    className="w-full px-5 py-4 bg-gradient-to-r from-slate-50 to-orange-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold text-slate-900 shadow-lg appearance-none cursor-pointer"
                    value={filters.auctionDate}
                    onChange={(e) => setFilters({ ...filters, auctionDate: e.target.value })}
                  >
                    <option value="">All Dates</option>
                    {auctionDates.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t-2 border-slate-200">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl font-black shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <X className="size-5" />
                  Clear All Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-2xl font-black shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Filter className="size-5" />
                  Apply Filters ({filteredLots.length} results)
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map(lot => (
            <div key={lot.id} className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
              <div className="relative h-56">
                <ImageWithFallback src={lot.image} alt={lot.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold text-sm shadow-xl">
                  Lot #{lot.id}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-slate-900 mb-2">{lot.title}</h3>
                <div className="flex items-center gap-2 text-slate-600 mb-4 font-medium">
                  <MapPin className="size-4 text-emerald-600" />
                  {lot.location}
                </div>
                <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b-2 border-slate-100">
                  <div className="flex items-center gap-2"><Bed className="size-4 text-blue-600" /><span className="font-bold text-slate-900">{lot.beds}</span></div>
                  <div className="flex items-center gap-2"><Bath className="size-4 text-purple-600" /><span className="font-bold text-slate-900">{lot.baths}</span></div>
                  <div className="flex items-center gap-2"><Maximize className="size-4 text-emerald-600" /><span className="font-bold text-slate-900">{lot.sqft}</span></div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-600 mb-1">Guide Price</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{lot.guide}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-600 mb-4 font-medium">
                  <Clock className="size-4 text-orange-600" />
                  <span>Auction: {lot.auction}</span>
                </div>
                <button 
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105" 
                  onClick={() => navigate(`/property-details?id=${lot.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}