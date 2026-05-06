import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
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
  ChevronDown,
  X,
  Eye,
  User,
  Mail,
  Lock,
  Phone,
  EyeOff,
  Building2,
  Calendar,
  PoundSterling,
  Hash,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "@/features/shared/figma/ImageWithFallback";
import Header from "@/features/shared/layout/Header";
import Footer from "@/features/shared/layout/Footer";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";
import { useBiddingApi } from "@/features/bid/api/useBiddingApi";
import { useAuthStore } from "@/stores/authStore";
import { useAuthApi } from "@/features/auth/api/useAuthApi";
import { useQueryClient } from "@tanstack/react-query";

// ─── Countdown Timer Component ───
function AuctionCountdown({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState("");
  const endRef = useRef(endTime);
  endRef.current = endTime;

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const end = endRef.current.getTime();
      const distance = end - now;
      if (distance <= 0) {
        setTimeLeft("ENDED");
        return;
      }
      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-bold text-red-600 animate-pulse">
      {timeLeft || "Calculating..."}
    </span>
  );
}

export default function AuctionDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, login } = useAuthStore();
  const authApi = useAuthApi();

  // ─── API Hooks ───
  // ─── API Hooks ───
  const { useGetAuctions, useGetAuctionById } = useAuctionApi();
  const { usePlaceBid, useGetBidHistory } = useBiddingApi();
  const placeBidMutation = usePlaceBid();

  // First find the auction ID from the slug
  const { data: auctionsData } = useGetAuctions({});
  const auctions = auctionsData?.data || [];
  const auctionFromList = auctions.find((a: any) => a.slug === slug);
  const auctionId = auctionFromList?._id;

  // Then fetch the full auction with populated properties by ID
  const { data: auction, isLoading } = useGetAuctionById(auctionId || "");

  // Auto-refresh when params change or bid is placed
  useEffect(() => {
    if (auctionId) {
      queryClient.invalidateQueries({ queryKey: ["auctions", auctionId] });
    }
  }, [slug, auctionId]);

  // ─── State ───
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);
  const [useAutoBid, setUseAutoBid] = useState(false);
  const [maxBidAmount, setMaxBidAmount] = useState("");
  const [expandedLot, setExpandedLot] = useState<string | null>(null);
  const [lotHistories, setLotHistories] = useState<Record<string, any>>({});
  const [loadingHistory, setLoadingHistory] = useState<Record<string, boolean>>(
    {},
  );

  // ─── Auth Modal State ───
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

  // ─── Notification ───
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ─── Derived Data ───
  const propertyDetails =
    auction?.properties
      ?.map((p: any) => {
        // If already populated with full data
        if (typeof p === "object" && p.propertyTitle && p.specifications)
          return p;

        // If it's just an ID, try to find full data from auction list
        const propId = typeof p === "string" ? p : p?._id?.toString();
        if (propId && auctionFromList?.properties) {
          const found = auctionFromList.properties.find((ap: any) => {
            const apId =
              typeof ap === "object" ? ap._id?.toString() : ap?.toString();
            return (
              apId === propId && typeof ap === "object" && ap.propertyTitle
            );
          });
          if (found) return found;
        }

        // If only partial data, return what we have
        if (typeof p === "object" && p.propertyTitle) return p;

        return null;
      })
      .filter(Boolean) || [];

  // ─── Auth Handlers ───
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
          showNotification("Account created!", "success");
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

  // ─── Bid Handler ───
  const handlePlaceBid = (property: any) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (user?.role === "admin" || user?.role === "agent") {
      showNotification("Admins and agents cannot place bids.", "error");
      return;
    }
    setSelectedLot(property);
    setBidAmount("");
    setBidSuccess(false);
  };

  const handleSubmitBid = async () => {
    if (!bidAmount || !selectedLot || !auction) return;
    const currentBid =
      selectedLot.currentBid || selectedLot.pricing?.startingAuctionPrice || 0;
    const bidIncrement =
      selectedLot.pricing?.minimumBidIncrement || auction.bidIncrement || 1000;
    const nextMinBid = currentBid + bidIncrement;
    const amount = parseFloat(bidAmount);
    if (amount < nextMinBid) {
      showNotification(
        `Minimum bid is £${nextMinBid.toLocaleString()}`,
        "error",
      );
      return;
    }
    try {
      await placeBidMutation.mutateAsync({
        auction: auction._id,
        property: selectedLot._id,
        amount,
        isAutoBid: useAutoBid,
        maxBid: useAutoBid ? parseFloat(maxBidAmount) : null,
      });
      setBidSuccess(true);
      showNotification("Bid placed successfully! 🎉", "success");
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      // Reset history so it reloads fresh on next view
      setLotHistories((prev) => ({ ...prev, [selectedLot._id]: null }));
      setExpandedLot(null);
      setTimeout(() => {
        setSelectedLot(null);
        setBidSuccess(false);
        setUseAutoBid(false);
        setMaxBidAmount("");
      }, 2000);
    } catch (err: any) {
      showNotification(err.message || "Bid failed", "error");
    }
  };

  // ─── Load Bid History for a Lot ───
  const loadBidHistory = async (propertyId: string) => {
    // If already expanded, just close it
    if (expandedLot === propertyId) {
      setExpandedLot(null);
      return;
    }

    // If we already have the history, just show it
    if (lotHistories[propertyId]) {
      setExpandedLot(propertyId);
      return;
    }

    // Fetch fresh data
    setLoadingHistory((prev) => ({ ...prev, [propertyId]: true }));
    try {
      const res = await fetch(
        `/api/bids/auction/${auction._id}/property/${propertyId}`,
      );
      const data = await res.json();
      if (data.success) {
        setLotHistories((prev) => ({ ...prev, [propertyId]: data.data }));
        setExpandedLot(propertyId);
      }
    } catch (err) {
      console.error("Failed to load bid history:", err);
    } finally {
      setLoadingHistory((prev) => ({ ...prev, [propertyId]: false }));
    }
  };

  // ─── Helpers ───
  const getPropertyImage = (property: any) => {
    if (property?.media?.propertyImages?.length > 0) {
      const img = property.media.propertyImages[0];
      return img.startsWith("http") ? img : `/uploads/properties/${img}`;
    }
    return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600";
  };

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(val);

  // ─── Loading State ───
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="animate-spin size-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6" />
          <p className="text-xl font-bold text-slate-600">
            Loading auction details...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <Gavel className="size-20 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Auction Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            The auction you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/auctions")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold"
          >
            Browse Auctions
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* ─── NOTIFICATION TOAST ─── */}
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
                <CheckCircle className="size-5" />
              ) : (
                <AlertCircle className="size-5" />
              )}
              <span className="font-bold text-sm">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── AUTH MODAL ─── */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-4 right-4 size-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
                >
                  <X className="size-4" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <User className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">
                      {isLogin ? "Welcome Back! 👋" : "Create Account 🚀"}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {isLogin
                        ? "Sign in to place bids"
                        : "Register to start bidding"}
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
                {authError && (
                  <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700 font-bold">
                    <AlertCircle className="size-4 flex-shrink-0" />
                    {authError}
                  </div>
                )}
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={authFormData.firstName}
                        onChange={(e) =>
                          setAuthFormData({
                            ...authFormData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={authFormData.lastName}
                        onChange={(e) =>
                          setAuthFormData({
                            ...authFormData,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                )}
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="tel"
                        value={authFormData.phone}
                        onChange={(e) =>
                          setAuthFormData({
                            ...authFormData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+44 7700 900000"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={authFormData.email}
                      onChange={(e) =>
                        setAuthFormData({
                          ...authFormData,
                          email: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={authFormData.password}
                      onChange={(e) =>
                        setAuthFormData({
                          ...authFormData,
                          password: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={authFormData.confirmPassword}
                        onChange={(e) =>
                          setAuthFormData({
                            ...authFormData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {authLoading
                    ? "Please wait..."
                    : isLogin
                      ? "Sign In"
                      : "Create Account"}
                </button>
                <p className="text-center text-sm text-slate-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setAuthError("");
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    {isLogin ? "Register" : "Sign In"}
                  </button>
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <button
          onClick={() => navigate("/auctions")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all shadow-sm"
        >
          <ArrowLeft className="size-4" /> Back to Auctions
        </button>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── LEFT: Auction Header + Lot Cards ─── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Auction Header */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/60 shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-bold mb-3">
                    <span className="size-2 bg-white rounded-full animate-pulse" />
                    {auction.status === "live"
                      ? "LIVE AUCTION"
                      : auction.status?.toUpperCase()}
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {auction.auctionTitle}
                  </h1>
                  {auction.description && (
                    <p className="text-slate-600">{auction.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Ends in</p>
                  <p className="text-xl">
                    <AuctionCountdown endTime={new Date(auction.endDateTime)} />
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />{" "}
                  {new Date(auction.startDateTime).toLocaleDateString()} -{" "}
                  {new Date(auction.endDateTime).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Hash className="size-4" /> {propertyDetails.length} Lots
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-4" /> {auction.totalBidders || 0}{" "}
                  Bidders
                </span>
                <span className="flex items-center gap-1">
                  <Gavel className="size-4" /> {auction.totalBids || 0} Total
                  Bids
                </span>
              </div>
            </div>

            {/* ─── LOT CARDS (One per Property) ─── */}
            {propertyDetails.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/60 shadow-xl text-center">
                <Building2 className="size-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-600">
                  No properties in this auction yet
                </h3>
              </div>
            ) : (
              propertyDetails.map((property: any) => {
                const currentBid =
                  property.currentBid ||
                  property.pricing?.startingAuctionPrice ||
                  0;
                const bidIncrement =
                  property.pricing?.minimumBidIncrement ||
                  auction.bidIncrement ||
                  1000;
                const nextMinBid = currentBid + bidIncrement;
                const reservePrice = property.pricing?.reservePrice || 0;
                const reserveMet = currentBid >= reservePrice;
                const imageUrl = getPropertyImage(property);
                const history = lotHistories[property._id];
                const isLoadingHistory = loadingHistory[property._id];
                const isExpanded = expandedLot === property._id;

                return (
                  <div
                    key={property._id}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white/60 shadow-xl overflow-hidden"
                  >
                    {/* Property Image */}
                    <div className="relative h-64">
                      <ImageWithFallback
                        src={imageUrl}
                        alt={property.propertyTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full">
                          LOT {propertyDetails.indexOf(property) + 1}
                        </span>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-black text-slate-900 mb-2">
                        {property.propertyTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-600 mb-4">
                        <MapPin className="size-4 text-blue-600" />
                        <span className="text-sm font-medium">
                          {property.location?.city}, {property.location?.area}
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-slate-100">
                        <div className="flex items-center gap-2">
                          <Bed className="size-4 text-blue-600" />
                          <span className="text-sm font-bold">
                            {property.specifications?.bedrooms || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="size-4 text-purple-600" />
                          <span className="text-sm font-bold">
                            {property.specifications?.bathrooms || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Maximize className="size-4 text-emerald-600" />
                          <span className="text-sm font-bold">
                            {property.specifications?.totalArea?.toLocaleString() ||
                              "N/A"}{" "}
                            sqft
                          </span>
                        </div>
                      </div>

                      {/* ─── BIDDING SECTION (PER LOT) ─── */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs font-semibold text-slate-600 uppercase">
                              Current Bid
                            </p>
                            <p className="text-2xl font-black text-green-600">
                              £{currentBid.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-slate-600">
                              Next Min Bid
                            </p>
                            <p className="text-lg font-bold text-slate-900">
                              £{nextMinBid.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-2">
                          <span className="text-slate-500">Bid Increment</span>
                          <span className="text-slate-900">
                            £{bidIncrement.toLocaleString()}
                          </span>
                        </div>
                        {reservePrice > 0 && (
                          <div
                            className={`flex items-center gap-1.5 text-xs font-bold ${reserveMet ? "text-green-600" : "text-amber-600"}`}
                          >
                            {reserveMet ? (
                              <CheckCircle className="size-3.5" />
                            ) : (
                              <AlertCircle className="size-3.5" />
                            )}
                            {reserveMet
                              ? "Reserve Met"
                              : `Reserve Not Met (£${reservePrice.toLocaleString()})`}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                          <span>{property.totalBids || 0} bids</span>
                          <span>
                            Starting: £
                            {(
                              property.pricing?.startingAuctionPrice || 0
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* ─── ACTION BUTTONS ─── */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePlaceBid(property)}
                          className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Gavel className="size-4" /> Place Bid
                        </button>
                        <button
                          onClick={() => loadBidHistory(property._id)}
                          className={`px-4 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                            isExpanded
                              ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          <Eye className="size-4" />
                          {isExpanded ? "Hide History" : "Bid History"}
                          <ChevronDown
                            className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>

                      {/* ─── EXPANDABLE BID HISTORY ─── */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t-2 border-slate-100">
                              {isLoadingHistory ? (
                                <div className="text-center py-4">
                                  <div className="animate-spin size-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
                                </div>
                              ) : history?.bids?.length > 0 ? (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                  {history.bids.map((bid: any, i: number) => (
                                    <div
                                      key={bid._id || i}
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
                                            {new Date(
                                              bid.createdAt,
                                            ).toLocaleString()}
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
                                  No bids yet for this lot.
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ─── RIGHT SIDEBAR: Auction Info ─── */}
          <div className="space-y-6">
            {/* Auction Status */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl">
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Info className="size-5 text-blue-600" /> Auction Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Status</span>
                  <span
                    className={`font-bold ${auction.status === "live" ? "text-green-600" : "text-slate-900"}`}
                  >
                    {auction.status === "live"
                      ? "🟢 Live"
                      : auction.status?.charAt(0).toUpperCase() +
                        auction.status?.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Lots</span>
                  <span className="font-bold">{propertyDetails.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Bids</span>
                  <span className="font-bold">{auction.totalBids || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Registered Bidders</span>
                  <span className="font-bold">{auction.totalBidders || 0}</span>
                </div>
              </div>
            </div>

            {/* Venue Info */}
            {auction.venue?.name && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl">
                <h3 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="size-5 text-purple-600" /> Venue
                </h3>
                <p className="font-bold text-slate-900">{auction.venue.name}</p>
                {auction.venue.address && (
                  <p className="text-sm text-slate-600">
                    {auction.venue.address}
                  </p>
                )}
                {auction.venue.city && (
                  <p className="text-sm text-slate-600">
                    {auction.venue.city}
                    {auction.venue.postcode
                      ? `, ${auction.venue.postcode}`
                      : ""}
                  </p>
                )}
              </div>
            )}

            {/* Auction Details */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl">
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="size-5 text-indigo-600" /> Auction Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Start Date</span>
                  <span className="font-bold">
                    {new Date(auction.startDateTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">End Date</span>
                  <span className="font-bold">
                    {new Date(auction.endDateTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Auction Type</span>
                  <span className="font-bold capitalize">
                    {auction.auctionType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Registration Fee</span>
                  <span className="font-bold">
                    £{auction.registrationFee?.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Deposit Required</span>
                  <span className="font-bold">
                    £{auction.depositRequired?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BID MODAL ─── */}
      <AnimatePresence>
        {selectedLot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setSelectedLot(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 to-orange-500" />
              <button
                className="absolute top-6 right-6 size-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all"
                onClick={() => setSelectedLot(null)}
              >
                <X className="size-5 text-slate-600" />
              </button>

              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full mb-4">
                  <Gavel className="size-4" />
                  <span className="text-sm font-bold">Place Bid</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {selectedLot.propertyTitle}
                </h3>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="size-4" />
                  <span className="text-sm font-medium">
                    {selectedLot.location?.city}, {selectedLot.location?.area}
                  </span>
                </div>
              </div>

              <div className="mb-6 rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src={getPropertyImage(selectedLot)}
                  alt={selectedLot.propertyTitle}
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Bid Info */}
              {(() => {
                const currentBid =
                  selectedLot.currentBid ||
                  selectedLot.pricing?.startingAuctionPrice ||
                  0;
                const bidIncrement =
                  selectedLot.pricing?.minimumBidIncrement ||
                  auction.bidIncrement ||
                  1000;
                const nextMinBid = currentBid + bidIncrement;
                const reservePrice = selectedLot.pricing?.reservePrice || 0;
                const reserveMet = currentBid >= reservePrice;
                return (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 mb-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase">
                          Current Bid
                        </p>
                        <p className="text-2xl font-black text-green-600">
                          £{currentBid.toLocaleString()}
                        </p>
                      </div>
                      {selectedLot.totalBids > 0 && (
                        <div className="text-right">
                          <p className="text-xl font-black text-slate-900">
                            {selectedLot.totalBids}
                          </p>
                          <p className="text-xs font-semibold text-slate-600">
                            Total Bids
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Next Minimum Bid</span>
                      <span className="text-slate-900 font-bold">
                        £{nextMinBid.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Bid Increment</span>
                      <span className="text-slate-900 font-bold">
                        £{bidIncrement.toLocaleString()}
                      </span>
                    </div>
                    {reservePrice > 0 && (
                      <div
                        className={`flex items-center gap-1.5 text-xs font-bold ${reserveMet ? "text-green-600" : "text-amber-600"}`}
                      >
                        {reserveMet ? (
                          <CheckCircle className="size-3.5" />
                        ) : (
                          <AlertCircle className="size-3.5" />
                        )}
                        {reserveMet
                          ? "Reserve Price Met"
                          : `Reserve Not Met (£${reservePrice.toLocaleString()})`}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Your Bid Amount (£)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">
                    £
                  </span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border-3 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-2xl placeholder:text-slate-300 shadow-sm"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  💡 Your bid must be at least the next minimum bid
                </p>
              </div>

              {/* Auto-Bid Toggle */}
              {selectedLot?.auctionDetails?.autoBidEnabled && (
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border-2 border-amber-200 cursor-pointer hover:bg-amber-100 transition-all">
                    <input
                      type="checkbox"
                      checked={useAutoBid}
                      onChange={(e) => setUseAutoBid(e.target.checked)}
                      className="size-5 rounded accent-amber-600"
                    />
                    <div>
                      <span className="text-sm font-bold text-amber-900">
                        Enable Auto-Bidding 🤖
                      </span>
                      <p className="text-xs text-amber-700">
                        System will automatically bid for you up to your max
                      </p>
                    </div>
                  </label>

                  {useAutoBid && (
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Maximum Bid Limit (£)
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400">
                          £
                        </span>
                        <input
                          type="number"
                          value={maxBidAmount}
                          onChange={(e) => setMaxBidAmount(e.target.value)}
                          className="w-full pl-12 pr-6 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-bold text-lg"
                          placeholder="Your absolute maximum"
                        />
                      </div>
                      <p className="text-xs text-amber-600 mt-1">
                        💡 You'll only pay what's needed to win
                      </p>
                    </div>
                  )}
                </div>
              )}

              {bidSuccess ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="size-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="size-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-green-900 text-lg">
                        Bid Placed! 🎉
                      </p>
                      <p className="text-sm text-green-700">
                        You're now the highest bidder
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                    onClick={() => setSelectedLot(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    onClick={handleSubmitBid}
                    disabled={!bidAmount || placeBidMutation.isPending}
                  >
                    <Gavel className="size-5" />
                    {placeBidMutation.isPending ? "Placing..." : "Place Bid"}
                  </button>
                </div>
              )}
              <p className="text-xs text-center text-slate-500 mt-4">
                🔒 By placing a bid, you agree to our terms
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
