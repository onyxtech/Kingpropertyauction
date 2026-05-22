import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronDown,
  Gavel,
  Zap,
  Briefcase,
  Crown,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useAdminStats } from "@/features/admin/api/useAdminApi";
import AuctionDropdown from "./AuctionDropdown";
import BuyingDropdown from "./BuyingDropdown";
import SellingDropdown from "./SellingDropdown";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showAuctionMenu, setShowAuctionMenu] = useState(false);
  const [showBuyingMenu, setShowBuyingMenu] = useState(false);
  const [showSellingMenu, setShowSellingMenu] = useState(false);
  const { data: stats } = useAdminStats();

  return (
    <header className="relative bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/50 backdrop-blur-xl border-b border-white/60 top-0 z-50 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/3 to-purple-500/5 pointer-events-none" />
      <div className="absolute top-0 right-0 size-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-96 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-yellow-400 flex-shrink-0" />
                <span className="text-white/90 text-xs font-semibold whitespace-nowrap">
                  🏆 UK's Premier Property Auction
                </span>
                <span className="text-white/40 mx-1">•</span>
                <span className="text-cyan-300 text-xs font-bold whitespace-nowrap">
                  10,000+ Properties Sold
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:08001234567"
                className="flex items-center gap-1.5 text-white hover:text-cyan-300 transition-colors group"
              >
                <Phone className="size-3.5 text-emerald-400 group-hover:text-emerald-300 flex-shrink-0" />
                <span className="text-xs font-bold whitespace-nowrap">
                  0800 123 4567
                </span>
              </a>
              <span className="text-white/40 text-xs">|</span>
              <a
                href="mailto:info@kingpropertyauction.com"
                className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors group"
              >
                <Mail className="size-3.5 flex-shrink-0" />
                <span className="text-xs font-medium whitespace-nowrap">
                  info@kingpropertyauction.com
                </span>
              </a>
              <span className="text-white/40 text-xs">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white/60 text-xs font-medium whitespace-nowrap">
                  Follow:
                </span>
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
              onClick={() => {
                window.location.href = "/";
              }}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="size-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                  <Crown className="size-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="text-left">
                <h1 className="font-black text-xl tracking-tight">
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    King
                  </span>
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
                  <ChevronDown
                    className={`size-4 transition-all ${showAuctionMenu ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                  />
                </button>
                <AuctionDropdown
                  show={showAuctionMenu}
                  onMouseEnter={() => setShowAuctionMenu(true)}
                  onMouseLeave={() => setShowAuctionMenu(false)}
                  onNavigate={(path) => {
                    window.location.href = path;
                  }}
                />
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
                  <ChevronDown
                    className={`size-4 transition-all ${showBuyingMenu ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                  />
                </button>
                <BuyingDropdown
                  show={showBuyingMenu}
                  onMouseEnter={() => setShowBuyingMenu(true)}
                  onMouseLeave={() => setShowBuyingMenu(false)}
                  onNavigate={(path) => {
                    window.location.href = path;
                  }}
                />
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
                  <ChevronDown
                    className={`size-4 transition-all ${showSellingMenu ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                  />
                </button>
                <SellingDropdown
                  show={showSellingMenu}
                  onMouseEnter={() => setShowSellingMenu(true)}
                  onMouseLeave={() => setShowSellingMenu(false)}
                  onNavigate={(path) => {
                    window.location.href = path;
                  }}
                />
              </div>

              <button
                onClick={() => {
                  window.location.href = "/live-auctions";
                }}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors"
              >
                Live Now
                <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full animate-pulse font-bold shadow-lg shadow-red-500/30">
                  {stats?.liveAuctions || 0} 🔥
                </span>
              </button>
              {/* <button onClick={() => navigate("/view-live-locations")} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Locations
              </button> */}
              <button
                onClick={() => {
                  window.location.href = "/contact-us";
                }}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Contact Us
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={() => navigate("/admin")}
                  className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="px-3 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
