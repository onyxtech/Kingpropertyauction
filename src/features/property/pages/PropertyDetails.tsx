import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Clock,
  Heart,
  Share2,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle,
  Home,
  Car,
  AlertCircle,
  TrendingUp,
  Users,
  Gavel,
  ChevronRight,
  ChevronLeft,
  X,
  FileText,
  Building2,
  Sparkles,
  Map,
  Navigation,
  Locate,
  Eye,
  EyeOff,
  User,
  Lock,
  Info,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Header from "@/features/shared/layout/Header";
import Footer from "@/features/shared/layout/Footer";
import { ImageWithFallback } from "@/features/shared/figma/ImageWithFallback";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";
import { useBiddingApi } from "@/features/bid/api/useBiddingApi";
import { useAuthStore } from "@/stores/authStore";
import { useAuthApi } from "@/features/auth/api/useAuthApi";
import { useQueryClient } from "@tanstack/react-query";
import CountdownTimer from "../../shared/ui/CountdownTimer";
import AuthModal from "@/features/shared/components/AuthModal";
import BidModal from "@/features/shared/components/BidModal";

export default function PropertyDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const queryId = searchParams.get("id");
  const propertyId = queryId || slug || "1";
  const queryClient = useQueryClient();
  const { isAuthenticated, user, login } = useAuthStore();
  const authApi = useAuthApi();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);
  const [useAutoBid, setUseAutoBid] = useState(false);
  const [maxBidAmount, setMaxBidAmount] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [bidHistory, setBidHistory] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const showNotification = (msg: string, type: "success" | "error") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const { useGetPropertyById } = usePropertyApi();
  const { data: apiProperty, isLoading: loading } =
    useGetPropertyById(propertyId);
  const { useGetAuctions } = useAuctionApi();
  const { data: auctionsData } = useGetAuctions({});
  const allAuctions = auctionsData?.data || [];
  const { usePlaceBid } = useBiddingApi();
  const placeBidMutation = usePlaceBid();

  const property = apiProperty || null;

  const matchingAuction =
    allAuctions.find((a: any) =>
      a.properties?.some(
        (p: any) => (typeof p === "string" ? p : p._id) === property?._id,
      ),
    ) || null;

  const isAuctionType = property?.listingType === "auction";
  const isInLiveAuction = matchingAuction !== null;
  const isLiveNow = matchingAuction?.status === "live";
  const isCompleted = matchingAuction?.status === "completed";
  const isDirectSale = property?.listingType === "direct_sale";

  const currentBid =
    property?.currentBid || property?.pricing?.startingAuctionPrice || 0;
  const startingPrice = property?.pricing?.startingAuctionPrice || 0;
  const reservePrice = property?.pricing?.reservePrice || 0;
  const bidIncrement =
    property?.pricing?.minimumBidIncrement ||
    matchingAuction?.bidIncrement ||
    1000;
  const nextMinBid = currentBid + bidIncrement;
  const reserveMet = currentBid >= reservePrice;
  const buyNowPrice = property?.pricing?.buyNowPrice || 0;

  const images =
    property?.media?.propertyImages?.length > 0
      ? property.media.propertyImages.map((img: string) =>
          img.startsWith("http") ? img : `http://localhost:5000${img}`,
        )
      : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"];

  const features = property?.features
    ? Object.entries(property.features)
        .filter(([, v]) => v)
        .map(([k]) =>
          k
            .replace(/([A-Z])/g, " $1")
            .trim()
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
        )
    : [];

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: property?.pricing?.currency || "GBP",
      maximumFractionDigits: 0,
    }).format(val);

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
          showNotification("Logged in!", "success");
        } else setAuthError(result.error || "Login failed");
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
          showNotification("Account created!", "success");
        } else setAuthError(result.error || "Registration failed");
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePlaceBidClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (user?.role === "admin" || user?.role === "agent") {
      showNotification("Admins/agents cannot bid.", "error");
      return;
    }
    setBidAmount("");
    setBidSuccess(false);
    setShowBidModal(true);
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || !property || !matchingAuction) return;
    const amount = parseFloat(bidAmount);
    if (amount < nextMinBid) {
      showNotification(`Minimum bid is ${formatPrice(nextMinBid)}`, "error");
      return;
    }
    try {
      await placeBidMutation.mutateAsync({
        auction: matchingAuction._id,
        property: property._id,
        amount,
        isAutoBid: useAutoBid,
        maxBid: useAutoBid ? parseFloat(maxBidAmount) : null,
      });
      setBidSuccess(true);
      showNotification("Bid placed! 🎉", "success");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      setBidHistory(null);
      setShowBidHistory(false);
      setTimeout(() => {
        setShowBidModal(false);
        setBidSuccess(false);
        setUseAutoBid(false);
        setMaxBidAmount("");
      }, 2000);
    } catch (err: any) {
      showNotification(err.message, "error");
    }
  };

  const loadBidHistory = async () => {
    if (showBidHistory) {
      setShowBidHistory(false);
      return;
    }
    if (bidHistory) {
      setShowBidHistory(true);
      return;
    }
    setLoadingHistory(true);
    try {
      const res = await fetch(
        `/api/bids/auction/${matchingAuction._id}/property/${property._id}`,
      );
      const data = await res.json();
      if (data.success) {
        setBidHistory(data.data);
        setShowBidHistory(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="size-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xl font-bold text-slate-600">
              Loading property...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-6 left-1/2 z-[100] pointer-events-none"
          >
            <div
              className={`px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border-2 flex items-center gap-3 ${notification.type === "success" ? "bg-green-500/95 border-green-400 text-white" : "bg-red-500/95 border-red-400 text-white"}`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="size-5" />
              ) : (
                <AlertCircle className="size-5" />
              )}
              <span className="font-bold text-sm">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <Header />
      <div className="container mx-auto px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-xl border-2 border-white/60 shadow-lg hover:shadow-xl transition-all font-bold text-slate-700 hover:text-blue-600"
        >
          <ArrowLeft className="size-5" /> Back to Listings
        </button>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 relative">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
              <ImageWithFallback
                src={images[currentImageIndex]}
                alt={property.propertyTitle}
                className="w-full h-full object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 size-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-110"
              >
                <ChevronLeft className="size-6 text-slate-900" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 size-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-110"
              >
                <ChevronRight className="size-6 text-slate-900" />
              </button>
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute bottom-4 right-4 px-5 py-3 bg-white/90 rounded-xl font-bold text-slate-900 flex items-center gap-2 shadow-xl"
              >
                View All {images.length} Photos
              </button>
              <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 rounded-full text-white font-bold text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
              <div className="absolute top-4 right-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-black shadow-xl">
                {property.propertyID || `LOT-${(property._id || "").slice(-3)}`}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-4">
            {images.slice(0, 4).map((img: string, idx: number) => (
              <div
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`relative h-28 rounded-2xl overflow-hidden cursor-pointer transition-all ${currentImageIndex === idx ? "ring-4 ring-blue-600 scale-105" : "hover:scale-105 opacity-70 hover:opacity-100"}`}
              >
                <ImageWithFallback
                  src={img}
                  alt={`View ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {isLiveNow ? (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-sm flex items-center gap-1.5">
                        <span className="size-2 bg-white rounded-full animate-pulse" />{" "}
                        Live Auction
                      </span>
                    ) : isCompleted ? (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold text-sm">
                        Completed
                      </span>
                    ) : isAuctionType ? (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full font-bold text-sm">
                        Upcoming Auction
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-bold text-sm">
                        For Sale
                      </span>
                    )}
                    <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold text-sm">
                      {property.legalInfo?.ownershipType || "Freehold"}
                    </span>
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 mb-3">
                    {property.propertyTitle}
                  </h1>
                  <div className="flex items-center gap-2 text-lg text-slate-600 font-medium">
                    <MapPin className="size-5 text-blue-600" />
                    {property.location?.streetAddress ||
                      property.location?.city}
                    , {property.location?.area}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`size-12 rounded-full flex items-center justify-center transition-all shadow-lg ${isFavorite ? "bg-gradient-to-br from-red-500 to-pink-500" : "bg-white/90"}`}
                  >
                    <Heart
                      className={`size-5 ${isFavorite ? "text-white fill-white" : "text-slate-600"}`}
                    />
                  </button>
                  <button className="size-12 bg-white/90 rounded-full flex items-center justify-center transition-all shadow-lg">
                    <Share2 className="size-5 text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 pb-6 border-b-2 border-slate-100">
                {[
                  {
                    icon: Bed,
                    gradient: "from-blue-500 to-indigo-600",
                    value: property.specifications?.bedrooms || 0,
                    label: "Bedrooms",
                  },
                  {
                    icon: Bath,
                    gradient: "from-purple-500 to-pink-600",
                    value: property.specifications?.bathrooms || 0,
                    label: "Bathrooms",
                  },
                  {
                    icon: Maximize,
                    gradient: "from-emerald-500 to-teal-600",
                    value:
                      property.specifications?.totalArea?.toLocaleString() ||
                      "N/A",
                    label: "Sq Ft",
                  },
                  {
                    icon: Car,
                    gradient: "from-orange-500 to-amber-600",
                    value: property.specifications?.parkingSpaces || 0,
                    label: "Parking",
                  },
                  {
                    icon: Home,
                    gradient: "from-rose-500 to-red-600",
                    value: property.specifications?.yearBuilt || "N/A",
                    label: "Built",
                  },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className={`size-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}
                    >
                      <stat.icon className="size-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">
                        {stat.value}
                      </div>
                      <div className="text-xs font-semibold text-slate-500">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="text-sm font-bold text-blue-900 mb-2">
                    {isDirectSale ? "Asking Price" : "Starting Price"}
                  </div>
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {formatPrice(startingPrice)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
                  <div className="text-sm font-bold text-emerald-900 mb-2">
                    {isDirectSale
                      ? "Buy Now Price"
                      : isAuctionType && !isInLiveAuction
                        ? "Starting Bid"
                        : "Current Bid"}
                  </div>
                  <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {isDirectSale
                      ? formatPrice(buyNowPrice || startingPrice)
                      : formatPrice(currentBid)}
                  </div>
                </div>
              </div>

              {isAuctionType && (
                <div className="mt-6 space-y-4">
                  {isLiveNow && matchingAuction?.endDateTime && (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 border-2 border-red-200 flex items-center justify-between">
                      <span className="text-sm font-bold text-red-700">
                        ⏰ Auction Ends In:
                      </span>
                      <CountdownTimer
                        endDate={new Date(matchingAuction.endDateTime)}
                        compact={false}
                        gradient="from-red-500 to-orange-500"
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
                  {isAuctionType &&
                    !isInLiveAuction &&
                    property.auctionDetails?.auctionEndDate && (
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 border-2 border-amber-200 flex items-center justify-between">
                        <span className="text-sm font-bold text-amber-700">
                          📅 Auction Date:
                        </span>
                        <span className="font-bold text-amber-900">
                          {new Date(
                            property.auctionDetails.auctionEndDate,
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-600">Next Min Bid</span>
                      <span className="text-slate-900 font-bold">
                        {formatPrice(nextMinBid)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-600">Bid Increment</span>
                      <span className="text-slate-900 font-bold">
                        {formatPrice(bidIncrement)}
                      </span>
                    </div>
                    {reservePrice > 0 && (
                      <div
                        className={`flex items-center gap-1.5 text-sm font-bold ${reserveMet ? "text-green-600" : "text-amber-600"}`}
                      >
                        {reserveMet ? (
                          <CheckCircle className="size-4" />
                        ) : (
                          <AlertCircle className="size-4" />
                        )}
                        {reserveMet
                          ? `Reserve Met (${formatPrice(reservePrice)})`
                          : `Reserve Not Met (${formatPrice(reservePrice)})`}
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-600">Total Bids</span>
                      <span className="text-slate-900 font-bold">
                        {property.totalBids || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-600">Status</span>
                      <span
                        className={`font-bold ${isLiveNow ? "text-green-600" : isCompleted ? "text-slate-600" : "text-amber-600"}`}
                      >
                        {isLiveNow
                          ? "🟢 Live"
                          : isCompleted
                            ? "✅ Completed"
                            : "🟡 Not in live auction"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <FileText className="size-6 text-blue-600" />
                Property Description
              </h2>
              <p className="text-slate-700 leading-relaxed text-lg">
                {property.propertyDescription || "No description available."}
              </p>
            </div>

            {features.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Sparkles className="size-6 text-purple-600" />
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
                    >
                      <CheckCircle className="size-5 text-blue-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isInLiveAuction && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Gavel className="size-6 text-red-600" />
                    Bid History
                  </h2>
                  <button
                    onClick={loadBidHistory}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${showBidHistory ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                  >
                    {showBidHistory ? "Hide" : "View"} History
                  </button>
                </div>
                <AnimatePresence>
                  {showBidHistory && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {loadingHistory ? (
                        <div className="text-center py-4">
                          <div className="animate-spin size-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
                        </div>
                      ) : bidHistory?.bids?.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {bidHistory.bids.map((bid: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100"
                            >
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                  {bid.bidder?.name?.charAt(0) || "?"}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">
                                    {bid.bidder?.name || "Anonymous"}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {new Date(bid.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-black text-green-600">
                                  £{bid.amount?.toLocaleString()}
                                </p>
                                <span
                                  className={`text-xs font-bold ${bid.status === "winning" ? "text-green-600" : "text-slate-500"}`}
                                >
                                  {bid.status === "winning"
                                    ? "🏆 Winning"
                                    : bid.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-sm text-slate-500 py-4">
                          No bids yet.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <div className="lg:col-span-1 space-y-6">
            {/* Gradient Action Card */}
            <div
              className={`rounded-3xl p-8 shadow-2xl sticky top-24 z-10 ${isLiveNow ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" : isCompleted ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600" : isAuctionType ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500" : "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"}`}
            >
              <div className="text-center mb-6">
                {isLiveNow ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-4">
                    <span className="size-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-white">
                      Live Auction
                    </span>
                  </div>
                ) : isCompleted ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-4">
                    <CheckCircle className="size-5 text-white" />
                    <span className="text-sm font-bold text-white">
                      Auction Completed
                    </span>
                  </div>
                ) : isAuctionType ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-4">
                    <Clock className="size-5 text-yellow-300" />
                    <span className="text-sm font-bold text-white">
                      Upcoming Auction
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-4">
                    <Tag className="size-5 text-white" />
                    <span className="text-sm font-bold text-white">
                      For Sale
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/20 rounded-xl p-3 text-center border-2 border-white/30">
                  <div className="text-2xl font-black text-white">0</div>
                  <div className="text-xs font-semibold text-white/80">
                    Views
                  </div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center border-2 border-white/30">
                  <div className="text-2xl font-black text-white">0</div>
                  <div className="text-xs font-semibold text-white/80">
                    Saved
                  </div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center border-2 border-white/30">
                  <div className="text-2xl font-black text-white">
                    {property.totalBids || 0}
                  </div>
                  <div className="text-xs font-semibold text-white/80">
                    Bids
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {isLiveNow ? (
                  <>
                    <button
                      onClick={handlePlaceBidClick}
                      className="w-full py-4 bg-white text-blue-600 rounded-xl font-black shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg"
                    >
                      <Gavel className="size-6" />
                      Place Bid
                    </button>
                  </>
                ) : isCompleted ? (
                  <>
                    {property.propertyStatus === "sold" ? (
                      <div className="bg-white/20 rounded-2xl p-4 text-center text-white border-2 border-white/30">
                        <p className="text-sm text-white/80 mb-1">🎉 SOLD</p>
                        <p className="text-4xl font-black">
                          £
                          {(
                            property.soldPrice ||
                            property.currentBid ||
                            0
                          ).toLocaleString()}
                        </p>
                        {property.soldTo && (
                          <p className="text-xs text-white/70 mt-2">
                            Winner ID:{" "}
                            {typeof property.soldTo === "object"
                              ? property.soldTo.name
                              : property.soldTo.toString().slice(-6)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white/20 rounded-2xl p-4 text-center text-white border-2 border-white/30">
                        <p className="text-sm text-white/80 mb-1">❌ UNSOLD</p>
                        <p className="text-lg font-bold">Reserve Not Met</p>
                        <p className="text-xs text-white/70 mt-2">
                          Highest Bid: £
                          {(property.currentBid || 0).toLocaleString()} |
                          Reserve: £
                          {(
                            property.pricing?.reservePrice || 0
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        navigate(`/auctions/${matchingAuction.slug}`)
                      }
                      className="w-full py-4 bg-white/20 text-white border-2 border-white/40 rounded-xl font-bold hover:bg-white/30 transition-all"
                    >
                      View Auction Results
                    </button>
                  </>
                ) : isAuctionType ? (
                  <>
                    <p className="text-white/80 text-sm text-center py-2">
                      This property is not currently in a live auction.
                    </p>
                    <button
                      onClick={() => navigate("/auctions")}
                      className="w-full py-4 bg-white/20 text-white border-2 border-white/40 rounded-xl font-bold hover:bg-white/30 transition-all"
                    >
                      View Live Auctions
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-white/20 rounded-2xl p-4 text-center text-white">
                      <p className="text-3xl font-black">
                        {formatPrice(startingPrice)}
                      </p>
                      <p className="text-sm text-white/80">Asking Price</p>
                    </div>
                    {buyNowPrice > 0 && (
                      <div className="bg-white/20 rounded-2xl p-4 text-center text-white">
                        <p className="text-3xl font-black">
                          {formatPrice(buyNowPrice)}
                        </p>
                        <p className="text-sm text-white/80">Buy Now Price</p>
                      </div>
                    )}
                  </>
                )}
                <button className="w-full py-4 bg-white/20 text-white border-2 border-white/40 rounded-xl font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-2">
                  Download Brochure
                </button>
              </div>
            </div>

            {/* Agent Contact Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 border-white/60">
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Contact Agent
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="size-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                  {(
                    property.sellerInfo?.agentName ||
                    property.sellerInfo?.sellerName ||
                    "A"
                  )?.charAt(0)}
                </div>
                <div>
                  <div className="font-black text-slate-900 text-lg">
                    {property.sellerInfo?.agentName ||
                      property.sellerInfo?.sellerName ||
                      "Agent"}
                  </div>
                  <div className="text-sm text-slate-600 font-semibold">
                    Property Agent
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {property.sellerInfo?.sellerContact && (
                  <a
                    href={`tel:${property.sellerInfo.sellerContact}`}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:scale-105 transition-all"
                  >
                    <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Phone className="size-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-900">
                      {property.sellerInfo.sellerContact}
                    </span>
                  </a>
                )}
                {property.sellerInfo?.sellerEmail && (
                  <a
                    href={`mailto:${property.sellerInfo.sellerEmail}`}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:scale-105 transition-all"
                  >
                    <div className="size-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Mail className="size-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">
                      {property.sellerInfo.sellerEmail}
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* Property Information Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 border-white/60">
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Property Information
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Tenure",
                    value: property.legalInfo?.ownershipType || "N/A",
                  },
                  {
                    label: "Property Type",
                    value:
                      property.propertyType?.charAt(0).toUpperCase() +
                        property.propertyType?.slice(1) || "N/A",
                  },
                  {
                    label: "Category",
                    value:
                      property.propertyCategory?.charAt(0).toUpperCase() +
                        property.propertyCategory?.slice(1) || "N/A",
                  },
                  {
                    label: "Year Built",
                    value: property.specifications?.yearBuilt || "N/A",
                  },
                  {
                    label: "Floors",
                    value: property.specifications?.floors || "N/A",
                  },
                  {
                    label: "Furnished",
                    value: property.specifications?.furnishedStatus || "N/A",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0"
                  >
                    <span className="text-slate-600 font-semibold">
                      {item.label}
                    </span>
                    <span className="font-bold text-slate-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      <BidModal
        show={showBidModal}
        onClose={() => setShowBidModal(false)}
        property={property}
        currentBid={currentBid}
        nextMinBid={nextMinBid}
        bidIncrement={bidIncrement}
        reservePrice={reservePrice}
        reserveMet={reserveMet}
        bidAmount={bidAmount}
        onBidAmountChange={setBidAmount}
        autoBidEnabled={property?.auctionDetails?.autoBidEnabled}
        useAutoBid={useAutoBid}
        onAutoBidToggle={setUseAutoBid}
        maxBidAmount={maxBidAmount}
        onMaxBidChange={setMaxBidAmount}
        bidSuccess={bidSuccess}
        isPending={placeBidMutation.isPending}
        onSubmit={handleSubmitBid}
        formatPrice={formatPrice}
        getPropertyImage={(p) =>
          p?.media?.propertyImages?.[0]?.startsWith("http")
            ? p.media.propertyImages[0]
            : `http://localhost:5000${p.media?.propertyImages?.[0]}` ||
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600"
        }
      />

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 size-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <X className="size-6 text-white" />
          </button>
          <div className="max-w-6xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((img: string, idx: number) => (
                <div
                  key={idx}
                  className="relative h-80 rounded-2xl overflow-hidden"
                >
                  <ImageWithFallback
                    src={img}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl overflow-hidden max-w-6xl w-full shadow-2xl relative">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white">
                    Property Location
                  </h3>
                  <p className="text-white/90">
                    {property.location?.streetAddress},{" "}
                    {property.location?.city}
                  </p>
                </div>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="size-12 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <X className="size-6 text-white" />
                </button>
              </div>
            </div>
            <div className="relative h-[400px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="size-20 text-red-500 mx-auto animate-bounce" />
                <p className="text-xl font-bold text-slate-700 mt-4">
                  {property.location?.streetAddress}
                </p>
                <p className="text-slate-500">
                  {property.location?.city}, {property.location?.area}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location?.streetAddress + " " + property.location?.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
