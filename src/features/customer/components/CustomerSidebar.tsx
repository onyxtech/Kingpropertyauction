import { useState } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  Building2,
  Gavel,
  CreditCard,
  MessageSquare,
  User,
  TrendingUp,
  LogOut,
  ArrowLeftRight,
  ShoppingBag,
  Handshake,
  Trophy,
  Heart,
  Mail,
} from "lucide-react";
import { useTheme } from "../../../app/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";
import { useCustomerRole } from "../hooks/useCustomerRole";
import { useCustomerApi } from "../api/useCustomerApi";
import RoleSwitchModal from "./RoleSwitchModal";

interface CustomerSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function CustomerSidebar({ activeTab, onTabChange }: CustomerSidebarProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { logout, user } = useAuthStore();
  const {
    canAddProperty,
    canBid,
    canListProperties,
    canSwitchView,
    showSellerView,
    showBuyerView,
    canApplyToSell,
    canApplyToBid,
    activeView,
    getActiveViewLabel,
  } = useCustomerRole();
  const { useSwitchView, useMyMessages } = useCustomerApi();
  const switchView = useSwitchView();
  const { data: conversations = [] } = useMyMessages();
  const [showRoleSwitchModal, setShowRoleSwitchModal] = useState(false);

  const unreadCount = Array.isArray(conversations)
    ? conversations.filter((c: any) => (c.unreadCount?.user || 0) > 0).length
    : 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSwitchView = async () => {
    const newView = activeView === "seller" ? "buyer" : "seller";
    await switchView.mutateAsync(newView);
  };

  const navItems = [
    {
      id: "overview",
      icon: LayoutDashboard,
      label: "Dashboard",
      show: true,
    },
    {
      id: "my-properties",
      icon: Building2,
      label: "My Properties",
      show: showSellerView,
    },
    {
      id: "my-auctions",
      icon: Gavel,
      label: "Auctions",
      show: showSellerView,
    },
    {
      id: "property-bidders",
      icon: TrendingUp,
      label: "Bidding Status",
      show: showSellerView,
    },
    {
      id: "my-bids",
      icon: ShoppingBag,
      label: "My Bids & Auctions",
      show: showBuyerView,
    },
    {
      id: "payments",
      icon: CreditCard,
      label: "Payments",
      show: user?.role !== "admin",
    },
    {
      id: "offers",
      icon: Handshake,
      label: "Offers & Negotiations",
      show: showBuyerView,
    },
    {
      id: "won-auctions",
      icon: Trophy,
      label: "Won Auctions",
      show: showBuyerView,
    },
    {
      id: "watchlist",
      icon: Heart,
      label: "My Watchlist",
      show: showBuyerView,
    },
    {
      id: "enquiries",
      icon: Mail,
      label: "My Enquiries",
      show: true,
    },
    {
      id: "messages",
      icon: MessageSquare,
      label: "Communication",
      show: true,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      id: "profile",
      icon: User,
      label: "Profile & Settings",
      show: true,
    },
  ].filter((item) => item.show);

  return (
    <>
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r-2 border-white/60 flex flex-col shadow-xl h-screen sticky top-0 overflow-hidden">
        <div className="p-6 border-b-2 border-slate-100">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
            <div className={`size-12 rounded-2xl bg-gradient-to-br ${theme.primary} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <LayoutDashboard className="size-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="font-black text-slate-900">King Property Auction</h1>
              <p className="text-xs text-slate-600 font-bold">My Dashboard</p>
            </div>
          </button>
        </div>

        {/* Active View Indicator */}
        {canSwitchView && (
          <div className="px-4 pt-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
              showSellerView
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}>
              {showSellerView ? <Building2 className="size-4" /> : <ShoppingBag className="size-4" />}
              <span>{getActiveViewLabel()}</span>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider px-4 mb-3">
              My Account
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    navigate(`/dashboard/${item.id}`);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${theme.secondary} text-white shadow-lg`
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {"badge" in item && item.badge && (
                    <span className="size-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t-2 border-slate-100 space-y-2">
          {/* Switch view - only if has BOTH permissions */}
          {canSwitchView && (
            <button
              onClick={handleSwitchView}
              disabled={switchView.isPending}
              className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            >
              <ArrowLeftRight className="size-5" />
              {showSellerView ? "Switch to Buyer View" : "Switch to Seller View"}
            </button>
          )}

          {/* Become Seller - only for pure buyers */}
          {canApplyToSell && (
            <button
              onClick={() => setShowRoleSwitchModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-purple-600 hover:bg-purple-50 rounded-xl text-sm font-bold transition-all"
            >
              <Building2 className="size-5" />
              Become a Seller
            </button>
          )}

          {/* Become Buyer - only for pure sellers/agents */}
          {canApplyToBid && (
            <button
              onClick={() => setShowRoleSwitchModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-green-600 hover:bg-green-50 rounded-xl text-sm font-bold transition-all"
            >
              <ShoppingBag className="size-5" />
              Become a Buyer
            </button>
          )}

          {/* Pending notice */}
          {(user as any)?.roleRequest?.status === "pending" && (
            <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs font-bold text-amber-700">
                ⏳ Role request pending approval
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all"
          >
            <LogOut className="size-5" /> Logout
          </button>
        </div>
      </aside>

      {showRoleSwitchModal && (
        <RoleSwitchModal onClose={() => setShowRoleSwitchModal(false)} />
      )}
    </>
  );
}
