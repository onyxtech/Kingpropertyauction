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
  X,
  FileText,
} from "lucide-react";
import { useTheme } from "../../../app/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";
import { useCustomerRole } from "../hooks/useCustomerRole";
import { useCustomerApi } from "../api/useCustomerApi";
import RoleSwitchModal from "./RoleSwitchModal";

interface CustomerSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function CustomerSidebar({
  activeTab,
  onTabChange,
  mobileOpen = false,
  onMobileClose,
}: CustomerSidebarProps) {
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
    isAgent,
    isSeller,
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
      show: user?.role !== "admin" && user?.role !== "seller",
    },
    {
        id: "invoices",
        icon: FileText,
        label: "Invoices",
        show: true,
    },
    {
      id: "offers",
      icon: Handshake,
      label: "Offers & Negotiations",
      show: showBuyerView,
    },
    {
        id: "property-offers",
        icon: FileText,
        label: "Property Offers",
        show: (isAgent || isSeller) && showSellerView,
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
      show: !showSellerView,
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
      {/* Mobile overlay - only when drawer open, below lg */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          w-56 max-w-[85vw] bg-white/80 backdrop-blur-xl border-r-2 border-white/60
          flex flex-col shadow-xl h-screen overflow-hidden
          fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:z-auto
        `}
      >
        <div className="p-3 border-b-2 border-slate-100 flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group flex-1 min-w-0"
          >
            <div
              className={`size-8 rounded-lg bg-gradient-to-br ${theme.primary} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}
            >
              <LayoutDashboard className="size-4 text-white" />
            </div>
            <div className="text-left min-w-0">
              <h1 className="font-black text-slate-900 text-[13px] leading-tight truncate">
                King Property Auction
              </h1>
              <p className="text-[11px] text-slate-600 font-bold">
                My Dashboard
              </p>
            </div>
          </button>
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl flex-shrink-0"
            aria-label="Close menu"
          >
            <X className="size-5 text-slate-500" />
          </button>
        </div>

        {/* Active View Indicator */}
        {canSwitchView && (
          <div className="px-4 pt-4">
            <div
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                showSellerView
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {showSellerView ? (
                <Building2 className="size-4" />
              ) : (
                <ShoppingBag className="size-4" />
              )}
              <span>{getActiveViewLabel()}</span>
            </div>
          </div>
        )}

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-3 mb-2">
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
                    onMobileClose?.();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-bold transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${theme.secondary} text-white shadow-lg`
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {"badge" in item && item.badge && (
                    <span className="size-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t-2 border-slate-100 space-y-1.5">
          {/* Switch view - only if has BOTH permissions */}
          {canSwitchView && (
            <button
              onClick={handleSwitchView}
              disabled={switchView.isPending}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-[13px] font-bold transition-all disabled:opacity-50"
            >
              <ArrowLeftRight className="size-4" />
              {showSellerView ? "Switch to Buyer View" : "Switch to Owner View"}
            </button>
          )}

          {/* Become Seller - only for pure buyers */}
          {canApplyToSell && (
            <button
              onClick={() => setShowRoleSwitchModal(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg text-[13px] font-bold transition-all"
            >
              <Building2 className="size-4" />
              Become an Owner
            </button>
          )}

          {/* Become Buyer - only for pure sellers/agents */}
          {canApplyToBid && (
            <button
              onClick={() => setShowRoleSwitchModal(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg text-[13px] font-bold transition-all"
            >
              <ShoppingBag className="size-4" />
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
            className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-[13px] font-bold transition-all"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </aside>

      {showRoleSwitchModal && (
        <RoleSwitchModal onClose={() => setShowRoleSwitchModal(false)} />
      )}
    </>
  );
}
