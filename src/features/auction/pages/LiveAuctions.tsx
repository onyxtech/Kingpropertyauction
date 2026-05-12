import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Gavel,
  Users,
  TrendingUp,
  Heart,
  Share2,
  Clock,
  MapPin,
  Calendar,
  Building2,
  ChevronRight,
} from "lucide-react";
import { ImageWithFallback } from "@/features/shared/figma/ImageWithFallback";
import PublicLayout from "@/features/shared/layout/PublicLayout";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";

export default function LiveAuctions() {
  const navigate = useNavigate();

  const { useGetAuctions } = useAuctionApi();
  const { data: auctionsData, isLoading } = useGetAuctions({ status: "live" });
  const auctions = auctionsData?.data || [];

  // Map auctions to display format
  const liveAuctions = auctions.map((a: any) => {
    const totalProperties = a.properties?.length || 0;
    const totalCurrentBids = a.properties?.reduce((sum: number, p: any) => {
      const isPopulated = typeof p === "object" && p.propertyTitle;
      return sum + (isPopulated ? (p.currentBid || p.pricing?.startingAuctionPrice || 0) : 0);
    }, 0) || 0;

    // Get first property image for the card
    const firstProperty = a.properties?.[0];
    const isPopulated = typeof firstProperty === "object" && firstProperty.propertyTitle;
    const cardImage = isPopulated && firstProperty?.media?.propertyImages?.[0]
      ? firstProperty.media.propertyImages[0]
      : a.auctionImage || "https://images.unsplash.com/photo-1627257363565-4bc682c69e8e?w=1080";

    return {
      id: a._id,
      slug: a.slug || a._id,
      title: a.auctionTitle || "Untitled Auction",
      description: a.description || "",
      location: a.venue?.name
        ? `${a.venue.name}, ${a.venue.city || "UK"}`
        : a.venue?.city
          ? `${a.venue.city}, UK`
          : "Online Auction",
      image: cardImage,
      startDateTime: new Date(a.startDateTime),
      endDateTime: new Date(a.endDateTime),
      endTime: new Date(a.endDateTime || Date.now() + 3600000),
      totalLots: totalProperties,
      totalBids: a.totalBids || 0,
      totalBidders: a.totalBidders || 0,
      totalValue: totalCurrentBids || a.startingBid || 0,
      status: a.status === "live" ? "active" : "ending",
      auctionType: a.auctionType || "live",
    };
  });

  // Countdown timers
  const [timers, setTimers] = useState<{ [key: string]: string }>({});
  const liveAuctionsRef = useRef(liveAuctions);
  liveAuctionsRef.current = liveAuctions;

  useEffect(() => {
    const updateTimers = () => {
      const newTimers: { [key: string]: string } = {};
      liveAuctionsRef.current.forEach((auction) => {
        const now = new Date().getTime();
        const end = auction.endTime.getTime();
        const distance = end - now;
        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          if (days > 0) newTimers[auction.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
          else if (hours > 0) newTimers[auction.id] = `${hours}h ${minutes}m ${seconds}s`;
          else newTimers[auction.id] = `${minutes}m ${seconds}s`;
        } else {
          newTimers[auction.id] = "ENDED";
        }
      });
      setTimers(newTimers);
    };
    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => `£${price.toLocaleString()}`;
  const totalActiveBidders = liveAuctions.reduce((s, a) => s + a.totalBidders, 0);
  const totalValue = liveAuctions.reduce((s, a) => s + a.totalValue, 0);
  const totalLots = liveAuctions.reduce((s, a) => s + a.totalLots, 0);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center h-96">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout className="min-h-screen bg-slate-50">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <button
          onClick={() => navigate("/auctions")}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Auctions
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/30 backdrop-blur-md rounded-full mb-6 shadow-lg">
              <div className="size-3 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-bold">
                🔥 {liveAuctions.length} Live {liveAuctions.length === 1 ? 'Auction' : 'Auctions'} Active Now
              </span>
            </div>
            <h1 className="text-6xl font-black mb-6 drop-shadow-lg">
              Live Auction Events
            </h1>
            <p className="text-2xl text-white/90 mb-8 font-medium">
              Join live auctions and bid on premium properties in real-time.
              <br />
              <span className="text-yellow-200">💎 Transparent • Secure • Efficient</span>
            </p>
            <div className="flex items-center gap-8 flex-wrap">
              <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 shadow-xl">
                <Gavel className="size-6" />
                <div>
                  <p className="text-3xl font-black">{liveAuctions.length}</p>
                  <p className="text-sm font-semibold text-white/80">Live Auctions</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 shadow-xl">
                <Building2 className="size-6" />
                <div>
                  <p className="text-3xl font-black">{totalLots}</p>
                  <p className="text-sm font-semibold text-white/80">Total Lots</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 shadow-xl">
                <Users className="size-6" />
                <div>
                  <p className="text-3xl font-black">{totalActiveBidders}</p>
                  <p className="text-sm font-semibold text-white/80">Active Bidders</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 shadow-xl">
                <TrendingUp className="size-6" />
                <div>
                  <p className="text-3xl font-black">
                    {totalValue >= 1000000
                      ? `£${(totalValue / 1000000).toFixed(1)}M`
                      : formatPrice(totalValue)
                    }
                  </p>
                  <p className="text-sm font-semibold text-white/80">Total Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Event Cards */}
      <div className="container mx-auto px-6 py-8">
        {liveAuctions.length === 0 ? (
          <div className="text-center py-20">
            <Gavel className="size-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">No Live Auctions</h2>
            <p className="text-slate-600 mb-6">There are no auctions happening right now. Check back soon or browse upcoming auctions.</p>
            <button
              onClick={() => navigate("/auctions")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              Browse All Auctions
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {liveAuctions.map((auction) => (
              <div
                key={auction.id}
                onClick={() => navigate(`/auctions/${auction.slug}`)}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-slate-200 hover:border-red-400 hover:shadow-2xl transition-all cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-72">
                  <ImageWithFallback
                    src={auction.image}
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* LIVE Badge */}
                  <div className="absolute top-5 left-5">
                    <div className="px-4 py-2 bg-red-500 text-white text-sm font-black rounded-full flex items-center gap-2 shadow-xl animate-pulse">
                      <div className="size-2.5 bg-white rounded-full" />
                      LIVE NOW
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="absolute top-5 right-5">
                    <div className="px-4 py-2 bg-black/70 backdrop-blur-md text-white rounded-xl shadow-lg flex items-center gap-2">
                      <Clock className="size-4 text-red-400" />
                      <span className="font-bold text-sm">
                        {timers[auction.id] || "Calculating..."}
                      </span>
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Bottom Info */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
                      {auction.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <MapPin className="size-4" />
                      <span>{auction.location}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Auction Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border border-blue-100">
                      <Building2 className="size-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-2xl font-black text-blue-600">{auction.totalLots}</p>
                      <p className="text-xs font-semibold text-slate-600">Lots</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center border border-purple-100">
                      <Users className="size-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-2xl font-black text-purple-600">{auction.totalBidders}</p>
                      <p className="text-xs font-semibold text-slate-600">Bidders</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 text-center border border-emerald-100">
                      <Gavel className="size-5 text-emerald-600 mx-auto mb-1" />
                      <p className="text-2xl font-black text-emerald-600">{auction.totalBids}</p>
                      <p className="text-xs font-semibold text-slate-600">Bids</p>
                    </div>
                  </div>

                  {/* Date & Type */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="size-4" />
                      <span>{auction.startDateTime.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className="text-slate-400">→</span>
                      <span>{auction.endDateTime.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700 capitalize">
                      {auction.auctionType}
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/auctions/${auction.slug}`);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-black text-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 group"
                  >
                    <Gavel className="size-5" />
                    Enter Auction Room
                    <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}