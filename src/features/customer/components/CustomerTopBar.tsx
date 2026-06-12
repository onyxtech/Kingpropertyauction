import { useState } from "react";
import { useNavigate } from "react-router";
import { Home, Plus, Gavel, Building2, Menu, Search, X } from "lucide-react";
import { useTheme } from "../../../app/hooks/useTheme";
import CustomerNotificationBell from "./CustomerNotificationBell";
import CustomerSearchBar from "./CustomerSearchBar";
import CustomerProfileDropdown from "./CustomerProfileDropdown";
import { useCustomerRole } from "../hooks/useCustomerRole";

interface CustomerTopBarProps {
  onMenuClick?: () => void;
}

export default function CustomerTopBar({ onMenuClick }: CustomerTopBarProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    canBid,
    canListProperties,
    showSellerView,
    showBuyerView,
  } = useCustomerRole();

  // Derive single primary action based on current view
  const getPrimaryAction = () => {
    if (showSellerView) {
      return {
        label: "Add Property",
        icon: Plus,
        action: () => navigate("/add-property"),
        color: "from-blue-500 to-indigo-600",
      };
    }
    if (showBuyerView) {
      return {
        label: "Browse Auctions",
        icon: Gavel,
        action: () => navigate("/auctions"),
        color: "from-green-500 to-emerald-600",
      };
    }
    if (canListProperties && !canBid) {
      return {
        label: "Add Property",
        icon: Plus,
        action: () => navigate("/add-property"),
        color: "from-blue-500 to-indigo-600",
      };
    }
    if (canBid && !canListProperties) {
      return {
        label: "Browse Auctions",
        icon: Gavel,
        action: () => navigate("/auctions"),
        color: "from-green-500 to-emerald-600",
      };
    }
    return {
      label: "Browse Properties",
      icon: Building2,
      action: () => navigate("/properties"),
      color: "from-slate-500 to-slate-700",
    };
  };

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const action = getPrimaryAction();
  const Icon = action.icon;

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b-2 border-white/60 shadow-sm sticky top-0 z-40">
      <div className="px-3 sm:px-5 py-1.5 sm:py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-all flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="size-4 text-slate-600" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all flex-shrink-0"
            title="Back to Website"
          >
            <Home className="size-4 text-slate-600" />
          </button>
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-all flex-shrink-0"
            aria-label="Search"
          >
            <Search className="size-4 text-slate-600" />
          </button>
          <div className="hidden md:block">
            <CustomerSearchBar />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={action.action}
            className={`p-2 xl:px-3.5 xl:py-1.5 bg-gradient-to-r ${action.color} text-white rounded-lg text-[13px] font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2`}
          >
            <Icon className="size-4" />
            <span className="hidden xl:inline">{action.label}</span>
          </button>
          <CustomerNotificationBell />
          <CustomerProfileDropdown />
        </div>
      </div>
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <CustomerSearchBar />
          </div>
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-xl flex-shrink-0"
            aria-label="Close search"
          >
            <X className="size-4 text-slate-500" />
          </button>
        </div>
      )}
    </header>
  );
}
