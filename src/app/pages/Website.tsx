import { useState } from "react";
import { useNavigate } from "react-router";
import Slider from "react-slick";
import {
  Building2,
  Search,
  SlidersHorizontal,
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Clock,
  TrendingUp,
  ArrowLeft,
  Users,
  Gavel,
  Video,
  Share2,
  Sparkles,
  Zap,
  Star,
  Award,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Home,
  Play,
  Pause,
  Link2,
  Facebook,
  Twitter,
  Mail,
  MessageCircle,
  Tag,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CountdownTimer from "../components/CountdownTimer";

export default function Website() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [tourPlaying, setTourPlaying] = useState(false);
  const [activeRoom, setActiveRoom] = useState("living");
  const [wishlistedProperties, setWishlistedProperties] = useState<string[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [propertyToShare, setPropertyToShare] = useState<any>(null);
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    minBeds: "",
    minBaths: "",
    searchQuery: ""
  });

  const handlePlaceBid = (property: any) => {
    setSelectedProperty(property);
    setBidModalOpen(true);
    setBidSuccess(false);
    setBidAmount("");
  };

  const handleSubmitBid = () => {
    if (!bidAmount || !selectedProperty) return;
    
    const currentBidValue = parseFloat(selectedProperty.currentBid?.replace(/[£,]/g, "") || selectedProperty.price.replace(/[£,]/g, ""));
    const newBidValue = parseFloat(bidAmount);

    if (newBidValue <= currentBidValue) {
      alert("Your bid must be higher than the current bid!");
      return;
    }

    // Simulate bid submission
    setBidSuccess(true);
    setTimeout(() => {
      setBidModalOpen(false);
      setBidSuccess(false);
      setBidAmount("");
    }, 2000);
  };

  const handleOpenVirtualTour = (property: any) => {
    setSelectedProperty(property);
    setVirtualTourOpen(true);
    setTourPlaying(false);
    setActiveRoom("living");
  };

  const roomImages: Record<string, string> = {
    living: "https://images.unsplash.com/photo-1600210492493-0946911123ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc0MDAwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    kitchen: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVufGVufDF8fHx8MTc0MDAwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    bedroom: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tfGVufDF8fHx8MTc0MDAwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    bathroom: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbXxlbnwxfHx8fDE3NDAwMDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    exterior: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc0MDAwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
  };

  const handleToggleWishlist = (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    setWishlistedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleShareProperty = (e: React.MouseEvent, property: any) => {
    e.stopPropagation();
    setPropertyToShare(property);
    setShareModalOpen(true);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/property-details?id=${propertyToShare.id}`;
    navigator.clipboard.writeText(link);
    alert("Property link copied to clipboard!");
  };

  const properties = [
    {
      id: 1,
      title: "Modern Luxury Villa",
      location: "Mayfair, London",
      price: "£2,450,000",
      image: "https://images.unsplash.com/photo-1706808849777-96e0d7be3bb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MTIzMzMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      beds: 5,
      baths: 4,
      sqft: "4,200",
      type: "auction",
      propertyType: "Villa",
      status: "Live Auction",
      auctionEndDate: new Date(Date.now() + 2 * 60 * 60 * 1000 + 34 * 60 * 1000), // 2 hours 34 minutes from now
      currentBid: "£2,450,000",
      bids: 12,
      featured: true,
      gradient: "from-red-500 to-orange-500",
    },
    {
      id: 2,
      title: "Contemporary Penthouse",
      location: "Canary Wharf, London",
      price: "£1,850,000",
      image: "https://images.unsplash.com/photo-1614622350812-96b09c78af77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzEyNTEzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      beds: 3,
      baths: 3,
      sqft: "2,800",
      type: "sale",
      propertyType: "Penthouse",
      status: "For Sale",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      title: "Elegant Pool Villa",
      location: "Kensington, London",
      price: "£3,200,000",
      image: "https://images.unsplash.com/photo-1763114766629-724ce8da8f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwdmlsbGElMjBwb29sfGVufDF8fHx8MTc3MTMxNjgwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      beds: 6,
      baths: 5,
      sqft: "5,500",
      type: "auction",
      propertyType: "Villa",
      status: "Live Auction",
      auctionEndDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      featured: true,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 4,
      title: "Skyline Penthouse Suite",
      location: "Chelsea, London",
      price: "£2,950,000",
      image: "https://images.unsplash.com/photo-1760611656071-a8bef0578874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZW50aG91c2UlMjBjaXR5JTIwdmlld3xlbnwxfHx8fDE3NzEzMDUyNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      beds: 4,
      baths: 3,
      sqft: "3,600",
      type: "sale",
      propertyType: "Penthouse",
      status: "For Sale",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: 5,
      title: "Victorian House",
      location: "Notting Hill, London",
      price: "£1,250,000",
      image: "https://images.unsplash.com/photo-1706808849777-96e0d7be3bb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MTIzMzMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      beds: 4,
      baths: 2,
      sqft: "2,200",
      type: "sale",
      propertyType: "House",
      status: "For Sale",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: 6,
      title: "Modern Apartment",
      location: "Shoreditch, London",
      price: "£850,000",
      image: "https://images.unsplash.com/photo-1614622350812-96b09c78af77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzEyNTEzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      beds: 2,
      baths: 2,
      sqft: "1,100",
      type: "auction",
      propertyType: "Apartment",
      status: "Live Auction",
      auctionEndDate: new Date(Date.now() + 5 * 60 * 60 * 1000 + 15 * 60 * 1000), // 5 hours 15 minutes from now
      currentBid: "£850,000",
      bids: 8,
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  // Filter properties based on activeTab, filters, and search
  let filteredProperties = properties.filter(property => {
    // Tab filtering
    if (activeTab === "auction" && property.type !== "auction") return false;
    if (activeTab === "sale" && property.type !== "sale") return false;
    if (activeTab === "featured" && !property.featured) return false;

    // Property type filter
    if (filters.propertyType && property.propertyType !== filters.propertyType) return false;

    // Price filter
    const priceValue = parseInt(property.price.replace(/[£,]/g, ''));
    const minPriceValue = filters.minPrice ? parseInt(filters.minPrice) : 0;
    const maxPriceValue = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
    if (priceValue < minPriceValue || priceValue > maxPriceValue) return false;

    // Location filter
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false;

    // Beds filter
    if (filters.minBeds && property.beds < parseInt(filters.minBeds)) return false;

    // Baths filter
    if (filters.minBaths && property.baths < parseInt(filters.minBaths)) return false;

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = property.title.toLowerCase().includes(query);
      const matchesLocation = property.location.toLowerCase().includes(query);
      if (!matchesTitle && !matchesLocation) return false;
    }

    return true;
  });

  // Sort properties
  filteredProperties = [...filteredProperties].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[£,]/g, ''));
    const priceB = parseInt(b.price.replace(/[£,]/g, ''));

    switch (sortBy) {
      case "lowToHigh":
        return priceA - priceB;
      case "highToLow":
        return priceB - priceA;
      case "endingSoon":
        // Auction properties with timeLeft come first
        if (a.timeLeft && !b.timeLeft) return -1;
        if (!a.timeLeft && b.timeLeft) return 1;
        return 0;
      case "recent":
      default:
        return 0; // Keep original order
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 size-72 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6 relative z-10">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all shadow-sm"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </button>
      </div>

      {/* Hero Slider Section */}
      <div className="relative overflow-hidden">
        <Slider
          dots={true}
          infinite={true}
          speed={1000}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={5000}
          fade={true}
          arrows={false}
          className="hero-slider"
        >
          {/* Slide 1: Find Your Perfect Property */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-95" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>
            
            <div className="container mx-auto px-6 py-16 relative z-10">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
                  <Sparkles className="size-4 text-yellow-300 animate-pulse" />
                  <span className="text-sm font-bold text-white">✨ Premium Properties • AI-Powered Search • Instant Viewing</span>
                </div>
                
                <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                  Find Your Perfect Property
                  <br />
                  <span className="text-cyan-300">With Confidence</span>
                </h1>
                
                <p className="text-2xl text-white/90 mb-10 font-medium">
                  Browse thousands of properties or participate in live auctions to secure the best deals.
                  <br />
                  <span className="text-yellow-200">💎 Transparent • Secure • Verified</span>
                </p>
                
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <TrendingUp className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">1,247</p>
                      <p className="text-sm font-semibold text-white/80">Active Listings</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <Gavel className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">24</p>
                      <p className="text-sm font-semibold text-white/80">Live Auctions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Users className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">8,934</p>
                      <p className="text-sm font-semibold text-white/80">Active Bidders</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2: Online Property Auctions */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 opacity-95" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 size-96 bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>
            
            <div className="container mx-auto px-6 py-16 relative z-10">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
                  <Gavel className="size-4 text-yellow-300 animate-pulse" />
                  <span className="text-sm font-bold text-white">🔴 Live Bidding • Real-Time Updates • Instant Wins</span>
                </div>
                
                <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                  Online Property Auctions
                  <br />
                  <span className="text-yellow-300">Bid from Anywhere</span>
                </h1>
                
                <p className="text-2xl text-white/90 mb-10 font-medium">
                  Join live auctions from the comfort of your home. Real-time bidding with instant notifications.
                  <br />
                  <span className="text-yellow-200">🏆 Competitive • Fair • Transparent</span>
                </p>
                
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <Gavel className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">24</p>
                      <p className="text-sm font-semibold text-white/80">Live Auctions Now</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg">
                      <Zap className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">£12.4M</p>
                      <p className="text-sm font-semibold text-white/80">Total Value</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <Users className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">842</p>
                      <p className="text-sm font-semibold text-white/80">Active Bidders</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slider>
      </div>

      {/* Sell Your Property Banner */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div 
          onClick={() => navigate("/selling")}
          className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-3xl p-10 text-white shadow-2xl shadow-emerald-500/40 overflow-hidden cursor-pointer hover:shadow-3xl transition-all group"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 size-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30">
                <Clock className="size-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-bold text-white">Fast Sale Guarantee</span>
              </div>
              
              <h2 className="text-5xl font-black mb-4 leading-tight">
                Sell Your Property
                <br />
                <span className="text-yellow-300">within 28 Days</span>
              </h2>
              
              <p className="text-2xl text-emerald-50 mb-6 font-medium">
                You Set The Price, No Upfront Costs & No Sale, No Fee.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-6 text-yellow-300 flex-shrink-0" />
                  <span className="text-white font-semibold">You Control The Price</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-6 text-yellow-300 flex-shrink-0" />
                  <span className="text-white font-semibold">Zero Upfront Costs</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-6 text-yellow-300 flex-shrink-0" />
                  <span className="text-white font-semibold">No Sale, No Fee</span>
                </div>
              </div>

              <button className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3 group">
                <Tag className="size-6" />
                <span>Get Your Free Valuation</span>
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Stats */}
            <div className="flex flex-col gap-4">
              <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-6 text-center min-w-[200px]">
                <p className="text-5xl font-black mb-2">28</p>
                <p className="text-emerald-50 font-bold">Days Average</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-6 text-center min-w-[200px]">
                <p className="text-5xl font-black mb-2">£0</p>
                <p className="text-emerald-50 font-bold">Upfront Costs</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-6 text-center min-w-[200px]">
                <p className="text-5xl font-black mb-2">100%</p>
                <p className="text-emerald-50 font-bold">Your Control</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200 relative z-10 py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-6 text-slate-400" />
                <input
                  type="text"
                  placeholder="🔍 Search by location, postcode, or property ID..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400 shadow-lg text-lg"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-8 py-5 bg-white border-2 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-lg ${showFilters ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}
              >
                <SlidersHorizontal className={`size-6 ${showFilters ? 'text-blue-600' : 'text-slate-600'}`} />
                <span className={`text-base font-semibold ${showFilters ? 'text-blue-600' : 'text-slate-700'}`}>Filters</span>
                {Object.values(filters).filter(val => val !== "").length > 0 && (
                  <span className="size-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-black flex items-center justify-center">
                    {Object.values(filters).filter(val => val !== "").length}
                  </span>
                )}
              </button>
              <button className="px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center gap-2">
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
                        <h3 className="text-white font-black text-lg">Advanced Filters</h3>
                        <p className="text-white/80 text-xs font-medium">Refine your property search</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFilters({
                        propertyType: "",
                        minPrice: "",
                        maxPrice: "",
                        location: "",
                        minBeds: "",
                        minBaths: "",
                        searchQuery: filters.searchQuery
                      })}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-bold transition-all flex items-center gap-2"
                    >
                      <X className="size-4" />
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Home className="size-4 text-blue-600" />
                      Property Type
                    </label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 shadow-sm hover:border-slate-300"
                    >
                      <option value="">All Types</option>
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Villa">Villa</option>
                      <option value="Bungalow">Bungalow</option>
                    </select>
                  </div>

                  {/* Min Price */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="text-emerald-600">£</span>
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      placeholder="No minimum"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm hover:border-slate-300"
                    />
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="text-emerald-600">£</span>
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      placeholder="No maximum"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm hover:border-slate-300"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <MapPin className="size-4 text-red-600" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      placeholder="e.g. London, Manchester..."
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm hover:border-slate-300"
                    />
                  </div>

                  {/* Min Bedrooms */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Bed className="size-4 text-purple-600" />
                      Min Bedrooms
                    </label>
                    <select
                      value={filters.minBeds}
                      onChange={(e) => setFilters({ ...filters, minBeds: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 shadow-sm hover:border-slate-300"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  {/* Min Bathrooms */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Bath className="size-4 text-cyan-600" />
                      Min Bathrooms
                    </label>
                    <select
                      value={filters.minBaths}
                      onChange={(e) => setFilters({ ...filters, minBaths: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 shadow-sm hover:border-slate-300"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters Display */}
                {Object.values(filters).filter(val => val !== "").length > 0 && (
                  <div className="px-6 pb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4">
                      <p className="text-sm font-bold text-slate-900 mb-3">Active Filters:</p>
                      <div className="flex flex-wrap gap-2">
                        {filters.propertyType && (
                          <div className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                            <Home className="size-3" />
                            {filters.propertyType}
                            <button onClick={() => setFilters({ ...filters, propertyType: "" })} className="hover:bg-white/20 rounded-full p-0.5 transition-all">
                              <X className="size-3" />
                            </button>
                          </div>
                        )}
                        {filters.location && (
                          <div className="px-3 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                            <MapPin className="size-3" />
                            {filters.location}
                            <button onClick={() => setFilters({ ...filters, location: "" })} className="hover:bg-white/20 rounded-full p-0.5 transition-all">
                              <X className="size-3" />
                            </button>
                          </div>
                        )}
                        {filters.minBeds && (
                          <div className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                            <Bed className="size-3" />
                            {filters.minBeds}+ beds
                            <button onClick={() => setFilters({ ...filters, minBeds: "" })} className="hover:bg-white/20 rounded-full p-0.5 transition-all">
                              <X className="size-3" />
                            </button>
                          </div>
                        )}
                        {filters.minBaths && (
                          <div className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                            <Bath className="size-3" />
                            {filters.minBaths}+ baths
                            <button onClick={() => setFilters({ ...filters, minBaths: "" })} className="hover:bg-white/20 rounded-full p-0.5 transition-all">
                              <X className="size-3" />
                            </button>
                          </div>
                        )}
                        {(filters.minPrice || filters.maxPrice) && (
                          <div className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                            £{filters.minPrice && parseInt(filters.minPrice).toLocaleString()}
                            {filters.minPrice && filters.maxPrice && ' - '}
                            {filters.maxPrice && `£${parseInt(filters.maxPrice).toLocaleString()}`}
                            <button onClick={() => setFilters({ ...filters, minPrice: "", maxPrice: "" })} className="hover:bg-white/20 rounded-full p-0.5 transition-all">
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

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 relative z-10" data-section="properties">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6">
            {[
              { id: "all", label: "All Properties", count: 1247, icon: Building2, gradient: "from-slate-600 to-slate-800" },
              { id: "auction", label: "Live Auctions", count: 24, icon: Gavel, gradient: "from-red-500 to-orange-500" },
              { id: "sale", label: "For Sale", count: 856, icon: Zap, gradient: "from-blue-500 to-cyan-500" },
              { id: "featured", label: "Featured", count: 67, icon: Star, gradient: "from-purple-500 to-pink-500" },
            ].map((tab) => {
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
                  <Icon className={`size-4 ${activeTab === tab.id ? 'text-current' : 'text-slate-400'}`} />
                  {tab.label}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id 
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div className="container mx-auto px-6 py-10 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-slate-600 text-lg">
              Showing <span className="font-bold text-slate-900">{filteredProperties.length}</span> of <span className="font-bold text-slate-900">{properties.length}</span> properties
            </p>
            <p className="text-sm text-slate-500 mt-1">Updated 2 minutes ago ⚡</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => navigate(`/property-details?id=${property.id}`)}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 border-slate-200 hover:border-transparent group cursor-pointer hover:scale-[1.02] relative"
              style={{
                backgroundImage: property.featured 
                  ? `linear-gradient(to bottom, white 70%, transparent), linear-gradient(135deg, var(--tw-gradient-stops))`
                  : 'none'
              }}
            >
              {property.featured && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              )}

              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Featured Badge */}
                {property.featured && (
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black rounded-full flex items-center gap-1.5 shadow-xl animate-pulse">
                      <Award className="size-4" />
                      FEATURED ⭐
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                {!property.featured && (
                  <div className="absolute top-4 left-4">
                    {property.type === "auction" ? (
                      <div className={`px-3 py-2 bg-gradient-to-r ${property.gradient} text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xl`}>
                        <Clock className="size-3" />
                        {property.status}
                      </div>
                    ) : (
                      <div className={`px-3 py-2 bg-gradient-to-r ${property.gradient} text-white text-xs font-bold rounded-full shadow-xl`}>
                        {property.status}
                      </div>
                    )}
                  </div>
                )}

                {/* Favorite & Share */}
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleToggleWishlist(e, property.id.toString())}
                    className="size-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all"
                  >
                    <Heart 
                      className={`size-5 ${wishlistedProperties.includes(property.id.toString()) ? 'fill-red-500 text-red-500' : 'text-red-500'}`} 
                    />
                  </button>
                  <button 
                    onClick={(e) => handleShareProperty(e, property)}
                    className="size-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all"
                  >
                    <Share2 className="size-5 text-blue-600" />
                  </button>
                </div>

                {/* Virtual Tour Badge */}
                <div className="absolute bottom-4 left-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenVirtualTour(property);
                    }}
                    className="px-3 py-2 bg-black/70 backdrop-blur-md hover:bg-black/90 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xl transition-all hover:scale-110 cursor-pointer"
                  >
                    <Video className="size-4" />
                    360° Virtual Tour
                  </button>
                </div>

                {/* Time Left Badge */}
                {property.auctionEndDate && (
                  <div className="absolute bottom-4 right-4">
                    <CountdownTimer 
                      endDate={property.auctionEndDate} 
                      compact={true}
                      gradient={property.gradient}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
                    {property.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-slate-600 mb-4">
                  <MapPin className="size-4 text-blue-600" />
                  <span className="text-sm font-medium">{property.location}</span>
                </div>

                <div className="flex items-center justify-between gap-3 mb-5 pb-5 border-b-2 border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="size-9 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Bed className="size-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{property.beds}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="size-9 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Bath className="size-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{property.baths}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      <Maximize className="size-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{property.sqft}</span>
                  </div>
                </div>

                {property.type === "auction" ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600">Current Bid</span>
                      {property.bids && (
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">{property.bids} bids</span>
                      )}
                    </div>
                    <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {property.currentBid || property.price}
                    </p>
                    <button 
                      className={`w-full py-3.5 bg-gradient-to-r ${property.gradient} text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2`} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaceBid(property);
                      }}
                    >
                      Place Bid 🎯
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {property.price}
                    </p>
                    <button 
                      className={`w-full py-3.5 border-3 border-gradient bg-gradient-to-r ${property.gradient} bg-clip-border text-slate-900 rounded-xl font-bold hover:bg-gradient-to-r hover:${property.gradient} hover:text-white transition-all flex items-center justify-center gap-2 border-2`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/property-details?id=${property.id}`);
                      }}
                    >
                      View Details
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 inline-flex items-center gap-3">
            Load More Properties
            <Sparkles className="size-5" />
          </button>
        </div>
      </div>

      {/* Bid Modal */}
      {bidModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Gradient Background */}
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${selectedProperty.gradient}`} />
            
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 size-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all hover:rotate-90"
              onClick={() => setBidModalOpen(false)}
            >
              <X className="size-5 text-slate-600" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${selectedProperty.gradient} text-white rounded-full mb-4`}>
                <Gavel className="size-4" />
                <span className="text-sm font-bold">Live Auction</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {selectedProperty.title}
              </h3>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="size-4" />
                <span className="text-sm font-medium">{selectedProperty.location}</span>
              </div>
            </div>

            {/* Property Image */}
            <div className="mb-6 rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Current Bid Info */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Current Bid</p>
                  <p className={`text-3xl font-black bg-gradient-to-r ${selectedProperty.gradient} bg-clip-text text-transparent`}>
                    {selectedProperty.currentBid || selectedProperty.price}
                  </p>
                </div>
                {selectedProperty.bids && (
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">{selectedProperty.bids}</p>
                    <p className="text-xs font-semibold text-slate-600">Total Bids</p>
                  </div>
                )}
              </div>
              {selectedProperty.timeLeft && (
                <div className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${selectedProperty.gradient} text-white rounded-xl`}>
                  <Clock className="size-4" />
                  <span className="text-sm font-bold">Ends in {selectedProperty.timeLeft}</span>
                </div>
              )}
            </div>

            {/* Bid Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Your Bid Amount (£)
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">£</span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border-3 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-2xl placeholder:text-slate-300 shadow-sm"
                  placeholder="0"
                  min={parseFloat(selectedProperty.currentBid?.replace(/[£,]/g, "") || selectedProperty.price.replace(/[£,]/g, "")) + 1000}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                💡 Minimum bid increment: £1,000
              </p>
            </div>

            {/* Success Message */}
            {bidSuccess ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="size-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-900 text-lg">Bid Placed Successfully! 🎉</p>
                    <p className="text-sm text-green-700">You're now the highest bidder</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Bid Summary */}
                {bidAmount && (
                  <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-600">Your Bid:</span>
                      <span className={`text-xl font-black bg-gradient-to-r ${selectedProperty.gradient} bg-clip-text text-transparent`}>
                        £{parseInt(bidAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-600">Increase:</span>
                      <span className="text-sm font-bold text-green-600">
                        +£{Math.max(0, parseInt(bidAmount || "0") - parseFloat(selectedProperty.currentBid?.replace(/[£,]/g, "") || selectedProperty.price.replace(/[£,]/g, ""))).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                    onClick={() => setBidModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className={`flex-1 py-4 bg-gradient-to-r ${selectedProperty.gradient} text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                    onClick={handleSubmitBid}
                    disabled={!bidAmount}
                  >
                    <Gavel className="size-5" />
                    Place Bid
                  </button>
                </div>
              </>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-center text-slate-500 mt-4">
              🔒 By placing a bid, you agree to our terms and conditions
            </p>
          </div>
        </div>
      )}

      {/* Virtual Tour Modal */}
      <AnimatePresence>
        {virtualTourOpen && selectedProperty && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl w-full max-w-6xl shadow-2xl relative overflow-hidden border-2 border-white/10"
            >
              {/* Gradient Top Border */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${selectedProperty.gradient} origin-left`} 
              />
            
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 size-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all hover:rotate-90 z-10 border border-white/20"
              onClick={() => setVirtualTourOpen(false)}
            >
              <X className="size-6 text-white" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-b from-black/50 to-transparent p-8 relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${selectedProperty.gradient} text-white rounded-full mb-4 shadow-xl`}>
                    <Video className="size-5 animate-pulse" />
                    <span className="text-sm font-bold">360° Virtual Tour</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2">
                    {selectedProperty.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="size-5" />
                    <span className="text-lg font-medium">{selectedProperty.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-4xl font-black bg-gradient-to-r ${selectedProperty.gradient} bg-clip-text text-transparent`}>
                    {selectedProperty.price}
                  </p>
                  <div className="flex items-center gap-3 mt-2 justify-end">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                      <Bed className="size-4 text-white/80" />
                      <span className="text-sm font-bold text-white">{selectedProperty.beds}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                      <Bath className="size-4 text-white/80" />
                      <span className="text-sm font-bold text-white">{selectedProperty.baths}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                      <Maximize className="size-4 text-white/80" />
                      <span className="text-sm font-bold text-white">{selectedProperty.sqft}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Virtual Tour Viewer */}
            <div className="p-8 pt-0">
              <div className="bg-gradient-to-br from-blue-950 via-purple-950 to-pink-950 rounded-2xl overflow-hidden aspect-video relative border-2 border-white/10 shadow-2xl">
                {/* Main Image - Changes based on active room */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tourPlaying ? activeRoom : 'default'}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full absolute inset-0"
                  >
                    <ImageWithFallback
                      src={tourPlaying ? roomImages[activeRoom] : selectedProperty.image}
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Center Play/360 Indicator - Only show when not playing */}
                <AnimatePresence>
                  {!tourPlaying && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <motion.button 
                        onClick={() => setTourPlaying(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="size-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl cursor-pointer group"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Video className="size-12 text-white" />
                          </motion.div>
                        </div>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Interactive Hotspots - Only show when playing */}
                <AnimatePresence>
                  {tourPlaying && (
                    <>
                      {/* Pause Button - Top Right */}
                      <motion.button 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTourPlaying(false)}
                        className="absolute top-4 right-4 size-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40 shadow-xl z-10"
                      >
                        <Pause className="size-6 text-white" />
                      </motion.button>

                      <motion.button 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 1.1 }}
                        onClick={() => setActiveRoom("bedroom")}
                        className={`absolute top-1/4 left-1/4 size-10 bg-blue-500/80 backdrop-blur-md rounded-full flex items-center justify-center border-2 shadow-xl cursor-pointer ${activeRoom === "bedroom" ? "border-yellow-400 scale-125" : "border-white"}`}
                      >
                        <motion.span 
                          animate={activeRoom === "bedroom" ? { y: [0, -5, 0] } : {}}
                          transition={{ duration: 0.5, repeat: activeRoom === "bedroom" ? Infinity : 0 }}
                          className="text-white text-lg font-black"
                        >
                          🛏️
                        </motion.span>
                      </motion.button>
                      <motion.button 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 1.1 }}
                        onClick={() => setActiveRoom("bathroom")}
                        className={`absolute top-1/3 right-1/3 size-10 bg-purple-500/80 backdrop-blur-md rounded-full flex items-center justify-center border-2 shadow-xl cursor-pointer ${activeRoom === "bathroom" ? "border-yellow-400 scale-125" : "border-white"}`}
                      >
                        <motion.span 
                          animate={activeRoom === "bathroom" ? { y: [0, -5, 0] } : {}}
                          transition={{ duration: 0.5, repeat: activeRoom === "bathroom" ? Infinity : 0 }}
                          className="text-white text-lg font-black"
                        >
                          🛁
                        </motion.span>
                      </motion.button>
                      <motion.button 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 1.1 }}
                        onClick={() => setActiveRoom("kitchen")}
                        className={`absolute bottom-1/4 left-1/2 size-10 bg-emerald-500/80 backdrop-blur-md rounded-full flex items-center justify-center border-2 shadow-xl cursor-pointer ${activeRoom === "kitchen" ? "border-yellow-400 scale-125" : "border-white"}`}
                      >
                        <motion.span 
                          animate={activeRoom === "kitchen" ? { y: [0, -5, 0] } : {}}
                          transition={{ duration: 0.5, repeat: activeRoom === "kitchen" ? Infinity : 0 }}
                          className="text-white text-lg font-black"
                        >
                          🍳
                        </motion.span>
                      </motion.button>
                    </>
                  )}
                </AnimatePresence>

                {/* 360° Rotation Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <div className="px-6 py-3 bg-black/70 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full animate-pulse ${tourPlaying ? "bg-green-500" : "bg-orange-500"}`} />
                        <span className="text-white text-sm font-bold">
                          {tourPlaying ? "Interactive 360° View" : "Click Play to Start Tour"}
                        </span>
                      </div>
                      {tourPlaying && (
                        <span className="text-white/60 text-xs">Click hotspots or rooms below</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Navigation */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: "Living Room", icon: "🛋️", gradient: "from-blue-500 to-cyan-500", id: "living" },
                  { name: "Kitchen", icon: "🍳", gradient: "from-emerald-500 to-teal-500", id: "kitchen" },
                  { name: "Master Bedroom", icon: "🛏️", gradient: "from-purple-500 to-pink-500", id: "bedroom" },
                  { name: "Bathroom", icon: "🛁", gradient: "from-orange-500 to-red-500", id: "bathroom" },
                  { name: "Exterior", icon: "🏡", gradient: "from-yellow-500 to-amber-500", id: "exterior" },
                ].map((room, index) => (
                  <motion.button
                    key={room.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTourPlaying(true);
                      setActiveRoom(room.id);
                    }}
                    className={`p-4 bg-gradient-to-br ${room.gradient} rounded-2xl text-white font-bold shadow-lg hover:shadow-2xl border-2 group ${
                      activeRoom === room.id && tourPlaying ? "border-yellow-400 scale-105 ring-4 ring-yellow-400/30" : "border-white/20"
                    }`}
                  >
                    <div className={`text-3xl mb-2 transition-all ${activeRoom === room.id && tourPlaying ? "scale-125" : "group-hover:scale-110"}`}>{room.icon}</div>
                    <div className="text-sm">{room.name}</div>
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 flex gap-4"
              >
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setPropertyToShare(selectedProperty);
                    setShareModalOpen(true);
                  }}
                  className={`flex-1 py-4 bg-gradient-to-r ${selectedProperty.gradient} text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2`}
                >
                  <Share2 className="size-5" />
                  Share Virtual Tour
                </motion.button>
                {selectedProperty.type === "auction" ? (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setVirtualTourOpen(false);
                      handlePlaceBid(selectedProperty);
                    }}
                    className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <Gavel className="size-5" />
                    Place Bid Now
                  </motion.button>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setVirtualTourOpen(false);
                      navigate(`/property-details?id=${selectedProperty.id}`);
                    }}
                    className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronRight className="size-5" />
                    View Full Details
                  </motion.button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModalOpen && propertyToShare && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShareModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
                <button 
                  onClick={() => setShareModalOpen(false)}
                  className="absolute top-4 right-4 size-8 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
                >
                  <X className="size-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Share2 className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Share Property</h3>
                    <p className="text-sm text-white/80">{propertyToShare.title}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Social Share Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/property-details?id=' + propertyToShare.id)}`, '_blank')}
                    className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Facebook className="size-5" />
                    Facebook
                  </button>
                  <button 
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + '/property-details?id=' + propertyToShare.id)}&text=${encodeURIComponent(propertyToShare.title)}`, '_blank')}
                    className="p-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Twitter className="size-5" />
                    Twitter
                  </button>
                  <button 
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(propertyToShare.title + ' - ' + window.location.origin + '/property-details?id=' + propertyToShare.id)}`, '_blank')}
                    className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="size-5" />
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent(propertyToShare.title)}&body=${encodeURIComponent('Check out this property: ' + window.location.origin + '/property-details?id=' + propertyToShare.id)}`}
                    className="p-4 bg-slate-700 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Mail className="size-5" />
                    Email
                  </button>
                </div>

                {/* Copy Link */}
                <div className="pt-4 border-t-2 border-slate-100">
                  <p className="text-sm font-bold text-slate-600 mb-3">Or copy link</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={`${window.location.origin}/property-details?id=${propertyToShare.id}`}
                      className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm text-slate-700 font-medium"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <Link2 className="size-4" />
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Modal */}
      <AnimatePresence>
        {registrationModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setRegistrationModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 p-8 text-white relative">
                <button 
                  onClick={() => setRegistrationModalOpen(false)}
                  className="absolute top-6 right-6 size-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
                >
                  <X className="size-6" />
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Users className="size-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black">Register for Auctions</h3>
                    <p className="text-white/90 font-medium">Join thousands of active bidders</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-5" />
                    <span className="font-semibold">Free Registration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-5" />
                    <span className="font-semibold">Instant Approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-5" />
                    <span className="font-semibold">Secure Platform</span>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                      <Users className="size-5 text-orange-600" />
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">First Name *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="John"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Last Name *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Doe"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                      <Mail className="size-5 text-orange-600" />
                      Contact Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                        <input 
                          type="email" 
                          required
                          placeholder="john.doe@example.com"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="+44 7700 900000"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                      <MapPin className="size-5 text-orange-600" />
                      Address
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Street Address *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="123 Main Street"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">City *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="London"
                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Postcode *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="SW1A 1AA"
                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bidding Preferences */}
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                      <Gavel className="size-5 text-orange-600" />
                      Bidding Preferences
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Property Type Interest</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium">
                          <option>All Property Types</option>
                          <option>Residential</option>
                          <option>Commercial</option>
                          <option>Land</option>
                          <option>Mixed Use</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Budget Range</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium">
                          <option>Under £500,000</option>
                          <option>£500,000 - £1,000,000</option>
                          <option>£1,000,000 - £2,000,000</option>
                          <option>£2,000,000 - £5,000,000</option>
                          <option>Over £5,000,000</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        required
                        className="mt-1 size-5 rounded border-2 border-orange-300 text-orange-600 focus:ring-2 focus:ring-orange-500"
                      />
                      <div className="text-sm">
                        <p className="font-bold text-slate-900 mb-1">I agree to the terms and conditions *</p>
                        <p className="text-slate-600">
                          By registering, you agree to our Terms of Service and Privacy Policy. You will receive auction notifications and property alerts.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                  >
                    <CheckCircle className="size-6" />
                    Complete Registration
                    <ChevronRight className="size-5" />
                  </motion.button>

                  <p className="text-center text-sm text-slate-600">
                    Already registered? <button type="button" className="text-orange-600 font-bold hover:underline">Sign In</button>
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}