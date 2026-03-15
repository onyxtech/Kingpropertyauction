import { useNavigate } from "react-router";
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
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function OnlineAuctions() {
  const navigate = useNavigate();

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

  const upcomingAuctions = [
    {
      id: 1,
      title: "Premium London Properties",
      date: "March 15, 2026",
      time: "2:00 PM GMT",
      lots: 45,
      image: "https://images.unsplash.com/photo-1706808849777-96e0d7be3bb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MTIzMzMwOHww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 2,
      title: "Investment Portfolio Sale",
      date: "March 22, 2026",
      time: "3:00 PM GMT",
      lots: 67,
      image: "https://images.unsplash.com/photo-1614622350812-96b09c78af77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzEyNTEzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 3,
      title: "Commercial Property Auction",
      date: "March 29, 2026",
      time: "1:00 PM GMT",
      lots: 34,
      image: "https://images.unsplash.com/photo-1763114766629-724ce8da8f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwdmlsbGElMjBwb29sfGVufDF8fHx8MTc3MTMxNjgwOHww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  const stats = [
    { label: "Active Bidders", value: "8,934", icon: Users, gradient: "from-blue-500 to-cyan-500" },
    { label: "Properties Sold", value: "2,456", icon: Award, gradient: "from-purple-500 to-pink-500" },
    { label: "Success Rate", value: "94%", icon: TrendingUp, gradient: "from-emerald-500 to-teal-500" },
    { label: "Avg. Savings", value: "15%", icon: Target, gradient: "from-orange-500 to-amber-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

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
            {upcomingAuctions.map((auction) => (
              <div key={auction.id} className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                <div className="relative h-64">
                  <ImageWithFallback
                    src={auction.image}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-sm shadow-xl">
                    {auction.lots} Lots
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{auction.title}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Clock className="size-5 text-blue-600" />
                      {auction.date} at {auction.time}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Gavel className="size-5 text-purple-600" />
                      Online Bidding
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/register')}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    Register for Auction
                  </button>
                </div>
              </div>
            ))}
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

      <Footer />
    </div>
  );
}