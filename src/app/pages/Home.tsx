import { useNavigate } from "react-router";
import { Building2, LayoutDashboard, Smartphone, ArrowRight, Sparkles, Zap, TrendingUp, Clock, CheckCircle, Tag } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const platforms = [
    {
      id: "website",
      title: "Property Portal",
      description: "Browse properties, join live auctions, and find your dream home",
      icon: Building2,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      path: "/website",
    },
    {
      id: "admin",
      title: "Admin Dashboard",
      description: "Manage listings, auctions, users, and platform analytics",
      icon: LayoutDashboard,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      path: "/admin",
    },
    {
      id: "mobile",
      title: "Mobile App",
      description: "Bid on-the-go with real-time notifications and AR tours",
      icon: Smartphone,
      gradient: "from-emerald-500 via-green-500 to-lime-500",
      path: "/mobile",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 size-72 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 size-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 size-64 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="border-b border-white/60 bg-white/60 backdrop-blur-xl relative z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Building2 className="size-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-lg">King Property Auction</h1>
                <p className="text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Live Auction Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                About
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                Contact
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition-all hover:scale-105">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-16 relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-full mb-8 border-2 border-green-400/50 shadow-lg shadow-green-500/20">
            <Sparkles className="size-4 text-green-600 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">Live Auctions • AI-Powered • Marketplace Sync</span>
          </div>
          
          <h1 className="text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
            Real Estate Auctions
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Reimagined
            </span>
          </h1>
          
          <p className="text-2xl text-slate-700 mb-12 leading-relaxed font-medium">
            A comprehensive platform combining traditional property listings with live bidding,
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI insights, virtual tours, and seamless marketplace integration.</span>
          </p>

          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl shadow-blue-500/30 text-white">
              <Zap className="size-5" />
              <div className="text-left">
                <p className="text-2xl font-black">24</p>
                <p className="text-xs font-semibold opacity-90">Active Auctions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-xl shadow-emerald-500/30 text-white">
              <Building2 className="size-5" />
              <div className="text-left">
                <p className="text-2xl font-black">1,247</p>
                <p className="text-xs font-semibold opacity-90">Properties</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl shadow-purple-500/30 text-white">
              <TrendingUp className="size-5" />
              <div className="text-left">
                <p className="text-2xl font-black">8,934</p>
                <p className="text-xs font-semibold opacity-90">Active Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sell Your Property Banner */}
        <div className="max-w-7xl mx-auto mb-16">
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

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.id}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-transparent overflow-hidden cursor-pointer"
                onClick={() => navigate(platform.path)}
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${platform.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div
                  className={`size-14 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="size-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                  {platform.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {platform.description}
                </p>

                {/* CTA Button */}
                <button
                  className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${platform.gradient} text-white rounded-lg font-medium group-hover:shadow-lg transition-all duration-300`}
                >
                  <span>Explore</span>
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Decorative Element */}
                <div
                  className={`absolute -right-8 -bottom-8 size-32 bg-gradient-to-br ${platform.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                />
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="mt-24 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Powerful Features for Modern Real Estate
          </h2>
          
          {/* Live Auctions Banner */}
          <div 
            onClick={() => navigate("/live-auctions")}
            className="mb-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white cursor-pointer hover:shadow-2xl transition-shadow relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                  <div className="size-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Live Now</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">24 Properties at Live Auction</h3>
                <p className="text-red-100 mb-4">Real-time bidding • Premium properties • Secure transactions</p>
                <button className="px-6 py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors inline-flex items-center gap-2">
                  Join Live Auctions
                  <ArrowRight className="size-5" />
                </button>
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold mb-2">£12.4M</p>
                <p className="text-red-100">Total Value</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Live Bidding", icon: "⚡" },
              { label: "AI Valuation", icon: "🤖" },
              { label: "Virtual Tours", icon: "🏠" },
              { label: "Marketplace Sync", icon: "🔄" },
              { label: "Mortgage Calculator", icon: "💰" },
              { label: "Social Sharing", icon: "📱" },
              { label: "Secure Payments", icon: "🔒" },
              { label: "Analytics", icon: "📊" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <p className="text-sm font-medium text-slate-700">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-lg mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              © 2026 King Property Auction. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}