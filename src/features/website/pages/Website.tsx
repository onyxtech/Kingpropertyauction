import { useState, useEffect, useRef } from "react";
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
  User,
  Eye,
  EyeOff,
  Phone,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "@/features/shared/figma/ImageWithFallback";
import Header from "@/features/shared/layout/Header";
import Footer from "@/features/shared/layout/Footer";
import CountdownTimer from "../../shared/ui/CountdownTimer";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";
import { useBiddingApi } from "@/features/bid/api/useBiddingApi";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useAuthApi } from "@/features/auth/api/useAuthApi";
import AuthModal from "@/features/shared/components/AuthModal";
import BidModal from "@/features/shared/components/BidModal";

export default function Website() {
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuthStore();
  const authApi = useAuthApi();
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
  const [wishlistedProperties, setWishlistedProperties] = useState<string[]>(
    [],
  );
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
    searchQuery: "",
  });

  // ──────────────── AUTH MODAL STATE (like LiveAuctions) ────────────────
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authFormData, setAuthFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // ──────────────── NOTIFICATION SYSTEM (like LiveAuctions) ────────────────
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ──────────────── FETCH REAL DATA ────────────────
  const { useGetProperties } = usePropertyApi();
  const { data: propertiesData, isLoading: propertiesLoading } =
    useGetProperties({ pageSize: 50 });
  const properties = propertiesData?.data || [];

  const { useGetAuctions } = useAuctionApi();
  const { data: auctionsData } = useGetAuctions({ status: "live" });
  const liveAuctions = auctionsData?.data || [];
  const allAuctionsData = useAuctionApi().useGetAuctions({});
  const allAuctions = allAuctionsData.data?.data || [];

  const { usePlaceBid } = useBiddingApi();
  const placeBidMutation = usePlaceBid();
  const queryClient = useQueryClient();

  // ──────────────── DERIVED COUNTS ────────────────
  const totalProperties = properties.length || 0;
  const totalUsers =
    allAuctions.reduce(
      (sum: number, a: any) => sum + (a.totalBidders || 0),
      0,
    ) || 0;
  const totalBids =
    allAuctions.reduce((sum: number, a: any) => sum + (a.totalBids || 0), 0) ||
    0;
  const liveAuctionCount = liveAuctions.length || 0;
  // Calculate total auction value from live auctions
  const totalAuctionValue = liveAuctions.reduce((sum: number, auction: any) => {
    return sum + (auction.startingBid || 0);
  }, 0);

  // ──────────────── AUTH HANDLERS (like LiveAuctions) ────────────────
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (isLogin) {
        const result = await authApi.login({
          email: authFormData.email,
          password: authFormData.password,
        });
        if (result.success && result.data) {
          login(result.data.token, {
            id: result.data.user.id,
            name: result.data.user.fullName,
            email: result.data.user.email,
            role: result.data.user.role,
          });
          setShowAuthModal(false);
          showNotification("Logged in successfully!", "success");
          // Reset form
          setAuthFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          setAuthError(result.error || "Login failed");
        }
      } else {
        if (authFormData.password !== authFormData.confirmPassword) {
          setAuthError("Passwords do not match");
          setAuthLoading(false);
          return;
        }
        const result = await authApi.register({
          firstName: authFormData.firstName,
          lastName: authFormData.lastName,
          email: authFormData.email,
          password: authFormData.password,
          phoneNumber: authFormData.phone,
          userType: "buyer",
          termsAccepted: true,
        });
        if (result.success && result.data) {
          login(result.data.token, {
            id: result.data.user.id,
            name: result.data.user.fullName,
            email: result.data.user.email,
            role: result.data.user.role,
          });
          setShowAuthModal(false);
          showNotification("Account created successfully!", "success");
          setAuthFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          setAuthError(result.error || "Registration failed");
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "Something went wrong");
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePlaceBid = (property: any) => {
    // 1. Must be logged in
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // 2. Admin/Agent cannot bid
    if (user?.role === "admin" || user?.role === "agent") {
      showNotification(
        "Admins and agents cannot place bids. Please use a buyer account.",
        "error",
      );
      return;
    }

    setSelectedProperty(property);
    setBidModalOpen(true);
    setBidSuccess(false);
    setBidAmount("");
  };

  const handleSubmitBid = async () => {
    if (!bidAmount || !selectedProperty) return;

    const bidIncrement = selectedProperty.pricing?.minimumBidIncrement || 1000;
    const currentBid =
      selectedProperty.currentBid ||
      selectedProperty.pricing?.startingAuctionPrice ||
      0;
    const nextMinBid = currentBid + bidIncrement;
    const newBidValue = parseFloat(bidAmount);

    // Validate bid amount against next minimum bid
    if (newBidValue < nextMinBid) {
      showNotification(
        `Your bid must be at least £${nextMinBid.toLocaleString()} (current bid + £${bidIncrement.toLocaleString()} increment)`,
        "error",
      );
      return;
    }

    // Find matching auction
    const matchingAuction = allAuctions.find((auction: any) =>
      auction.properties?.some(
        (p: any) =>
          (typeof p === "string" ? p : p._id) === selectedProperty._id,
      ),
    );

    if (!matchingAuction) {
      showNotification(
        "This property is not currently part of any live auction.",
        "error",
      );
      return;
    }

    try {
      await placeBidMutation.mutateAsync({
        auction: matchingAuction._id,
        property: selectedProperty._id,
        amount: newBidValue,
      });
      setBidSuccess(true);
      showNotification("Bid placed successfully! 🎉", "success");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      setTimeout(() => {
        setBidModalOpen(false);
        setBidSuccess(false);
        setBidAmount("");
      }, 2000);
    } catch (error: any) {
      showNotification(error.message || "Failed to place bid.", "error");
    }
  };

  const handleOpenVirtualTour = (property: any) => {
    setSelectedProperty(property);
    setVirtualTourOpen(true);
    setTourPlaying(false);
    setActiveRoom("living");
  };

  const roomImages: Record<string, string> = {
    living:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc0MDAwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    kitchen:
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVufGVufDF8fHx8MTc0MDAwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    bedroom:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tfGVufDF8fHx8MTc0MDAwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    bathroom:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbXxlbnwxfHx8fDE3NDAwMDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    exterior:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc0MDAwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
  };

  const handleToggleWishlist = (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    setWishlistedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId],
    );
  };

  const handleShareProperty = (e: React.MouseEvent, property: any) => {
    e.stopPropagation();
    setPropertyToShare(property);
    setShareModalOpen(true);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/properties/${propertyToShare.slug || propertyToShare._id}`;
    navigator.clipboard.writeText(link);
    alert("Property link copied to clipboard!");
  };

  // ──────────────── FILTER & SORT (from real data) ────────────────
  let filteredProperties = properties.filter((property: any) => {
    // Tab filtering - use listingType
    if (activeTab === "auction" && property.listingType !== "auction")
      return false;
    if (activeTab === "sale" && property.listingType !== "direct_sale")
      return false;
    if (activeTab === "featured" && !property.featured) return false;

    // Property type filter
    if (
      filters.propertyType &&
      property.propertyType !== filters.propertyType.toLowerCase()
    )
      return false;

    // Price filter
    const priceValue =
      property.pricing?.reservePrice ||
      property.pricing?.startingAuctionPrice ||
      0;
    const minPriceValue = filters.minPrice ? parseInt(filters.minPrice) : 0;
    const maxPriceValue = filters.maxPrice
      ? parseInt(filters.maxPrice)
      : Infinity;
    if (priceValue < minPriceValue || priceValue > maxPriceValue) return false;

    // Location filter
    const locationStr = `${property.location?.city || ""} ${property.location?.area || ""} ${property.location?.state || ""}`;
    if (
      filters.location &&
      !locationStr.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;

    // Beds filter
    if (
      filters.minBeds &&
      (property.specifications?.bedrooms || 0) < parseInt(filters.minBeds)
    )
      return false;

    // Baths filter
    if (
      filters.minBaths &&
      (property.specifications?.bathrooms || 0) < parseInt(filters.minBaths)
    )
      return false;

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = (property.propertyTitle || "")
        .toLowerCase()
        .includes(query);
      const matchesLocation = locationStr.toLowerCase().includes(query);
      if (!matchesTitle && !matchesLocation) return false;
    }

    return true;
  });

  // Sort
  filteredProperties = [...filteredProperties].sort((a: any, b: any) => {
    const priceA =
      a.pricing?.reservePrice || a.pricing?.startingAuctionPrice || 0;
    const priceB =
      b.pricing?.reservePrice || b.pricing?.startingAuctionPrice || 0;
    switch (sortBy) {
      case "lowToHigh":
        return priceA - priceB;
      case "highToLow":
        return priceB - priceA;
      case "endingSoon":
        return 0;
      default:
        return 0;
    }
  });

  // Counts for tabs
  const auctionCount = properties.filter(
    (p: any) => p.listingType === "auction",
  ).length;
  const saleCount = properties.filter(
    (p: any) => p.listingType === "direct_sale",
  ).length;
  const featuredCount = properties.filter((p: any) => p.featured).length;

  // Helper to get property image
  const getPropertyImage = (property: any) => {
    if (property.media?.propertyImages?.length > 0) {
      const img = property.media.propertyImages[0];
      return img.startsWith("http") ? img : `/uploads/properties/${img}`;
    }
    return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600";
  };

  // Helper to format price
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper to get auction info for a property (like LiveAuctions does)
  // Helper to get auction info for a property
  const getAuctionInfo = (property: any) => {
    const matchingAuction = allAuctions.find((auction: any) =>
      auction.properties?.some(
        (p: any) => (typeof p === "string" ? p : p._id) === property._id,
      ),
    );
    return matchingAuction || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* ──────────────── NOTIFICATION TOAST ──────────────── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-6 left-1/2 z-[100] pointer-events-none"
          >
            <div
              className={`px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border-2 flex items-center gap-3 ${
                notification.type === "success"
                  ? "bg-green-500/95 border-green-400 text-white"
                  : "bg-red-500/95 border-red-400 text-white"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="size-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="size-5 flex-shrink-0" />
              )}
              <span className="font-bold text-sm">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──────────────── AUTH MODAL (like LiveAuctions) ──────────────── */}
      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        isLogin={isLogin}
        onToggleLogin={() => {
          setIsLogin(!isLogin);
          setAuthError("");
        }}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        authError={authError}
        authLoading={authLoading}
        formData={authFormData}
        onFormChange={(field, value) =>
          setAuthFormData((prev) => ({ ...prev, [field]: value }))
        }
        onSubmit={handleAuthSubmit}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 size-72 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
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
              <div
                className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1.5s" }}
              />
            </div>

            <div className="container mx-auto px-6 py-16 relative z-10">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
                  <Sparkles className="size-4 text-yellow-300 animate-pulse" />
                  <span className="text-sm font-bold text-white">
                    ✨ Premium Properties • AI-Powered Search • Instant Viewing
                  </span>
                </div>

                <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                  Find Your Perfect Property
                  <br />
                  <span className="text-cyan-300">With Confidence</span>
                </h1>

                <p className="text-2xl text-white/90 mb-10 font-medium">
                  Browse thousands of properties or participate in live auctions
                  to secure the best deals.
                  <br />
                  <span className="text-yellow-200">
                    💎 Transparent • Secure • Verified
                  </span>
                </p>

                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <TrendingUp className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">
                        {totalProperties.toLocaleString()}
                      </p>
                      <p className="text-sm font-semibold text-white/80">
                        Active Listings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <Gavel className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">
                        {liveAuctionCount}
                      </p>
                      <p className="text-sm font-semibold text-white/80">
                        Live Auctions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Users className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">
                        {allAuctions
                          .reduce(
                            (sum: number, a: any) =>
                              sum + (a.totalBidders || 0),
                            0,
                          )
                          .toLocaleString()}
                      </p>
                      <p className="text-sm font-semibold text-white/80">
                        Active Bidders
                      </p>
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
              <div
                className="absolute bottom-0 right-0 size-96 bg-yellow-300 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1.5s" }}
              />
            </div>

            <div className="container mx-auto px-6 py-16 relative z-10">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
                  <Gavel className="size-4 text-yellow-300 animate-pulse" />
                  <span className="text-sm font-bold text-white">
                    🔴 Live Bidding • Real-Time Updates • Instant Wins
                  </span>
                </div>

                <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                  Online Property Auctions
                  <br />
                  <span className="text-yellow-300">Bid from Anywhere</span>
                </h1>

                <p className="text-2xl text-white/90 mb-10 font-medium">
                  Join live auctions from the comfort of your home. Real-time
                  bidding with instant notifications.
                  <br />
                  <span className="text-yellow-200">
                    🏆 Competitive • Fair • Transparent
                  </span>
                </p>

                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <Gavel className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">
                        {liveAuctionCount}
                      </p>
                      <p className="text-sm font-semibold text-white/80">
                        Live Auctions Now
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg">
                      <Zap className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">
                        {new Intl.NumberFormat("en-GB", {
                          style: "currency",
                          currency: "GBP",
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(totalAuctionValue)}
                      </p>
                      <p className="text-sm font-semibold text-white/80">
                        Total Value
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <Users className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">
                        {totalBids.toLocaleString()}
                      </p>
                      <p className="text-sm font-semibold text-white/80">
                        Total Bids
                      </p>
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
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 size-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30">
                <Clock className="size-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-bold text-white">
                  Fast Sale Guarantee
                </span>
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
                  <span className="text-white font-semibold">
                    You Control The Price
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-6 text-yellow-300 flex-shrink-0" />
                  <span className="text-white font-semibold">
                    Zero Upfront Costs
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-6 text-yellow-300 flex-shrink-0" />
                  <span className="text-white font-semibold">
                    No Sale, No Fee
                  </span>
                </div>
              </div>

              <button className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3 group">
                <Tag className="size-6" />
                <span>Get Your Free Valuation</span>
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

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
                {Object.values(filters).filter((val) => val !== "").length >
                  0 && (
                  <span className="size-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-black flex items-center justify-center">
                    {Object.values(filters).filter((val) => val !== "").length}
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
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className=" text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="text-emerald-600">£</span>
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                      placeholder="No minimum"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm hover:border-slate-300"
                    />
                  </div>

                  <div>
                    <label className=" text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="text-emerald-600">£</span>
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                      placeholder="No maximum"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm hover:border-slate-300"
                    />
                  </div>

                  <div>
                    <label className=" text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <MapPin className="size-4 text-red-600" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                      placeholder="e.g. London, Manchester..."
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm hover:border-slate-300"
                    />
                  </div>

                  <div>
                    <label className=" text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
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
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  <div>
                    <label className=" text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Bath className="size-4 text-cyan-600" />
                      Min Bathrooms
                    </label>
                    <select
                      value={filters.minBaths}
                      onChange={(e) =>
                        setFilters({ ...filters, minBaths: e.target.value })
                      }
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

                {Object.values(filters).filter((val) => val !== "").length >
                  0 && (
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
                            {filters.minBeds}+ beds
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
                            {filters.minBaths}+ baths
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

      {/* Tabs */}
      <div
        className="bg-white/80 backdrop-blur-xl border-b border-slate-200 relative z-10"
        data-section="properties"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6">
            {[
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

      {/* Property Grid */}
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
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="endingSoon">Ending Soon</option>
          </select>
        </div>

        {propertiesLoading ? (
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
            <p className="text-slate-500">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property: any) => {
              const imageUrl = getPropertyImage(property);
              const auctionInfo = getAuctionInfo(property);
              const isAuction =
                property.listingType === "auction" &&
                auctionInfo !== null &&
                auctionInfo.status === "live";
              const isLiveAuction = isAuction;
              const auction = getAuctionInfo(property);
              const auctionEndDate =
                isAuction && auctionInfo ? auctionInfo.endDateTime : null;
              const gradient = isAuction
                ? "from-red-500 to-orange-500"
                : "from-blue-500 to-cyan-500";

              // Price display - use current bid if auction, otherwise reserve price
              // Price display - use property's own currentBid
              const displayPrice = isAuction
                ? formatPrice(
                    property.currentBid ||
                      property.pricing?.startingAuctionPrice ||
                      0,
                  )
                : formatPrice(
                    property.pricing?.reservePrice ||
                      property.pricing?.startingAuctionPrice ||
                      0,
                  );

              const nextMinBid = isAuction
                ? (property.currentBid ||
                    property.pricing?.startingAuctionPrice ||
                    0) + (property.pricing?.minimumBidIncrement || 1000)
                : 0;

              const reserveMet = isAuction
                ? (property.currentBid || 0) >=
                  (property.pricing?.reservePrice || 0)
                : false;

              const startingBid = property.pricing?.startingAuctionPrice || 0;
              const reservePrice = property.pricing?.reservePrice || 0;

              return (
                <div
                  key={property._id}
                  onClick={() =>
                    navigate(`/properties/${property.slug || property._id}`)
                  }
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 border-slate-200 hover:border-transparent group cursor-pointer hover:scale-[1.02] relative"
                >
                  {property.featured && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                  )}

                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={property.propertyTitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {property.featured && (
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black rounded-full flex items-center gap-1.5 shadow-xl">
                          <Award className="size-4" />
                          FEATURED
                        </div>
                      </div>
                    )}

                    {!property.featured && (
                      <div className="absolute top-4 left-4">
                        {property.listingType === "auction" ? (
                          isAuction ? (
                            <div className="px-3 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xl">
                              <Clock className="size-3" />
                              Live Auction
                            </div>
                          ) : auctionInfo &&
                            auctionInfo.status === "completed" ? (
                            property.propertyStatus === "sold" ? (
                              <div className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-xl">
                                🎉 Sold
                              </div>
                            ) : (
                              <div className="px-3 py-2 bg-gradient-to-r from-slate-500 to-slate-700 text-white text-xs font-bold rounded-full shadow-xl">
                                Unsold
                              </div>
                            )
                          ) : (
                            <div className="px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xl">
                              <Clock className="size-3" />
                              Upcoming Auction
                            </div>
                          )
                        ) : (
                          <div
                            className={`px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full shadow-xl`}
                          >
                            For Sale
                          </div>
                        )}
                      </div>
                    )}

                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleToggleWishlist(e, property._id)}
                        className="size-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all"
                      >
                        <Heart
                          className={`size-5 ${wishlistedProperties.includes(property._id) ? "fill-red-500 text-red-500" : "text-red-500"}`}
                        />
                      </button>
                      <button
                        onClick={(e) => handleShareProperty(e, property)}
                        className="size-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all"
                      >
                        <Share2 className="size-5 text-blue-600" />
                      </button>
                    </div>

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

                    {auctionEndDate && (
                      <div className="absolute bottom-4 right-4">
                        <CountdownTimer
                          endDate={new Date(auctionEndDate)}
                          compact={true}
                          gradient={gradient}
                          onEnded={async () => {
                            try {
                              await fetch(`/api/auctions/check-ended-public`, {
                                method: "POST",
                              });
                            } catch (e) {}
                            queryClient.invalidateQueries({
                              queryKey: ["properties"],
                            });
                            queryClient.invalidateQueries({
                              queryKey: ["auctions"],
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
                        {property.propertyTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 mb-4">
                      <MapPin className="size-4 text-blue-600" />
                      <span className="text-sm font-medium">
                        {property.location?.city ||
                          property.location?.area ||
                          "Location TBD"}
                        , {property.location?.state || "UK"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 mb-5 pb-5 border-b-2 border-slate-100">
                      <div className="flex items-center gap-2 text-slate-600">
                        <div className="size-9 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                          <Bed className="size-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {property.specifications?.bedrooms || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <div className="size-9 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <Bath className="size-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {property.specifications?.bathrooms || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                          <Maximize className="size-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {property.specifications?.totalArea?.toLocaleString() ||
                            "N/A"}{" "}
                          sqft
                        </span>
                      </div>
                    </div>

                    {property.listingType === "auction" ? (
                      isAuction ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-600">
                              Current Bid
                            </span>
                            {property.totalBids > 0 && (
                              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                                {property.totalBids} bids
                              </span>
                            )}
                          </div>
                          <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {displayPrice}
                          </p>
                          {reservePrice > 0 && (
                            <div
                              className={`flex items-center gap-1.5 text-xs font-bold ${reserveMet ? "text-green-600" : "text-amber-600"}`}
                            >
                              {reserveMet ? (
                                <CheckCircle className="size-3.5" />
                              ) : (
                                <AlertCircle className="size-3.5" />
                              )}
                              {reserveMet ? "Reserve Met" : "Reserve Not Met"}
                            </div>
                          )}
                          {nextMinBid > 0 && (
                            <p className="text-xs text-slate-500">
                              Next min bid:{" "}
                              <span className="font-bold text-slate-700">
                                £{nextMinBid.toLocaleString()}
                              </span>
                            </p>
                          )}
                          <button
                            className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaceBid(property);
                            }}
                          >
                            <Gavel className="size-4" />
                            Place Bid
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs text-amber-600 font-semibold">
                            ⏳ This property is not yet in a live auction
                          </p>
                          <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {formatPrice(
                              property.pricing?.startingAuctionPrice || 0,
                            )}
                          </p>
                          <button
                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/properties/${property.slug || property._id}`,
                              );
                            }}
                          >
                            View Details
                            <ChevronRight className="size-4" />
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="space-y-3">
                        <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {displayPrice}
                        </p>
                        <button
                          className={`w-full py-3.5 border-gradient bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-border text-slate-900 rounded-xl font-bold hover:bg-gradient-to-r hover:text-white transition-all flex items-center justify-center gap-2 border-2`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/properties/${property.slug || property._id}`,
                            );
                          }}
                        >
                          View Details
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bid Modal */}
      <BidModal
        show={bidModalOpen}
        onClose={() => setBidModalOpen(false)}
        property={selectedProperty}
        currentBid={
          selectedProperty?.currentBid ||
          selectedProperty?.pricing?.startingAuctionPrice ||
          0
        }
        nextMinBid={
          (selectedProperty?.currentBid ||
            selectedProperty?.pricing?.startingAuctionPrice ||
            0) + (selectedProperty?.pricing?.minimumBidIncrement || 1000)
        }
        bidIncrement={selectedProperty?.pricing?.minimumBidIncrement || 1000}
        reservePrice={selectedProperty?.pricing?.reservePrice || 0}
        reserveMet={
          (selectedProperty?.currentBid || 0) >=
          (selectedProperty?.pricing?.reservePrice || 0)
        }
        bidAmount={bidAmount}
        onBidAmountChange={setBidAmount}
        bidSuccess={bidSuccess}
        isPending={placeBidMutation.isPending}
        onSubmit={handleSubmitBid}
        formatPrice={formatPrice}
        getPropertyImage={getPropertyImage}
      />

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
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 to-orange-500 origin-left"
              />

              <button
                className="absolute top-6 right-6 size-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all hover:rotate-90 z-10 border border-white/20"
                onClick={() => setVirtualTourOpen(false)}
              >
                <X className="size-6 text-white" />
              </button>

              <div className="bg-gradient-to-b from-black/50 to-transparent p-8 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full mb-4 shadow-xl">
                      <Video className="size-5 animate-pulse" />
                      <span className="text-sm font-bold">
                        360° Virtual Tour
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2">
                      {selectedProperty.propertyTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="size-5" />
                      <span className="text-lg font-medium">
                        {selectedProperty.location?.city},{" "}
                        {selectedProperty.location?.area}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0">
                <div className="bg-gradient-to-br from-blue-950 via-purple-950 to-pink-950 rounded-2xl overflow-hidden aspect-video relative border-2 border-white/10 shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tourPlaying ? activeRoom : "default"}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full absolute inset-0"
                    >
                      <ImageWithFallback
                        src={
                          tourPlaying
                            ? roomImages[activeRoom]
                            : getPropertyImage(selectedProperty)
                        }
                        alt={selectedProperty.propertyTitle}
                        className="w-full h-full object-cover opacity-90"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

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
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Video className="size-12 text-white" />
                          </motion.div>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {tourPlaying && (
                      <>
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
                        {[
                          {
                            room: "bedroom",
                            pos: "top-1/4 left-1/4",
                            color: "bg-blue-500/80",
                            emoji: "🛏️",
                          },
                          {
                            room: "bathroom",
                            pos: "top-1/3 right-1/3",
                            color: "bg-purple-500/80",
                            emoji: "🛁",
                          },
                          {
                            room: "kitchen",
                            pos: "bottom-1/4 left-1/2",
                            color: "bg-emerald-500/80",
                            emoji: "🍳",
                          },
                        ].map((spot) => (
                          <motion.button
                            key={spot.room}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.25 }}
                            whileTap={{ scale: 1.1 }}
                            onClick={() => setActiveRoom(spot.room)}
                            className={`absolute ${spot.pos} size-10 ${spot.color} backdrop-blur-md rounded-full flex items-center justify-center border-2 shadow-xl cursor-pointer ${activeRoom === spot.room ? "border-yellow-400 scale-125" : "border-white"}`}
                          >
                            <span className="text-white text-lg font-black">
                              {spot.emoji}
                            </span>
                          </motion.button>
                        ))}
                      </>
                    )}
                  </AnimatePresence>

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <div className="px-6 py-3 bg-black/70 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-2 rounded-full animate-pulse ${tourPlaying ? "bg-green-500" : "bg-orange-500"}`}
                        />
                        <span className="text-white text-sm font-bold">
                          {tourPlaying
                            ? "Interactive 360° View"
                            : "Click Play to Start Tour"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    {
                      name: "Living Room",
                      icon: "🛋️",
                      gradient: "from-blue-500 to-cyan-500",
                      id: "living",
                    },
                    {
                      name: "Kitchen",
                      icon: "🍳",
                      gradient: "from-emerald-500 to-teal-500",
                      id: "kitchen",
                    },
                    {
                      name: "Master Bedroom",
                      icon: "🛏️",
                      gradient: "from-purple-500 to-pink-500",
                      id: "bedroom",
                    },
                    {
                      name: "Bathroom",
                      icon: "🛁",
                      gradient: "from-orange-500 to-red-500",
                      id: "bathroom",
                    },
                    {
                      name: "Exterior",
                      icon: "🏡",
                      gradient: "from-yellow-500 to-amber-500",
                      id: "exterior",
                    },
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
                      className={`p-4 bg-gradient-to-br ${room.gradient} rounded-2xl text-white font-bold shadow-lg hover:shadow-2xl border-2 group ${activeRoom === room.id && tourPlaying ? "border-yellow-400 scale-105 ring-4 ring-yellow-400/30" : "border-white/20"}`}
                    >
                      <span className="text-3xl mb-2 block">{room.icon}</span>
                      <span className="text-sm">{room.name}</span>
                    </motion.button>
                  ))}
                </div>

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
                    className="flex-1 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="size-5" /> Share Virtual Tour
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setVirtualTourOpen(false);
                      navigate(
                        `/properties/${selectedProperty.slug || selectedProperty._id}`,
                      );
                    }}
                    className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronRight className="size-5" /> View Full Details
                  </motion.button>
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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="absolute top-4 right-4 size-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
                >
                  <X className="size-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Share2 className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Share Property</h3>
                    <p className="text-sm text-white/80">
                      {propertyToShare.propertyTitle}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Facebook",
                      icon: Facebook,
                      color: "bg-blue-600 hover:bg-blue-700",
                      url: `https://www.facebook.com/sharer/sharer.php?u=`,
                    },
                    {
                      label: "Twitter",
                      icon: Twitter,
                      color: "bg-sky-500 hover:bg-sky-600",
                      url: `https://twitter.com/intent/tweet?url=`,
                    },
                    {
                      label: "WhatsApp",
                      icon: MessageCircle,
                      color: "bg-green-600 hover:bg-green-700",
                      url: `https://wa.me/?text=`,
                    },
                    {
                      label: "Email",
                      icon: Mail,
                      color: "bg-slate-700 hover:bg-slate-800",
                      url: `mailto:?subject=${encodeURIComponent(propertyToShare.propertyTitle)}&body=`,
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() =>
                        window.open(
                          item.url +
                            encodeURIComponent(
                              window.location.origin +
                                "/properties/" +
                                (propertyToShare.slug || propertyToShare._id),
                            ),
                          "_blank",
                        )
                      }
                      className={`p-4 ${item.color} text-white rounded-2xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-2`}
                    >
                      <item.icon className="size-5" /> {item.label}
                    </button>
                  ))}
                </div>
                <div className="pt-4 border-t-2 border-slate-100">
                  <p className="text-sm font-bold text-slate-600 mb-3">
                    Or copy link
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/properties/${propertyToShare.slug || propertyToShare._id}`}
                      className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm text-slate-700 font-medium"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <Link2 className="size-4" /> Copy
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
