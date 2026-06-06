import { useNavigate } from "react-router";
import { Home, Plus, Gavel, Building2 } from "lucide-react";
import { useTheme } from "../../../app/hooks/useTheme";
import CustomerNotificationBell from "./CustomerNotificationBell";
import CustomerSearchBar from "./CustomerSearchBar";
import CustomerProfileDropdown from "./CustomerProfileDropdown";
import { useCustomerRole } from "../hooks/useCustomerRole";

export default function CustomerTopBar() {
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

  const action = getPrimaryAction();
  const Icon = action.icon;

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b-2 border-white/60 shadow-sm sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all hover:scale-110"
            title="Back to Website"
          >
            <Home className="size-5 text-slate-600" />
          </button>
          <CustomerSearchBar />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={action.action}
            className={`px-4 py-2.5 bg-gradient-to-r ${action.color} text-white rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2`}
          >
            <Icon className="size-4" />
            <span className="hidden xl:inline">{action.label}</span>
          </button>
          <CustomerNotificationBell />
          <CustomerProfileDropdown />
        </div>
      </div>
    </header>
  );
}
