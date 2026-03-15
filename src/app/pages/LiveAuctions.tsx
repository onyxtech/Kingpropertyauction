import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Gavel,
  Users,
  TrendingUp,
  Heart,
  Share2,
  Video,
  Clock,
  MapPin,
  Bed,
  Bath,
  Maximize,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  X,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LiveAuctions() {
  const navigate = useNavigate();
  const [selectedAuction, setSelectedAuction] = useState<number | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const liveAuctions = [
    {
      id: 1,
      title: "Luxury Estate Mansion",
      location: "Mayfair, London",
      image: "https://images.unsplash.com/photo-1627257363565-4bc682c69e8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBlc3RhdGUlMjBleHRlcmlvcnxlbnwxfHx8fDE3NzE0MzcyOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      startingBid: 2400000,
      currentBid: 2850000,
      nextMinBid: 2875000,
      reservePrice: 2900000,
      reserveMet: false,
      bids: 47,
      watchers: 234,
      beds: 7,
      baths: 6,
      sqft: "8,500",
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 34 * 60 * 1000), // 2h 34m
      status: "hot",
      leadingBidder: "J.Smith***",
      bidHistory: [
        { bidder: "J.Smith***", amount: 2850000, time: "2 mins ago" },
        { bidder: "M.Johnson***", amount: 2825000, time: "5 mins ago" },
        { bidder: "J.Smith***", amount: 2800000, time: "8 mins ago" },
        { bidder: "A.Williams***", amount: 2775000, time: "12 mins ago" },
        { bidder: "M.Johnson***", amount: 2750000, time: "15 mins ago" },
      ],
    },
    {
      id: 2,
      title: "Modern Mansion Villa",
      location: "Knightsbridge, London",
      image: "https://images.unsplash.com/photo-1609273589499-d5afdb6bdf52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtYW5zaW9uJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MTM0MjcyOXww&ixlib=rb-4.1.0&q=80&w=1080",
      startingBid: 1800000,
      currentBid: 2150000,
      nextMinBid: 2175000,
      reservePrice: 2200000,
      reserveMet: false,
      bids: 32,
      watchers: 189,
      beds: 5,
      baths: 4,
      sqft: "6,200",
      endTime: new Date(Date.now() + 1 * 60 * 60 * 1000 + 18 * 60 * 1000), // 1h 18m
      status: "active",
      leadingBidder: "R.Davis***",
      bidHistory: [
        { bidder: "R.Davis***", amount: 2150000, time: "1 min ago" },
        { bidder: "K.Wilson***", amount: 2125000, time: "6 mins ago" },
        { bidder: "R.Davis***", amount: 2100000, time: "11 mins ago" },
        { bidder: "T.Brown***", amount: 2075000, time: "18 mins ago" },
      ],
    },
    {
      id: 3,
      title: "Elegant Townhouse",
      location: "Chelsea, London",
      image: "https://images.unsplash.com/photo-1740596400206-f894025300b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwdG93bmhvdXNlfGVufDF8fHx8MTc3MTQzNzI5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      startingBid: 1500000,
      currentBid: 1725000,
      nextMinBid: 1750000,
      reservePrice: 1700000,
      reserveMet: true,
      bids: 28,
      watchers: 145,
      beds: 4,
      baths: 3,
      sqft: "3,800",
      endTime: new Date(Date.now() + 45 * 60 * 1000), // 45m
      status: "ending",
      leadingBidder: "L.Anderson***",
      bidHistory: [
        { bidder: "L.Anderson***", amount: 1725000, time: "Just now" },
        { bidder: "P.Taylor***", amount: 1700000, time: "3 mins ago" },
        { bidder: "L.Anderson***", amount: 1675000, time: "9 mins ago" },
      ],
    },
    {
      id: 4,
      title: "Waterfront Property",
      location: "Richmond, London",
      image: "https://images.unsplash.com/photo-1574120582683-1adf79c5dfd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmZyb250JTIwcHJvcGVydHl8ZW58MXx8fHwxNzcxNDM3MjkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      startingBid: 2800000,
      currentBid: 3250000,
      nextMinBid: 3275000,
      reservePrice: 3200000,
      reserveMet: true,
      bids: 56,
      watchers: 312,
      beds: 6,
      baths: 5,
      sqft: "7,400",
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000 + 12 * 60 * 1000), // 4h 12m
      status: "active",
      leadingBidder: "C.Martinez***",
      bidHistory: [
        { bidder: "C.Martinez***", amount: 3250000, time: "30 secs ago" },
        { bidder: "N.Garcia***", amount: 3225000, time: "4 mins ago" },
        { bidder: "C.Martinez***", amount: 3200000, time: "7 mins ago" },
        { bidder: "B.Lee***", amount: 3175000, time: "10 mins ago" },
        { bidder: "N.Garcia***", amount: 3150000, time: "14 mins ago" },
      ],
    },
  ];

  const [timers, setTimers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers: { [key: number]: string } = {};
      liveAuctions.forEach((auction) => {
        const now = new Date().getTime();
        const end = auction.endTime.getTime();
        const distance = end - now;

        if (distance > 0) {
          const hours = Math.floor(distance / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          newTimers[auction.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimers[auction.id] = "ENDED";
        }
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return `£${(price / 1000).toFixed(0)}k`;
  };

  const formatFullPrice = (price: number) => {
    return `£${price.toLocaleString()}`;
  };

  const handlePlaceBid = (auctionId: number) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    alert(`Bid placed for auction ${auctionId}!`);
    setBidAmount("");
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
  };

  const handleAuthSubmit = () => {
    if (isLogin) {
      // Login logic
      setIsAuthenticated(true);
      setShowAuthModal(false);
    } else {
      // Register logic
      setIsAuthenticated(true);
      setShowAuthModal(false);
    }
  };

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <button
          onClick={() => navigate("/website")}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Properties
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 text-white relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/30 backdrop-blur-md rounded-full mb-6 shadow-lg">
              <div className="size-3 bg-white rounded-full animate-pulse shadow-lg shadow-white/50" />
              <span className="text-sm font-bold">🔥 Live Bidding Active - 24 Properties Now</span>
            </div>
            <h1 className="text-6xl font-black mb-6 drop-shadow-lg">Property Auctions Live Now</h1>
            <p className="text-2xl text-white/90 mb-8 font-medium">
              Real-time bidding on premium properties. Place your bid and secure your dream home today.
              <br />
              <span className="text-yellow-200">💎 Transparent • Secure • Efficient</span>
            </p>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 shadow-xl">
                <Gavel className="size-6" />
                <div>
                  <p className="text-3xl font-black">24</p>
                  <p className="text-sm font-semibold text-white/80">Live Auctions</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 shadow-xl">
                <Users className="size-6" />
                <div>
                  <p className="text-3xl font-black">1,847</p>
                  <p className="text-sm font-semibold text-white/80">Active Bidders</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 shadow-xl">
                <TrendingUp className="size-6" />
                <div>
                  <p className="text-3xl font-black">£12.4M</p>
                  <p className="text-sm font-semibold text-white/80">Total Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Grid */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {liveAuctions.map((auction) => (
            <div
              key={auction.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-slate-200 hover:border-blue-500 transition-all"
            >
              {/* Image Section */}
              <div className="relative h-64">
                <ImageWithFallback
                  src={auction.image}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  {auction.status === "hot" && (
                    <div className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1 animate-pulse">
                      🔥 HOT
                    </div>
                  )}
                  {auction.status === "ending" && (
                    <div className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      ENDING SOON
                    </div>
                  )}
                  {auction.status === "active" && (
                    <div className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <div className="size-2 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button className="size-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                    <Heart className="size-5 text-slate-600" />
                  </button>
                  <button className="size-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                    <Share2 className="size-5 text-slate-600" />
                  </button>
                </div>

                {/* Virtual Tour */}
                <div className="absolute bottom-4 left-4">
                  <div className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg flex items-center gap-2">
                    <Video className="size-4" />
                    360° Virtual Tour
                  </div>
                </div>

                {/* Timer */}
                <div className="absolute bottom-4 right-4">
                  <div className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4" />
                      <span className="font-bold">{timers[auction.id] || "Loading..."}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Title & Location */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{auction.title}</h3>
                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="size-4" />
                    <span className="text-sm">{auction.location}</span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="flex items-center gap-6 mb-4 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Bed className="size-5 text-slate-600" />
                    <span className="text-sm font-medium text-slate-900">{auction.beds} Beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="size-5 text-slate-600" />
                    <span className="text-sm font-medium text-slate-900">{auction.baths} Baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="size-5 text-slate-600" />
                    <span className="text-sm font-medium text-slate-900">{auction.sqft} sqft</span>
                  </div>
                </div>

                {/* Bidding Info */}
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Current Bid</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatFullPrice(auction.currentBid)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Next Min Bid</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {formatFullPrice(auction.nextMinBid)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-600">
                        <strong className="text-slate-900">{auction.bids}</strong> bids
                      </span>
                      <span className="text-slate-600">
                        <strong className="text-slate-900">{auction.watchers}</strong> watching
                      </span>
                    </div>
                    {auction.reserveMet ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="size-4" />
                        <span className="text-xs font-medium">Reserve Met</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertCircle className="size-4" />
                        <span className="text-xs font-medium">Reserve Not Met</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-600">
                    Leading: <span className="font-medium text-slate-900">{auction.leadingBidder}</span>
                  </div>
                </div>

                {/* Bidding Actions */}
                <div className="flex gap-3 mb-4">
                  <input
                    type="number"
                    placeholder={`Min: ${formatFullPrice(auction.nextMinBid)}`}
                    className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                  <button
                    onClick={() => handlePlaceBid(auction.id)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-shadow"
                  >
                    Place Bid
                  </button>
                </div>

                {/* View Details */}
                <button
                  onClick={() => setSelectedAuction(selectedAuction === auction.id ? null : auction.id)}
                  className="w-full py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  {selectedAuction === auction.id ? "Hide Details" : "View Bid History"}
                  <ChevronRight className={`size-4 transition-transform ${selectedAuction === auction.id ? "rotate-90" : ""}`} />
                </button>

                {/* Bid History - Expandable */}
                {selectedAuction === auction.id && (
                  <div className="mt-4 bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Gavel className="size-4" />
                      Recent Bid History
                    </h4>
                    <div className="space-y-2">
                      {auction.bidHistory.map((bid, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">
                                {bid.bidder.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{bid.bidder}</p>
                              <p className="text-xs text-slate-600">{bid.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">
                              {formatFullPrice(bid.amount)}
                            </p>
                            {index === 0 && (
                              <span className="text-xs text-green-600 font-medium">Highest Bid</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-blue-900/40 to-purple-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            {/* Decorative Gradient Background */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {isLogin ? "Welcome Back! 👋" : "Join Us! 🎉"}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {isLogin ? "Sign in to start bidding" : "Create your account to bid"}
                </p>
              </div>
              <button
                onClick={handleAuthClose}
                className="size-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="size-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 size-5 text-slate-400" />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium transition-colors"
                      value={formData.firstName}
                      onChange={handleAuthChange}
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 size-5 text-slate-400" />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium transition-colors"
                      value={formData.lastName}
                      onChange={handleAuthChange}
                    />
                  </div>
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 size-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium transition-colors"
                  value={formData.email}
                  onChange={handleAuthChange}
                />
              </div>
              
              {!isLogin && (
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 size-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    value={formData.phone}
                    onChange={handleAuthChange}
                  />
                </div>
              )}
              
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 size-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium transition-colors"
                  value={formData.password}
                  onChange={handleAuthChange}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 size-5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              
              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 size-5 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    value={formData.confirmPassword}
                    onChange={handleAuthChange}
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={handleAuthSubmit}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {isLogin ? "Sign In 🚀" : "Create Account 🎯"}
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Register Now
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}