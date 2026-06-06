import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronDown,
  Crown,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Sparkles,
  Gavel,
  Zap,
  Briefcase,
  Menu as MenuIcon,
  X,
} from "lucide-react";

const dropdownIcons: Record<string, any> = {
  Auctions: Gavel,
  Buying: Zap,
  Selling: Briefcase,
};

const dropdownBgTheme: Record<string, "blue" | "emerald" | "orange"> = {
  Auctions: "blue",
  Buying: "emerald",
  Selling: "orange",
};
import * as LucideIcons from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const getBadgeBg = (color: string) => {
  const map: Record<string, string> = {
    red: "bg-red-500", green: "bg-green-500", blue: "bg-blue-500",
    orange: "bg-orange-500", purple: "bg-purple-500", amber: "bg-amber-500",
    cyan: "bg-cyan-500", rose: "bg-rose-500",
  };
  return map[color] || "bg-red-500";
};
import { useAdminStats } from "@/features/admin/api/useAdminApi";
import DynamicDropdown from "./DynamicDropdown";
import { useMenuData } from "@/hooks/useMenuData";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    return "/dashboard";
  };
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: stats } = useAdminStats();
  const { getHeaderDropdowns, getStandaloneLinks, getMobileMenuItems, getMobileChildren } = useMenuData();
  const headerDropdowns = getHeaderDropdowns();
  const standaloneLinks = getStandaloneLinks();
  const mobileItems = getMobileMenuItems();

  return (
    <>
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

            <nav className="hidden md:flex items-center gap-6 flex-nowrap">
              {/* Dynamic Dropdowns from DB */}
              {headerDropdowns.map((dropdown: any) => (
                <div
                  key={dropdown._id}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(dropdown._id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-all flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group whitespace-nowrap">
                    {(() => {
                      const HardcodedIcon = dropdownIcons[dropdown.label];
                      const icons: any = LucideIcons;
                      const DbIcon = dropdown.icon ? icons[dropdown.icon] : null;
                      const IconComp = HardcodedIcon || DbIcon;
                      return IconComp ? (
                        <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30">
                          <IconComp className="size-4 text-white" />
                        </div>
                      ) : null;
                    })()}
                    {dropdown.label}
                    {dropdown.badge && (
                      <span className={`px-2 py-0.5 text-white text-[10px] rounded-full animate-pulse font-black ${getBadgeBg(dropdown.badgeColor || "red")}`}>
                        {dropdown.badgeLabel || "LIVE"}
                      </span>
                    )}
                    <ChevronDown
                      className={`size-4 transition-all ${openDropdown === dropdown._id ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                    />
                  </button>
                  <DynamicDropdown
                    show={openDropdown === dropdown._id}
                    items={dropdown.children}
                    onMouseEnter={() => setOpenDropdown(dropdown._id)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    onNavigate={(path) => { window.location.href = path; }}
                    width={dropdown.label === "Auctions" ? "500px" : "320px"}
                    bgTheme={dropdownBgTheme[dropdown.label] || "blue"}
                  />
                </div>
              ))}

              {/* Dynamic Standalone Links */}
              {standaloneLinks.map((link: any) => {
                const icons: any = LucideIcons;
                const IconComp = link.icon ? icons[link.icon] : null;
                const isLiveLink = link.url === "/live-auctions" || link.label === "Live Now";

                const badge = link.badge ? (
                  isLiveLink && (!link.badgeLabel || link.badgeLabel === "LIVE") ? (
                    <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full animate-pulse font-bold shadow-lg shadow-red-500/30">
                      {(stats as any)?.liveAuctions || 0} 🔥
                    </span>
                  ) : (
                    <span className={`px-2.5 py-1 text-white text-xs rounded-full animate-pulse font-bold ${getBadgeBg(link.badgeColor || "red")}`}>
                      {link.badgeLabel || "LIVE"}
                    </span>
                  )
                ) : null;

                return (
                  <button
                    key={link._id}
                    onClick={() => { window.location.href = link.url; }}
                    className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-all flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group whitespace-nowrap"
                  >
                    {IconComp && (
                      <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30">
                        <IconComp className="size-4 text-white" />
                      </div>
                    )}
                    {link.label}
                    {badge}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-all"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen
                ? <X className="size-6 text-slate-700" />
                : <MenuIcon className="size-6 text-slate-700" />
              }
            </button>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={() => navigate(getDashboardPath())}
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

    {mobileOpen && (
      <div className="md:hidden fixed inset-0 z-[200] flex">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 overflow-y-auto">
          <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Crown className="size-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-black text-white">King Property</h2>
                <p className="text-xs text-white/60 font-bold">Auction Portal</p>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            >
              <X className="size-5 text-white" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {mobileItems.map((item: any) => {
              const icons: any = LucideIcons;
              const IconComp = item.icon ? icons[item.icon] : null;
              const children = getMobileChildren(item._id);

              return (
                <div key={item._id}>
                  <button
                    onClick={() => {
                      if (!children.length && item.url) {
                        window.location.href = item.url;
                        setMobileOpen(false);
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-bold text-sm transition-all"
                  >
                    {IconComp && (
                      <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <IconComp className="size-4 text-white" />
                      </div>
                    )}
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full animate-pulse font-black">
                        {item.badgeLabel || "LIVE"}
                      </span>
                    )}
                    {item.highlight && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] rounded-full font-black">
                        {item.highlight}
                      </span>
                    )}
                  </button>
                  {children.length > 0 && (
                    <div className="ml-11 space-y-1 border-l-2 border-slate-100 pl-3 mt-1">
                      {children.map((child: any) => {
                        const ChildIcon = child.icon ? (LucideIcons as any)[child.icon] : null;
                        return (
                          <button
                            key={child._id}
                            onClick={() => {
                              if (child.url) {
                                window.location.href = child.url;
                                setMobileOpen(false);
                              }
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium transition-all"
                          >
                            {ChildIcon && <ChildIcon className="size-4" />}
                            {child.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-4 border-t-2 border-slate-100 space-y-2 flex-shrink-0">
            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-sm font-black text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={() => { navigate(getDashboardPath()); setMobileOpen(false); }}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { logout(); navigate("/"); setMobileOpen(false); }}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigate("/login"); setMobileOpen(false); }}
                  className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { navigate("/register"); setMobileOpen(false); }}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
