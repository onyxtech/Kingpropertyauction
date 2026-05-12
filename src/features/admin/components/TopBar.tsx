import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import {
  Search,
  Bell,
  ChevronDown,
  ArrowLeft,
  Plus,
  Gavel,
  Mail,
  FileText,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useTheme } from "../../../app/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";

export default function TopBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/view-all-lots?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const quickActions = [
    {
      id: "newProperty",
      label: "Add Property",
      icon: Plus,
      action: () => navigate("/admin/properties/new"),
    },
    {
      id: "createAuction",
      label: "Create Auction",
      icon: Gavel,
      action: () => navigate("/admin/auctions"),
    },
    { id: "sendCampaign", label: "Send Campaign", icon: Mail },
    { id: "generateReport", label: "Generate Report", icon: FileText },
  ];

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "AD";

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b-2 border-white/60 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all hover:scale-110"
            title="Back to Website"
          >
            <ArrowLeft className="size-5 text-slate-600" />
          </button>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties, users, auctions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-96 transition-all"
            />
          </form>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                className={`px-4 py-2.5 bg-gradient-to-r ${theme.secondary} text-white rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2`}
                title={action.label}
              >
                <Icon className="size-4" />
                <span className="hidden xl:inline">{action.label}</span>
              </button>
            );
          })}

          <button
            className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all"
            title="Notifications"
          >
            <Bell className="size-5 text-slate-600" />
            <div className="absolute top-1.5 right-1.5 size-2.5 bg-red-500 rounded-full animate-pulse" />
          </button>

          {/* Profile Button */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 pl-4 border-l-2 border-slate-200 hover:bg-slate-50 rounded-xl p-2 transition-all"
          >
            <div
              className={`size-11 bg-gradient-to-br ${theme.primary} rounded-xl flex items-center justify-center shadow-lg`}
            >
              <span className="text-white font-black text-sm">{initials}</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-slate-900">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-slate-600 font-medium">
                {user?.email || "admin@kingauction.com"}
              </p>
            </div>
            <ChevronDown
              className={`size-4 text-slate-400 transition-transform ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown via Portal */}
      {showDropdown &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[99998]"
              onClick={() => setShowDropdown(false)}
            />
            <div
              className="fixed z-[99999] w-56 bg-white rounded-2xl shadow-2xl border-2 border-slate-100"
              style={{
                top: "72px",
                right: "24px",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              }}
            >
              <div className="p-2">
                <button
                  onClick={() => {
                    navigate("/admin/profile");
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <User className="size-5 text-slate-500" /> Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/admin/settings");
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <Settings className="size-5 text-slate-500" /> Settings
                </button>
                <hr className="my-2 border-slate-100" />
                <button
                  onClick={() => {
                    handleLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="size-5 text-red-500" /> Logout
                </button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </header>
  );
}
