import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  Heart,
  ChevronDown,
  ChevronRight,
  Gavel,
  Zap,
  Briefcase,
  Grid3x3,
  Globe,
  Package,
  DollarSign,
  FileText,
  BookOpen,
  Bell,
  Shield,
  ThumbsUp,
  UserCheck,
  HelpCircle,
  Gift,
  ClipboardList,
  Crown,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Sparkles
} from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const [showAuctionMenu, setShowAuctionMenu] = useState(false);
  const [showBuyingMenu, setShowBuyingMenu] = useState(false);
  const [showSellingMenu, setShowSellingMenu] = useState(false);

  return (
    <header className="relative bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/50 backdrop-blur-xl border-b border-white/60 sticky top-0 z-50 shadow-lg">
      {/* Gradient Overlay for Header */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/3 to-purple-500/5 pointer-events-none" />
      <div className="absolute top-0 right-0 size-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-96 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Bar */}
      <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-2">
            {/* Left - Property Tagline */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-yellow-400 flex-shrink-0" />
                <span className="text-white/90 text-xs font-semibold whitespace-nowrap">🏆 UK's Premier Property Auction</span>
                <span className="text-white/40 mx-1">•</span>
                <span className="text-cyan-300 text-xs font-bold whitespace-nowrap">10,000+ Properties Sold</span>
              </div>
            </div>

            {/* Right - Contact & Social */}
            <div className="flex items-center gap-3">
              {/* Customer Service Number */}
              <a 
                href="tel:08001234567" 
                className="flex items-center gap-1.5 text-white hover:text-cyan-300 transition-colors group"
              >
                <Phone className="size-3.5 text-emerald-400 group-hover:text-emerald-300 flex-shrink-0" />
                <span className="text-xs font-bold whitespace-nowrap">0800 123 4567</span>
              </a>

              <span className="text-white/40 text-xs">|</span>

              {/* Email */}
              <a 
                href="mailto:info@kingpropertyauction.com" 
                className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors group"
              >
                <Mail className="size-3.5 flex-shrink-0" />
                <span className="text-xs font-medium whitespace-nowrap">info@kingpropertyauction.com</span>
              </a>

              <span className="text-white/40 text-xs">|</span>

              {/* Social Media Links */}
              <div className="flex items-center gap-1.5">
                <span className="text-white/60 text-xs font-medium whitespace-nowrap">Follow:</span>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="size-6 rounded-lg bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all flex-shrink-0"
                  aria-label="Facebook"
                >
                  <Facebook className="size-3 text-white" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="size-6 rounded-lg bg-white/10 hover:bg-sky-500 flex items-center justify-center transition-all flex-shrink-0"
                  aria-label="Twitter"
                >
                  <Twitter className="size-3 text-white" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="size-6 rounded-lg bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all flex-shrink-0"
                  aria-label="Instagram"
                >
                  <Instagram className="size-3 text-white" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="size-6 rounded-lg bg-white/10 hover:bg-blue-700 flex items-center justify-center transition-all flex-shrink-0"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="size-3 text-white" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="size-6 rounded-lg bg-white/10 hover:bg-red-600 flex items-center justify-center transition-all flex-shrink-0"
                  aria-label="YouTube"
                >
                  <Youtube className="size-3 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                {/* Simple logo container */}
                <div className="size-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                  {/* Crown icon */}
                  <Crown className="size-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="text-left">
                <h1 className="font-black text-xl tracking-tight">
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">King</span>
                  <span className="text-slate-900"> Property</span>
                </h1>
                <p className="text-xs font-bold text-slate-600">
                  Auction Portal
                </p>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-6">
              {/* Auctions Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => setShowAuctionMenu(true)}
                onMouseLeave={() => setShowAuctionMenu(false)}
              >
                <button className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-all flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group">
                  <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30">
                    <Gavel className="size-4 text-white" />
                  </div>
                  Auctions
                  <ChevronDown className={`size-4 transition-all ${showAuctionMenu ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
                
                {showAuctionMenu && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-[500px] opacity-100 visible transition-all"
                    onMouseEnter={() => setShowAuctionMenu(true)}
                    onMouseLeave={() => setShowAuctionMenu(false)}
                  >
                    <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
                      {/* Gradient Overlay Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 pointer-events-none" />
                      <div className="absolute top-0 right-0 size-64 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 size-64 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="relative p-6 space-y-3">
                        <button 
                          onClick={() => navigate("/auctions")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-blue-600 bg-gradient-to-r from-transparent to-transparent hover:from-blue-50/80 hover:to-indigo-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <Grid3x3 className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-blue-600 transition-colors">View All Auctions</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Browse auction lots</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </button>
                        
                        <button 
                          onClick={() => navigate("/live-auctions")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-red-600 bg-gradient-to-r from-transparent to-transparent hover:from-red-50/80 hover:to-orange-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-red-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <Zap className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-red-600 transition-colors flex items-center gap-2">
                                Live Auctions
                                <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full animate-pulse font-black">LIVE</span>
                              </div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Bid in real-time</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                        </button>
                        
                        <button 
                          onClick={() => navigate("/view-all-lots")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-emerald-600 bg-gradient-to-r from-transparent to-transparent hover:from-emerald-50/80 hover:to-teal-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <Package className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-emerald-600 transition-colors">View All Lots</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Explore inventory</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                        </button>
                      </div>
                      
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 py-1 text-xs font-bold text-slate-400 bg-white/80 backdrop-blur-sm rounded-full">SERVICES</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <button 
                          onClick={() => navigate("/free-valuation")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-orange-600 bg-gradient-to-r from-transparent to-transparent hover:from-orange-50/80 hover:to-amber-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-orange-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <FileText className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-orange-600 transition-colors">Free Valuation</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Get instant estimate</div>
                            </div>
                          </div>
                          <div className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black rounded-full">FREE</div>
                        </button>
                        
                        <button 
                          onClick={() => navigate("/auction-finance")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-indigo-600 bg-gradient-to-r from-transparent to-transparent hover:from-indigo-50/80 hover:to-blue-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-indigo-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <DollarSign className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-indigo-600 transition-colors">Auction Finance</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Quick approval</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </button>
                        
                        <button 
                          onClick={() => navigate("/catalogue-request")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-rose-600 bg-gradient-to-r from-transparent to-transparent hover:from-rose-50/80 hover:to-red-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-rose-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <FileText className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-rose-600 transition-colors">Catalogue Request</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Download brochures</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Buying Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => setShowBuyingMenu(true)}
                onMouseLeave={() => setShowBuyingMenu(false)}
              >
                <button className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-all flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group">
                  <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30">
                    <Zap className="size-4 text-white" />
                  </div>
                  Buying
                  <ChevronDown className={`size-4 transition-all ${showBuyingMenu ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
                
                {showBuyingMenu && (
                  <div className="absolute top-full left-0 mt-2 w-72 z-[100] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    <div 
                      className="relative bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden p-3"
                      onMouseEnter={() => setShowBuyingMenu(true)}
                      onMouseLeave={() => setShowBuyingMenu(false)}
                    >
                      {/* Gradient Overlay Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 pointer-events-none" />
                      <div className="absolute top-0 right-0 size-64 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 size-64 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="relative space-y-1.5">
                        <button 
                          onClick={() => navigate("/buying-overview")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-blue-600 bg-gradient-to-r from-transparent to-transparent hover:from-blue-50/80 hover:to-indigo-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <Grid3x3 className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-blue-600 transition-colors">Buying Overview</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Start your journey</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </button>
                        
                        <button 
                          onClick={() => navigate("/buying-guide")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-purple-600 bg-gradient-to-r from-transparent to-transparent hover:from-purple-50/80 hover:to-pink-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <BookOpen className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-purple-600 transition-colors">Guide</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Step-by-step help</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                        </button>
                        
                        <button 
                          onClick={() => navigate("/register-alert")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-emerald-600 bg-gradient-to-r from-transparent to-transparent hover:from-emerald-50/80 hover:to-teal-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <Bell className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-emerald-600 transition-colors">Register for Alert</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Get notified instantly</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                        </button>
                        
                        <button 
                          onClick={() => navigate("/terms-of-sale")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-amber-600 bg-gradient-to-r from-transparent to-transparent hover:from-amber-50/80 hover:to-yellow-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-amber-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <Shield className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-amber-600 transition-colors">Terms of Sale</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Legal protection</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                        </button>
                      </div>
                      
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 py-1 text-xs font-bold text-slate-400 bg-white/80 backdrop-blur-sm rounded-full">PREMIUM</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <button 
                          onClick={() => navigate("/why-buy-at-king")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-cyan-600 bg-gradient-to-r from-transparent to-transparent hover:from-cyan-50/80 hover:to-blue-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-cyan-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <ThumbsUp className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-cyan-600 transition-colors">Why Buy At King Auction</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Discover benefits</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
                        </button>
                        
                        <button 
                          onClick={() => navigate("/auction-finance")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-indigo-600 bg-gradient-to-r from-transparent to-transparent hover:from-indigo-50/80 hover:to-blue-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-indigo-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <DollarSign className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-indigo-600 transition-colors">Auction Finance</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Quick approval</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </button>
                        
                        <button 
                          onClick={() => navigate("/solicitor")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-rose-600 bg-gradient-to-r from-transparent to-transparent hover:from-rose-50/80 hover:to-red-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-rose-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <Briefcase className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-rose-600 transition-colors">Solicitor</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Legal experts ready</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Selling Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => setShowSellingMenu(true)}
                onMouseLeave={() => setShowSellingMenu(false)}
              >
                <button className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-all flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group">
                  <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30">
                    <Briefcase className="size-4 text-white" />
                  </div>
                  Selling
                  <ChevronDown className={`size-4 transition-all ${showSellingMenu ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
                
                {showSellingMenu && (
                  <div className="absolute top-full left-0 mt-2 w-72 z-[100] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="relative bg-gradient-to-br from-white via-orange-50/30 to-rose-50/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden p-3"
                         onMouseEnter={() => setShowSellingMenu(true)}
                         onMouseLeave={() => setShowSellingMenu(false)}
                    >
                      {/* Gradient Overlay Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-red-500/10 pointer-events-none" />
                      <div className="absolute top-0 right-0 size-64 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 size-64 bg-gradient-to-br from-rose-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="relative space-y-1.5">
                        <button 
                          onClick={() => navigate("/add-property")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-green-600 bg-gradient-to-r from-transparent to-transparent hover:from-green-50/80 hover:to-emerald-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-green-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <Building2 className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-green-600 transition-colors">Add Property</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">List your property</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                        </button>
                        
                        <button 
                          onClick={() => navigate("/selling-overview")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-blue-600 bg-gradient-to-r from-transparent to-transparent hover:from-blue-50/80 hover:to-indigo-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <Grid3x3 className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-blue-600 transition-colors">Selling Overview</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Start your journey</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </button>
                        
                        <button 
                          onClick={() => navigate("/why-sell-with-future")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-purple-600 bg-gradient-to-r from-transparent to-transparent hover:from-purple-50/80 hover:to-pink-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <ThumbsUp className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-purple-600 transition-colors">Why Sell With Future</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Discover advantages</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                        </button>
                        
                        <button 
                          onClick={() => navigate("/guide-faq")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-emerald-600 bg-gradient-to-r from-transparent to-transparent hover:from-emerald-50/80 hover:to-teal-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <HelpCircle className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-emerald-600 transition-colors">Guide & FAQ</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Get answers</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                        </button>
                      </div>
                      
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 py-1 text-xs font-bold text-slate-400 bg-white/80 backdrop-blur-sm rounded-full">PREMIUM</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <button 
                          onClick={() => navigate("/free-valuation")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-orange-600 bg-gradient-to-r from-transparent to-transparent hover:from-orange-50/80 hover:to-amber-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-orange-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <FileText className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-orange-600 transition-colors">Free Valuation</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Know your worth</div>
                            </div>
                          </div>
                          <div className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black rounded-full">FREE</div>
                        </button>
                        
                        <button 
                          onClick={() => navigate("/referral-fee")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-indigo-600 bg-gradient-to-r from-transparent to-transparent hover:from-indigo-50/80 hover:to-blue-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-indigo-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <Gift className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-indigo-600 transition-colors">Referral Fee</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Earn rewards</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </button>
                        
                        <button 
                          onClick={() => navigate("/home-report")}
                          className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-rose-600 bg-gradient-to-r from-transparent to-transparent hover:from-rose-50/80 hover:to-red-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-rose-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                              <ClipboardList className="size-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-rose-600 transition-colors">Home Report</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">Property assessment</div>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => navigate("/live-auctions")}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors"
              >
                Live Now
                <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full animate-pulse font-bold shadow-lg shadow-red-500/30">
                  24 🔥
                </span>
              </button>
              <button 
                onClick={() => navigate("/view-live-locations")}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Locations
              </button>
              <button 
                onClick={() => navigate("/contact-us")}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Contact Us
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}