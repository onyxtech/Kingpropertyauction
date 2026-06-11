import { useNavigate } from "react-router";
import { mediaUrl } from "@/lib/mediaUrl";
import {
  Globe,
  Users,
  Clock,
  Shield,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Zap,
  Target,
  Award,
  Gavel
} from "lucide-react";
import PublicLayout from "@/features/shared/layout/PublicLayout";
import { ImageWithFallback } from "@/features/shared/figma/ImageWithFallback";
import AuctionTimer from "@/features/shared/components/AuctionTimer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { CACHE_KEYS } from "@/constants";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";

export default function OnlineAuctions() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: liveData, isLoading: liveLoading } = useQuery({
    queryKey: [CACHE_KEYS.AUCTIONS, 'live'],
    queryFn: () => apiClient.fetch('/auctions?status=live&limit=3'),
    refetchInterval: 30000,
  });
  const { data: allData } = useQuery({
    queryKey: [CACHE_KEYS.AUCTIONS, 'all'],
    queryFn: () => apiClient.fetch('/auctions?limit=6'),
    refetchInterval: 30000,
  });

  const liveAuctions = liveData?.data || [];
  const allAuctions = allData?.data || [];
  const dynamicStats = {
    totalAuctions: allData?.pagination?.total || 0,
    liveAuctions: liveData?.pagination?.total || liveData?.data?.length || 0,
    totalProperties: 0,
  };

  useAuctionSocket({
    onAuctionUpdate: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.AUCTIONS, 'live'] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.AUCTIONS, 'all'] });
    },
  });

  const features = [
    {
      icon: Globe,
      title: "Bid from Anywhere",
      description: "Access auctions from the comfort of your home, 24/7",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Bank-level encryption and verified bidders only",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Live bidding with instant notifications",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Dedicated team available during all auctions",
      gradient: "from-orange-500 to-amber-600"
    }
  ];


  const stats = [
    { label: "Live Auctions", value: dynamicStats.liveAuctions || "—", icon: Users, gradient: "from-blue-500 to-cyan-500" },
    { label: "Total Auctions", value: dynamicStats.totalAuctions || "—", icon: Award, gradient: "from-purple-500 to-pink-500" },
    { label: "Properties Listed", value: dynamicStats.totalProperties || "—", icon: TrendingUp, gradient: "from-emerald-500 to-teal-500" },
    { label: "Avg. Savings", value: "15%", icon: Target, gradient: "from-orange-500 to-amber-500" }
  ];

  return (
    <PublicLayout>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">🌐 100% Online • Secure • Transparent</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Online Property Auctions
              <br />
              <span className="text-yellow-300">Bid from Anywhere</span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-10 font-medium">
              Join thousands of bidders in our secure online auction platform
              <br />
              <span className="text-yellow-200">✨ Real-time bidding • Expert support • Transparent process</span>
            </p>

            <div className="flex items-center gap-4 justify-center">
              <button 
                onClick={() => navigate('/view-all-lots')}
                className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                View Live Auctions
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                <div className={`size-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="size-7 text-white" />
                </div>
                <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-slate-600 font-bold">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-slate-900 mb-4">
              Why Choose Online Auctions?
            </h2>
            <p className="text-xl text-slate-600 font-medium">
              Experience the future of property bidding
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                  <div className={`size-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="size-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 font-medium">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Auctions */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-slate-900 mb-4">
              Upcoming Online Auctions
            </h2>
            <p className="text-xl text-slate-600 font-medium">
              Register now to participate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {liveLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border-2 border-white/60 animate-pulse">
                  <div className="h-64 bg-slate-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
                    <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
                    <div className="h-4 bg-slate-200 rounded-lg w-2/3" />
                    <div className="h-12 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              ))
            ) : allAuctions.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-slate-500 font-medium">
                  No auctions currently scheduled. Check back soon!
                </p>
              </div>
            ) : (
              allAuctions.map((auction: any) => {
                const startDate = auction.startDateTime ? new Date(auction.startDateTime) : null;
                const dateStr = startDate?.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'Europe/London',
                }) || 'TBC';
                const timeStr = startDate?.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'Europe/London',
                }) || '';
                const lotCount = auction.totalLots || auction.properties?.length || 0;
                const rawAuctionImage = auction.auctionImage ||
                  auction.properties?.[0]?.media?.propertyImages?.[0] || null;
                const auctionImage = rawAuctionImage ? mediaUrl(rawAuctionImage) : null;
                return (
                  <div key={auction._id} className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                    <div className="relative h-64">
                      {auctionImage ? (
                        <ImageWithFallback
                          src={auctionImage}
                          alt={auction.auctionTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Gavel className="size-16 text-white/60" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        {auction.status === 'live' && (
                          <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-black rounded-full animate-pulse shadow-lg">
                            🔴 Live
                          </span>
                        )}
                        {auction.status === 'scheduled' && (
                          <span className="px-3 py-1.5 bg-blue-500 text-white text-xs font-black rounded-full shadow-lg">
                            📅 Scheduled
                          </span>
                        )}
                        {auction.status === 'completed' && (
                          <span className="px-3 py-1.5 bg-slate-500 text-white text-xs font-black rounded-full shadow-lg">
                            ✅ Completed
                          </span>
                        )}
                      </div>
                      {lotCount > 0 && (
                        <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-sm shadow-xl">
                          {lotCount} Lot{lotCount !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-black text-slate-900 mb-4">{auction.auctionTitle}</h3>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <Clock className="size-5 text-blue-600" />
                          {dateStr}{timeStr ? ` at ${timeStr}` : ''}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <Gavel className="size-5 text-purple-600" />
                          Online Bidding
                        </div>
                      </div>
                      {auction.startDateTime && auction.endDateTime && (
                        <AuctionTimer
                          startDateTime={auction.startDateTime}
                          endDateTime={auction.endDateTime}
                          status={auction.status}
                          showLabel={true}
                        />
                      )}
                      <button
                        onClick={() => navigate(`/auctions/${auction.slug || auction._id}`)}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      >
                        View Auction
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Register", desc: "Create your account and verify your identity" },
              { step: "2", title: "Browse", desc: "Explore properties and review legal packs" },
              { step: "3", title: "Bid", desc: "Place bids in real-time during the auction" },
              { step: "4", title: "Win", desc: "Complete the purchase and get your property" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="size-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </PublicLayout>
  );
}


