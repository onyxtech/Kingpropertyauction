import { mediaUrl } from "@/lib/mediaUrl";
import { useState } from "react";
import { useNavigate } from "react-router";
import { showSuccess, showError } from "@/lib/toast";
import { CheckCircle, AlertCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import PublicLayout from "@/features/shared/layout/PublicLayout";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";
import { useBiddingApi } from "@/features/bid/api/useBiddingApi";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useAuthApi } from "@/features/auth/api/useAuthApi";
import AuthModal from "@/features/shared/components/AuthModal";
import HeroSlider from "../components/HeroSlider";
import PropertyFilters from "../components/PropertyFilters";
import VirtualTourModal from "../components/VirtualTourModal";
import ShareModal from "../components/ShareModal";
import PropertyGrid from "../components/PropertyGrid";
import BidModalWrapper from "../components/BidModalWrapper";

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
  const [tourPlaying, setTourPlaying] = useState(false);
  const [activeRoom, setActiveRoom] = useState("living");
  const [wishlistedProperties, setWishlistedProperties] = useState<string[]>(
    [],
  );
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [propertyToShare, setPropertyToShare] = useState<any>(null);
  const [filters, setFilters] = useState({
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    minBeds: "",
    minBaths: "",
    searchQuery: "",
  });

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
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const { useGetProperties } = usePropertyApi();
  const { data: propertiesData, isLoading: propertiesLoading } =
    useGetProperties({ pageSize: 50 });
  const properties = propertiesData?.data || [];

  const { useGetAuctions } = useAuctionApi();
  const { data: auctionsData } = useGetAuctions({});
  const allAuctions = auctionsData?.data || [];
  const onlineAuctions = allAuctions;
  const liveAuctions = onlineAuctions.filter((a: any) => a.status === "live");

  const { usePlaceBid } = useBiddingApi();
  const placeBidMutation = usePlaceBid();
  const queryClient = useQueryClient();

  useAuctionSocket();

  const totalProperties = properties.length || 0;
  const totalUsers =
    onlineAuctions.reduce(
      (sum: number, a: any) => sum + (a.totalBidders || 0),
      0,
    ) || 0;
  const totalBids =
    onlineAuctions.reduce(
      (sum: number, a: any) => sum + (a.totalBids || 0),
      0,
    ) || 0;
  const liveAuctionCount = liveAuctions.length || 0;
  const totalAuctionValue = liveAuctions.reduce(
    (sum: number, auction: any) => sum + (auction.startingBid || 0),
    0,
  );

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
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    const userPermissions = (user as any)?.permissions;
    const userCanBid = user?.role !== "admin" && userPermissions?.canBid === true;
    if (!userCanBid) {
      showNotification(
        user?.role === "admin"
          ? "Administrators cannot place bids."
          : "You don't have bidding permissions. Apply to become a buyer from your dashboard.",
        "error"
      );
      return;
    }
    const propertyOwnerId = property?.createdBy?._id || property?.createdBy;
    const currentUserId = user?.id || (user as any)?._id;
    if (propertyOwnerId && currentUserId &&
        propertyOwnerId.toString() === currentUserId.toString()) {
      showNotification("You cannot bid on your own property.", "error");
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

    if (!isFinite(newBidValue) || newBidValue <= 0) {
      showNotification("Please enter a valid bid amount.", "error");
      return;
    }

    if (newBidValue < nextMinBid) {
      showNotification(
        `Your bid must be at least £${nextMinBid.toLocaleString()} (current bid + £${bidIncrement.toLocaleString()} increment)`,
        "error",
      );
      return;
    }

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
      showSuccess("Bid placed! 🎉", "Your bid has been submitted successfully.");
      showNotification("Bid placed successfully! 🎉", "success");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      setTimeout(() => {
        setBidModalOpen(false);
        setBidSuccess(false);
        setBidAmount("");
      }, 2000);
    } catch (error: any) {
      showError("Bid failed", error.message || "Failed to place bid.");
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
    showNotification("Property link copied!", "success");
  };

  const getPropertyImage = (property: any) => {
    if (property.media?.propertyImages?.length > 0) {
      const img = property.media.propertyImages[0];

      return img.startsWith("/uploads") ? img : `/uploads/properties/${img}`;
    }
    return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600";
  };

  const getPropertyThumb = (property: any) => {
    if (property.media?.propertyThumbnails?.length > 0) {
      const thumb = property.media.propertyThumbnails[0];

      return thumb.startsWith("/uploads")
        ? thumb
        : `/uploads/properties/${thumb}`;
    }
    return undefined;
  };

  return (
    <PublicLayout>
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

      <PropertyFilters
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      <HeroSlider
        totalProperties={totalProperties}
        liveAuctionCount={liveAuctionCount}
        totalAuctionValue={totalAuctionValue}
        totalBids={totalBids}
        totalBidders={totalUsers}
      />

      <div id="property-grid">
        <PropertyGrid
          properties={properties}
          allAuctions={allAuctions}
          filters={filters}
          isLoading={propertiesLoading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          wishlisted={wishlistedProperties}
          onBid={handlePlaceBid}
          onWishlist={handleToggleWishlist}
          onShare={handleShareProperty}
          onTour={handleOpenVirtualTour}
          onNavigate={(path) => navigate(path)}
          onAuctionEnded={() =>
            queryClient.invalidateQueries({ queryKey: ["auctions"] })
          }
        />
      </div>

      <BidModalWrapper
        show={bidModalOpen}
        property={selectedProperty}
        bidAmount={bidAmount}
        bidSuccess={bidSuccess}
        isPending={placeBidMutation.isPending}
        onClose={() => setBidModalOpen(false)}
        onBidChange={setBidAmount}
        onSubmit={handleSubmitBid}
      />

      <VirtualTourModal
        show={virtualTourOpen}
        property={selectedProperty}
        tourPlaying={tourPlaying}
        setTourPlaying={setTourPlaying}
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
        roomImages={roomImages}
        getPropertyImage={getPropertyImage}
        onClose={() => setVirtualTourOpen(false)}
        onShare={() => {
          setPropertyToShare(selectedProperty);
          setShareModalOpen(true);
        }}
        onNavigate={(path) => navigate(path)}
      />

      <ShareModal
        show={shareModalOpen}
        property={propertyToShare}
        onClose={() => setShareModalOpen(false)}
        onCopyLink={handleCopyLink}
      />
    </PublicLayout>
  );
}
