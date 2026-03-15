import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  MapPin,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Tag,
  Home,
  Building2,
  Store,
  Warehouse,
  ChevronDown,
  Eye,
  Download,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Auctions() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("All Status");

  const allAuctionLots = [
    {
      lotNumber: "LOT-2026-001",
      title: "Premium London Property Auction",
      location: "London, England",
      type: "Mixed Portfolio",
      startDate: "March 15, 2026",
      startTime: "10:00 GMT",
      endDate: "March 15, 2026",
      endTime: "18:00 GMT",
      totalProperties: 45,
      estimatedValue: "£125,500,000",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdWN0aW9uJTIwaGFtbWVyfGVufDF8fHx8MTc3MTIzMzMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      status: "Live Now",
      registeredBidders: 234,
    },
    {
      lotNumber: "LOT-2026-002",
      title: "Commercial Property Sale Manchester",
      location: "Manchester, England",
      type: "Commercial",
      startDate: "March 16, 2026",
      startTime: "11:00 GMT",
      endDate: "March 16, 2026",
      endTime: "17:00 GMT",
      totalProperties: 28,
      estimatedValue: "£78,300,000",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzcxMjMzMzA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "Live Now",
      registeredBidders: 156,
    },
    {
      lotNumber: "LOT-2026-003",
      title: "Residential Portfolio Birmingham",
      location: "Birmingham, England",
      type: "Residential",
      startDate: "March 18, 2026",
      startTime: "09:00 GMT",
      endDate: "March 18, 2026",
      endTime: "16:00 GMT",
      totalProperties: 62,
      estimatedValue: "£94,700,000",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGhvdXNlc3xlbnwxfHx8fDE3NzEyMzMzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "Upcoming",
      registeredBidders: 189,
    },
    {
      lotNumber: "LOT-2026-004",
      title: "Scotland Regional Auction",
      location: "Edinburgh, Scotland",
      type: "Mixed Portfolio",
      startDate: "March 20, 2026",
      startTime: "10:30 GMT",
      endDate: "March 20, 2026",
      endTime: "19:00 GMT",
      totalProperties: 52,
      estimatedValue: "£112,400,000",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MTIzMzMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      status: "Upcoming",
      registeredBidders: 201,
    },
    {
      lotNumber: "LOT-2026-005",
      title: "South Coast Property Auction",
      location: "Brighton, England",
      type: "Residential",
      startDate: "March 22, 2026",
      startTime: "12:00 GMT",
      endDate: "March 22, 2026",
      endTime: "18:30 GMT",
      totalProperties: 38,
      estimatedValue: "£67,900,000",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMHBvb2x8ZW58MXx8fHwxNzcxMjMzMzA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "Live Now",
      registeredBidders: 178,
    },
    {
      lotNumber: "LOT-2026-006",
      title: "Industrial & Warehouse Auction",
      location: "Birmingham, England",
      type: "Commercial",
      startDate: "March 24, 2026",
      startTime: "11:00 GMT",
      endDate: "March 24, 2026",
      endTime: "16:00 GMT",
      totalProperties: 22,
      estimatedValue: "£89,600,000",
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2V8ZW58MXx8fHwxNzcxMjMzMzA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "Upcoming",
      registeredBidders: 142,
    },
    {
      lotNumber: "LOT-2026-007",
      title: "Luxury Properties Auction London",
      location: "London, England",
      type: "Residential",
      startDate: "March 25, 2026",
      startTime: "13:00 GMT",
      endDate: "March 25, 2026",
      endTime: "20:00 GMT",
      totalProperties: 31,
      estimatedValue: "£156,300,000",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW50aG91c2V8ZW58MXx8fHwxNzcxMjMzMzA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "Upcoming",
      registeredBidders: 312,
    },
    {
      lotNumber: "LOT-2026-008",
      title: "Midlands Property Portfolio",
      location: "Leicester, England",
      type: "Mixed Portfolio",
      startDate: "March 27, 2026",
      startTime: "10:00 GMT",
      endDate: "March 27, 2026",
      endTime: "17:30 GMT",
      totalProperties: 47,
      estimatedValue: "£73,800,000",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3RhdGUlMjBob3VzZXxlbnwxfHx8fDE3NzEyMzMzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "Live Now",
      registeredBidders: 167,
    },
    {
      lotNumber: "LOT-2026-009",
      title: "North West Commercial Sale",
      location: "Liverpool, England",
      type: "Commercial",
      startDate: "March 28, 2026",
      startTime: "11:30 GMT",
      endDate: "March 28, 2026",
      endTime: "18:00 GMT",
      totalProperties: 34,
      estimatedValue: "£98,200,000",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGNlbnRlcnxlbnwxfHx8fDE3NzEyMzMzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "Upcoming",
      registeredBidders: 198,
    },
    {
      lotNumber: "LOT-2026-010",
      title: "Yorkshire Property Auction",
      location: "Leeds, England",
      type: "Residential",
      startDate: "March 29, 2026",
      startTime: "09:30 GMT",
      endDate: "March 29, 2026",
      endTime: "16:30 GMT",
      totalProperties: 41,
      estimatedValue: "£54,600,000",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnR8ZW58MXx8fHwxNzcxMjMzMzA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "Upcoming",
      registeredBidders: 145,
    },
    {
      lotNumber: "LOT-2026-011",
      title: "East Anglia Mixed Auction",
      location: "Cambridge, England",
      type: "Mixed Portfolio",
      startDate: "March 30, 2026",
      startTime: "10:30 GMT",
      endDate: "March 30, 2026",
      endTime: "17:00 GMT",
      totalProperties: 36,
      estimatedValue: "£81,400,000",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBwYXJrfGVufDF8fHx8MTc3MTIzMzMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      status: "Upcoming",
      registeredBidders: 173,
    },
    {
      lotNumber: "LOT-2026-012",
      title: "North East Property Sale",
      location: "Newcastle, England",
      type: "Residential",
      startDate: "March 31, 2026",
      startTime: "12:00 GMT",
      endDate: "March 31, 2026",
      endTime: "19:30 GMT",
      totalProperties: 29,
      estimatedValue: "£42,900,000",
      image: "https://images.unsplash.com/photo-1502672260066-6bc35f0a0331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2Z0JTIwYXBhcnRtZW50fGVufDF8fHx8MTc3MTIzMzMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      status: "Upcoming",
      registeredBidders: 134,
    },
  ];

  // Filter lots based on search and filters
  const filteredLots = allAuctionLots.filter((lot) => {
    const matchesSearch = lot.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All Types" || lot.type === filterType;
    const matchesStatus = filterStatus === "All Status" || lot.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const liveCount = allAuctionLots.filter(a => a.status === "Live Now").length;
  const upcomingCount = allAuctionLots.filter(a => a.status === "Upcoming").length;
  const totalProperties = allAuctionLots.reduce((sum, a) => sum + a.totalProperties, 0);
  const totalValue = allAuctionLots.reduce((sum, a) => sum + parseFloat(a.estimatedValue.replace(/[£,]/g, "")), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <div className="size-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-white">🔨 {liveCount} Live Auction Lots • {upcomingCount} Upcoming Lots</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Auction Lots
              <br />
              <span className="text-cyan-300">Browse & Register to Bid</span>
            </h1>
            
            <p className="text-2xl text-white/90 font-medium">
              Explore our live and upcoming auction lots featuring multiple properties
              <br />
              <span className="text-yellow-200">✨ {totalProperties} properties across {allAuctionLots.length} auction lots</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 -mt-8">
        <div className="container mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/60 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">{liveCount}</div>
                <div className="text-sm text-slate-600 font-bold">Live Auction Lots</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{upcomingCount}</div>
                <div className="text-sm text-slate-600 font-bold">Upcoming Lots</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">{totalProperties}</div>
                <div className="text-sm text-slate-600 font-bold">Total Properties</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">£{(totalValue / 1000000).toFixed(0)}M</div>
                <div className="text-sm text-slate-600 font-bold">Total Value</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-white/60 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by lot number, title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-900"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none pl-4 pr-10 py-4 bg-slate-50 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 cursor-pointer"
              >
                <option>All Types</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Mixed Portfolio</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-4 bg-slate-50 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 cursor-pointer"
              >
                <option>All Status</option>
                <option>Live Now</option>
                <option>Upcoming</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Grid className="size-5" />
                Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  viewMode === "table"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <List className="size-5" />
                Table
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-slate-600 font-medium">
              Showing <span className="font-black text-slate-900">{filteredLots.length}</span> of <span className="font-black text-slate-900">{allAuctionLots.length}</span> auction lots
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center gap-2">
              <Download className="size-5" />
              Export Catalogue
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLots.map((lot) => (
              <div
                key={lot.lotNumber}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-white/60 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group"
              >
                <div className="relative h-56">
                  <ImageWithFallback
                    src={lot.image}
                    alt={lot.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    {lot.status === "Live Now" ? (
                      <div className="px-4 py-2 bg-red-500 text-white text-sm font-black rounded-full flex items-center gap-2 shadow-xl animate-pulse">
                        <div className="size-2 bg-white rounded-full" />
                        LIVE NOW
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-blue-600 text-white text-sm font-black rounded-full shadow-xl">
                        UPCOMING
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-slate-900">
                    {lot.lotNumber}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {lot.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-600 font-medium mb-4">
                    <MapPin className="size-4 text-blue-600" />
                    <span className="text-sm">{lot.location}</span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-600">START DATE & TIME</span>
                      </div>
                      <div className="text-sm font-black text-blue-600">{lot.startDate}</div>
                      <div className="text-xs font-bold text-slate-500">{lot.startTime}</div>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-600">END DATE & TIME</span>
                      </div>
                      <div className="text-sm font-black text-purple-600">{lot.endDate}</div>
                      <div className="text-xs font-bold text-slate-500">{lot.endTime}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                      <span className="text-sm font-bold text-slate-600">Total Properties</span>
                      <span className="text-lg font-black text-emerald-600">{lot.totalProperties}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                      <span className="text-sm font-bold text-slate-600">Est. Value</span>
                      <span className="text-lg font-black text-orange-600">{lot.estimatedValue}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                      <Users className="size-4 text-blue-600" />
                      {lot.registeredBidders} bidders
                    </div>
                    <div className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                      {lot.type}
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate("/view-all-lots")}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="size-5" />
                    View Properties
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-white/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Lot Number</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Auction Title</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Location</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Start Date & Time</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">End Date & Time</th>
                    <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">Properties</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Est. Value</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Status</th>
                    <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLots.map((lot, idx) => (
                    <tr key={lot.lotNumber} className={`hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
                      <td className="px-6 py-5">
                        <div className="font-black text-blue-600">{lot.lotNumber}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-black text-slate-900 mb-1">{lot.title}</div>
                        <div className="text-xs font-bold text-slate-500">{lot.type}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <MapPin className="size-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm">{lot.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-slate-900">{lot.startDate}</div>
                        <div className="text-xs text-slate-600 font-medium">{lot.startTime}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-slate-900">{lot.endDate}</div>
                        <div className="text-xs text-slate-600 font-medium">{lot.endTime}</div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full">
                          <Building2 className="size-4 text-emerald-600" />
                          <span className="text-lg font-black text-emerald-600">{lot.totalProperties}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-lg font-black text-orange-600">{lot.estimatedValue}</div>
                        <div className="text-xs font-medium text-slate-500">{lot.registeredBidders} bidders</div>
                      </td>
                      <td className="px-6 py-5">
                        {lot.status === "Live Now" ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white text-xs font-black rounded-full animate-pulse">
                            <div className="size-2 bg-white rounded-full" />
                            LIVE NOW
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-black rounded-full">
                            UPCOMING
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => navigate("/view-all-lots")}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm flex items-center gap-2"
                          >
                            <Eye className="size-4" />
                            View Properties
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredLots.length === 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-white/60 p-16 text-center">
            <div className="size-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <Search className="size-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">No Auction Lots Found</h3>
            <p className="text-slate-600 font-medium mb-6">Try adjusting your search or filters</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setFilterType("All Types");
                setFilterStatus("All Status");
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-3xl p-12 shadow-xl text-white text-center">
          <h2 className="text-4xl font-black mb-6">Want to Participate in These Auctions?</h2>
          <p className="text-2xl font-medium mb-10">
            Register now to bid on properties from any of our auction lots
          </p>
          <div className="flex items-center gap-4 justify-center">
            <button 
              onClick={() => navigate("/register")}
              className="px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Register to Bid
            </button>
            <button 
              onClick={() => navigate("/contact-us")}
              className="px-10 py-5 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}