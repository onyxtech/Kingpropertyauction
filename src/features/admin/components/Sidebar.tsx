import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  Building2,
  Users,
  Gavel,
  Send,
  Share2,
  TrendingUp,
  BrainCircuit,
  Shield,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  FileText,
  Menu,
} from "lucide-react";
import { useTheme } from "../../../app/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";

const menuItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "pageBuilder", icon: FileText, label: "Page Builder" },
  { id: "menuManager", icon: Menu, label: "Menu Manager" },
  { id: "properties", icon: Building2, label: "Properties" },
  { id: "auctions", icon: Gavel, label: "Auctions" },
  { id: "bids", icon: TrendingUp, label: "Bids" },
  { id: "marketing", icon: Send, label: "Marketing" },
  { id: "social", icon: Share2, label: "Social & Sync" },
  { id: "investors", icon: TrendingUp, label: "Investors" },
  { id: "ai", icon: BrainCircuit, label: "AI Tools" },
  { id: "compliance", icon: Shield, label: "Compliance" },
  { id: "financial", icon: CreditCard, label: "Financial" },
  { id: "users", icon: Users, label: "Users" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
    path: "/admin/settings/email",
  },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavigation = (item: any) => {
    const tab = typeof item === "string" ? item : item.id;
    const customPath = typeof item === "object" ? item.path : null;
    onTabChange(tab);
    if (customPath) {
      navigate(customPath);
    } else {
      navigate(`/admin/${tab}`);
    }
  };

  return (
    <aside className="w-72 bg-white/80 backdrop-blur-xl border-r-2 border-white/60 flex flex-col shadow-xl">
      <div className="p-6 border-b-2 border-slate-100">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group"
        >
          <div
            className={`size-12 rounded-2xl bg-gradient-to-br ${theme.primary} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
          >
            <LayoutDashboard className="size-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="font-black text-slate-900">King Property Auction</h1>
            <p className="text-xs text-slate-600 font-bold">Admin Portal</p>
          </div>
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider px-4 mb-3">
            Main Navigation
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id
                    ? `bg-gradient-to-r ${theme.secondary} text-white shadow-lg`
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="size-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t-2 border-slate-100 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all"
        >
          <LogOut className="size-5" /> Logout
        </button>
      </div>
    </aside>
  );
}
